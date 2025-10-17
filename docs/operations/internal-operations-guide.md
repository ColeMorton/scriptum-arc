# Zixly Internal Operations Guide

**Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Service Operations  
**Status**: Active Guide

---

## Overview

This document explains how Zixly uses its own platform to run the Zixly service business. This "dogfooding" approach provides authentic expertise and continuous improvement of our service delivery capabilities while demonstrating the value of the self-hostable SME stack to potential clients.

---

## Internal Operations Architecture

### Zixly Service Business Model

**What We Track:**

- **Service Clients**: Businesses using Zixly for n8n automation services
- **Service Revenue**: Revenue from Starter, Professional, and Enterprise packages
- **Service Costs**: Consultant time, tools, infrastructure costs
- **Service Metrics**: Project velocity, client satisfaction, delivery efficiency
- **Sales Pipeline**: Leads for service contracts through our sales process

### Data Model for Internal Operations

**Tenant**: Zixly organization (single tenant for internal use)
**ClientKPI**: Service clients (businesses using Zixly services)
**Financial**: Zixly revenue/expenses per client project
**LeadEvent**: Zixly sales pipeline (leads for service contracts)
**CustomMetric**: Internal KPIs (billable hours, project velocity, client satisfaction)
**Integration**: Zixly's own system integrations (Xero, Plane, Nextcloud, etc.)
**WorkflowMetadata**: Internal n8n workflows for Zixly operations
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
- **n8n**: Automated project status updates
- **Custom Metrics**: Project velocity, delivery efficiency

### Financial Operations

**What We Track:**

- Service revenue by client and project type
- Operational costs (consultant time, tools, infrastructure)
- Profit margins by service tier
- Cash flow and billing status

**Tools Used:**

- **Xero**: Accounting and financial management
- **Invoice Ninja**: Client billing and payment tracking
- **n8n**: Automated financial reporting and Xero sync

### Client Support

**What We Track:**

- Support ticket volume and response times
- Client satisfaction scores (NPS)
- Support efficiency metrics
- Client retention rates

**Tools Used:**

- **Chatwoot**: Client support and communication
- **n8n**: Automated support workflows
- **Custom Metrics**: Satisfaction tracking, response times

### Sales & Marketing

**What We Track:**

- Lead generation and conversion rates
- Sales pipeline value and velocity
- Marketing campaign effectiveness
- Customer acquisition costs

**Tools Used:**

- **Mautic**: Marketing automation and lead nurturing
- **n8n**: Lead scoring and sales automation
- **Custom Metrics**: Lead velocity, conversion rates

---

## Self-Hostable Stack Implementation

### Core Tools in Use

1. **n8n (Automation Hub)**
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

**n8n as the Central Hub:**

- Connects all tools via APIs and webhooks
- Automates data flow between systems
- Provides custom business logic and workflows
- Handles error handling and retry logic

**Data Flow:**

```
Client Action → n8n Workflow → Tool Integration → Database Update → Dashboard Refresh
```

**Example Workflows:**

1. **New Client Onboarding**
   - Client signs up → n8n creates Plane project
   - n8n creates Nextcloud folder structure
   - n8n sends welcome email via Mautic
   - n8n updates financial records

2. **Time Tracking Sync**
   - Consultant logs hours in Plane
   - n8n syncs to financial records
   - n8n updates project profitability
   - n8n generates client reports

3. **Support Ticket Automation**
   - Client submits ticket in Chatwoot
   - n8n creates task in Plane
   - n8n notifies team via Slack
   - n8n tracks response time metrics

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

- n8n deployment for internal automation
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
