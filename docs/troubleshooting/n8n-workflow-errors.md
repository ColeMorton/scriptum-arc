# n8n Workflow Errors Troubleshooting

**Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Technical Operations  
**Status**: Active Guide

---

## Overview

This guide helps resolve common n8n workflow execution errors when setting up and running Zixly's internal automation workflows. It covers credential validation, API connectivity, and workflow node failures.

---

## Common Workflow Execution Errors

### Error: "Credential validation failed"

**Cause**: Invalid or expired credentials in n8n credential store.

**Solutions**:

1. **Check credential configuration**:
   - Go to Settings → Credentials in n8n
   - Verify all required credentials are present
   - Test each credential individually

2. **Update expired credentials**:
   - Regenerate API keys if expired
   - Update passwords (especially app passwords)
   - Verify OAuth tokens are still valid

3. **Verify credential permissions**:
   - Ensure API keys have required permissions
   - Check user account access levels
   - Verify service account status

### Error: "Node execution failed"

**Cause**: Individual workflow node encountered an error during execution.

**Solutions**:

1. **Check node configuration**:
   - Verify all required parameters are set
   - Check data formats and types
   - Validate API endpoint URLs

2. **Review input data**:
   - Ensure input data matches expected format
   - Check for missing required fields
   - Validate data types and values

3. **Check external service status**:
   - Verify API endpoints are accessible
   - Check service status pages
   - Test connectivity manually

### Error: "Workflow execution timeout"

**Cause**: Workflow took too long to complete and was terminated.

**Solutions**:

1. **Optimize workflow performance**:
   - Reduce data processing in single nodes
   - Use batch processing for large datasets
   - Implement parallel execution where possible

2. **Increase timeout settings**:
   - Configure longer timeout values for slow operations
   - Use asynchronous processing for long-running tasks
   - Break complex workflows into smaller chunks

3. **Check resource usage**:
   - Monitor CPU and memory usage
   - Ensure adequate Docker resources
   - Check for resource contention

---

## Credential Validation Failures

### Supabase Credential Issues

**Common Problems**:

- Invalid project URL
- Expired service role key
- Incorrect database permissions

**Troubleshooting Steps**:

1. **Verify Supabase project settings**:
   - Check project URL format
   - Verify service role key is current
   - Confirm database access permissions

2. **Test Supabase connection**:

   ```bash
   # Test database connection
   curl -H "apikey: YOUR_SERVICE_KEY" \
        -H "Authorization: Bearer YOUR_SERVICE_KEY" \
        https://YOUR_PROJECT.supabase.co/rest/v1/
   ```

3. **Check RLS policies**:
   - Verify Row Level Security is configured
   - Check tenant isolation policies
   - Test data access permissions

### SMTP Credential Issues

**Common Problems**:

- Invalid email credentials
- SMTP server connectivity
- Authentication method errors

**Troubleshooting Steps**:

1. **Verify SMTP settings**:
   - Check host, port, and security settings
   - Verify username and password
   - Test SMTP connection manually

2. **Check authentication method**:
   - Use app passwords for Microsoft accounts
   - Verify 2FA is enabled where required
   - Check OAuth configuration if applicable

3. **Test email sending**:
   - Send test email from n8n interface
   - Check email delivery logs
   - Verify sender authentication

**Guide**: See [SMTP Authentication Troubleshooting](smtp-authentication.md) for detailed setup.

### API Credential Issues

**Common Problems**:

- Expired API keys
- Insufficient permissions
- Rate limiting

**Troubleshooting Steps**:

1. **Verify API key validity**:
   - Check key expiration dates
   - Regenerate keys if expired
   - Verify key format and encoding

2. **Check API permissions**:
   - Ensure required scopes are granted
   - Verify user account permissions
   - Check service account status

3. **Monitor API usage**:
   - Check rate limiting status
   - Monitor API quota usage
   - Implement backoff strategies

---

## API Connectivity Issues

### External Service Connectivity

**Common Problems**:

- Network connectivity issues
- Service unavailability
- SSL/TLS certificate problems

**Troubleshooting Steps**:

1. **Test network connectivity**:

   ```bash
   # Test basic connectivity
   ping api.example.com

   # Test HTTPS connectivity
   curl -I https://api.example.com/health

   # Test from Docker container
   docker exec zixly-n8n curl -I https://api.example.com/health
   ```

2. **Check SSL/TLS configuration**:
   - Verify certificate validity
   - Check TLS version compatibility
   - Test with different TLS versions

3. **Verify firewall settings**:
   - Check outbound port access
   - Verify proxy configuration
   - Test from different networks

### Webhook Connectivity

**Common Problems**:

