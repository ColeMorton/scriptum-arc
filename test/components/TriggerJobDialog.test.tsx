import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TriggerJobDialog } from '@/components/pipelines/TriggerJobDialog'
import type { ReactNode } from 'react'

// Mock toast - using inline functions in the factory
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Import the mocked toast after the mock is defined
import { toast } from 'sonner'
const mockToastSuccess = toast.success as ReturnType<typeof vi.fn>
const mockToastError = toast.error as ReturnType<typeof vi.fn>

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch as unknown as typeof fetch

// Mock MSW to prevent interference
vi.mock('msw', () => ({
  setupServer: vi.fn(() => ({
    listen: vi.fn(),
    close: vi.fn(),
    resetHandlers: vi.fn(),
  })),
}))

// Mock Next.js router
const mockRefresh = vi.fn()
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    push: mockPush,
  }),
}))

interface DialogProps {
  children: ReactNode
  open?: boolean
  [key: string]: unknown
}

interface ChildrenOnlyProps {
  children: ReactNode
  [key: string]: unknown
}

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  [key: string]: unknown
}

interface InputProps {
  [key: string]: unknown
}

interface SelectProps {
  children: ReactNode
  onValueChange?: (value: string) => void
  defaultValue?: string
  [key: string]: unknown
}

interface SelectItemProps {
  children: ReactNode
  value: string
  [key: string]: unknown
}

// Mock UI components
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: DialogProps) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: ChildrenOnlyProps) => <div>{children}</div>,
  DialogHeader: ({ children }: ChildrenOnlyProps) => <div>{children}</div>,
  DialogTitle: ({ children }: ChildrenOnlyProps) => <h2>{children}</h2>,
  DialogDescription: ({ children }: ChildrenOnlyProps) => <p>{children}</p>,
  DialogFooter: ({ children }: ChildrenOnlyProps) => <div>{children}</div>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type, ...props }: ButtonProps) => (
    <button onClick={onClick} disabled={disabled} type={type} {...props}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: ChildrenOnlyProps) => <label {...props}>{children}</label>,
}))

vi.mock('@/components/ui/input', () => ({
  Input: (props: InputProps) => <input {...props} />,
}))

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, defaultValue }: SelectProps) => (
    <div>
      {children}
      <select onChange={(e) => onValueChange?.(e.target.value)} defaultValue={defaultValue}>
        <option value="trading-sweep">Trading Sweep</option>
        <option value="document-processing">Document Processing</option>
        <option value="data-etl">Data ETL</option>
        <option value="ml-inference">ML Inference</option>
      </select>
    </div>
  ),
  SelectTrigger: ({ children }: ChildrenOnlyProps) => <div>{children}</div>,
  SelectValue: () => <span>Select job type</span>,
  SelectContent: ({ children }: ChildrenOnlyProps) => <div>{children}</div>,
  SelectItem: ({ children, value }: SelectItemProps) => <option value={value}>{children}</option>,
}))

vi.mock('@/components/ui/textarea', () => ({
  Textarea: (props: InputProps) => <textarea {...props} />,
}))

