# Email Authentication Troubleshooting

**Version**: 1.1  
**Last Updated**: 2025-01-27  
**Owner**: Technical Operations  
**Status**: Active Guide

---

## Overview

This guide covers email authentication for pipeline services workflows. **CURRENT STATUS**: Zixly has migrated from SMTP to Microsoft Outlook OAuth2 API for enhanced security and reliability.

**✅ MIGRATION COMPLETED**: Microsoft Outlook OAuth2 API is now active and configured.

---

## Current Microsoft Outlook OAuth2 Configuration

**Active Configuration**:

- **Type**: Microsoft Outlook OAuth2 API
- **Client ID**: 7885db51-be6e-4425-b555-52d60ff9c04a
- **OAuth Redirect URL**: http://localhost:5678/rest/oauth2-credential/callback
- **Authorization URL**: https://login.microsoftonline.com/common/oauth2/v2.0/authorize
- **Access Token URL**: https://login.microsoftonline.com/common/oauth2/v2.0/token
- **Status**: ✅ Active and functional

**Benefits of OAuth2 Migration**:

- Enhanced security with token-based authentication
- Automatic token refresh capabilities
- Compliance with Microsoft security policies
- Improved reliability and deliverability
- No need for app passwords or SMTP configuration

---

## Legacy SMTP Error Messages (Historical Reference)

### Error: "535 5.7.139 Authentication unsuccessful, basic authentication is disabled"

**Cause**: Microsoft has disabled basic authentication for security reasons.

**Solution**: ✅ RESOLVED - Migrated to Microsoft Outlook OAuth2 API (no longer applicable).

### Error: "SSL routines:tls_validate_record_header:wrong version number"

**Cause**: Incorrect SSL/TLS configuration - trying to use SSL on port 587.

**Solution**: ✅ RESOLVED - Migrated to Microsoft Outlook OAuth2 API (no longer applicable).

### Error: "Invalid login" or "Authentication failed"

**Cause**: Incorrect credentials or authentication method.

**Solution**: ✅ RESOLVED - Migrated to Microsoft Outlook OAuth2 API (no longer applicable).

---

## Microsoft Outlook OAuth2 Setup (Current Active Method)

### ✅ CURRENT STATUS: OAuth2 Configuration Active

**Configuration Details**:

- **Type**: Microsoft Outlook OAuth2 API
- **Client ID**: 7885db51-be6e-4425-b555-52d60ff9c04a
- **OAuth Redirect URL**: http://localhost:5678/rest/oauth2-credential/callback
- **Authorization URL**: https://login.microsoftonline.com/common/oauth2/v2.0/authorize
- **Access Token URL**: https://login.microsoftonline.com/common/oauth2/v2.0/token
- **Status**: ✅ Active and functional

### Benefits of OAuth2 vs. App Passwords

**OAuth2 Advantages**:

- ✅ Token-based authentication (more secure)
- ✅ Automatic token refresh
- ✅ No need for app passwords
- ✅ Better compliance with Microsoft security policies
- ✅ Enhanced deliverability

**Legacy App Password Method** (No longer used):

- ❌ Static passwords (less secure)
- ❌ Manual password rotation required
- ❌ Deprecated by Microsoft for new applications

---

## Testing Microsoft Outlook OAuth2 Configuration

### Method 1: pipeline services Credential Test

1. Go to pipeline services → Settings → Credentials
2. Edit "Microsoft Outlook OAuth2 API" credential
3. Click "Test" button
4. Verify "Connection successful" message

### Method 2: Workflow Test

1. Create a simple pipeline services workflow
2. Add "Microsoft Outlook" node
3. Configure with "Microsoft Outlook OAuth2 API" credential
4. Send test email to yourself
5. Verify email delivery

### Method 3: OAuth2 Token Validation

```bash
# Check pipeline services logs for OAuth2 authentication
docker-compose -f docker-compose.pipeline services.yml logs pipeline services | grep -i oauth

# Check for successful token refresh
docker-compose -f docker-compose.pipeline services.yml logs pipeline services | grep -i "token refresh"
```

---

## Alternative Email Providers

### Gmail (Recommended Alternative)

**Advantages**: Reliable, well-documented, free

**Setup Steps**:

1. Enable 2FA in Google Account
2. Generate app password
3. Configure pipeline services with Gmail SMTP

**Configuration**:

- **Host**: `smtp.gmail.com`
- **Port**: `587`
- **Security**: `STARTTLS`
- **Username**: Your Gmail address
- **Password**: Gmail app password

