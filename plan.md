# Supabase Outlook Smoke Test Workflow

## Scope

Create a comprehensive smoke test workflow that validates both Supabase database connectivity and Outlook SMTP email functionality using the native n8n Supabase node.

## Workflow Configuration

### File Name

`internal/supabase-outlook-smoke-test.json`

### Purpose

- **Supabase Testing**: Validates database connectivity and credential configuration
- **Outlook SMTP Testing**: Validates email sending functionality via Outlook/Hotmail
- **Integration Testing**: Ensures both systems work together in n8n workflows

### Workflow Structure

```
Manual Trigger
    ↓
Fetch Test Info (Supabase) ← Uses native Supabase node
    ↓
Check Result ← Validates data retrieval
    ↓ (success)           ↓ (failure)
Send Success Email    Return Error Response
    ↓
Return Success Response
```

### Key Features

1. **Native Supabase Node**: Uses `operation: "get"` with `tableId: "tenants"`
2. **Specific Tenant Query**: Filters by tenant ID `cmgrh5b8m0000oxx37dssfm9z`
3. **Outlook SMTP Integration**: Sends test email via cole.morton@hotmail.com
4. **Error Handling**: Proper success/failure paths
5. **Credential Validation**: Tests both Supabase and SMTP credentials

### Benefits

- **Comprehensive Testing**: Validates both database and email functionality
- **Native Integration**: Uses n8n's built-in Supabase node (no HTTP workarounds)
- **Real-world Scenario**: Tests actual tenant data retrieval
- **Production Ready**: Mirrors real workflow patterns
- **Clear Naming**: Descriptive filename and purpose

## Documentation Updates

### Files Updated

1. **`n8n-workflows/README.md`**: Updated workflow name and description
2. **`docs/tools/n8n-setup.md`**: Updated setup documentation
3. **`plan.md`**: Updated project plan

### Key Changes

- Workflow name: "Supabase Outlook Smoke Test"
- File name: `supabase-outlook-smoke-test.json`
- Purpose: Validates both Supabase and Outlook integration
- Use case: First workflow to run for credential validation

## Implementation Status

### Completed

- ✅ Workflow JSON structure finalized
- ✅ Documentation updated across all files
- ✅ Clear naming convention established
- ✅ Purpose and benefits documented

### Next Steps

- Import workflow into n8n
- Configure Supabase credentials
- Configure Outlook SMTP credentials
- Test workflow execution
- Verify email delivery

## Technical Details

### Supabase Configuration

- **Operation**: `get` (retrieve single record)
- **Table**: `tenants`
- **Filter**: Specific tenant ID lookup
- **Credentials**: Supabase account with service role key

### SMTP Configuration

- **Provider**: Outlook/Hotmail
- **From**: cole.morton@hotmail.com
- **To**: cole.morton@hotmail.com
- **Authentication**: App password required

### Workflow Flow

1. Manual trigger starts workflow
2. Supabase node fetches tenant data
3. IF node validates successful retrieval
4. Success path: Send email + return success response
5. Failure path: Return error response

This workflow serves as the foundation for all other n8n workflows in the Zixly internal operations platform.
