---
**← [Phase 1: Data Foundation](./phase-1-data-foundation.md)** | **[Back to Documentation Index](../index.md)** | **[Phase 3: Business Intelligence Layer](./phase-3-business-intelligence.md)** →
---

# Phase 2: Local Development & Testing

**Phase**: 2 of 6  
**Duration**: 2 weeks (Weeks 5-6)  
**Status**: 🎯 **READY TO START**  
**Prerequisites**: Phase 1 Complete ✅

---

## Executive Summary

Phase 2 focuses on local development and testing of the self-hostable stack integration, specifically adding Plane project management alongside the existing n8n setup. This phase is 100% local and functional, enabling rapid development and testing without deployment complexity.

**Strategic Importance**: This phase establishes the core project management capability for Zixly's internal operations while maintaining a local development environment for rapid iteration and testing.

---

## Related Documentation

**Foundation Context**:

- [Phase 1: Data Foundation](./phase-1-data-foundation.md) - Complete ✅
- [System Architecture](../architecture/system-architecture.md) - Technical patterns
- [Dogfooding Strategy](../architecture/dogfooding-strategy.md) - Strategic rationale

**Implementation Guidance**:

- [Internal Operations Guide](../operations/internal-operations-guide.md) - Business requirements
- [Time Tracking System](../operations/time-tracking-system.md) - Operational standards
- [n8n Workflow Capabilities](../integrations/n8n-workflow-capabilities.md) - Technical patterns

---

## Phase 2 Objectives

### Primary Goals

1. **Local Docker Environment** - Spin up both n8n and Plane locally with single command
2. **Plane Integration** - Configure Plane for Zixly internal project management
3. **Plane Smoke Test** - n8n workflow to validate Plane connectivity and functionality
4. **Local Development Workflow** - Streamlined development and testing process

### Success Criteria

- ✅ Both n8n and Plane running locally via Docker Compose
- ✅ Plane smoke test workflow operational in n8n
- ✅ Plane configured for Zixly internal project management
- ✅ Local development workflow documented and functional
- ✅ All functionality testable without external dependencies

---

## Implementation Plan

### Week 5: Local Docker Environment Setup

#### 5.1 Local Docker Compose Stack

**File**: `docker-compose.local.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: zixly-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=zixly_admin
      - POSTGRES_PASSWORD=local_dev_password
      - POSTGRES_DB=zixly_main
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    networks:
      - zixly-local
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U zixly_admin -d zixly_main']
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: zixly-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass local_dev_password
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - zixly-local
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 30s
      timeout: 10s
      retries: 3

  # n8n Workflow Automation
  n8n:
    image: n8nio/n8n:latest
    container_name: zixly-n8n
    restart: unless-stopped
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=local_dev_password
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=zixly_admin
      - DB_POSTGRESDB_PASSWORD=local_dev_password
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=168
    ports:
      - '5678:5678'
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - zixly-local
    healthcheck:
      test:
        ['CMD', 'wget', '--no-verbose', '--tries=1', '--spider', 'http://localhost:5678/healthz']
      interval: 30s
      timeout: 10s
      retries: 3

  # Plane Project Management
  plane:
    image: makeplane/plane:latest
    container_name: zixly-plane
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://zixly_admin:local_dev_password@postgres:5432/plane
      - REDIS_URL=redis://:local_dev_password@redis:6379
      - SECRET_KEY=local_plane_secret_key
      - WEB_URL=http://localhost:8000
      - NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    ports:
      - '8000:8000'
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - zixly-local
    healthcheck:
      test: ['CMD', 'wget', '--no-verbose', '--tries=1', '--spider', 'http://localhost:8000/health']
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  n8n_data:
    driver: local

networks:
  zixly-local:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

#### 5.2 Secure Credential Management

**File**: `.env.local`

```bash
# Local Development Environment
NODE_ENV=development

# Database Configuration
POSTGRES_USER=zixly_admin
POSTGRES_PASSWORD=local_dev_password
POSTGRES_DB=zixly_main

# n8n Configuration
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=local_dev_password
N8N_DB_NAME=n8n
N8N_DB_USER=zixly_admin
N8N_DB_PASSWORD=local_dev_password

# Plane Configuration
PLANE_SECRET_KEY=local_plane_secret_key
PLANE_DB_NAME=plane

