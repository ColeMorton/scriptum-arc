# Credential Management Security Guide

**Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Security Team  
**Status**: Critical Security Policy

---

## Overview

This document outlines the security policies and procedures for managing credentials in the Zixly internal operations platform. **All team members must follow these guidelines to prevent credential exposure.**

---

## 🚨 CRITICAL SECURITY RULES

### ❌ NEVER DO THESE

1. **Never commit credentials to source control**
2. **Never hardcode passwords in configuration files**
3. **Never share credentials via email or chat**
4. **Never store credentials in plain text**
5. **Never use production credentials in development**

### ✅ ALWAYS DO THESE

1. **Use environment variables for all secrets**
2. **Use credential templates for setup**
3. **Rotate credentials regularly**
4. **Use strong, unique passwords**
5. **Implement proper access controls**

---

## Credential Management Process

### 1. Environment Setup

**For new team members:**

1. **Copy the template file:**

   ```bash
   cp zixly-credentials.env.template zixly-credentials.env
   ```

2. **Fill in actual values:**
   - Replace all `your_*_here` placeholders with real credentials
   - Use strong, unique passwords
   - Never share the `.env` file

3. **Verify .gitignore:**
   ```bash
   # Ensure these patterns are in .gitignore
   *.env
   *credentials*
   *secrets*
   .env.local
   .env.production
   zixly-credentials.env
   ```

### 2. Docker Compose Security

**All Docker Compose files use environment variables:**

```yaml
# ✅ CORRECT - Uses environment variables
environment:
  - N8N_BASIC_AUTH_PASSWORD=${N8N_BASIC_AUTH_PASSWORD}
  - DB_POSTGRESDB_PASSWORD=${DB_POSTGRESDB_PASSWORD}

# ❌ WRONG - Hardcoded credentials
environment:
  - N8N_BASIC_AUTH_PASSWORD=zixly2025
  - DB_POSTGRESDB_PASSWORD=n8n_password
```

### 3. Credential Rotation Schedule

**Rotate credentials every 90 days:**

- **n8n Basic Auth**: Change admin password
- **Email Passwords**: Update SMTP credentials
- **Database Passwords**: Rotate PostgreSQL passwords
- **API Keys**: Refresh external service keys

---

## Security Checklist

### Before Committing Code

- [ ] No hardcoded passwords in files
- [ ] No `.env` files in repository
- [ ] All credentials use environment variables
- [ ] Template files have placeholder values only
- [ ] `.gitignore` includes credential patterns

### After Credential Exposure

- [ ] **IMMEDIATELY** rotate exposed credentials
- [ ] Remove credentials from git history
- [ ] Update all affected systems
- [ ] Notify security team
- [ ] Review access logs
- [ ] Implement additional monitoring

---

## File Security Patterns

### ✅ Secure Files

**Configuration files with environment variables:**

```yaml
# docker-compose.n8n.yml
environment:
  - N8N_BASIC_AUTH_PASSWORD=${N8N_BASIC_AUTH_PASSWORD}
  - DB_POSTGRESDB_PASSWORD=${DB_POSTGRESDB_PASSWORD}
```

**Template files with placeholders:**

```bash
# zixly-credentials.env.template
N8N_BASIC_AUTH_PASSWORD=your_n8n_password_here
DB_POSTGRESDB_PASSWORD=your_postgres_password_here
```

### ❌ Insecure Files

**Files with hardcoded credentials:**

```yaml
# ❌ NEVER DO THIS
environment:
  - N8N_BASIC_AUTH_PASSWORD=zixly2025
  - DB_POSTGRESDB_PASSWORD=n8n_password
```

**Files with real credentials:**

```bash
# ❌ NEVER COMMIT THIS
N8N_BASIC_AUTH_PASSWORD=actual_password_123
DB_POSTGRESDB_PASSWORD=real_password_456
```

---

## Emergency Procedures

### If Credentials Are Exposed

1. **Immediate Actions (within 1 hour):**
   - Rotate all exposed credentials
   - Remove credentials from git history
   - Update all systems with new credentials
   - Notify security team

2. **Investigation (within 24 hours):**
   - Review git history for other exposures
   - Check access logs for unauthorized access
   - Assess impact and scope
   - Document incident

3. **Prevention (within 48 hours):**
   - Implement credential scanning in CI/CD
   - Review and update security policies
   - Conduct team security training
   - Implement additional monitoring

---

## Tools and Automation

### Credential Scanning

**Add to CI/CD pipeline:**

```yaml
# .github/workflows/security.yml
- name: Scan for secrets
  uses: trufflesecurity/trufflehog@main
  with:
    path: ./
    base: main
    head: HEAD
```

### Environment Validation

**Add to startup scripts:**

```bash
# scripts/validate-env.sh
if [ -z "$N8N_BASIC_AUTH_PASSWORD" ]; then
  echo "ERROR: N8N_BASIC_AUTH_PASSWORD not set"
  exit 1
fi
```

---

## Contact Information

**Security Team:**

- **Primary**: Cole Morton (cole.morton@hotmail.com)
- **Emergency**: Immediate notification required for credential exposure

**Reporting Security Issues:**

- **Email**: security@zixly.com.au (when configured)
- **Response Time**: Within 1 hour for critical issues

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Zixly Security Team  
**Review Cycle**: Monthly
