# Supabase Configuration Fix

## Problem

Your production deployment is failing with:

```
500: INTERNAL_SERVER_ERROR
Code: MIDDLEWARE_INVOCATION_FAILED
[Error: Your project's URL and Key are required to create a Supabase client!]
```

## Root Cause

The Supabase client is missing required environment variables in production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Solution Applied

### 1. Enhanced Error Handling

Updated all Supabase client files to include proper environment variable validation:

- `lib/supabase/client.ts` - Browser client with validation
- `lib/supabase/server.ts` - Server client with validation
- `lib/supabase/middleware.ts` - Middleware with graceful fallback

### 2. Required Environment Variables

You need to set these environment variables in your Vercel deployment:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 3. How to Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the following values:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### 4. Setting Environment Variables in Vercel

#### Option A: Vercel Dashboard

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add the two variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = your anon key

#### Option B: Vercel CLI

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

### 5. Redeploy

After setting the environment variables, redeploy your application:

```bash
vercel --prod
```

## Verification

After deployment, check that:

1. No more middleware errors in Vercel logs
2. Supabase authentication works
3. API routes function properly

## Security Notes

- The `NEXT_PUBLIC_` prefix makes these variables available in the browser
- This is safe for Supabase as the anon key is designed for client-side use
- Never expose your service role key (it should be `SUPABASE_SERVICE_ROLE_KEY` without the `NEXT_PUBLIC_` prefix)
