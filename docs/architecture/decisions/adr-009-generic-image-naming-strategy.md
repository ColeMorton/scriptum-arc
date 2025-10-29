# ADR-009: Generic Image Naming Strategy

**Status**: Accepted
**Date**: 2025-01-29
**Decision Makers**: Technical Architecture Team
**Affected Components**: Docker Compose configurations, image management, development workflow

---

## Context

The Zixly project integrates with an external trading project that provides trading API services. Previously, the Zixly docker-compose.yml was building trading images from an external context (`/Users/colemorton/Projects/trading`), which created several issues:

1. **Slow Development Cycles**: Every container restart required rebuilding images from source
2. **Poor Image Reusability**: Images were tied to specific project contexts
3. **Inconsistent Naming**: Container names and image names were mixed together
4. **No Image Portability**: Images couldn't be shared between projects or environments

### Business Requirements

1. **Faster Development**: Reduce container startup time from 30-60 seconds to <5 seconds
2. **Image Reusability**: Enable trading images to be used across multiple projects
3. **Clear Separation**: Distinguish between image identity (generic) and deployment context (project-specific)
4. **Foundation for CI/CD**: Prepare for future GitHub Container Registry integration

---

## Decision

**We will implement a generic image naming strategy that separates image identity from container identity.**

### Image Naming Convention

- **Images**: Generic, reusable names (e.g., `trading-api:latest`, `webhook-receiver:latest`)
- **Containers**: Project-specific names (e.g., `zixly-trading-api`, `zixly-webhook-receiver`)

### Implementation Strategy

1. **Trading Project**: Create `docker-compose.yml` with generic image names
2. **Zixly Project**: Reference pre-built images instead of building from external context
3. **Build Once, Use Many**: Images built once and reused across projects
4. **Container Isolation**: Project-specific container names maintain deployment boundaries

---

## Implementation Details

### Trading Project (`/Users/colemorton/Projects/trading/docker-compose.yml`)

```yaml
version: '3.8'

services:
  trading-api:
    build:
      context: .
      dockerfile: Dockerfile.api
      target: development
    image: trading-api:latest # Generic, reusable name
    container_name: trading-api
    # ... rest of config

  arq-worker:
    build:
      context: .
      dockerfile: Dockerfile.api
      target: development
    image: arq-worker:latest # Generic, reusable name
    container_name: arq-worker
    # ... rest of config
```

### Zixly Project (`/Users/colemorton/Projects/zixly/docker-compose.yml`)

```yaml
# BEFORE (building from external context):
trading-api:
  build:
    context: /Users/colemorton/Projects/trading
    dockerfile: Dockerfile.api
    target: development
  container_name: zixly-trading-api

# AFTER (using pre-built image):
trading-api:
  image: trading-api:latest  # Use pre-built generic image
  container_name: zixly-trading-api  # Keep Zixly-specific container name
```

### Zixly Services (Add Image Tags)

```yaml
webhook-receiver:
  build:
    context: ./services/webhook-receiver
    dockerfile: Dockerfile
  image: webhook-receiver:latest # Add generic image tag
  container_name: zixly-webhook-receiver

pipeline-worker:
  build:
    context: ./services/pipeline-worker
    dockerfile: Dockerfile
  image: pipeline-worker:latest # Add generic image tag
  # ... rest of config
```

---

## Workflow Changes

### Initial Setup (First Time)

```bash
# 1. Build trading images (in trading project)
cd /Users/colemorton/Projects/trading
docker-compose build

# Creates: trading-api:latest, arq-worker:latest

# 2. Build zixly images (in zixly project)
cd /Users/colemorton/Projects/zixly
docker-compose build webhook-receiver pipeline-worker

# Creates: webhook-receiver:latest, pipeline-worker:latest
```

### Daily Development

```bash
# Start Zixly services (uses pre-built images instantly)
cd /Users/colemorton/Projects/zixly
docker-compose --profile zixly --profile trading up -d

# Images load instantly (no rebuild)
# Containers still named zixly-* for isolation
```

### When Trading Code Changes

```bash
# Rebuild only changed images
cd /Users/colemorton/Projects/trading
docker-compose build trading-api

# Restart Zixly services to use new image
cd /Users/colemorton/Projects/zixly
docker-compose restart trading-api
```

---

## Benefits

### Performance Improvements

