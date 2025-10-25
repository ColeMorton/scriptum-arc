# HubSpot Integration Guide

**Version**: 1.0  
**Last Updated**: 2025-10-25  
**Integration Type**: CRM & Marketing  
**Authentication**: OAuth 2.0

---

## Overview

HubSpot is a popular CRM and marketing automation platform. Integrating HubSpot with your accounting, project management, and other systems eliminates duplicate data entry and automates your entire customer lifecycle.

---

## What HubSpot Integration Enables

### Automatic Lead Capture and Follow-up

- Website form submission → HubSpot contact created → Follow-up sequence begins
- Email inquiry → Contact created → Assigned to sales rep → Reminder scheduled
- Phone call logged → Activity recorded → Next steps automated

### Deal Won to Invoice Automation

- Deal marked "won" in HubSpot → Invoice created in Xero → Project created in Asana → Welcome email sent
- Single action triggers entire customer onboarding

### Contact Data Synchronization

- Customer details entered once → Updated everywhere (accounting, project management, email)
- No more "which system has the correct email?"

### Reporting and Analytics

- Sales pipeline visibility
- Marketing campaign performance
- Customer lifecycle metrics
- Revenue forecasting

---

## Common Workflows

### Lead to Customer Journey

1. Lead captured (website, phone, email) → HubSpot contact created
2. Lead qualified → Moved to "Qualified" stage → Assigned to sales rep
3. Deal created → Follow-up tasks auto-generated
4. Deal won → Invoice + Project + Welcome email (all automatic)
5. Customer onboarded → Lifecycle stage updated

### Customer Communication Automation

1. Deal milestone reached → Customer update email sent
2. Invoice sent → Email notification with payment link
3. Payment overdue → Reminder sequence from HubSpot
4. Project complete → Feedback request + Review request

### Sales Team Efficiency

1. No activity in 7 days → Reminder to sales rep
2. Deal stuck in stage > 30 days → Manager notification
3. High-value deal → Auto-create tasks for approval process
4. Lost deal → Competitor info captured → Learn for next time

---

## Workflow Example

**Scenario**: Architecture firm winning new client

**Before automation** (15 hours total):

- Sales rep enters client details in HubSpot (30 min)
- Admin creates same client in Xero (30 min)
- Admin creates engagement letter (1 hour)
- Project Manager creates project in Asana (1 hour)
- Various people send welcome emails (30 min)
- **Setup time: 3.5 hours**
- Plus ongoing coordination and updates (2 hours/week × 6 weeks = 12 hours)
- **Total: 15.5 hours for onboarding**

**After automation** (2 hours total):

- Sales rep marks deal "won" in HubSpot (2 minutes)
- Everything else happens automatically:
  - Client created in Xero with correct details
  - Engagement letter generated and sent
  - Project created in Asana with tasks assigned
  - Welcome email sent with next steps
  - Team notified
  - Kickoff meeting scheduled
- Project Manager reviews and adjusts (2 hours over project)
- **Total: 2 hours**
- **Time saved: 13.5 hours = $1,350 per client**

**ROI**: At 20 new clients/year, saves $27,000/year. Investment: $11,000. **Payback: 5 months**

---

## Setup Requirements

**HubSpot Plan Requirements**:

- **Free**: Basic CRM features, limited automation
- **Starter** ($20-50/month): More contacts, basic workflows
- **Professional** ($800/month): Advanced automation, recommended for serious use
- **Enterprise** ($3,200/month): Advanced features, large organizations

**Recommendation**: Professional plan for businesses serious about automation

**OAuth Connection**: Similar to Xero, you grant permission via HubSpot login. Takes 2-3 minutes.

---

## Common Integrations

**HubSpot + Xero**:

- Deal won → Invoice created
- Contact updates synced bidirectionally
- Payment received → Deal stage updated

**HubSpot + Asana**:

- Deal won → Project created with tasks
- Project milestones → Customer update emails from HubSpot
- Project complete → Update HubSpot, request feedback

**HubSpot + Email/Calendar**:

- Meeting booked → Calendar event + Reminder emails
- Email received → Logged in HubSpot automatically
- Task due → Reminder email sent

---

## Best Practices

1. **Clean Data First**: Deduplicate contacts before connecting
2. **Define Stages Clearly**: Sales pipeline stages should match your process
3. **Lifecycle Stages**: Use HubSpot's lifecycle stages (Lead, MQL, SQL, Customer, Evangelist)
4. **Custom Properties**: Define custom fields for your industry (legal: matter type, construction: job type, etc.)
5. **Deal Pipelines**: Separate pipelines for different business lines if needed

---

## Support

**Documentation**: This guide + workflow diagrams + video tutorials  
**Implementation**: Included in Complete or Enterprise packages  
**Additional Workflows**: $1,000-$2,000 each or included in monthly management

**Contact**: hello@zixly.dev or 0412 345 678

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-25  
**Owner**: Zixly Technical Architecture