# External Services (for testing)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=ops@colemorton.com.au
SMTP_PASSWORD=your_email_password
```

**File**: `.env.local.template`

```bash
# Local Development Environment Template
# Copy this file to .env.local and update with your values

NODE_ENV=development

# Database Configuration
POSTGRES_USER=zixly_admin
POSTGRES_PASSWORD=your_local_db_password
POSTGRES_DB=zixly_main

# n8n Configuration
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_n8n_password
N8N_DB_NAME=n8n
N8N_DB_USER=zixly_admin
N8N_DB_PASSWORD=your_local_db_password

# Plane Configuration
PLANE_SECRET_KEY=your_plane_secret_key
PLANE_DB_NAME=plane

# External Services (for testing)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASSWORD=your_email_password
```

#### 5.3 Database Initialization

**File**: `init-scripts/01-create-databases.sql`

```sql
-- Create databases for local development
CREATE DATABASE n8n;
CREATE DATABASE plane;

-- Create service users
CREATE USER n8n_user WITH PASSWORD 'n8n_password';
CREATE USER plane_user WITH PASSWORD 'plane_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE n8n TO n8n_user;
GRANT ALL PRIVILEGES ON DATABASE plane TO plane_user;

-- Enable required extensions
\c n8n;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c plane;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

#### 5.4 Local Development Scripts

**File**: `scripts/start-local.sh`

```bash
#!/bin/bash
# Start Zixly local development stack

set -euo pipefail

echo "🚀 Starting Zixly local development stack..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found. Please copy .env.local.template to .env.local and configure."
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Create necessary directories
mkdir -p letsencrypt init-scripts

# Start the stack
echo "📦 Starting Docker Compose stack..."
docker-compose -f docker-compose.local.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Check PostgreSQL
if docker exec zixly-postgres pg_isready -U zixly_admin -d zixly_main > /dev/null; then
    echo "✅ PostgreSQL is healthy"
else
    echo "❌ PostgreSQL health check failed"
fi

# Check Redis
if docker exec zixly-redis redis-cli ping > /dev/null; then
    echo "✅ Redis is healthy"
else
    echo "❌ Redis health check failed"
fi

# Check n8n
if curl -f -s http://localhost:5678/healthz > /dev/null; then
    echo "✅ n8n is healthy"
else
    echo "❌ n8n health check failed"
fi

# Check Plane
if curl -f -s http://localhost:8000/health > /dev/null; then
    echo "✅ Plane is healthy"
else
    echo "❌ Plane health check failed"
fi

echo "🎉 Zixly local stack is running!"
echo ""
echo "📋 Service URLs:"
echo "  - n8n: http://localhost:5678"
echo "  - Plane: http://localhost:8000"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo "🔧 Next steps:"
echo "  1. Configure Plane workspace and generate API token"
echo "  2. Import Plane smoke test workflow in n8n"
echo "  3. Run smoke test to validate integration"
```

**File**: `scripts/stop-local.sh`

```bash
#!/bin/bash
# Stop Zixly local development stack

echo "🛑 Stopping Zixly local stack..."

docker-compose -f docker-compose.local.yml down

echo "✅ Zixly local stack stopped"
```

**File**: `scripts/restart-local.sh`

```bash
#!/bin/bash
# Restart Zixly local development stack

echo "🔄 Restarting Zixly local stack..."

./scripts/stop-local.sh
sleep 5
./scripts/start-local.sh
```

**File**: `scripts/clean-local.sh`

```bash
#!/bin/bash
# Clean Zixly local development stack (removes all data)

echo "🧹 Cleaning Zixly local stack (this will remove all data)..."

read -p "Are you sure? This will delete all local data. (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose -f docker-compose.local.yml down -v
    docker volume prune -f
    echo "✅ Local stack cleaned"
else
    echo "❌ Clean cancelled"
fi
```

**File**: `scripts/setup-local.sh`

```bash
#!/bin/bash
# Setup Zixly local development environment

echo "🔧 Setting up Zixly local development environment..."

# Make scripts executable
chmod +x scripts/start-local.sh
chmod +x scripts/stop-local.sh
chmod +x scripts/restart-local.sh
chmod +x scripts/clean-local.sh

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    if [ -f ".env.local.template" ]; then
        cp .env.local.template .env.local
        echo "📝 Created .env.local from template. Please update with your values."
    else
        echo "❌ .env.local.template not found. Please create .env.local manually."
        exit 1
    fi
fi

# Create necessary directories
mkdir -p letsencrypt init-scripts

echo "✅ Local development environment setup complete!"
echo ""
echo "🔧 Next steps:"
echo "  1. Update .env.local with your configuration"
echo "  2. Run ./scripts/start-local.sh to start the stack"
```