- Webhook URL not accessible
- SSL certificate issues
- Authentication failures

**Troubleshooting Steps**:

1. **Test webhook URL**:

   ```bash
   # Test webhook endpoint
   curl -X POST http://localhost:5678/webhook/test \
        -H "Content-Type: application/json" \
        -d '{"test": "data"}'
   ```

2. **Check webhook configuration**:
   - Verify webhook path is correct
   - Check HTTP method configuration
   - Validate request format

3. **Monitor webhook logs**:
   - Check n8n webhook logs
   - Monitor incoming requests
   - Verify data processing

---

## Workflow Node Failures

### HTTP Request Node Failures

**Common Problems**:

- Invalid URLs or endpoints
- Authentication header issues
- Request format errors

**Solutions**:

1. **Validate request configuration**:
   - Check URL format and accessibility
   - Verify authentication headers
   - Validate request body format

2. **Test API endpoints manually**:

   ```bash
   # Test API endpoint
   curl -X GET \
        -H "Authorization: Bearer YOUR_TOKEN" \
        https://api.example.com/endpoint
   ```

3. **Check response handling**:
   - Verify response format expectations
   - Handle error responses appropriately
   - Implement retry logic for failures

### Database Node Failures

**Common Problems**:

- SQL syntax errors
- Data type mismatches
- Connection issues

**Solutions**:

1. **Validate SQL queries**:
   - Test queries in database client
   - Check for syntax errors
   - Verify data type compatibility

2. **Check data mapping**:
   - Ensure field mappings are correct
   - Validate data types and formats
   - Handle null values appropriately

3. **Monitor database performance**:
   - Check query execution times
   - Monitor database resource usage
   - Optimize slow queries

### Email Node Failures

**Common Problems**:

- SMTP authentication issues
- Invalid email addresses
- Template rendering errors

**Solutions**:

1. **Verify email configuration**:
   - Check SMTP settings
   - Validate email addresses
   - Test email templates

2. **Check email content**:
   - Validate template syntax
   - Check for missing variables
   - Test email rendering

3. **Monitor email delivery**:
   - Check email logs
   - Verify delivery status
   - Handle bounce notifications

---

## Debugging Workflow Execution

### Enable Debug Logging

1. **Configure n8n logging**:

   ```yaml
   # docker-compose.yml
   environment:
     - N8N_LOG_LEVEL=debug
     - N8N_DIAGNOSTICS_ENABLED=true
   ```

2. **Monitor execution logs**:

   ```bash
   # Follow n8n logs
   docker-compose -f docker-compose.n8n.yml logs -f n8n

   # Filter for specific workflow
   docker-compose -f docker-compose.n8n.yml logs n8n | grep "workflow-name"
   ```

### Workflow Execution Analysis

1. **Check execution history**:
   - Go to Executions in n8n interface
   - Review failed executions
   - Analyze execution logs

2. **Test individual nodes**:
   - Execute nodes manually
   - Check input/output data
   - Validate node configuration

3. **Monitor resource usage**:

   ```bash
   # Check container resource usage
   docker stats zixly-n8n

   # Monitor database performance
   docker exec zixly-n8n-postgres psql -U n8n -d n8n -c "SELECT * FROM pg_stat_activity;"
   ```

---

## Prevention and Best Practices

### Workflow Design

1. **Implement error handling**:
   - Use error handling nodes
   - Implement retry logic
   - Add fallback mechanisms

2. **Validate input data**:
   - Check required fields
   - Validate data types
   - Handle edge cases

3. **Monitor workflow health**:
   - Set up execution monitoring
   - Track success/failure rates
   - Alert on critical failures

### Credential Management

1. **Regular credential rotation**:
   - Update API keys regularly
   - Rotate passwords periodically
   - Monitor credential expiration

2. **Secure credential storage**:
   - Use n8n credential system
   - Avoid hardcoded credentials
   - Implement access controls

3. **Test credential validity**:
   - Regular credential testing
   - Monitor authentication failures
   - Update expired credentials promptly

---

## Getting Help

### Self-Service Resources

1. **Check this troubleshooting guide**
2. **Review n8n execution logs**
3. **Test individual workflow nodes**
4. **Verify external service status**

### When to Contact Support

Contact support if:

- **Workflow failures persist** after troubleshooting
- **Multiple workflows** are affected
- **Data corruption** or loss occurs
- **Security issues** are identified

### Support Information

- **Primary Contact**: Your Name (your_email@domain.com)
- **Documentation**: This troubleshooting guide
- **Logs Location**: n8n execution history and Docker logs

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Zixly Technical Operations  
**Review Cycle**: Monthly
