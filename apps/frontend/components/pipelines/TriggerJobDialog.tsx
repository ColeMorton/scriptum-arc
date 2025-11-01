'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiPost } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface TriggerJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TriggerJobDialog({ open, onOpenChange }: TriggerJobDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    job_type: 'trading-sweep',
    ticker: '',
    config: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Parse config JSON if provided
      let config: Record<string, unknown> | undefined
      const trimmedConfig = formData.config.trim()
      if (trimmedConfig) {
        try {
          config = JSON.parse(trimmedConfig) as Record<string, unknown>
        } catch {
          toast.error('Invalid JSON configuration')
          setLoading(false)
          return
        }
      }

      // Build request body
      const body: Record<string, unknown> = {
        job_type: formData.job_type,
      }

      // Only include ticker if it has a value after trimming
      const trimmedTicker = formData.ticker.trim()
      if (trimmedTicker) {
        body.ticker = trimmedTicker
      }

      // Only include config if parsed successfully
      if (config) {
        body.config = config
      }

      // Call API to trigger job
      const data = await apiPost<{ id: string }>('/api/pipelines', body)

      toast.success('Job triggered successfully', {
        description: `Job ${data.id} has been queued`,
      })

      // Close dialog
      onOpenChange(false)

      // Refresh the page to show new job
      router.refresh()

      // Reset form
      setFormData({
        job_type: 'trading-sweep',
        ticker: '',
        config: '',
      })
    } catch (error) {
      console.error('Failed to trigger job:', error)
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Failed to trigger job', {
        description: errorMsg,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Trigger New Pipeline Job</DialogTitle>
          <DialogDescription>
            Configure and submit a new pipeline job. The job will be queued and processed
            asynchronously.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="job_type">Job Type</Label>
              <select
                id="job_type"
                value={formData.job_type}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="trading-sweep">Trading Sweep</option>
                <option value="document-processing">Document Processing</option>
                <option value="data-etl">Data ETL</option>
                <option value="ml-inference">ML Inference</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ticker">Ticker Symbol</Label>
              <Input
                id="ticker"
                placeholder="BTC-USD, ETH-USD, etc."
                value={formData.ticker}
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="config">Configuration JSON (optional)</Label>
              <textarea
                id="config"
                value={formData.config}
                onChange={(e) => setFormData({ ...formData, config: e.target.value })}
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                placeholder='{\n  "key": "value"\n}'
              />
              <p className="text-xs text-muted-foreground">
                Valid JSON configuration for the job. Varies by job type.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Triggering...' : 'Trigger Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