**Documentation**: [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

### SendGrid (Professional Option)

**Advantages**: High deliverability, analytics, free tier

**Setup Steps**:

1. Create SendGrid account
2. Generate API key
3. Configure pipeline services with SendGrid SMTP

**Configuration**:

- **Host**: `smtp.sendgrid.net`
- **Port**: `587`
- **Security**: `STARTTLS`
- **Username**: `apikey`
- **Password**: Your SendGrid API key

**Documentation**: [SendGrid SMTP Setup](https://docs.sendgrid.com/for-developers/sending-email/smtp-integration)

### Email Provider Comparison

| Provider        | Free Tier          | Setup Complexity | Deliverability | Documentation |
| --------------- | ------------------ | ---------------- | -------------- | ------------- |
| Outlook/Hotmail | Yes                | Medium           | Good           | Limited       |
| Gmail           | Yes                | Easy             | Excellent      | Excellent     |
| SendGrid        | 100 emails/day     | Easy             | Excellent      | Excellent     |
| Mailgun         | 5,000 emails/month | Medium           | Excellent      | Good          |

---

## Troubleshooting Checklist

### Before Contacting Support

1. **Verify 2FA is Enabled**:
   - Check Microsoft account security settings
   - Ensure two-factor authentication is active

2. **Check App Password**:
   - Verify app password was generated correctly
   - Ensure app password is used (not regular password)
   - Check password format (xxxx-xxxx-xxxx-xxxx)

3. **Verify SMTP Settings**:
   - Host: `smtp-mail.outlook.com`
   - Port: `587`
   - Security: `STARTTLS` (not SSL)
   - Username: Full email address

4. **Test Network Connectivity**:
   - Check if port 587 is accessible
   - Verify firewall settings
   - Test with telnet command

5. **Check pipeline services Logs**:
   ```bash
   docker-compose -f docker-compose.pipeline services.yml logs pipeline services | grep -i smtp
   ```

### Common Issues and Solutions

**Issue**: App password not working

- **Solution**: Regenerate app password, ensure 2FA is enabled

**Issue**: Connection timeout

- **Solution**: Check firewall, try alternative port 25

**Issue**: SSL/TLS errors

- **Solution**: Use STARTTLS on port 587, not SSL on port 465

**Issue**: Authentication still failing

- **Solution**: Try Gmail or SendGrid as alternative

---

## Advanced Configuration

### Custom SMTP Settings

For advanced users who need custom SMTP configuration:

```yaml
# docker-compose.yml environment variables
SMTP_HOST: smtp-mail.outlook.com
SMTP_PORT: 587
SMTP_SECURE: false
SMTP_USER: your_email@domain.com
SMTP_PASSWORD: your_app_password_here
```

### pipeline services Environment Variables

Add to pipeline services container environment:

```yaml
- SMTP_HOST=smtp-mail.outlook.com
- SMTP_PORT=587
- SMTP_SECURE=false
- SMTP_USER=your_email@domain.com
- SMTP_PASSWORD=your_app_password
```

---

## Security Best Practices

### Password Management

- **Never use regular passwords** for SMTP authentication
- **Always use app passwords** for Microsoft accounts
- **Rotate app passwords** regularly (every 90 days)
- **Store credentials securely** in pipeline services credential system

### Network Security

- **Use STARTTLS** for encrypted email transmission
- **Avoid unencrypted SMTP** (port 25 without encryption)
- **Monitor SMTP logs** for unauthorized access attempts

### Account Security

- **Enable 2FA** on all email accounts
- **Use strong passwords** for main accounts
- **Monitor account activity** for suspicious access

---

## Getting Help

### Self-Service Resources

1. **Check this guide** for common solutions
2. **Review pipeline services logs** for specific error messages
3. **Test with alternative email providers**
4. **Verify network connectivity**

### When to Contact Support

Contact support if:

- App password setup fails after following guide
- Multiple email providers fail
- Network connectivity issues persist
- pipeline services workflow execution errors occur

### Support Information

- **Primary Contact**: Your Name (your_email@domain.com)
- **Documentation**: This troubleshooting guide
- **Logs Location**: `docker-compose logs pipeline services`

---

**Document Version**: 1.1  
**Last Updated**: 2025-01-27  
**Owner**: Zixly Technical Operations  
**Review Cycle**: Monthly

**Recent Updates**:

- ✅ Migrated from SMTP to Microsoft Outlook OAuth2 API
- ✅ Updated all troubleshooting sections to reflect OAuth2 configuration
- ✅ Added OAuth2 testing and validation procedures
- ✅ Marked legacy SMTP methods as resolved/historical reference
