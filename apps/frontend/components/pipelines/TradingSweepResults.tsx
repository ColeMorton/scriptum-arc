'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

interface TradingResult {
  id: string
  parameters: {
    fast_period: number
    slow_period: number
  }
  performance: {
    score: number
    sharpe_ratio: number
    sortino_ratio: number
    total_return_pct: number
    annualized_return: number
    max_drawdown_pct: number
    win_rate_pct: number
    profit_factor: number
  }
  trades: {
    total_trades: number
    trades_per_month: number
    avg_trade_duration: string
  }
}

interface TradingSweepResultsProps {
  results: TradingResult[]
  ticker: string
}

export function TradingSweepResults({ results, ticker }: TradingSweepResultsProps) {
  const [sortBy, setSortBy] = useState<'score' | 'sharpe_ratio' | 'total_return_pct'>('score')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const sortedResults = [...results].sort((a, b) => {
    const aVal = a.performance[sortBy]
    const bVal = b.performance[sortBy]
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
  })

  const topResults = sortedResults.slice(0, 10)

  const exportToCSV = () => {
    const headers = [
      'Fast Period',
      'Slow Period',
      'Score',
      'Sharpe Ratio',
      'Sortino Ratio',
      'Total Return %',
      'Annualized Return',
      'Max Drawdown %',
      'Win Rate %',
      'Profit Factor',
      'Total Trades',
      'Trades/Month',
      'Avg Trade Duration',
    ]

    const rows = sortedResults.map((result) => [
      result.parameters.fast_period,
      result.parameters.slow_period,
      result.performance.score,
      result.performance.sharpe_ratio,
      result.performance.sortino_ratio,
      result.performance.total_return_pct,
      result.performance.annualized_return,
      result.performance.max_drawdown_pct,
      result.performance.win_rate_pct,
      result.performance.profit_factor,
      result.trades.total_trades,
      result.trades.trades_per_month,
      result.trades.avg_trade_duration,
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `trading-sweep-${ticker}-${new Date().toISOString()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No results available yet.</p>
      </div>
    )
  }

  // Calculate statistics
  const stats = {
    best_sharpe: Math.max(...results.map((r) => r.performance.sharpe_ratio)),
    best_return: Math.max(...results.map((r) => r.performance.total_return_pct)),
    lowest_drawdown: Math.min(...results.map((r) => r.performance.max_drawdown_pct)),
    avg_sharpe: results.reduce((sum, r) => sum + r.performance.sharpe_ratio, 0) / results.length,
    avg_return:
      results.reduce((sum, r) => sum + r.performance.total_return_pct, 0) / results.length,
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Best Sharpe</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {stats.best_sharpe.toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">Best Return</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {stats.best_return.toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Lowest DD</p>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {stats.lowest_drawdown.toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Avg Sharpe</p>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {stats.avg_sharpe.toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Avg Return</p>
          <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
            {stats.avg_return.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Simple Bar Chart for Sharpe Ratios */}
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Top 10 Strategies by Sharpe Ratio
          </h3>
        </div>
        <div className="space-y-2">
          {topResults.map((result, index) => {
            const maxSharpe = topResults[0].performance.sharpe_ratio
            const width = (result.performance.sharpe_ratio / maxSharpe) * 100
            return (
              <div key={result.id} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8">#{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {result.parameters.fast_period}/{result.parameters.slow_period}
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {result.performance.sharpe_ratio.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            All Results ({results.length})
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'score' | 'sharpe_ratio' | 'total_return_pct')
                }
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
              >
                <option value="score">Score</option>
                <option value="sharpe_ratio">Sharpe Ratio</option>
                <option value="total_return_pct">Total Return</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              Export CSV
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Fast/Slow
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Sharpe
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Return %
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Drawdown %
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Win Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Trades
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {result.parameters.fast_period}/{result.parameters.slow_period}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {result.performance.sharpe_ratio.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">
                    +{result.performance.total_return_pct.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
                    {result.performance.max_drawdown_pct.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {result.performance.win_rate_pct.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {result.trades.total_trades}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
