# Zixly n8n Workflows

This directory contains the n8n workflows for Zixly's internal operations automation. These workflows demonstrate "eating our own dogfood" by using the same self-hostable SME stack tools we recommend to clients.

## Overview

n8n serves as the central automation hub for Zixly's internal operations, connecting all self-hostable SME stack tools and automating service delivery workflows.

## Workflow Structure

```
n8n-workflows/
├── internal/                    # Internal Zixly operations workflows
│   ├── client-onboarding.json   # Client onboarding automation
│   ├── time-tracking-sync.json  # Daily time tracking sync
│   └── financial-reporting.json # Weekly financial reporting
├── external/                    # Client-facing workflows (future)
└── templates/                   # Workflow templates
```

## Core Workflows

### 0. Supabase Outlook Smoke Test

**File**: `internal/supabase-outlook-smoke-test.json`

**Purpose**: Validates Supabase database connectivity and Outlook SMTP email functionality.

**Use Case**: Run this workflow first to verify Supabase credentials and Outlook email credentials are working before executing production workflows.

### 1. Client Onboarding Automation

**File**: `internal/client-onboarding.json`

**Purpose**: Automates the complete client onboarding process when a new service contract is signed.

**Trigger**: Webhook POST to `/client-onboarding`

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

**Actions**:

1. **Create Client Record** - Adds client to Supabase database
2. **Create Plane Project** - Sets up project management workspace
3. **Create Nextcloud Folder** - Creates client file structure
4. **Send Welcome Email** - Sends onboarding confirmation
5. **Track Metrics** - Records onboarding completion

**Output**: Success confirmation with project details

### 2. Time Tracking Sync

**File**: `internal/time-tracking-sync.json`

**Purpose**: Daily synchronization of billable hours from Plane to financial records.

**Trigger**: Cron job (5 PM weekdays)

**Actions**:

1. **Fetch Completed Tasks** - Gets completed tasks from Plane
2. **Calculate Billable Hours** - Estimates hours based on task complexity
3. **Update Metrics** - Records billable hours and project velocity
4. **Send Notification** - Daily sync summary email
5. **Update Sync Status** - Tracks sync health

**Metrics Tracked**:

- Billable hours per client
- Project velocity (tasks completed)
- Time tracking accuracy
- Consultant productivity

### 3. Financial Reporting

**File**: `internal/financial-reporting.json`

**Purpose**: Weekly financial performance analysis and automated reporting.

**Trigger**: Cron job (Monday 9 AM)

**Actions**:

1. **Aggregate Financial Data** - Collects weekly revenue/expenses
2. **Calculate KPIs** - Computes profit margins, revenue per hour
3. **Generate Client Breakdown** - Per-client performance analysis
4. **Send Report** - Comprehensive weekly financial report
5. **Sync to Xero** - Updates accounting system

**Metrics Calculated**:

- Total revenue and expenses
- Profit margins by client and service tier
- Revenue per billable hour
- Client satisfaction scores
- Operational efficiency metrics

## Workflow Features

### Error Handling

All workflows include comprehensive error handling:

- **Retry Logic**: Automatic retry for transient failures
- **Error Notifications**: Email alerts for critical failures
- **Graceful Degradation**: Partial success handling
- **Logging**: Detailed execution logs

### Data Validation

- **Input Validation**: Checks required fields and data types
- **Client Mapping**: Validates client ID mappings
- **Data Integrity**: Ensures data consistency across systems

### Monitoring

- **Execution Tracking**: Records workflow execution history
- **Performance Metrics**: Tracks execution times and success rates
- **Health Checks**: Monitors system connectivity
- **Alerting**: Notifications for failures and anomalies

## Integration Points

### Supabase Database

**Tables Used**:

- `client_kpis` - Service clients
- `custom_metric` - Internal KPIs and metrics
- `workflow_metadata` - Workflow execution tracking
- `data_sync_status` - System health monitoring

### External APIs

**Plane (Project Management)**:

- Project creation and management
- Task completion tracking
- Time estimation and logging

**Nextcloud (File Management)**:

- Folder structure creation
- Document organization
- File access management

**Email (Notifications)**:

- Client communication
- Internal notifications
- Report delivery

**Xero (Accounting)**:

- Financial data synchronization
- Revenue and expense tracking
- Profit margin analysis

## Setup Instructions

### 1. Deploy n8n Stack

```bash
# Start n8n services
./scripts/start-n8n.sh

# Or manually
docker-compose -f docker-compose.n8n.yml up -d
```

### 2. Access n8n Interface

- **URL**: http://localhost:5678
- **Username**: admin
- **Password**: zixly2025

### 3. Configure Credentials

Import credentials from `n8n-credentials/credentials-template.json`:

