# Docker Image Strategy Guide

**Version**: 1.0  
**Last Updated**: 2025-01-29  
**Owner**: Technical Operations  
**Status**: Active Guide

---

## Overview

This guide explains the generic image naming strategy implemented in the Zixly project. It covers how images are built, named, and used across different projects, providing faster development cycles and better image portability.

---

## Image Naming Strategy

### Generic Image Names

Images use generic, reusable names that can be shared across projects:

| Service          | Image Name                | Purpose                      |
| ---------------- | ------------------------- | ---------------------------- |
| Trading API      | `trading-api:latest`      | FastAPI trading service      |
| ARQ Worker       | `arq-worker:latest`       | Trading async job processing |
| Webhook Receiver | `webhook-receiver:latest` | Webhook ingestion service    |
| Pipeline Worker  | `pipeline-worker:latest`  | Job processing service       |

### Project-Specific Container Names

Containers use project-specific names for deployment isolation:

| Service          | Container Name           | Project Context          |
| ---------------- | ------------------------ | ------------------------ |
| Trading API      | `zixly-trading-api`      | Running in Zixly context |
| ARQ Worker       | `zixly-arq-worker`       | Running in Zixly context |
| Webhook Receiver | `zixly-webhook-receiver` | Running in Zixly context |
| Pipeline Worker  | `zixly-pipeline-worker`  | Running in Zixly context |

---

## Benefits

### Performance Improvements

- **95% Faster Startup**: Pre-built images load in ~1.7 seconds vs 30-60 seconds for rebuild
- **No Rebuild Overhead**: Images loaded from cache instead of built from source
- **Reduced Resource Usage**: No CPU/memory overhead for unnecessary builds

### Development Experience

- **Faster Iteration**: Quick container restarts for development
- **Clear Separation**: Image identity vs deployment context is explicit
- **Better Debugging**: Easier to identify which image is being used

### Architecture Benefits

- **Image Portability**: Generic images can be used in any project
- **Reusability**: Same images for development, testing, and production
- **Foundation for CI/CD**: Ready for container registry integration
- **Consistency**: Same images across different environments

---

## Project Structure

### Trading Project (`/Users/colemorton/Projects/trading`)

**Purpose**: Builds and maintains trading service images

**Docker Compose**:

```yaml
# /Users/colemorton/Projects/trading/docker-compose.yml
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

### Zixly Project (`/Users/colemorton/Projects/zixly`)

**Purpose**: Uses pre-built images and builds Zixly-specific images

**Docker Compose**:

```yaml
# /Users/colemorton/Projects/zixly/docker-compose.yml

# Trading services use pre-built images
trading-api:
  image: trading-api:latest # Use pre-built generic image
  container_name: zixly-trading-api # Zixly-specific container name
  # ... rest of config

arq-worker:
  image: arq-worker:latest # Use pre-built generic image
  container_name: zixly-arq-worker # Zixly-specific container name
  # ... rest of config

# Zixly services build and tag their own images
webhook-receiver:
  build:
    context: ./services/webhook-receiver
    dockerfile: Dockerfile
  image: webhook-receiver:latest # Generic image tag
  container_name: zixly-webhook-receiver
  # ... rest of config

pipeline-worker:
  build:
    context: ./services/pipeline-worker
    dockerfile: Dockerfile
  image: pipeline-worker:latest # Generic image tag
  # ... rest of config
```

---

## Development Workflow

### Initial Setup (First Time)

```bash
# 1. Build trading images (in trading project)
cd /Users/colemorton/Projects/trading
docker-compose build

# This creates:
# - trading-api:latest
# - arq-worker:latest

# 2. Build zixly images (in zixly project)
cd /Users/colemorton/Projects/zixly
docker-compose build webhook-receiver pipeline-worker

# This creates:
# - webhook-receiver:latest
# - pipeline-worker:latest
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

### When Zixly Code Changes

```bash
# Rebuild only changed images
cd /Users/colemorton/Projects/zixly
docker-compose build webhook-receiver

# Restart services to use new image
docker-compose restart webhook-receiver
```

---

## Image Management

### Building Images

```bash
# Build all trading images
cd /Users/colemorton/Projects/trading
docker-compose build

# Build specific trading image
docker-compose build trading-api

# Build all zixly images
cd /Users/colemorton/Projects/zixly
docker-compose build webhook-receiver pipeline-worker

# Build specific zixly image
docker-compose build webhook-receiver
```