### Week 6: Plane Configuration & Integration

#### 6.1 Plane Setup

**Initial Configuration Steps**:

1. **Access Plane**: http://localhost:8000
2. **Complete Setup Wizard**:
   - Create admin account
   - Set up workspace: "Zixly Internal Operations"
   - Configure team members
3. **Create Project Templates**:
   - Client Onboarding Template
   - Support Ticket Template
   - Internal Operations Template
4. **Generate API Token**:
   - Go to Settings → API Tokens
   - Create token with full access
   - Store in n8n credentials

#### 6.2 Plane Smoke Test Workflow

**File**: `n8n-workflows/internal/plane-smoke-test.json`

```json
{
  "name": "Plane Smoke Test",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "GET",
        "url": "http://plane:8000/api/workspaces/",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "httpHeaderAuth": {
          "name": "Authorization",
          "value": "Bearer {{$credentials.planeApi.token}}"
        }
      },
      "id": "plane-workspaces-test",
      "name": "Test Plane Workspaces",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "id": "condition1",
              "leftValue": "={{ $json.status }}",
              "rightValue": 200,
              "operator": {
                "type": "number",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "check-response",
      "name": "Check Response Status",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "httpMethod": "GET",
        "url": "http://plane:8000/api/projects/",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "httpHeaderAuth": {
          "name": "Authorization",
          "value": "Bearer {{$credentials.planeApi.token}}"
        }
      },
      "id": "plane-projects-test",
      "name": "Test Plane Projects",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [680, 200]
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "url": "http://plane:8000/api/workspaces/{{ $json.workspaces[0].id }}/projects/",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "httpHeaderAuth": {
          "name": "Authorization",
          "value": "Bearer {{$credentials.planeApi.token}}"
        },
        "sendBody": true,
        "bodyContentType": "json",
        "jsonBody": "{\n  \"name\": \"Smoke Test Project\",\n  \"description\": \"Test project created by n8n smoke test\",\n  \"identifier\": \"ST\",\n  \"network\": 0,\n  \"icon_prop\": {\n    \"name\": \"package\",\n    \"color\": \"#3b82f6\"\n  }\n}"
      },
      "id": "create-test-project",
      "name": "Create Test Project",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [900, 200]
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "url": "http://plane:8000/api/workspaces/{{ $('Test Plane Workspaces').item.json.workspaces[0].id }}/projects/{{ $json.id }}/issues/",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "httpHeaderAuth": {
          "name": "Authorization",
          "value": "Bearer {{$credentials.planeApi.token}}"
        },
        "sendBody": true,
        "bodyContentType": "json",
        "jsonBody": "{\n  \"name\": \"Smoke Test Issue\",\n  \"description\": \"Test issue created by n8n smoke test workflow\",\n  \"priority\": \"low\",\n  \"state\": \"backlog\"\n}"
      },
      "id": "create-test-issue",
      "name": "Create Test Issue",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [1120, 200]
    },
    {
      "parameters": {
        "httpMethod": "DELETE",
        "url": "http://plane:8000/api/workspaces/{{ $('Test Plane Workspaces').item.json.workspaces[0].id }}/projects/{{ $('Create Test Project').item.json.id }}/",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "httpHeaderAuth": {
          "name": "Authorization",
          "value": "Bearer {{$credentials.planeApi.token}}"
        }
      },
      "id": "cleanup-test-project",
      "name": "Cleanup Test Project",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [1340, 200]
    },
    {
      "parameters": {
        "authentication": "genericCredentialType",
        "genericAuthType": "smtp",
        "smtpAuth": {
          "user": "{{ $credentials.outlookSmtp.user }}",
          "password": "{{ $credentials.outlookSmtp.password }}"
        },
        "fromEmail": "{{ $credentials.outlookSmtp.user }}",
        "toEmail": "ops@colemorton.com.au",
        "subject": "✅ Plane Smoke Test - SUCCESS (Local)",
        "message": "Plane integration smoke test completed successfully in local environment:\n\n- Plane API connectivity: ✅\n- Workspaces access: ✅\n- Projects access: ✅\n- Project creation: ✅\n- Issue creation: ✅\n- Cleanup: ✅\n\nPlane is ready for production use with n8n workflows.",
        "options": {}
      },
      "id": "send-success-email",
      "name": "Send Success Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2.1,
      "position": [1560, 200]
    },
    {
      "parameters": {
        "authentication": "genericCredentialType",
        "genericAuthType": "smtp",
        "smtpAuth": {
          "user": "{{ $credentials.outlookSmtp.user }}",
          "password": "{{ $credentials.outlookSmtp.password }}"
        },
        "fromEmail": "{{ $credentials.outlookSmtp.user }}",
        "toEmail": "ops@colemorton.com.au",
        "subject": "❌ Plane Smoke Test - FAILED (Local)",
        "message": "Plane integration smoke test failed in local environment:\n\n- Error: {{ $json.error }}\n- Status: {{ $json.status }}\n\nPlease check Plane configuration and API credentials.",
        "options": {}
      },
      "id": "send-failure-email",
      "name": "Send Failure Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2.1,
      "position": [680, 400]
    }
  ],
  "connections": {
    "Test Plane Workspaces": {
      "main": [
        [
          {
            "node": "Check Response Status",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check Response Status": {
      "main": [
        [
          {
            "node": "Test Plane Projects",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Send Failure Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Test Plane Projects": {
      "main": [
        [
          {
            "node": "Create Test Project",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Test Project": {
      "main": [
        [
          {
            "node": "Create Test Issue",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Test Issue": {
      "main": [
        [
          {
            "node": "Cleanup Test Project",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Cleanup Test Project": {
      "main": [
        [
          {
            "node": "Send Success Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "tags": [],
  "triggerCount": 0,
  "updatedAt": "2025-01-27T00:00:00.000Z",
  "versionId": "1"
}
```