- Zixly Supabase API
- Zixly Plane API
- Zixly Nextcloud API
- Zixly SMTP
- Zixly Xero API

### 4. Import Workflows

1. Go to Workflows in n8n interface
2. Click "Import from File"
3. Select workflow JSON files from `internal/` directory
4. Configure credential references
5. Activate workflows

### 5. Test Workflows

**Client Onboarding Test**:

```bash
curl -X POST http://localhost:5678/webhook/client-onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "test-client",
    "clientName": "Test Client",
    "industry": "Testing",
    "serviceTier": "Starter",
    "contactEmail": "test@example.com",
    "contactName": "Test User"
  }'
```

## Workflow Customization

### Adding New Workflows

1. **Create JSON File**: Add new workflow to `internal/` directory
2. **Define Triggers**: Set up webhooks, cron jobs, or manual triggers
3. **Configure Actions**: Define API calls, data processing, notifications
4. **Test Workflow**: Validate in n8n interface
5. **Document Usage**: Update this README

### Modifying Existing Workflows

1. **Export Current**: Download existing workflow from n8n
2. **Edit JSON**: Modify workflow structure
3. **Import Updated**: Upload modified workflow
4. **Test Changes**: Validate modifications
5. **Update Documentation**: Reflect changes in README

### Workflow Templates

Use templates in `templates/` directory for common patterns:

- **API Integration**: Standard API call patterns
- **Data Processing**: Common data transformation logic
- **Error Handling**: Standard error handling patterns
- **Notifications**: Email and alert templates

## Monitoring and Maintenance

### Execution Monitoring

**View Execution History**:

1. Go to Executions in n8n interface
2. Filter by workflow or date range
3. Review execution details and logs
4. Identify failed executions

**Performance Metrics**:

- Execution success rate
- Average execution time
- Error frequency
- Resource usage

### Maintenance Tasks

**Daily**:

- Check execution logs for errors
- Verify sync status for all systems
- Monitor resource usage

**Weekly**:

- Review workflow performance
- Update credentials if needed
- Backup workflow configurations

**Monthly**:

- Analyze execution patterns
- Optimize slow workflows
- Update documentation

### Troubleshooting

**Common Issues**:

1. **Workflow Execution Failures**
   - Check credential validity
   - Verify API endpoint accessibility
   - Review execution logs
   - Test individual nodes

2. **Data Sync Issues**
   - Verify database connectivity
   - Check API rate limits
   - Validate data formats
   - Review error messages

3. **Performance Issues**
   - Monitor resource usage
   - Optimize database queries
   - Implement caching
   - Scale resources if needed

## Security Considerations

### Access Control

- **Authentication**: Basic auth for n8n interface
- **Authorization**: Role-based access control
- **Network Security**: Local network access only
- **Credential Security**: Encrypted credential storage

### Data Protection

- **Data Encryption**: All data encrypted in transit and at rest
- **Access Logging**: Comprehensive access logs
- **Backup Security**: Encrypted backup storage
- **Audit Trail**: Complete execution audit trail

## Performance Optimization

### Resource Management

**Recommended Resources**:

- **n8n**: 2GB RAM, 1 CPU core
- **PostgreSQL**: 1GB RAM, 1 CPU core
- **Redis**: 512MB RAM, 0.5 CPU core

### Workflow Optimization

- **Batch Processing**: Group similar operations
- **Parallel Execution**: Run independent operations in parallel
- **Caching**: Implement result caching where appropriate
- **Rate Limiting**: Respect API rate limits

### Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_execution_entity(workflow_id);
CREATE INDEX idx_workflow_executions_finished_at ON workflow_execution_entity(finished_at);
```

## Documentation

### Related Documentation

- **Setup Guide**: `docs/tools/n8n-setup.md`
- **Internal Operations**: `docs/operations/internal-operations-guide.md`
- **Dogfooding Strategy**: `docs/architecture/dogfooding-strategy.md`

### API Documentation

- **n8n API**: https://docs.n8n.io/api/
- **Supabase API**: https://supabase.com/docs/guides/api
- **Plane API**: https://docs.plane.so/api-reference
- **Nextcloud API**: https://docs.nextcloud.com/server/latest/developer_manual/client_apis/

## Support

### Getting Help

1. **Documentation**: Check this README and related docs
2. **Logs**: Review execution logs for error details
3. **Community**: n8n Community Forum
4. **GitHub**: n8n GitHub Issues

### Contributing

1. **Fork Repository**: Create your own fork
2. **Create Branch**: Make changes in feature branch
3. **Test Changes**: Validate all modifications
4. **Submit PR**: Create pull request with description
5. **Review Process**: Address feedback and merge

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Zixly Technical Operations  
**Review Cycle**: Monthly
