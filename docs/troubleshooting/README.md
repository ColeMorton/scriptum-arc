# Zixly Troubleshooting Guide

> **⚠️ PARTIALLY OUTDATED**: Some troubleshooting guides reference the old n8n architecture. Docker service troubleshooting and general infrastructure issues remain relevant, but n8n-specific workflow troubleshooting is obsolete.
>
> **Status**: Mixed (Docker guides current, n8n guides outdated)  
> **Last Updated**: 2025-01-27

**Version**: 1.0  
**Owner**: Technical Operations

---

## Overview

This directory contains troubleshooting guides for common issues encountered when setting up and operating the Zixly platform. Docker and infrastructure guides are current, but workflow automation troubleshooting needs updating for the new Docker pipeline architecture.

---

## Available Troubleshooting Guides

### [SMTP Authentication Issues](smtp-authentication.md)

**Common Issues**: Email authentication failures, app password setup, SSL/TLS errors

**Quick Solutions**:

- Microsoft basic authentication deprecated → Use app passwords
- SSL version errors → Use STARTTLS on port 587
- Connection failures → Check firewall and network settings

### ~~n8n Workflow Errors~~ (Deprecated)

**⚠️ OBSOLETE**: This guide was for the old n8n architecture. For current pipeline troubleshooting, see:

- [Pipeline Services Documentation](../pipelines/)
- [System Architecture - Pipeline Architecture](../architecture/system-architecture.md#pipeline-architecture)
- Check webhook receiver and worker logs for current pipeline issues

### [Docker Service Issues](docker-services.md)

**Common Issues**: Container startup failures, port conflicts, volume mounting

**Quick Solutions**:

- Services won't start → Check port availability
- Data not persisting → Verify volume mounting
- Performance issues → Monitor resource usage

---

## Quick Diagnostic Commands

### Check Service Status

```bash
# Check pipeline services
docker-compose -f docker-compose.pipeline.yml ps

# Check specific service logs
docker-compose -f docker-compose.pipeline.yml logs webhook-receiver
docker-compose -f docker-compose.pipeline.yml logs pipeline-worker
docker-compose -f docker-compose.pipeline.yml logs redis
docker-compose -f docker-compose.pipeline.yml logs localstack
```

### Test Network Connectivity

```bash
# Test webhook receiver
curl http://localhost:3000/health

# Test SMTP connection
telnet smtp-mail.outlook.com 587

# Test database connection
docker exec zixly-pipeline services-postgres pg_isready -U pipeline services
```

### Check Resource Usage

```bash
# Check Docker resource usage
docker stats

# Check disk space
df -h

# Check memory usage
free -h
```

---

## Common Error Patterns

### Authentication Errors

- **Pattern**: "Authentication unsuccessful" or "Invalid credentials"
- **Common Cause**: Expired tokens, incorrect passwords, missing app passwords
- **Guide**: [SMTP Authentication](smtp-authentication.md)

### Connection Errors

- **Pattern**: "Connection refused" or "Connection timeout"
- **Common Cause**: Service not running, port conflicts, firewall blocking
- **Guide**: [Docker Service Issues](docker-services.md)

### Workflow Errors

- **Pattern**: "Node execution failed" or "Workflow stopped"
- **Common Cause**: Invalid data, API endpoint issues, credential problems
- **Guide**: Check webhook receiver and pipeline worker logs for errors

---

## Troubleshooting Process

### Step 1: Identify the Problem

1. **Read the error message** carefully
2. **Check the logs** for additional context
3. **Identify which component** is failing (webhook receiver, pipeline worker, database, etc.)

### Step 2: Check Common Solutions

1. **Review the relevant troubleshooting guide**
2. **Try the quick diagnostic commands**
3. **Check the common error patterns** above

### Step 3: Apply Solutions

1. **Follow the step-by-step guide** for your specific issue
2. **Test the solution** to verify it works
3. **Document any new solutions** for future reference

### Step 4: Verify Resolution

1. **Test the functionality** that was failing
2. **Monitor logs** for any remaining issues
3. **Update documentation** if needed

---

## Prevention Tips

### Regular Maintenance

- **Monitor service health** daily
- **Check logs** for warnings or errors
- **Update credentials** before they expire
- **Backup configurations** regularly

### Proactive Monitoring

- **Set up health checks** for all services
- **Monitor resource usage** to prevent issues
- **Track workflow execution** success rates
- **Review error patterns** to identify trends

### Documentation Updates

- **Document new issues** and solutions
- **Update guides** when procedures change
- **Share knowledge** with team members
- **Maintain troubleshooting history**

---

## Getting Help

### Self-Service First

1. **Check this troubleshooting guide**
2. **Review the specific guide** for your issue
3. **Try the diagnostic commands**
4. **Search for similar issues** in logs

### When to Escalate

Contact support if:

- **Issue persists** after following guides
- **Multiple components** are failing
- **Data loss** or corruption occurs
- **Security concerns** are identified

### Support Information

- **Primary Contact**: Your Name (your_email@domain.com)
- **Response Time**: Within 24 hours for critical issues
- **Documentation**: This troubleshooting guide
- **Logs**: Available in Docker containers

---

## Contributing

### Adding New Guides

1. **Identify common issues** not covered
2. **Document step-by-step solutions**
3. **Include diagnostic commands**
4. **Test solutions** thoroughly
5. **Update this README** with new guide

### Improving Existing Guides

1. **Identify gaps** in current documentation
2. **Add missing solutions**
3. **Improve clarity** and organization
4. **Update outdated information**
5. **Test updated procedures**

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Zixly Technical Operations  
**Review Cycle**: Monthly