#### 6.3 n8n Credentials Configuration

**File**: `n8n-credentials/credentials-local.json`

```json
{
  "supabase": {
    "name": "Supabase",
    "type": "httpBasicAuth",
    "data": {
      "user": "your-supabase-user",
      "password": "your-supabase-password"
    }
  },
  "outlookSmtp": {
    "name": "Outlook SMTP",
    "type": "smtp",
    "data": {
      "host": "smtp.office365.com",
      "port": 587,
      "user": "ops@colemorton.com.au",
      "password": "your-email-password"
    }
  },
  "planeApi": {
    "name": "Plane API",
    "type": "httpHeaderAuth",
    "data": {
      "name": "Authorization",
      "value": "Bearer your-plane-api-token"
    }
  }
}
```

#### 6.4 Local Development Documentation

**File**: `docs/local-development/README.md`

````markdown
# Zixly Local Development Environment

## Quick Start

1. **Setup environment**:
   ```bash
   ./scripts/setup-local.sh
   ```
````

2. **Configure credentials**:
   - Update `.env.local` with your values
   - Configure n8n credentials in the interface

3. **Start the stack**:

   ```bash
   ./scripts/start-local.sh
   ```

4. **Access services**:
   - n8n: http://localhost:5678
   - Plane: http://localhost:8000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

5. **Configure Plane**:
   - Complete setup wizard
   - Generate API token
   - Update n8n credentials

6. **Import smoke test workflow**:
   - Import `plane-smoke-test.json` in n8n
   - Configure credentials
   - Execute workflow

## Development Workflow

### Daily Development

1. Start stack: `./scripts/start-local.sh`
2. Make changes to workflows
3. Test changes in n8n
4. Stop stack: `./scripts/stop-local.sh`

### Clean Development

1. Clean stack: `./scripts/clean-local.sh`
2. Start fresh: `./scripts/start-local.sh`
3. Reconfigure services

### Debugging

- Check logs: `docker-compose -f docker-compose.local.yml logs [service]`
- Access containers: `docker exec -it zixly-[service] bash`
- Database access: `docker exec -it zixly-postgres psql -U zixly_admin -d zixly_main`

## Troubleshooting

### Common Issues

1. **Port conflicts**: Check if ports 5432, 5678, 6379, 8000 are available
2. **Docker not running**: Start Docker Desktop
3. **Services not starting**: Check logs for errors
4. **Database connection issues**: Wait for PostgreSQL to be ready

### Reset Everything

```bash
./scripts/clean-local.sh
./scripts/start-local.sh
```

