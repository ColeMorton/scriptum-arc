# ADR-002: n8n vs Web App Separation of Concerns

**Status**: Accepted  
**Date**: 2025-01-27  
**Deciders**: Technical Architecture Team

## Context

We need to clearly define responsibilities between n8n (workflow automation) and the web application (business intelligence) to avoid duplication and leverage each platform's strengths.

**Business Context**:

- Zixly is an open-source internal operations platform
- Tracks Zixly's service delivery operations
- Demonstrates "eating our own dogfood" with self-hostable SME stack
- Open-source for demonstration and reuse purposes

**Problem**:

- Potential overlap between n8n and web app capabilities
- Risk of duplicating functionality
- Need to leverage each platform's strengths
- Clear boundaries for development and maintenance

## Decision

**n8n Responsibilities**:

- Workflow orchestration and execution
- API integrations and OAuth
- Data transformation and ETL
- Scheduled automation
- Custom TypeScript nodes

**Web App Responsibilities**:

- Business intelligence dashboards
- Real-time user interfaces
- Multi-tenant user management
- Advanced analytics and ML
- Mobile application

**Integration Point**: PostgreSQL database only

## Consequences

**Positive**:

- Zero duplication of functionality
- Leverages each platform's strengths
- Clear boundaries and responsibilities
- Scalable architecture
- Easier maintenance and development
- Clear separation of concerns

**Negative**:

- No direct communication between platforms
- Database becomes single point of integration
- Potential data consistency issues
- Complex debugging across platforms
- Requires careful data flow design

## Implementation

### n8n Platform

```typescript
// n8n handles workflow automation
- Visual workflow builder
- OAuth integrations (Xero, HubSpot, Asana)
- Data transformation and ETL
- Scheduled job execution
- Custom TypeScript nodes
- Error handling and retry logic
```

### Web App Platform

```typescript
// Web app handles business intelligence
- Interactive dashboards
- Real-time data visualization
- User authentication and authorization
- Advanced analytics and ML
- Mobile application
- WebSocket connections
```

### Integration Pattern

```
External APIs → n8n Workflows → PostgreSQL → Web App → User Interface
```

### Data Flow

- **n8n writes**: Processed business data, workflow metadata, sync status
- **Web app reads**: Business data for presentation, metadata for UI, status for indicators
- **No direct communication**: Platforms never call each other's APIs

## Current Implementation Status

### ✅ IMPLEMENTED (Web App)

- Basic dashboard UI with static charts
- Multi-tenant authentication (Supabase Auth)
- API endpoints for data retrieval
- Static data visualization
- Basic UI components

### ❌ NOT IMPLEMENTED (Web App)

- Real-time WebSocket connections
- Live dashboard updates
- Interactive filtering and drill-down
- Advanced analytics and ML
- Mobile application

### ❌ NOT IMPLEMENTED (n8n)

- n8n deployment and configuration
- Workflow execution engine
- OAuth integrations (Xero, HubSpot, Asana)
- Custom TypeScript nodes
- Automated data sync workflows

## Anti-Patterns to Avoid

### Web App Anti-Patterns

**DO NOT build in web app**:

- Workflow execution or management
- API integrations or OAuth handling
- Data transformation or ETL logic
- Scheduled jobs or automation
- Custom node development

### n8n Anti-Patterns

**DO NOT build in n8n**:

- User interface components
- Real-time WebSocket connections
- Mobile application features
- Advanced analytics hosting
- Multi-tenant user management

## Future Considerations

### Scalability

- n8n can scale workflow execution independently
- Web app can scale user experience independently
- Database can be optimized for each platform's needs
- Clear separation enables independent scaling

### Maintenance

- Clear boundaries make maintenance easier
- Each platform can be updated independently
- Debugging is isolated to specific platforms
- Documentation is clearly separated

### Open-Source Strategy

- Clear separation makes open-source release easier
- Community can understand platform boundaries
- Reusable patterns for each platform
- Clear contribution guidelines

## Related Decisions

- **ADR-001**: Multi-Tenant Architecture
- **ADR-003**: Real-Time Data Strategy
- **ADR-004**: Mobile App Architecture

## Review

**Next Review**: 2025-04-27  
**Reviewers**: Technical Architecture Team  
**Status**: Accepted and documented

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Technical Architecture Team
