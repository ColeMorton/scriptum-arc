# Zixly Internal Operations Guide

> **⚠️ PARTIALLY OUTDATED**: This document describes operational workflows that were built using the old n8n architecture. The conceptual data model and business processes remain valid, but the automation implementation details (n8n workflows) need to be rebuilt using Docker-based workflow services.
>
> **Status**: Reference Document (Automation sections outdated)  
> **Last Updated**: 2025-10-25  
> **Action Required**: Rebuild automation workflows using webhook receiver + workers

**Version**: 2.0  
**Owner**: Service Operations

---

## Overview

This document explains how Zixly uses its own platform to run the Zixly service business. This "dogfooding" approach provides authentic expertise and continuous improvement of our service delivery capabilities while demonstrating the value of business automation to SME clients.

**Note**: The automation workflows described in this document reference n8n, which has been replaced with Docker-based workflow services. The business processes and data models are still accurate, but the implementation details need updating.

---

## Internal Operations Architecture

### Zixly Service Business Model

**What We Track:**

- **Service Clients**: SMEs using Zixly for business automation services (connecting Xero, HubSpot, Shopify, Asana)
- **Service Revenue**: Revenue from Business Automation Starter, Complete, and Enterprise packages
- **Service Costs**: Consultant time, tools, infrastructure costs, OAuth integration setup
- **Service Metrics**: Project velocity, client satisfaction, delivery efficiency, time saved for clients
- **Sales Pipeline**: Leads for business automation service contracts through our sales process

### Data Model for Internal Operations

**Tenant**: Zixly organization (single tenant for internal use)
**ClientKPI**: Service clients (businesses using Zixly services)
**Financial**: Zixly revenue/expenses per client project
**LeadEvent**: Zixly sales pipeline (leads for service contracts)
**CustomMetric**: Internal KPIs (billable hours, project velocity, client satisfaction)
**Integration**: Zixly's own system integrations (Xero, Plane, Nextcloud, etc.)
**WorkflowMetadata**: Internal pipelines for Zixly operations
**DataSyncStatus**: Internal data sync health monitoring

---

## Service Delivery Tracking

### Project Management

**What We Track:**

- Active service projects by tier (Starter/Professional/Enterprise)
- Project completion timeline and efficiency
- Billable hours per project and consultant
- Service delivery quality metrics

**Tools Used:**

- **Plane**: Project management and task tracking
- **Workflow automation**: Automated project status updates
- **Custom Metrics**: Project velocity, delivery efficiency, client time savings

### Financial Operations

**What We Track:**

- Service revenue by client and project type
- Operational costs (consultant time, tools, infrastructure, OAuth services)
- Profit margins by service tier
- Cash flow and billing status

**Tools Used:**

- **Xero**: Accounting and financial management
- **Invoice Ninja**: Client billing and payment tracking
- **Workflow automation**: Automated financial reporting and Xero sync

### Client Support

**What We Track:**

- Support ticket volume and response times
- Client satisfaction scores (NPS)
- Support efficiency metrics
- Client retention rates

**Tools Used:**

- **Chatwoot**: Client support and communication
- **pipeline services**: Automated support workflows
- **Custom Metrics**: Satisfaction tracking, response times

### Sales & Marketing

**What We Track:**

- Lead generation and conversion rates
- Sales pipeline value and velocity
- Marketing campaign effectiveness
- Customer acquisition costs

**Tools Used:**

- **Mautic**: Marketing automation and lead nurturing
- **pipeline services**: Lead scoring and sales automation
- **Custom Metrics**: Lead velocity, conversion rates

---

## Self-Hostable Stack Implementation

### Core Tools in Use

1. **pipeline services (Automation Hub)**
   - Client onboarding workflows
   - Time tracking automation
   - Financial reporting workflows
   - Support ticket automation

2. **Plane (Project Management)**
   - Service delivery project tracking
   - Task management and team collaboration
   - Project templates for service tiers
   - Resource allocation and planning

3. **Nextcloud (File Management)**
   - Client project documentation
   - Proposal and contract storage
   - Team collaboration files
   - Backup and version control

4. **Metabase (Business Intelligence)**
   - Service delivery dashboards
   - Financial performance analytics
   - Client satisfaction reporting
   - Operational efficiency metrics

5. **Chatwoot (Client Support)**
   - Multi-channel client support
   - Support ticket management
   - Client communication history
   - Support team collaboration

6. **Invoice Ninja (Billing)**
   - Client invoicing and billing
   - Payment tracking and reminders
   - Financial reporting
   - Recurring billing automation

7. **Mautic (Marketing Automation)**
   - Lead generation and nurturing
   - Email marketing campaigns
   - Lead scoring and segmentation
   - Marketing analytics

### Integration Architecture

**pipeline services as the Central Hub:**

