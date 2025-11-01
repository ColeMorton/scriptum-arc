// Shared utility functions
export function cn(...inputs: unknown[]): string {
  return inputs.filter(Boolean).join(' ')
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
