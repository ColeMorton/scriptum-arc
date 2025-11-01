'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { tenantSchema, type TenantFormData } from '@/lib/form-schemas'
import { toast } from 'sonner'

interface TenantFormProps {
  onSubmit: (data: TenantFormData) => void
  defaultValues?: Partial<TenantFormData>
}

export function TenantForm({ onSubmit, defaultValues }: TenantFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues,
  })

  const handleFormSubmit = async (data: TenantFormData) => {
    try {
      await onSubmit(data)
      toast.success('Tenant created successfully!')
    } catch (error) {
      toast.error('Failed to create tenant')
      console.error('Form submission error:', error)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Tenant</CardTitle>
        <CardDescription>Add a new tenant to your business intelligence platform</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input id="name" {...register('name')} placeholder="Enter company name" />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry (Optional)</Label>
            <Input
              id="industry"
              {...register('industry')}
              placeholder="e.g., Technology, Construction"
            />
            {errors.industry && <p className="text-sm text-red-600">{errors.industry.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Tenant'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