### Listing Images

```bash
# List all generic images
docker images | grep -E "trading-api|arq-worker|webhook-receiver|pipeline-worker"

# Expected output:
# trading-api:latest      3.23GB
# arq-worker:latest       3.23GB
# webhook-receiver:latest 508MB
# pipeline-worker:latest  517MB
```

### Listing Containers

```bash
# List running containers with their images
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"

# Expected output:
# zixly-trading-api      trading-api:latest          Up 2 minutes
# zixly-arq-worker       arq-worker:latest           Up 2 minutes
# zixly-webhook-receiver webhook-receiver:latest     Up 2 minutes
# zixly-pipeline-worker  pipeline-worker:latest      Up 2 minutes
```

### Cleaning Up Images

```bash
# Remove unused images
docker image prune

# Remove specific image
docker rmi trading-api:latest

# Remove all unused images (including tagged ones)
docker image prune -a
```

---

## Troubleshooting

### Image Not Found Error

**Error**: `Error response from daemon: pull access denied for trading-api, repository does not exist`

**Solution**:

```bash
# Build the missing image
cd /Users/colemorton/Projects/trading
docker-compose build trading-api

# Or build all trading images
docker-compose build
```

### Container Won't Start

**Error**: Container fails to start with image-related errors

**Solution**:

```bash
# Check if image exists
docker images | grep trading-api

# If missing, build it
cd /Users/colemorton/Projects/trading
docker-compose build trading-api

# Check container logs
docker-compose logs trading-api
```

### Slow Startup Times

**Issue**: Containers taking 30-60 seconds to start

**Solution**:

```bash
# Ensure using pre-built images (not building from source)
docker images | grep -E "trading-api|arq-worker|webhook-receiver|pipeline-worker"

# If images exist, startup should be ~1.7 seconds
# If building from source, rebuild images first
```

---

## Best Practices

### Image Building

1. **Build Once, Use Many**: Build images once and reuse them
2. **Tag Consistently**: Use consistent tagging strategy (`latest` for development)
3. **Build in Correct Order**: Build trading images before zixly images
4. **Verify Images**: Always verify images exist before starting services

### Container Management

1. **Use Project-Specific Names**: Keep container names project-specific
2. **Monitor Resource Usage**: Check image sizes and container resource usage
3. **Clean Up Regularly**: Remove unused images and containers
4. **Health Checks**: Use health checks to verify container status

### Development Workflow

1. **Start with Images**: Always ensure images are built before starting services
2. **Incremental Changes**: Only rebuild images when code changes
3. **Test Changes**: Verify changes work before committing
4. **Document Changes**: Update documentation when changing image strategy

---

## Future Considerations

### Container Registry Integration

When ready for production deployment:

```bash
# Tag images for registry
docker tag trading-api:latest ghcr.io/colemorton/zixly/trading-api:latest
docker tag webhook-receiver:latest ghcr.io/colemorton/zixly/webhook-receiver:latest

# Push to registry
docker push ghcr.io/colemorton/zixly/trading-api:latest
docker push ghcr.io/colemorton/zixly/webhook-receiver:latest
```

### Image Versioning

For production deployments:

```bash
# Use semantic versioning
docker tag trading-api:latest trading-api:1.2.3
docker tag webhook-receiver:latest webhook-receiver:1.2.3

# Use Git SHA for traceability
docker tag trading-api:latest trading-api:abc123
docker tag webhook-receiver:latest webhook-receiver:abc123
```

### Multi-Architecture Support

For broader compatibility:

```bash
# Build for multiple architectures
docker buildx build --platform linux/amd64,linux/arm64 -t trading-api:latest .
docker buildx build --platform linux/amd64,linux/arm64 -t webhook-receiver:latest .
```

---

## Related Documentation

- [ADR-009: Generic Image Naming Strategy](../architecture/decisions/adr-009-generic-image-naming-strategy.md)
- [Unified Architecture Guide](./unified-architecture.md)
- [Docker Services Troubleshooting](../troubleshooting/docker-services.md)
- [Local Development Setup](./README.md)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-29  
**Owner**: Technical Operations  
**Review Cycle**: Quarterly
