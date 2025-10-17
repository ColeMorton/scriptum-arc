# n8n Setup Guide for Zixly Internal Operations

**Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Technical Operations  
**Status**: Active Guide

---

## Overview

This guide covers the setup and configuration of n8n for Zixly's internal operations automation. n8n serves as the central automation hub, connecting all self-hostable SME stack tools and automating Zixly's service delivery workflows.

---

## Prerequisites

- Docker and Docker Compose installed
- MacBook Pro (M1) or compatible system
- 8GB+ RAM available for Docker containers
- Ports 5678, 5432, 6379 available

---

## Quick Start

### 1. Deploy n8n Stack

```bash
# Navigate to Zixly project directory
cd /Users/colemorton/Projects/zixly

# Start n8n services
docker-compose -f docker-compose.n8n.yml up -d

# Check service status
docker-compose -f docker-compose.n8n.yml ps
```

### 2. Access n8n Interface

- **URL**: http://localhost:5678
- **Username**: admin
- **Password**: your_n8n_password_here
- **Email**: your_email@domain.com
- **Name**: Your Name

**⚠️ SECURITY WARNING**: This documentation contains placeholder credentials only. Never commit real credentials to source control.

### 3. Verify Services

```bash
# Check n8n health
curl http://localhost:5678/healthz

# Check PostgreSQL
docker exec zixly-n8n-postgres psql -U n8n -d n8n -c "SELECT version();"

# Check Redis
docker exec zixly-n8n-redis redis-cli ping
```

---

## Configuration

### Environment Variables

The n8n service is configured with the following key environment variables:

```yaml
environment:
  - N8N_BASIC_AUTH_ACTIVE=true
  - N8N_BASIC_AUTH_USER=admin
  - N8N_BASIC_AUTH_PASSWORD=your_n8n_password_here
  - N8N_HOST=localhost
  - N8N_PORT=5678
  - N8N_PROTOCOL=http
  - N8N_EDITOR_BASE_URL=http://localhost:5678
  - WEBHOOK_URL=http://localhost:5678
  - GENERIC_TIMEZONE=Australia/Brisbane
  - N8N_LOG_LEVEL=info
  - N8N_METRICS=true
  - N8N_DIAGNOSTICS_ENABLED=true
```

### Database Configuration

n8n uses PostgreSQL for workflow persistence:

```yaml
- DB_TYPE=postgresdb
- DB_POSTGRESDB_HOST=postgres
- DB_POSTGRESDB_PORT=5432
- DB_POSTGRESDB_DATABASE=n8n
- DB_POSTGRESDB_USER=n8n
- DB_POSTGRESDB_PASSWORD=your_database_password_here
```

### Redis Configuration

Redis is used for queue management:

```yaml
- QUEUE_BULL_REDIS_HOST=redis
- QUEUE_BULL_REDIS_PORT=6379
- QUEUE_BULL_REDIS_DB=0
```

---

## Core Workflows

### 0. Supabase Outlook Smoke Test (Recommended First Step)

**Purpose**: Validates Supabase database connectivity and Microsoft Outlook OAuth2 email functionality before running production workflows.

**Trigger**: Manual execution

**Actions**:

1. Queries specific Zixly tenant from Supabase database using tenant ID
2. Validates database connection and data retrieval
3. Sends test email via Microsoft Outlook OAuth2 API with results
4. Returns success/failure status with detailed information

**Testing**: Execute this workflow first to ensure Supabase credentials and Microsoft Outlook OAuth2 credentials are properly configured.

### 1. Client Onboarding Automation

**Purpose**: Automates new client setup when a service contract is signed.

**Trigger**: Webhook POST to `/client-onboarding`

**Actions**:

1. Creates client record in Supabase
2. Creates project in Plane
3. Creates folder structure in Nextcloud
4. Sends welcome email to client
5. Tracks onboarding metrics

**Input Data**:

```json
{
  "clientId": "brisbane-construction",
  "clientName": "Brisbane Construction Co",
  "industry": "Construction",
  "serviceTier": "Starter",
  "contactEmail": "contact@brisbaneconstruction.com.au",
  "contactName": "John Smith"
}
```

**Output**: Success confirmation with project details

### 2. Time Tracking Sync

**Purpose**: Daily sync of billable hours from Plane to financial records.

**Trigger**: Cron job (5 PM weekdays)

**Actions**:

1. Fetches completed tasks from Plane
2. Calculates billable hours per client
3. Updates CustomMetric table
4. Sends daily sync notification
5. Updates sync status

**Metrics Tracked**:

- Billable hours per client
- Project velocity (tasks completed)
- Time tracking accuracy

### 3. Financial Reporting

**Purpose**: Weekly financial performance analysis and reporting.

**Trigger**: Cron job (Monday 9 AM)

