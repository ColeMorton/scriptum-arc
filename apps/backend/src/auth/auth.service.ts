import { Injectable } from '@nestjs/common'
import { createClient } from '@supabase/supabase-js'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  private supabase

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('NEXT_PUBLIC_SUPABASE_URL')
    const supabaseKey = this.configService.get<string>('NEXT_PUBLIC_SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async verifyToken(token: string) {
    const { data, error } = await this.supabase.auth.getUser(token)

    if (error) {
      throw new Error(`Authentication failed: ${error.message}`)
    }

    return data.user
  }

  extractTenantId(user: {
    user_metadata?: { tenant_id?: string }
    app_metadata?: { tenant_id?: string }
  }): string {
    // Extract tenant ID from user metadata
    const tenantId = user?.user_metadata?.tenant_id || user?.app_metadata?.tenant_id

    if (!tenantId) {
      throw new Error('Tenant ID not found in user metadata')
    }

    return tenantId
  }
}
