# Xero Integration Guide

**Version**: 1.0  
**Last Updated**: 2025-10-25  
**Integration Type**: Accounting  
**Authentication**: OAuth 2.0

---

## Overview

Xero is Australia's most popular cloud accounting software. Integrating Xero with your other business systems eliminates duplicate data entry, speeds up invoicing, and provides real-time financial visibility.

---

## What Xero Integration Enables

### Automatic Invoice Creation

**Instead of**: Manually creating invoices in Xero from timesheets, sales, or project data  
**With automation**: Invoices generate automatically when work is done or deals are won

**Common triggers**:

- Time logged and approved → Invoice created
- Deal won in CRM → Invoice sent to customer
- Project milestone reached → Progress invoice generated
- Subscription renewal date → Recurring invoice created

### Payment Tracking and Follow-up

**Instead of**: Checking Xero daily for payments and manually sending reminders  
**With automation**: Automatic payment tracking and reminder sequences

**What happens**:

- Invoice paid in Xero → Thank you email sent + CRM updated
- Invoice overdue 7 days → First reminder sent
- Invoice overdue 14 days → Second reminder sent
- Invoice overdue 30 days → Final notice + alert to management

### Customer Data Synchronization

**Instead of**: Entering customer details in CRM, then again in Xero  
**With automation**: Customer details synced automatically between systems

**How it works**:

- New customer in CRM → Contact created in Xero
- Customer details updated anywhere → All systems updated
- Single source of truth (no "which system is correct?")

### Expense and Bill Management

**Instead of**: Manually entering supplier invoices and allocating to jobs/projects  
**With automation**: Supplier invoices automatically processed and allocated

**Workflows**:

- Supplier invoice received (email/scan) → Bill created in Xero
- Bill approved → Payment scheduled
- Expense allocated to correct job/project automatically

---

## Common Workflows by Industry

### Professional Services (Law, Accounting, Consulting)

**Timesheet to Invoice**:

1. Time logged in practice management/project tool
2. Weekly timesheet compiled automatically
3. Timesheet approved by manager
4. Invoice created in Xero with line items from timesheet
5. Invoice sent to client
6. Payment reminders automatic
7. Payment received → Thank you email + CRM updated

**Trust Accounting**:

1. Trust receipt received → Trust bank entry in Xero
2. Trust payment made → Trust bank entry + client ledger update
3. Reconciliation alerts if discrepancies
4. Monthly trust reports generated automatically

### Construction & Trades

**Quote to Invoice with Job Costing**:

1. Quote accepted in CRM
2. Job created in Xero with budget
3. Costs incurred → Allocated to job automatically
   - Materials purchased → Bill in Xero → Job allocation
   - Subcontractor invoice → Bill in Xero → Job allocation
   - Staff time → Allocated to job
4. Progress billing: Milestone reached → Invoice generated
5. Job complete → Final invoice + Profit/loss report

**Variation Management**:

1. Variation requested → Quote created
2. Variation approved → Invoice created for additional amount
3. Variation costs tracked separately for reporting

### E-commerce & Retail

**Order to Accounting**:

1. Order placed in Shopify
2. Invoice created in Xero automatically
3. Payment received → Recorded in Xero
4. Daily sales summary compiled
5. End of day → Bank reconciliation prepared

**Inventory and COGS**:

1. Product sold → Inventory decreased + COGS recorded
2. Stock received → Inventory increased + Bill created
3. Monthly inventory valuation automatic

### Manufacturing

**Production Costing**:

1. Production order created
2. Raw materials allocated → COGS tracked
3. Labor hours allocated → COGS tracked
4. Finished goods → Inventory asset recorded
5. Product sold → COGS to expense + Revenue recorded

---

## Setup Process

### Prerequisites

**What you need**:

- Active Xero account (any plan: Starter, Standard, Premium)
- Administrator access to Xero
- Clear understanding of what you want to automate

**Xero plan considerations**:

- **Starter**: Basic features, limited to 20 invoices/quotes per month (usually too limited)
- **Standard**: Most common, unlimited invoices, multi-currency
- **Premium**: Advanced features like projects, expenses, multi-currency

**Recommendation**: Standard plan is sufficient for most SMEs

### OAuth Connection Setup

**How it works** (takes 2-3 minutes):

1. You click "Connect to Xero" in our onboarding
2. Redirected to Xero login page (you login with your Xero credentials)
3. Xero shows what permissions we're requesting
4. You click "Allow access"
5. Redirected back, connection established