**Actions**:

1. Aggregates weekly financial data
2. Calculates key performance metrics
3. Generates client breakdown
4. Sends comprehensive report
5. Syncs to Xero accounting

**Metrics Calculated**:

- Total revenue and expenses
- Profit margins
- Revenue per billable hour
- Client satisfaction scores

---

## Credentials Setup

### Required Credentials

1. **Zixly Supabase API**
   - Type: Supabase API
   - URL: Your Supabase project URL
   - Service Key: Your Supabase service key

2. **Zixly Plane API**
   - Type: HTTP Request Authentication
   - API Key: Your Plane API key
   - Base URL: http://plane:8000

3. **Zixly Nextcloud API**
   - Type: HTTP Request Authentication
   - Username: admin
   - Password: Your Nextcloud password
   - Base URL: http://nextcloud:8080

4. **Microsoft Outlook OAuth2 API**
   - Type: Microsoft Outlook OAuth2 API
   - OAuth Redirect URL: http://localhost:5678/rest/oauth2-credential/callback
   - Authorization URL: https://login.microsoftonline.com/common/oauth2/v2.0/authorize
   - Access Token URL: https://login.microsoftonline.com/common/oauth2/v2.0/token
   - Client ID: 7885db51-be6e-4425-b555-52d60ff9c04a
   - Client Secret: [Configured and encrypted]
   - Allowed HTTP Request Domains: All

5. **Zixly Xero API**
   - Type: OAuth2
   - Client ID: Your Xero app client ID
   - Client Secret: Your Xero app secret
   - Authorization URL: https://login.xero.com/identity/connect/authorize
   - Access Token URL: https://identity.xero.com/connect/token

### Setting Up Credentials

1. **Access n8n Interface**: http://localhost:5678
2. **Navigate to Credentials**: Settings → Credentials
3. **Add Each Credential**: Click "Add Credential" and select the appropriate type
4. **Test Connections**: Use the "Test" button to verify each credential

---

## Workflow Management

### Importing Workflows

1. **Access Workflows**: Main n8n interface
2. **Import Workflow**: Click "Import from File"
3. **Select JSON File**: Choose from `n8n-workflows/internal/`
4. **Configure Credentials**: Update credential references
5. **Activate Workflow**: Toggle the workflow to active

### Workflow Files

- `client-onboarding.json` - Client onboarding automation
- `time-tracking-sync.json` - Daily time tracking sync
- `financial-reporting.json` - Weekly financial reporting

### Monitoring Workflows

1. **Execution History**: View past executions and results
2. **Error Handling**: Monitor failed executions
3. **Performance Metrics**: Track execution times
4. **Logs**: Access detailed execution logs

---

## Integration Points

### Supabase Integration

**Purpose**: Store and retrieve Zixly internal operations data

**Tables Used**:

- `client_kpis` - Service clients
- `custom_metric` - Internal KPIs
- `workflow_metadata` - Workflow tracking
- `data_sync_status` - Sync health monitoring

### Plane Integration

**Purpose**: Project management and task tracking

**API Endpoints**:

- `GET /api/v1/projects/` - Fetch projects
- `POST /api/v1/projects/` - Create project
- `GET /api/v1/issues/` - Fetch tasks/issues

### Nextcloud Integration

**Purpose**: File management and document storage

**API Endpoints**:

- `MKCOL /remote.php/dav/files/` - Create folders
- `PUT /remote.php/dav/files/` - Upload files

### Microsoft Outlook OAuth2 Integration

**Purpose**: Automated notifications and reports via Microsoft Outlook OAuth2 API

**Configuration**:

- **Authentication**: OAuth 2.0 with automatic token refresh
- **Security**: Token-based authentication (no static passwords)
- **Reliability**: Enhanced deliverability and compliance with Microsoft security policies

**Use Cases**:

- Client welcome emails
- Daily sync notifications
- Weekly financial reports
- Error alerts

---

## Troubleshooting

### Common Issues

**1. n8n Won't Start**

```bash
# Check Docker logs
docker-compose -f docker-compose.n8n.yml logs n8n

# Check port conflicts
lsof -i :5678
```

**2. Database Connection Issues**

```bash
# Check PostgreSQL status
docker exec zixly-n8n-postgres pg_isready -U n8n

# Check database exists
docker exec zixly-n8n-postgres psql -U n8n -l
```

**3. Redis Connection Issues**

```bash
# Check Redis status
docker exec zixly-n8n-redis redis-cli ping

# Check Redis logs
docker-compose -f docker-compose.n8n.yml logs redis
```

**4. Workflow Execution Failures**

- Check credential configuration
- Verify API endpoints are accessible
- Review execution logs in n8n interface
- Test individual nodes

### Logs and Monitoring

**View Logs**:

```bash
# All services
docker-compose -f docker-compose.n8n.yml logs

# Specific service
docker-compose -f docker-compose.n8n.yml logs n8n

# Follow logs in real-time
docker-compose -f docker-compose.n8n.yml logs -f n8n
```

**Health Checks**:

```bash
# n8n health
curl http://localhost:5678/healthz

# Database health
docker exec zixly-n8n-postgres pg_isready -U n8n

# Redis health
docker exec zixly-n8n-redis redis-cli ping
```

---

## Security Considerations

### Access Control

- **Basic Auth**: Enabled with strong password
- **Local Access Only**: No external exposure
- **Credential Encryption**: All credentials encrypted at rest

### Data Protection

- **Database Security**: PostgreSQL with authentication
- **Network Isolation**: Docker network isolation
- **Volume Encryption**: Consider encrypting Docker volumes

### Backup Strategy

**Database Backup**:

```bash
# Create backup
docker exec zixly-n8n-postgres pg_dump -U n8n n8n > n8n-backup-$(date +%Y%m%d).sql

# Restore backup
docker exec -i zixly-n8n-postgres psql -U n8n n8n < n8n-backup-20250127.sql
```

**Workflow Backup**:

```bash
# Backup workflow files
cp -r n8n-workflows/ backups/n8n-workflows-$(date +%Y%m%d)/
```

---

## Performance Optimization

### Resource Allocation

**Recommended Resources**:

- **n8n**: 2GB RAM, 1 CPU core
- **PostgreSQL**: 1GB RAM, 1 CPU core
- **Redis**: 512MB RAM, 0.5 CPU core

### Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_execution_entity(workflow_id);
CREATE INDEX idx_workflow_executions_finished_at ON workflow_execution_entity(finished_at);
```

### Workflow Optimization

- **Batch Processing**: Group similar operations
- **Error Handling**: Implement retry logic
- **Resource Limits**: Set appropriate timeouts
- **Monitoring**: Track execution performance

---

## Next Steps

### Phase 2.2: Plane Integration

1. Deploy Plane project management
2. Configure Plane API credentials
3. Test Plane integration workflows
4. Set up project templates

### Phase 2.3: Nextcloud Integration

1. Deploy Nextcloud file management
2. Configure Nextcloud API credentials
3. Test file management workflows
4. Set up folder templates

### Monitoring and Maintenance

1. Set up regular backups
2. Monitor resource usage
3. Update workflows as needed
4. Document new workflows

---

## Troubleshooting

### Microsoft Outlook OAuth2 Authentication

**✅ CURRENT STATUS**: Microsoft Outlook OAuth2 API is configured and active

**Configuration Details**:

- **Client ID**: 7885db51-be6e-4425-b555-52d60ff9c04a
- **OAuth Redirect URL**: http://localhost:5678/rest/oauth2-credential/callback
- **Authentication Method**: OAuth 2.0 (Token-based)
- **Status**: Active and functional

**Migration Completed**:

- ✅ Replaced SMTP authentication with OAuth2
- ✅ Enhanced security with token-based authentication
- ✅ Improved reliability and compliance with Microsoft policies
- ✅ Automatic token refresh capabilities

**Legacy SMTP Reference**: For historical context, see [SMTP Authentication Troubleshooting](troubleshooting/smtp-authentication.md)

### Quick Diagnostic Commands

```bash
# Check n8n logs for OAuth2 authentication errors
docker-compose -f docker-compose.n8n.yml logs n8n | grep -i oauth

# Check n8n logs for Outlook API errors
docker-compose -f docker-compose.n8n.yml logs n8n | grep -i outlook

# Check service status
docker-compose -f docker-compose.n8n.yml ps

# Test Microsoft Graph API connectivity
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" https://graph.microsoft.com/v1.0/me
```

### Troubleshooting Resources

- [SMTP Authentication Issues](troubleshooting/smtp-authentication.md)
- [n8n Workflow Errors](troubleshooting/n8n-workflow-errors.md)
- [Docker Service Issues](troubleshooting/docker-services.md)

---

## Support

### Documentation

- **n8n Documentation**: https://docs.n8n.io/
- **Docker Compose Reference**: https://docs.docker.com/compose/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

### Community

- **n8n Community**: https://community.n8n.io/
- **GitHub Issues**: https://github.com/n8n-io/n8n/issues
- **Discord**: https://discord.gg/n8n

---

**Document Version**: 1.1  
**Last Updated**: 2025-01-27  
**Owner**: Zixly Technical Operations  
**Review Cycle**: Monthly

**Recent Updates**:

- ✅ Migrated from SMTP to Microsoft Outlook OAuth2 API
- ✅ Updated credential configuration and troubleshooting sections
- ✅ Enhanced security with token-based authentication
