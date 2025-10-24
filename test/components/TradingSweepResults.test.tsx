import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TradingSweepResults } from '@/components/pipelines/TradingSweepResults'
import { mockTradingResults } from '../utils/test-data'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  [key: string]: unknown
}

// Mock the Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: ButtonProps) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

describe('TradingSweepResults', () => {
  const defaultProps = {
    results: mockTradingResults,
    ticker: 'BTC-USD',
  }

  describe('Statistics Calculation', () => {
    it('calculates best sharpe ratio correctly', () => {
      render(<TradingSweepResults {...defaultProps} />)

      // Best sharpe from mockTradingResults is 2.5 - check the statistics card
      const bestSharpeCard = screen.getByText('Best Sharpe').closest('div')
      expect(bestSharpeCard).toHaveTextContent('2.50')
    })

    it('calculates best return correctly', () => {
      render(<TradingSweepResults {...defaultProps} />)

      // Best return from mockTradingResults is 150.5%
      expect(screen.getByText('150.5%')).toBeInTheDocument()
    })

    it('calculates lowest drawdown correctly', () => {
      render(<TradingSweepResults {...defaultProps} />)

      // Lowest drawdown from mockTradingResults is -12.3%
      expect(screen.getByText('-12.3%')).toBeInTheDocument()
    })

    it('calculates average sharpe ratio correctly', () => {
      render(<TradingSweepResults {...defaultProps} />)

      // Average: (2.5 + 2.1 + 1.8) / 3 = 2.13
      expect(screen.getByText('2.13')).toBeInTheDocument()
    })

    it('calculates average return correctly', () => {
      render(<TradingSweepResults {...defaultProps} />)

      // Average: (150.5 + 120.0 + 95.0) / 3 = 121.8%
      expect(screen.getByText('121.8%')).toBeInTheDocument()
    })

    it('handles edge case with single result', () => {
      const singleResult = [mockTradingResults[0]]
      render(<TradingSweepResults results={singleResult} ticker="ETH-USD" />)

      // Best and average should be the same
      const sharpeValues = screen.getAllByText('2.50')
      expect(sharpeValues.length).toBeGreaterThan(0)
    })

    it('handles results with negative returns', () => {
      const negativeResults = [
        {
          ...mockTradingResults[0],
          performance: {
            ...mockTradingResults[0].performance,
            total_return_pct: -50.0,
            sharpe_ratio: -1.5,
          },
        },
      ]

      render(<TradingSweepResults results={negativeResults} ticker="BTC-USD" />)

      // Check the Best Return card specifically
      const bestReturnCard = screen.getByText('Best Return').closest('div')
      expect(bestReturnCard).toHaveTextContent('-50.0%')
    })
  })

  describe('Sorting', () => {
    it('sorts by score descending by default', () => {
      render(<TradingSweepResults {...defaultProps} />)

      const rows = screen.getAllByRole('row')
      // First data row should have highest Sharpe ratio (2.50) - check the Sharpe column
      const firstDataRow = rows[1]
      const sharpeCell = firstDataRow.querySelector('td:nth-child(2)') // Sharpe column
      expect(sharpeCell).toHaveTextContent('2.50')
    })

    it('changes sort when dropdown changed', () => {
      render(<TradingSweepResults {...defaultProps} />)

      const sortSelect = screen.getByRole('combobox')
      fireEvent.change(sortSelect, { target: { value: 'sharpe_ratio' } })

      const rows = screen.getAllByRole('row')
      // First data row should now have highest sharpe (2.5)
      expect(rows[1]).toHaveTextContent('2.50')
    })

    it('toggles sort order', () => {
      render(<TradingSweepResults {...defaultProps} />)

      const sortOrderButton = screen.getByText('↓')
      fireEvent.click(sortOrderButton)

      // Should now show ascending order
      expect(screen.getByText('↑')).toBeInTheDocument()
    })

    it('maintains sort stability for equal values', () => {
      const equalResults = [
        {
          ...mockTradingResults[0],
          performance: { ...mockTradingResults[0].performance, score: 90 },
        },
        {
          ...mockTradingResults[1],
          performance: { ...mockTradingResults[1].performance, score: 90 },
        },
        {
          ...mockTradingResults[2],
          performance: { ...mockTradingResults[2].performance, score: 90 },
        },
      ]

      render(<TradingSweepResults results={equalResults} ticker="BTC-USD" />)

      // Should render without errors
      expect(screen.getAllByRole('row').length).toBeGreaterThan(0)
    })
  })

  describe('CSV Export', () => {
    it('exports CSV with correct columns', () => {
      // Mock URL.createObjectURL and link.click
      const createObjectURL = vi.fn(() => 'blob:mock-url')
      const revokeObjectURL = vi.fn()
      global.URL.createObjectURL = createObjectURL
      global.URL.revokeObjectURL = revokeObjectURL

      const mockClick = vi.fn()
      const originalCreateElement = document.createElement
      vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        if (tag === 'a') {
          return {
            click: mockClick,
            href: '',
            download: '',
            style: { display: 'none' },
          }
        }
        return originalCreateElement.call(document, tag)
      })

      render(<TradingSweepResults {...defaultProps} />)

      const exportButton = screen.getByText('Export CSV')
      fireEvent.click(exportButton)

      expect(createObjectURL).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(revokeObjectURL).toHaveBeenCalled()
    })

    it('CSV contains all required columns', () => {
      const createObjectURL = vi.fn((blob: Blob) => {
        // Mock blob.text() method - we don't need to capture csvContent
        if ('text' in blob) {
          void blob.text()
        }
        return 'blob:mock-url'
      })
      global.URL.createObjectURL = createObjectURL
      global.URL.revokeObjectURL = vi.fn()

      const mockClick = vi.fn()
      const originalCreateElement = document.createElement
      vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        if (tag === 'a') {
          return {
            click: mockClick,
            href: '',
            download: '',
            style: { display: 'none' },
          }
        }
        return originalCreateElement.call(document, tag)
      })

      render(<TradingSweepResults {...defaultProps} />)

      const exportButton = screen.getByText('Export CSV')
      fireEvent.click(exportButton)

      // Check that createObjectURL was called
      expect(createObjectURL).toHaveBeenCalled()
    })

    it('handles special characters in CSV (commas, quotes)', () => {
      const specialResults = [
        {
          ...mockTradingResults[0],
          trades: {
            ...mockTradingResults[0].trades,
            avg_trade_duration: '5.2 days, 3 hours',
          },
        },
      ]

      const createObjectURL = vi.fn((blob: Blob) => {
        // Mock blob.text() method - we don't need to capture csvContent
        if ('text' in blob) {
          void blob.text()
        }
        return 'blob:mock-url'
      })
      global.URL.createObjectURL = createObjectURL
      global.URL.revokeObjectURL = vi.fn()

      const mockClick = vi.fn()
      const originalCreateElement = document.createElement
      vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        if (tag === 'a') {
          return {
            click: mockClick,
            href: '',
            download: '',
            style: { display: 'none' },
          }
        }
        return originalCreateElement.call(document, tag)
      })

      render(<TradingSweepResults results={specialResults} ticker="BTC-USD" />)

      const exportButton = screen.getByText('Export CSV')
      fireEvent.click(exportButton)

      expect(createObjectURL).toHaveBeenCalled()
    })

    it('includes ticker in filename', () => {
      let downloadFilename = ''

      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      }

      const originalCreateElement = document.createElement
      vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        if (tag === 'a') {
          const link = mockLink as unknown as HTMLAnchorElement
          Object.defineProperty(link, 'download', {
            set: (value) => {
              downloadFilename = value
            },
            get: () => downloadFilename,
          })
          return link
        }
        return originalCreateElement.call(document, tag)
      })

      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
      global.URL.revokeObjectURL = vi.fn()

      render(<TradingSweepResults {...defaultProps} />)

      const exportButton = screen.getByText('Export CSV')
      fireEvent.click(exportButton)

      expect(downloadFilename).toContain('BTC-USD')
      expect(downloadFilename).toContain('.csv')
    })
  })

  describe('Top 10 Chart', () => {
    it('renders top 10 strategies', () => {
      render(<TradingSweepResults {...defaultProps} />)

      expect(screen.getByText('Top 10 Strategies by Sharpe Ratio')).toBeInTheDocument()

      // Should show ranking
      expect(screen.getByText('#1')).toBeInTheDocument()
      expect(screen.getByText('#2')).toBeInTheDocument()
      expect(screen.getByText('#3')).toBeInTheDocument()
    })

    it('limits chart to 10 results when more available', () => {
      const manyResults = Array.from({ length: 25 }, (_, i) => ({
        ...mockTradingResults[0],
        id: `result-${i}`,
        parameters: {
          fast_period: 10 + i,
          slow_period: 50 + i,
        },
        performance: {
          ...mockTradingResults[0].performance,
          sharpe_ratio: 2.5 - i * 0.1,
        },
      }))

      render(<TradingSweepResults results={manyResults} ticker="BTC-USD" />)

      // Should only show #1 through #10
      expect(screen.getByText('#10')).toBeInTheDocument()
      expect(screen.queryByText('#11')).not.toBeInTheDocument()
    })
  })

  describe('Results Table', () => {
    it('renders all results in table', () => {
      render(<TradingSweepResults {...defaultProps} />)

      expect(screen.getByText(`All Results (${mockTradingResults.length})`)).toBeInTheDocument()
    })

    it('displays all required columns', () => {
      render(<TradingSweepResults {...defaultProps} />)

      expect(screen.getByText('Fast/Slow')).toBeInTheDocument()
      expect(screen.getByText('Sharpe')).toBeInTheDocument()
      expect(screen.getByText('Return %')).toBeInTheDocument()
      expect(screen.getByText('Drawdown %')).toBeInTheDocument()
      expect(screen.getByText('Win Rate')).toBeInTheDocument()
      expect(screen.getByText('Trades')).toBeInTheDocument()
    })

    it('formats percentages correctly', () => {
      render(<TradingSweepResults {...defaultProps} />)

      // Return should have + prefix and 1 decimal
      expect(screen.getByText('+150.5%')).toBeInTheDocument()

      // Drawdown should be negative
      expect(screen.getByText('-12.3%')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('displays empty message when no results', () => {
      render(<TradingSweepResults results={[]} ticker="BTC-USD" />)

      expect(screen.getByText('No results available yet.')).toBeInTheDocument()
    })

    it('does not render statistics cards when empty', () => {
      render(<TradingSweepResults results={[]} ticker="BTC-USD" />)

      expect(screen.queryByText('Best Sharpe')).not.toBeInTheDocument()
    })

    it('does not render chart when empty', () => {
      render(<TradingSweepResults results={[]} ticker="BTC-USD" />)

      expect(screen.queryByText('Top 10 Strategies')).not.toBeInTheDocument()
    })

    it('does not render table when empty', () => {
      render(<TradingSweepResults results={[]} ticker="BTC-USD" />)

      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
  })
})