**What we can access** (you control this):

- Read: Contacts, Invoices, Bills, Bank Transactions, Reports
- Write: Create/Update Contacts, Invoices, Bills, Payments
- We cannot: Delete anything, access your bank login, see Xero password

**Revoking access**: You can disconnect us anytime in Xero settings

### Permission Configuration

**Recommended permissions**:

- ✅ Read contacts, invoices, bills, payments (required for sync)
- ✅ Write contacts, invoices, bills (required to create/update)
- ✅ Read bank transactions (for payment reconciliation)
- ✅ Read reports (for dashboard metrics)
- ❌ No bank feed access (not needed, we don't touch bank connections)

### Testing

**Before going live with real data**:

1. We create test invoices in Xero (marked as "TEST")
2. You review and confirm they're correct
3. We test payment received workflow
4. We test update workflows
5. You approve, then we go live with real data

---

## Data Mapping

### Contact/Customer Mapping

**CRM → Xero**:

- CRM Contact Name → Xero Contact Name
- CRM Email → Xero Email Address
- CRM Phone → Xero Phone Number
- CRM Company → Xero Contact Name (if business)
- CRM Address → Xero Postal Address

**What's synchronized**:

- Contact details (name, email, phone, address)
- Notes/description
- Custom fields (if configured)

**What's not synchronized** (stays separate):

- CRM deals/opportunities (business logic, not accounting)
- CRM email history (communication, not financial)
- Xero financial history (stays in Xero)

### Invoice Mapping

**From Timesheets**:

- Time entry description → Invoice line item description
- Time entry hours × rate → Line item amount
- Time entry date → Invoice line item date
- Timesheet total → Invoice total

**From CRM Deal**:

- Deal name → Invoice reference
- Deal amount → Invoice total
- Deal products → Invoice line items
- Deal custom fields → Invoice custom fields

**From Project Milestones**:

- Milestone name → Invoice description
- Milestone % complete × project value → Invoice amount
- Milestone date → Invoice date

---

## Workflow Examples with ROI

### Example 1: Law Firm Billing Automation

**Before automation**:

- Timesheets collected from lawyers (email, paper, various systems)
- Admin compiles timesheets manually (8 hours/week)
- Invoices created in Xero manually (4 hours/week)
- Invoice errors from transcription (15-20% of invoices need correction)
- **Total time: 12 hours/week = $62,400/year**

**After automation**:

- Time logged in practice management software
- Timesheets compiled automatically
- Invoices created in Xero automatically
- Review and approve (2 hours/week)
- **Total time: 2 hours/week = $10,400/year**
- **Time saved: 10 hours/week = $52,000/year**
- **ROI: 4:1 on $12,000 automation investment**

### Example 2: Construction Company Job Costing

**Before automation**:

- Supplier invoices entered manually (3 hours/week)
- Manual allocation to jobs (2 hours/week)
- Job costing reports compiled end of month (4 hours/month)
- No real-time visibility into job profitability
- **Total time: 6 hours/week = $23,400/year**

**After automation**:

- Supplier invoices auto-created in Xero
- Auto-allocation to jobs based on rules
- Real-time job costing dashboard
- Review and exceptions (1 hour/week)
- **Total time: 1 hour/week = $3,900/year**
- **Time saved: 5 hours/week = $19,500/year**
- **Plus: Catch unprofitable jobs mid-project (value: $30K/year)**
- **ROI: 4:1 on $12,000 automation investment**

### Example 3: E-commerce Daily Sales Reconciliation

**Before automation**:

- Export Shopify orders daily
- Create invoices in Xero manually (if tracking individual orders)
- Or create daily summary invoice (loses order detail)
- Bank reconciliation manual
- **Total time: 5 hours/week = $13,000/year**

**After automation**:

- Orders sync to Xero automatically (individual or summary)
- Payment reconciliation automatic
- Daily sales summary email
- Review exceptions only (30 min/week)
- **Total time: 0.5 hours/week = $1,300/year**
- **Time saved: 4.5 hours/week = $11,700/year**
- **ROI: 3:1 on $4,000 automation investment**

---

## Troubleshooting Common Issues

### Connection Issues

**Problem**: "Xero connection expired" or "Authorization failed"

**Cause**: OAuth tokens expire after 60 days of no use  
**Solution**: Reconnect (takes 2 minutes, click "Reconnect to Xero")  
**Prevention**: Monthly management monitors and renews automatically

### Duplicate Contacts

**Problem**: Same customer exists multiple times in Xero

**Cause**: Created in Xero before automation, then CRM creates another  
**Solution**: One-time cleanup (merge duplicates) then automation prevents future duplicates  
**Prevention**: Automation checks for existing contact before creating

### Invoice Discrepancies

**Problem**: Invoice total doesn't match expected amount

**Cause**: Usually rounding, tax calculation differences, or missing data  
**Solution**: Check tax settings in both systems, verify rates are correct  
**Prevention**: Tax configuration verified during setup

### Missing Invoices

**Problem**: Expected invoice not created in Xero

**Cause**: Workflow trigger didn't fire, or workflow failed  
**Solution**: Check workflow execution log, re-run manually if needed  
**Prevention**: Monitoring alerts us to failed workflows

---

## Best Practices

### Chart of Accounts

**Before automation**: Map your chart of accounts clearly

- Income accounts for different revenue types
- Expense accounts for different cost types
- Track categories you need for reporting

**Why it matters**: Automation uses these accounts to categorize correctly

### Tax Rates

**Configure correctly from the start**:

- GST (10% in Australia) for taxable sales
- GST-free for exports, education, health, etc.
- Input taxed for financial services, rent, etc.

**Automation uses these settings**: Wrong tax rate = BAS errors later

### Coding and Tracking

**If you use Xero tracking categories**:

- Departments, locations, projects, etc.
- Configure automation to set tracking automatically
- Enables better reporting and profitability analysis

### Invoice Numbering

**Maintain consistent numbering**:

- Xero has default number sequence (INV-0001, INV-0002, etc.)
- If you have custom format, configure automation to match
- Important for audit and compliance

---

## Pricing and Plans

### Xero Pricing (External to Zixly)

**Xero Starter**: $33/month (20 invoices/month limit)  
**Xero Standard**: $65/month (unlimited, most popular)  
**Xero Premium**: $78/month (advanced features)

**Note**: You pay Xero directly for your subscription

### Zixly Integration Costs

**Initial Setup** (included in service tier):

- Starter package: Basic Xero integration included
- Complete package: Advanced Xero workflows included
- Enterprise package: Unlimited Xero workflows

**Additional Workflows** (after initial implementation):

- $1,000-$2,000 per additional workflow depending on complexity
- Or included in monthly management (1-2 workflows/month depending on tier)

---

## Security and Compliance

### Data Security

- OAuth 2.0 (most secure method, no passwords stored)
- Tokens encrypted in AWS Secrets Manager
- All connections use HTTPS/TLS encryption
- Audit trail of all actions

### Compliance

- **GST/BAS**: Xero handles GST calculations, we maintain data integrity
- **Audit trail**: Complete log of invoices created, payments recorded
- **Access control**: Only authorized users can access automation system
- **Data residency**: Xero Australia servers, automation in AWS Sydney

### Privacy

- We don't store your Xero financial data permanently
- Automation reads from and writes to Xero, data stays in Xero
- Australian Privacy Act compliant
- Can sign NDA if required

---

## Support and Resources

### Getting Help

**During implementation**:

- Weekly check-ins with Zixly team
- Email/phone support for questions
- Screen sharing for troubleshooting

**After go-live**:

- Included support period (30-90 days depending on tier)
- Monthly management available ($500-$2K/month)
- Pay-as-you-go support ($150-$250/hour)

### Xero Resources

- **Xero Central**: Xero's help documentation
- **Xero Support**: For Xero-specific questions (we can coordinate with them)
- **Xero Community**: Forum for Xero users
- **Xero API**: For developers (we handle this)

### Zixly Resources

- **Integration Guide** (this document)
- **Workflow Diagrams**: Visual representation of your automation
- **Video Tutorials**: How to use dashboard and monitor workflows
- **FAQ**: Common questions and solutions

---

## Next Steps

1. **Book Free Assessment**: Discuss your specific Xero automation needs
2. **Business Process Review**: Map your workflows and calculate ROI
3. **Implementation**: We set up OAuth, build workflows, test, go live
4. **Training**: Your team learns how to monitor and use automation
5. **Ongoing**: Optional monthly management for continuous optimization

**Contact**: hello@zixly.dev or 0412 345 678 (Cole)

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-25  
**Owner**: Zixly Technical Architecture  
**Review Cycle**: Quarterly
