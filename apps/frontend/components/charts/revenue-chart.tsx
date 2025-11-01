'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { chartTheme, lineChartConfig } from '@/lib/chart-config'

interface RevenueData {
  month: string
  revenue: number
  expenses: number
  profit: number
}

interface RevenueChartProps {
  data: RevenueData[]
  title?: string
  description?: string
}

export function RevenueChart({ data, title = 'Revenue Trend', description }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid.stroke} />
              <XAxis dataKey="month" stroke={chartTheme.axis.stroke} fontSize={12} />
              <YAxis
                stroke={chartTheme.axis.stroke}
                fontSize={12}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={chartTheme.tooltip}
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`,
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={chartTheme.colors[0]}
                strokeWidth={lineChartConfig.strokeWidth}
                dot={lineChartConfig.dot}
                activeDot={lineChartConfig.activeDot}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke={chartTheme.colors[1]}
                strokeWidth={lineChartConfig.strokeWidth}
                dot={lineChartConfig.dot}
                activeDot={lineChartConfig.activeDot}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke={chartTheme.colors[2]}
                strokeWidth={lineChartConfig.strokeWidth}
                dot={lineChartConfig.dot}
                activeDot={lineChartConfig.activeDot}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
