import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Test Supabase connection
    const { error } = await supabase.from('_prisma_migrations').select('*').limit(1)

    if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database connection failed',
          error: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Supabase connected successfully',
      timestamp: new Date().toISOString(),
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasConnection: true,
      },
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