- Connects all tools via APIs and webhooks
- Automates data flow between systems
- Provides custom business logic and workflows
- Handles error handling and retry logic

**Data Flow:**

```
Client Action → pipeline → Tool Integration → Database Update → Dashboard Refresh
```

**Example Workflows:**

1. **New Client Onboarding**
   - Client signs up → pipeline services creates Plane project
   - pipeline services creates Nextcloud folder structure
   - pipeline services sends welcome email via Mautic
   - pipeline services updates financial records

2. **Time Tracking Sync**
   - Consultant logs hours in Plane
   - pipeline services syncs to financial records
   - pipeline services updates project profitability
   - pipeline services generates client reports

3. **Support Ticket Automation**
   - Client submits ticket in Chatwoot
   - pipeline services creates task in Plane
   - pipeline services notifies team via Slack
   - pipeline services tracks response time metrics

---

## Key Performance Indicators

### Service Delivery Metrics

**Project Velocity:**

- Projects completed per month
- Average project duration by tier
- On-time delivery percentage
- Project profitability by tier

**Client Satisfaction:**

- Net Promoter Score (NPS)
- Client retention rate
- Support response time
- Client feedback scores

**Financial Performance:**

- Monthly recurring revenue (MRR)
- Revenue per consultant hour
- Profit margins by service tier
- Client lifetime value

**Operational Efficiency:**

- Billable hours utilization
- Consultant productivity
- Support ticket resolution time
- Marketing ROI

### Dashboard Views

**Service Delivery Dashboard:**

- Active projects by tier
- Project completion timeline
- Billable hours utilization
- Client satisfaction trends

**Financial Dashboard:**

- Revenue by service tier
- Profit margins and costs
- Cash flow and billing status
- Client profitability analysis

**Sales Pipeline Dashboard:**

- Lead generation and conversion
- Pipeline value and velocity
- Sales cycle length
- Marketing campaign effectiveness

**Operations Dashboard:**

- Support ticket metrics
- Team productivity
- System health and sync status
- Workflow automation status

---

## Benefits of Internal Operations Platform

### For Zixly Business

**Operational Excellence:**

- Automated service delivery processes
- Real-time visibility into operations
- Data-driven decision making
- Continuous process improvement

**Client Service Quality:**

- Faster response times
- Better project tracking
- Improved client satisfaction
- Proactive issue resolution

**Business Growth:**

- Scalable operations
- Efficient resource utilization
- Better financial management
- Data-driven business development

### For Client Demonstrations

**Authentic Expertise:**

- Real-world implementation experience
- Proven ROI and business value
- Live system demonstrations
- Genuine use case examples

**Credibility:**

- "We use these tools to run our own business"
- Actual metrics and performance data
- Continuous improvement stories
- Authentic success stories

**Competitive Advantage:**

- Unique positioning in the market
- No competitor can make the same claim
- Continuous innovation through daily usage
- Real-world problem solving experience

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

- Schema transformation for internal operations
- API endpoints for service business metrics
- Documentation updates

### Phase 2: Core Tools (Weeks 5-8)

- pipeline services deployment for internal automation
- Plane for project management
- Nextcloud for file management

### Phase 3: Business Intelligence (Weeks 9-12)

- Metabase for analytics and reporting
- Enhanced monitoring and dashboards
- Service-specific metrics tracking

### Phase 4: Communication & Billing (Weeks 13-16)

- Chatwoot for client support
- Invoice Ninja for billing automation
- Complete service delivery automation

### Phase 5: Marketing & Advanced (Weeks 17-20)

- Mautic for marketing automation
- Advanced operational capabilities
- Full stack integration

### Phase 6: Optimization (Weeks 21-24)

- Performance optimization
- Advanced dashboards
- Case study documentation

---

## Success Metrics

### Internal Operations Success

**Efficiency Gains:**

- 50%+ reduction in manual administrative work
- 90%+ client satisfaction scores
- 80%+ billable hours utilization
- 95%+ invoice payment within 30 days

**Business Impact:**

- Improved service delivery quality
- Faster client onboarding
- Better financial management
- Enhanced team productivity

### Client Demonstration Value

**Credibility Metrics:**

- Live system demonstrations
- Real performance data
- Authentic use case examples
- Continuous improvement stories

**Competitive Advantage:**

- Unique market positioning
- Authentic expertise
- Real-world implementation knowledge
- Continuous innovation

---

## Conclusion

The Zixly internal operations platform demonstrates the power of "eating your own dogfood" by using the same tools and workflows we recommend to clients. This approach provides authentic expertise, continuous improvement, and a unique competitive advantage in the market.

By running our own business on the self-hostable SME stack, we can confidently recommend these tools to clients, knowing they deliver real business value and operational excellence.

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Zixly Service Operations  
**Review Cycle**: Monthly