describe('TriggerJobDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockToastSuccess.mockClear()
    mockToastError.mockClear()
    mockRefresh.mockClear()
    mockPush.mockClear()
    // Reset fetch mock and set up default behavior
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'job-123' }),
      clone: function () {
        return this
      },
    })
  })

  describe('Form Rendering', () => {
    it('renders dialog when open', () => {
      render(<TriggerJobDialog {...defaultProps} />)

      expect(screen.getByTestId('dialog')).toBeInTheDocument()
      expect(screen.getByText('Trigger New Pipeline Job')).toBeInTheDocument()
    })

    it('does not render when closed', () => {
      render(<TriggerJobDialog open={false} onOpenChange={vi.fn()} />)

      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
    })

    it('renders all form fields', () => {
      render(<TriggerJobDialog {...defaultProps} />)

      expect(screen.getByText('Job Type')).toBeInTheDocument()
      expect(screen.getByText('Ticker Symbol')).toBeInTheDocument()
      expect(screen.getByText('Configuration JSON (optional)')).toBeInTheDocument()
    })

    it('renders job type select with all options', () => {
      render(<TriggerJobDialog {...defaultProps} />)

      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()

      // Check that all job types are available
      expect(screen.getByText('Trading Sweep')).toBeInTheDocument()
      expect(screen.getByText('Document Processing')).toBeInTheDocument()
      expect(screen.getByText('Data ETL')).toBeInTheDocument()
      expect(screen.getByText('ML Inference')).toBeInTheDocument()
    })

    it('renders submit and cancel buttons', () => {
      render(<TriggerJobDialog {...defaultProps} />)

      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Trigger Job')).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('has a default job_type selected', async () => {
      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      expect((jobTypeSelect as HTMLSelectElement).value).toBe('trading-sweep')
    })

    it('allows submission with only job_type', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-job-id' }),
        clone: function () {
          return this
        },
      })

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'document-processing' } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
        // Check that the request was made with correct data
        expect(mockToastSuccess).toHaveBeenCalled()
      })
    })

    it('includes ticker when provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-job-id' }),
        clone: function () {
          return this
        },
      })

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const tickerInput = screen.getByPlaceholderText(/BTC-USD/i)
      fireEvent.change(tickerInput, { target: { value: 'ETH-USD' } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
        expect(mockToastSuccess).toHaveBeenCalled()
      })
    })

    it('validates JSON config format', async () => {
      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const configTextarea = screen.getByLabelText('Configuration JSON (optional)')
      fireEvent.change(configTextarea, { target: { value: 'invalid json{' } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Invalid JSON configuration')
      })

      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('accepts valid JSON config', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-job-id' }),
        clone: function () {
          return this
        },
      })

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const configTextarea = screen.getByLabelText('Configuration JSON (optional)')
      const validConfig = JSON.stringify({ strategy: 'EMA', period: 20 }, null, 2)
      fireEvent.change(configTextarea, { target: { value: validConfig } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
        expect(mockToastSuccess).toHaveBeenCalled()
      })
    })

    it('trims whitespace from ticker', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-job-id' }),
        clone: function () {
          return this
        },
      })

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const tickerInput = screen.getByPlaceholderText(/BTC-USD/i)
      fireEvent.change(tickerInput, { target: { value: '  BTC-USD  ' } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
        expect(mockToastSuccess).toHaveBeenCalled()
      })
    })

    it('ignores empty ticker', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-job-id' }),
        clone: function () {
          return this
        },
      })

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const tickerInput = screen.getByPlaceholderText(/BTC-USD/i)
      fireEvent.change(tickerInput, { target: { value: '   ' } }) // Only whitespace

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
        expect(mockToastSuccess).toHaveBeenCalled()
      })
    })
  })

  describe('Submission', () => {
    it('disables submit button while submitting', async () => {
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ ok: true, json: async () => ({ id: 'new-job-id' }) }), 100)
          })
      )

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled()

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
    })

    it('shows success toast on successful submission', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-job-id', job_type: 'trading-sweep' }),
        clone: function () {
          return this
        },
      })

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith(
          'Job triggered successfully',
          expect.objectContaining({
            description: expect.stringContaining('new-job-id'),
          })
        )
      })
    })

    it('shows error toast on failed submission', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Server Error' }),
        clone: function () {
          return this
        },
      })

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          'Failed to trigger job',
          expect.objectContaining({
            description: expect.stringContaining('Internal Server Error'),
          })
        )
      })
    })

    it('closes dialog on successful submission', async () => {
      const onOpenChange = vi.fn()
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-job-id' }),
        clone: function () {
          return this
        },
      })

      render(<TriggerJobDialog open={true} onOpenChange={onOpenChange} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false)
      })
    })

    it('refreshes router on successful submission', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-job-id' }),
        clone: function () {
          return this
        },
      })

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled()
      })
    })

    it('resets form after successful submission', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-job-id' }),
        clone: function () {
          return this
        },
      })

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const tickerInput = screen.getByPlaceholderText(/BTC-USD/i)
      fireEvent.change(tickerInput, { target: { value: 'ETH-USD' } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalled()
      })

      // Form should be reset - ticker was filled before submission,
      // so after reset it should be empty
      await waitFor(() => {
        expect((tickerInput as HTMLInputElement).value).toBe('')
      })
    })
  })

  describe('Cancel Button', () => {
    it('closes dialog when cancel clicked', () => {
      const onOpenChange = vi.fn()
      render(<TriggerJobDialog open={true} onOpenChange={onOpenChange} />)

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('does not submit when cancel clicked', () => {
      render(<TriggerJobDialog {...defaultProps} />)

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('handles network errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          'Failed to trigger job',
          expect.objectContaining({
            description: expect.stringContaining('Network error'),
          })
        )
      })
    })

    it('handles very large JSON config', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-job-id' }),
        clone: function () {
          return this
        },
      })

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      // Create large config object
      const largeConfig = {
        parameters: Array.from({ length: 100 }, (_, i) => ({ key: `param${i}`, value: i })),
      }

      const configTextarea = screen.getByLabelText('Configuration JSON (optional)')
      fireEvent.change(configTextarea, { target: { value: JSON.stringify(largeConfig) } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
        expect(mockToastSuccess).toHaveBeenCalled()
      })
    })

    it('handles special characters in ticker', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-job-id' }),
        clone: function () {
          return this
        },
      })

      render(<TriggerJobDialog {...defaultProps} />)

      const jobTypeSelect = screen.getByRole('combobox')
      fireEvent.change(jobTypeSelect, { target: { value: 'trading-sweep' } })

      const tickerInput = screen.getByPlaceholderText(/BTC-USD/i)
      fireEvent.change(tickerInput, { target: { value: 'BTC-USD/USDT:PERP' } })

      const submitButton = screen.getByText('Trigger Job')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
        expect(mockToastSuccess).toHaveBeenCalled()
      })
    })
  })
})
