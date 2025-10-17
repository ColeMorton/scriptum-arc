# ADR-004: Mobile App Architecture

**Status**: Proposed  
**Date**: 2025-01-27  
**Deciders**: Technical Architecture Team

## Context

The documentation mentions a React Native mobile application with offline sync and push notifications, but this feature is not yet implemented. We need to decide on the mobile app architecture for the internal operations platform.

**Business Context**:

- Zixly is an open-source internal operations platform
- Tracks Zixly's service delivery operations
- Demonstrates "eating our own dogfood" with self-hostable SME stack
- Open-source for demonstration and reuse purposes

**Current State**:

- No mobile application
- No offline data sync
- No push notifications
- No native device features

**Requirements**:

- Mobile access to internal operations data
- Offline data synchronization
- Push notifications for critical events
- Native device features (camera, GPS, etc.)
- Cross-platform compatibility (iOS/Android)

## Decision

**Technology Stack**: React Native with Expo  
**Architecture**: Offline-first with real-time sync  
**Deployment**: App Store and Google Play Store

**Rationale**:

- React Native provides cross-platform development
- Expo simplifies development and deployment
- Offline-first architecture for field operations
- Real-time sync when online
- Native device features for service delivery

## Consequences

**Positive**:

- Cross-platform mobile app
- Offline data access
- Native device features
- Push notifications
- Real-time sync
- Easy deployment with Expo

**Negative**:

- Additional development complexity
- Mobile-specific testing required
- App store approval process
- Device compatibility considerations
- Performance optimization needed

## Implementation Plan

### Phase 1: Basic Mobile App (4 weeks)

- React Native project setup
- Basic navigation and UI
- Authentication integration
- Core data display

### Phase 2: Offline Sync (2 weeks)

- Local database (SQLite)
- Offline data storage
- Sync when online
- Conflict resolution

### Phase 3: Native Features (2 weeks)

- Push notifications
- Camera integration
- GPS tracking
- Device sensors

### Phase 4: Production (2 weeks)

- App store deployment
- Testing and optimization
- Documentation
- Community release

## Technical Architecture

### React Native with Expo

```typescript
// App.tsx - Main application component
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Projects" component={Projects} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Offline-First Architecture

```typescript
// Offline data sync with Supabase
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingChanges, setPendingChanges] = useState([])

  useEffect(() => {
    // Check network status
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected)
    })

    return unsubscribe
  }, [])

  const syncData = async () => {
    if (isOnline) {
      // Sync pending changes
      for (const change of pendingChanges) {
        await supabase.from(change.table).upsert(change.data)
      }
      setPendingChanges([])
    }
  }

  return { isOnline, syncData }
}
```

### Push Notifications

```typescript
// Push notification setup
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

const registerForPushNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync()

  if (status === 'granted') {
    const token = await Notifications.getExpoPushTokenAsync()
    // Send token to server for notifications
    return token
  }
}
```

## Current Implementation Status

### ✅ IMPLEMENTED

- None (mobile app not yet implemented)

### ❌ NOT IMPLEMENTED

- React Native mobile app
- Offline data sync
- Push notifications
- Native device features
- Cross-platform compatibility

## Feature Specifications

### Core Features

- **Dashboard**: Service delivery metrics and KPIs
- **Projects**: Client project tracking and updates
- **Time Tracking**: Billable hours and project time
- **Notifications**: Push notifications for critical events
- **Offline Sync**: Data synchronization when online

### Native Features

- **Camera**: Photo capture for project documentation
- **GPS**: Location tracking for field operations
- **Push Notifications**: Real-time alerts and updates
- **Offline Storage**: Local data for offline access
- **Background Sync**: Data sync in background

### User Experience

- **Intuitive Navigation**: Easy-to-use interface
- **Offline-First**: Works without internet connection
- **Real-Time Updates**: Live data when online
- **Native Feel**: Platform-specific UI components
- **Performance**: Smooth animations and interactions

## Development Considerations

### Cross-Platform Development

- React Native for iOS and Android
- Platform-specific code when needed
- Shared business logic and components
- Consistent user experience

### Offline-First Design

- Local database for offline storage
- Conflict resolution for data sync
- Background sync when online
- User feedback for sync status

### Performance Optimization

- Lazy loading for large datasets
- Image optimization and caching
- Memory management for mobile
- Battery usage optimization

## Deployment Strategy

### Development

- Expo development build
- Hot reloading for development
- Device testing on iOS/Android
- Continuous integration

### Production

- App Store and Google Play Store
- Over-the-air updates with Expo
- Analytics and crash reporting
- User feedback collection

## Security Considerations

### Data Security

- Encrypted local storage
- Secure API communication
- Authentication and authorization
- Data privacy compliance

### App Security

- Code obfuscation for production
- Secure API endpoints
- Input validation and sanitization
- Regular security updates

## Future Enhancements

### Advanced Features

- Voice commands for hands-free operation
- Augmented reality for project visualization
- Machine learning for predictive insights
- Advanced analytics and reporting

### Integration Features

- Third-party app integrations
- Calendar and scheduling integration
- Document management integration
- Communication tools integration

## Related Decisions

- **ADR-001**: Multi-Tenant Architecture
- **ADR-002**: n8n vs Web App Separation
- **ADR-003**: Real-Time Data Strategy

## Review

**Next Review**: 2025-04-27  
**Reviewers**: Technical Architecture Team  
**Status**: Proposed (awaiting implementation)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Technical Architecture Team
