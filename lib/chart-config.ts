// Chart configuration for Recharts
export const chartColors = {
  primary: '#3b82f6', // Blue
  secondary: '#10b981', // Green
  accent: '#f59e0b', // Amber
  danger: '#ef4444', // Red
  warning: '#f97316', // Orange
  success: '#22c55e', // Green
  info: '#06b6d4', // Cyan
}

export const chartTheme = {
  colors: [
    chartColors.primary,
    chartColors.secondary,
    chartColors.accent,
    chartColors.danger,
    chartColors.warning,
    chartColors.success,
    chartColors.info,
  ],
  grid: {
    stroke: '#e5e7eb',
    strokeWidth: 1,
  },
  axis: {
    stroke: '#6b7280',
    strokeWidth: 1,
  },
  tooltip: {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '6px',
  },
}

// Common chart configurations
export const lineChartConfig = {
  strokeWidth: 2,
  dot: { r: 4 },
  activeDot: { r: 6 },
}

export const barChartConfig = {
  barSize: 40,
  radius: [4, 4, 0, 0],
}

export const pieChartConfig = {
  cx: '50%',
  cy: '50%',
  innerRadius: 60,
  outerRadius: 80,
  paddingAngle: 5,
}