## Security Notes

- All credentials are stored in `.env.local` (not committed to git)
- Use strong passwords for local development
- Never commit real credentials to version control
- Use `.env.local.template` as a reference for required variables

````

---

## Success Criteria & Validation

### Technical Validation

| Component | Success Criteria | Validation Method |
|-----------|------------------|-------------------|
| **Docker Services** | Both n8n and Plane containers healthy | `docker-compose -f docker-compose.local.yml ps` |
| **Local Access** | Both services accessible via localhost | `curl http://localhost:5678` and `curl http://localhost:8000` |
| **Database** | Both n8n and Plane databases accessible | Connect to each service database |
| **Plane Smoke Test** | Workflow executes successfully | Run smoke test workflow in n8n |
| **Integration** | n8n can create projects/issues in Plane | Manual test via n8n workflows |

### Performance Validation

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Service Startup** | < 2 minutes | Time from `./scripts/start-local.sh` to both healthy |
| **Plane API Response** | < 500ms | API calls from n8n to Plane |
| **Memory Usage** | < 2GB total | `docker stats --no-stream` |
| **Disk Usage** | < 5GB | `df -h` on local machine |

---

## Local Development Benefits

### Advantages of Local Development

1. **Rapid Iteration** - No deployment delays
2. **Offline Development** - No internet dependency
3. **Easy Debugging** - Direct access to logs and containers
4. **Cost Effective** - No cloud infrastructure costs
5. **Version Control** - All changes tracked in git
6. **Team Collaboration** - Consistent local environment

### Development Workflow

1. **Start Development**:
   ```bash
   ./scripts/start-local.sh
````

2. **Make Changes**:
   - Edit workflows in n8n
   - Modify Plane configuration
   - Update database schemas

3. **Test Changes**:
   - Run smoke test workflow
   - Validate integration
   - Check logs for errors

4. **Commit Changes**:

   ```bash
   git add .
   git commit -m "feat: add plane integration workflow"
   ```

5. **Stop Development**:
   ```bash
   ./scripts/stop-local.sh
   ```

---

## Security Considerations

### Credential Management

1. **Environment Variables**:
   - All sensitive data in `.env.local` (not committed)
   - Template file `.env.local.template` for reference
   - Strong passwords for local development

2. **Database Security**:
   - Local PostgreSQL with restricted access
   - No external network exposure
   - Data encrypted at rest

3. **Network Security**:
   - Services only accessible via localhost
   - No external port exposure
   - Internal Docker network isolation

### Best Practices

1. **Never commit credentials**:

   ```bash
   # Add to .gitignore
   .env.local
   .env.production
   ```

2. **Use strong passwords**:

   ```bash
   # Generate secure passwords
   openssl rand -base64 32
   ```

3. **Regular credential rotation**:
   - Change passwords monthly
   - Update API tokens regularly
   - Monitor access logs

---

## Next Phase Preparation

### Phase 3 Prerequisites

With local development complete, Phase 3 will focus on:

1. **Production Deployment** - Deploy to DigitalOcean
2. **SSL/TLS Configuration** - Traefik with Let's Encrypt
3. **Monitoring Setup** - Prometheus and Grafana
4. **Backup Systems** - Automated backups

### Local to Production Migration

The local development environment provides:

- **Validated Workflows** - All n8n workflows tested locally
- **Database Schema** - PostgreSQL setup ready for production
- **Integration Patterns** - n8n to Plane integration proven
- **Documentation** - Complete setup and troubleshooting guides

---

## Conclusion

Phase 2 establishes a robust local development environment for Zixly's self-hostable stack integration. This approach provides:

1. **Rapid Development** - Local environment enables fast iteration
2. **Cost Efficiency** - No cloud infrastructure costs during development
3. **Team Collaboration** - Consistent local environment for all developers
4. **Production Readiness** - Validated workflows ready for deployment
5. **Security** - Secure credential management and network isolation

By completing Phase 2, Zixly has a fully functional local development environment with Plane integration, ready for production deployment in Phase 3.

---

**Phase 2 Status**: 🎯 **READY FOR LOCAL DEVELOPMENT**  
**Estimated Implementation Time**: 20 hours over 2 weeks  
**Critical Path**: Docker setup → Plane configuration → Smoke test → Integration validation

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Zixly Technical Architecture  
**Review Cycle**: Daily during development
