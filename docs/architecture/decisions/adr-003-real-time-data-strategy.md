# ADR-003: Real-Time Data Strategy

**Status**: Proposed  
**Date**: 2025-01-27  
**Deciders**: Technical Architecture Team

## Context

The documentation mentions real-time WebSocket connections and live dashboard updates, but these features are not yet implemented. We need to decide on the real-time data strategy for the internal operations platform.

**Business Context**:

- Zixly is an open-source internal operations platform
- Tracks Zixly's service delivery operations
- Demonstrates "eating our own dogfood" with self-hostable SME stack
- Open-source for demonstration and reuse purposes

**Current State**:

- Static dashboard with manual refresh
- No real-time data updates
- No WebSocket connections
- No live collaboration features

**Requirements**:

- Live dashboard updates as data changes
- Real-time notifications for critical events
- Multi-user collaboration (Zixly team members)
- Performance optimization for real-time features

## Decision

**Phase 1 (Current)**: Static data with manual refresh  
**Phase 2 (Future)**: Supabase real-time subscriptions with WebSocket connections

**Rationale**:

- Supabase provides built-in real-time capabilities
- WebSocket connections for live updates
- Real-time subscriptions for database changes
- Push notifications for critical events
- Aligns with open-source strategy for simplicity

## Consequences

**Positive**:

- Live dashboard updates
- Better user experience
- Real-time collaboration
- Immediate data synchronization
- Built-in Supabase real-time support
- Simple implementation

**Negative**:

- Increased complexity
- WebSocket connection management
- Potential performance impact
- Additional infrastructure requirements
- Requires careful state management

## Implementation Plan

### Phase 1: Static Data (Current)

- Manual refresh for data updates
- Basic dashboard functionality
- Focus on core features
- Simple implementation

### Phase 2: Real-Time Data (Future)

- Supabase real-time subscriptions
- WebSocket connections
- Live dashboard updates
- Push notifications

## Technical Implementation

### Supabase Real-Time Subscriptions

```typescript
// Real-time subscription for financial data
const subscription = supabase
  .channel('financial-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'financials',
    },
    (payload) => {
      // Update dashboard in real-time
      updateDashboard(payload.new)
    }
  )
  .subscribe()
```

### WebSocket Connection Management

```typescript
// WebSocket connection with reconnection logic
const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket(url)

    ws.onopen = () => setIsConnected(true)
    ws.onclose = () => setIsConnected(false)
    ws.onerror = () => {
      // Reconnection logic
      setTimeout(() => connect(), 5000)
    }

    setSocket(ws)
    return () => ws.close()
  }, [url])

  return { socket, isConnected }
}
```

### Real-Time Dashboard Updates

```typescript
// Dashboard component with real-time updates
const Dashboard = () => {
  const [data, setData] = useState(null);
  const { socket, isConnected } = useWebSocket('/api/ws');

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const update = JSON.parse(event.data);
        setData(prev => ({ ...prev, ...update }));
      };
    }
  }, [socket]);

  return (
    <div>
      <ConnectionStatus connected={isConnected} />
      <FinancialChart data={data} />
      <KPICards data={data} />
    </div>
  );
};
```

## Current Implementation Status

### ✅ IMPLEMENTED

- Static dashboard UI
- Basic data visualization
- Manual refresh functionality
- API endpoints for data retrieval

### ❌ NOT IMPLEMENTED

- WebSocket connections
- Real-time subscriptions
- Live dashboard updates
- Push notifications
- Multi-user collaboration

## Implementation Timeline

### Week 1: Supabase Real-Time Setup

- Configure Supabase real-time
- Implement basic subscriptions
- Test real-time data flow

### Week 2: WebSocket Implementation

- Add WebSocket server
- Implement connection management
- Add reconnection logic

### Week 3: Dashboard Integration

- Update dashboard components
- Add real-time data handling
- Implement live updates

### Week 4: Testing and Optimization

- Test real-time performance
- Optimize data flow
- Add error handling

## Performance Considerations

### Database Performance

- Real-time subscriptions add overhead
- Monitor database connection usage
- Optimize queries for real-time updates
- Consider connection pooling

### Client Performance

- WebSocket connections consume resources
- Implement connection limits
- Add connection status indicators
- Handle connection failures gracefully

### Network Performance

- WebSocket connections require stable network
- Implement fallback to polling
- Add connection quality monitoring
- Optimize data payload size

## Security Considerations

### WebSocket Security

- Secure WebSocket connections (WSS)
- Authentication for WebSocket connections
- Rate limiting for real-time updates
- Input validation for real-time data

### Data Security

- Real-time data must respect RLS policies
- Secure data transmission
- Audit real-time data access
- Monitor for suspicious activity

## Future Enhancements

### Advanced Real-Time Features

- Multi-user collaboration
- Real-time editing
- Live cursors and presence
- Real-time notifications

### Mobile Real-Time

- Push notifications for mobile
- Offline sync with real-time updates
- Background real-time updates
- Mobile-specific optimizations

## Related Decisions

- **ADR-001**: Multi-Tenant Architecture
- **ADR-002**: n8n vs Web App Separation
- **ADR-004**: Mobile App Architecture

## Review

**Next Review**: 2025-04-27  
**Reviewers**: Technical Architecture Team  
**Status**: Proposed (awaiting implementation)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Technical Architecture Team