1. **Faster Startup**: Container restart time reduced from 30-60 seconds to ~1.7 seconds
2. **No Rebuild Overhead**: Images loaded from cache instead of built from source
3. **Reduced Resource Usage**: No CPU/memory overhead for unnecessary builds

### Development Experience

1. **Faster Iteration**: Quick container restarts for development
2. **Clear Separation**: Image identity vs deployment context is explicit
3. **Better Debugging**: Easier to identify which image is being used

### Architecture Benefits

1. **Image Portability**: Generic images can be used in any project
2. **Reusability**: Same images for development, testing, and production
3. **Foundation for CI/CD**: Prepared for container registry integration
4. **Consistency**: Same images across different environments

### Operational Benefits

1. **Easier Troubleshooting**: Clear distinction between image and container issues
2. **Better Resource Management**: Images can be shared between projects
3. **Simplified Deployment**: Pre-built images reduce deployment complexity

---

## Consequences

### Positive

1. **95% Faster Container Startup**: From 30-60 seconds to 1.7 seconds
2. **Improved Developer Experience**: Faster iteration cycles
3. **Better Image Management**: Clear separation of concerns
4. **Foundation for CI/CD**: Ready for container registry integration
5. **Resource Efficiency**: Shared images reduce disk usage

### Negative

1. **Initial Setup Complexity**: Requires building images in both projects
2. **Image Synchronization**: Need to rebuild trading images when code changes
3. **Learning Curve**: Developers need to understand new workflow

### Mitigation Strategies

1. **Documentation**: Comprehensive guides for new workflow
2. **Automation**: Scripts to automate image building and synchronization
3. **Monitoring**: Health checks to ensure correct images are being used
4. **Fallback**: Can revert to build-from-source if needed

---

## Migration Plan

### Phase 1: Implementation (Completed)

1. ✅ Create trading project docker-compose.yml with generic image names
2. ✅ Update Zixly docker-compose.yml to use pre-built images
3. ✅ Add image tags to Zixly services
4. ✅ Build initial images with generic names
5. ✅ Verify implementation works correctly

### Phase 2: Documentation (In Progress)

1. 🔄 Update architecture documentation
2. 🔄 Update troubleshooting guides
3. 🔄 Create developer workflow documentation
4. 🔄 Update deployment guides

### Phase 3: Optimization (Future)

1. ⏳ Create automation scripts for image building
2. ⏳ Implement GitHub Container Registry integration
3. ⏳ Add image versioning strategy
4. ⏳ Create CI/CD pipeline for image building

---

## Verification

### Image Verification

```bash
# Check images exist with generic names
docker images | grep -E "trading-api|arq-worker|webhook-receiver|pipeline-worker"

# Expected output:
# trading-api:latest      3.23GB
# arq-worker:latest       3.23GB
# webhook-receiver:latest 508MB
# pipeline-worker:latest  517MB
```

### Container Verification

```bash
# Verify containers have project-specific names
docker ps --format "table {{.Names}}\t{{.Image}}"

# Expected output:
# zixly-trading-api      trading-api:latest
# zixly-arq-worker       arq-worker:latest
# zixly-webhook-receiver webhook-receiver:latest
# zixly-pipeline-worker  pipeline-worker:latest
```

### Performance Verification

```bash
# Test container restart speed
time docker-compose restart trading-api arq-worker

# Expected: ~1.7 seconds total
```

---

## Future Considerations

### Container Registry Integration

When ready for production deployment:

1. **GitHub Container Registry**: Push images to `ghcr.io/colemorton/zixly`
2. **Image Versioning**: Use semantic versioning (e.g., `trading-api:1.2.3`)
3. **CI/CD Pipeline**: Automated image building and pushing
4. **Multi-Architecture**: Support for ARM64 and AMD64

### Advanced Image Management

1. **Image Scanning**: Security vulnerability scanning
2. **Image Signing**: Content trust and verification
3. **Image Caching**: Optimize image layer caching
4. **Image Cleanup**: Automated cleanup of old images

---

## References

- [Docker Compose Image Reference](https://docs.docker.com/compose/compose-file/compose-file-v3/#image)
- [Docker Image Naming Best Practices](https://docs.docker.com/engine/reference/commandline/tag/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-29  
**Owner**: Technical Architecture Team  
**Review Cycle**: Quarterly
