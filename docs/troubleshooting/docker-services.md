# Docker Services Troubleshooting

**Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Technical Operations  
**Status**: Active Guide

---

## Overview

This guide helps resolve common Docker service issues when running the Zixly internal operations stack. It covers container startup failures, port conflicts, volume mounting problems, and service connectivity issues.

---

## Common Docker Service Issues

### Error: "Port already in use"

**Cause**: Another service is using the required port.

**Solutions**:

1. **Check port usage**:

   ```bash
   # Check what's using port 5678
   lsof -i :5678

   # Check all Zixly ports
   lsof -i :5678 -i :5432 -i :6379
   ```

2. **Stop conflicting services**:

   ```bash
   # Stop other Docker containers
   docker ps
   docker stop CONTAINER_NAME

   # Kill processes using ports
   sudo kill -9 PID
   ```

3. **Change port mapping**:
   ```yaml
   # docker-compose.pipeline services.yml
   ports:
     - '5679:5678' # Change host port
   ```

### Error: "Container failed to start"

**Cause**: Container startup configuration or resource issues.

**Solutions**:

1. **Check container logs**:

   ```bash
   # Check startup logs
   docker-compose -f docker-compose.pipeline services.yml logs pipeline services
   docker-compose -f docker-compose.pipeline services.yml logs postgres
   docker-compose -f docker-compose.pipeline services.yml logs redis
   ```

2. **Verify Docker resources**:

   ```bash
   # Check Docker system info
   docker system info

   # Check available resources
   docker system df
   ```

3. **Check Docker daemon status**:

   ```bash
   # Restart Docker if needed
   sudo systemctl restart docker

   # Check Docker status
   sudo systemctl status docker
   ```

### Error: "Volume mount failed"

**Cause**: Docker volume permissions or path issues.

**Solutions**:

1. **Check volume permissions**:

   ```bash
   # Check volume ownership
   ls -la /var/lib/docker/volumes/

   # Fix permissions if needed
   sudo chown -R $USER:$USER /var/lib/docker/volumes/
   ```

2. **Verify volume paths**:

   ```bash
   # Check if volumes exist
   docker volume ls | grep zixly

   # Inspect volume details
   docker volume inspect zixly_pipeline services_data
   ```

3. **Recreate volumes**:
   ```bash
   # Remove and recreate volumes
   docker-compose -f docker-compose.pipeline services.yml down -v
   docker-compose -f docker-compose.pipeline services.yml up -d
   ```

---

## Service Connectivity Issues

### pipeline services Service Not Accessible

**Symptoms**: Cannot access http://localhost:5678

**Troubleshooting Steps**:

1. **Check container status**:

   ```bash
   # Check if container is running
   docker-compose -f docker-compose.pipeline services.yml ps

   # Check container health
   docker inspect zixly-pipeline services | grep -A 5 "Health"
   ```

2. **Test connectivity**:

   ```bash
   # Test from host
   curl http://localhost:5678/healthz

   # Test from container
   docker exec zixly-pipeline services curl http://localhost:5678/healthz
   ```

3. **Check port mapping**:

   ```bash
   # Verify port is mapped correctly
   docker port zixly-pipeline services

   # Check if port is listening
   netstat -tlnp | grep 5678
   ```

### Database Connection Issues

**Symptoms**: pipeline services cannot connect to PostgreSQL

**Troubleshooting Steps**:

1. **Check PostgreSQL status**:

   ```bash
   # Check if PostgreSQL is running
   docker exec zixly-pipeline services-postgres pg_isready -U pipeline services

   # Check PostgreSQL logs
   docker-compose -f docker-compose.pipeline services.yml logs postgres
   ```

2. **Test database connectivity**:

   ```bash
   # Connect to database
   docker exec -it zixly-pipeline services-postgres psql -U pipeline services -d pipeline services

   # Test from pipeline services container
   docker exec zixly-pipeline services ping postgres
   ```

3. **Check network connectivity**:
   ```bash
   # Check Docker network
   docker network ls
   docker network inspect zixly-internal-network
   ```

### Redis Connection Issues

**Symptoms**: pipeline services cannot connect to Redis

**Troubleshooting Steps**:

1. **Check Redis status**:

   ```bash
   # Check if Redis is running
   docker exec zixly-pipeline services-redis redis-cli ping

   # Check Redis logs
   docker-compose -f docker-compose.pipeline services.yml logs redis
   ```

2. **Test Redis connectivity**:

   ```bash
   # Connect to Redis
   docker exec -it zixly-pipeline services-redis redis-cli

   # Test from pipeline services container
   docker exec zixly-pipeline services ping redis
   ```

---

## Performance and Resource Issues

### High Resource Usage

**Symptoms**: Slow performance, high CPU/memory usage

**Solutions**:

1. **Monitor resource usage**:

   ```bash
   # Check container resource usage
   docker stats

   # Check system resources
   top
   free -h
   df -h
   ```

2. **Optimize resource allocation**:

   ```yaml
   # docker-compose.pipeline services.yml
   deploy:
     resources:
       limits:
         memory: 2G
         cpus: '1.0'
       reservations:
         memory: 1G
         cpus: '0.5'
   ```

3. **Clean up unused resources**:

   ```bash
   # Remove unused containers
   docker container prune

   # Remove unused images
   docker image prune

   # Remove unused volumes
   docker volume prune
   ```

### Slow Startup Times

**Symptoms**: Services take long time to start

**Solutions**:

1. **Check startup dependencies**:

   ```yaml
   # Ensure proper dependency order
   depends_on:
     - postgres
     - redis
   ```

2. **Optimize image sizes**:

   ```bash
   # Check image sizes
   docker images | grep zixly

   # Use smaller base images if possible
   ```

3. **Check system resources**:
   ```bash
   # Monitor startup process
   docker-compose -f docker-compose.pipeline services.yml up --no-deps pipeline services
   ```

---

## Data Persistence Issues

### Data Not Persisting

**Symptoms**: Data lost after container restart

**Troubleshooting Steps**:

1. **Check volume mounting**:

   ```bash
   # Check if volumes are mounted
   docker inspect zixly-pipeline services | grep -A 10 "Mounts"

   # Check volume content
   docker exec zixly-pipeline services ls -la /home/node/.pipeline services/
   ```

2. **Verify volume configuration**:

   ```yaml
   # Ensure volumes are properly configured
   volumes:
     - pipeline services_data:/home/node/.pipeline services
     - postgres_data:/var/lib/postgresql/data
     - redis_data:/data
   ```

3. **Check volume permissions**:

   ```bash
   # Check volume permissions
   docker exec zixly-pipeline services ls -la /home/node/.pipeline services/

   # Fix permissions if needed
   docker exec zixly-pipeline services chown -R node:node /home/node/.pipeline services/
   ```

### Backup and Recovery

**Prevent Data Loss**:

1. **Regular backups**:

   ```bash
   # Backup pipeline services data
   docker run --rm -v zixly_pipeline services_data:/data -v $(pwd):/backup alpine tar czf /backup/pipeline services-backup-$(date +%Y%m%d).tar.gz -C /data .

   # Backup PostgreSQL data
   docker exec zixly-pipeline services-postgres pg_dump -U pipeline services pipeline services > pipeline services-db-backup-$(date +%Y%m%d).sql
   ```

2. **Test recovery procedures**:
   ```bash
   # Test backup restoration
   docker run --rm -v zixly_pipeline services_data:/data -v $(pwd):/backup alpine tar xzf /backup/pipeline services-backup-YYYYMMDD.tar.gz -C /data
   ```

---

## Network and Security Issues

### Network Connectivity Problems

**Symptoms**: Containers cannot communicate with each other

**Troubleshooting Steps**:

1. **Check Docker network**:

   ```bash
   # List Docker networks
   docker network ls

   # Inspect network configuration
   docker network inspect zixly-internal-network
   ```

2. **Test inter-container communication**:

   ```bash
   # Test from pipeline services to postgres
   docker exec zixly-pipeline services ping postgres

   # Test from pipeline services to redis
   docker exec zixly-pipeline services ping redis
   ```

3. **Check firewall settings**:

   ```bash
   # Check firewall status
   sudo ufw status

   # Check iptables rules
   sudo iptables -L
   ```

### Security Configuration

**Best Practices**:

1. **Use non-root users**:

   ```yaml
   # Run containers as non-root
   user: '1000:1000'
   ```

2. **Limit container privileges**:

   ```yaml
   # Remove unnecessary privileges
   security_opt:
     - no-new-privileges:true
   ```

3. **Use secrets for sensitive data**:
   ```yaml
   # Use Docker secrets instead of environment variables
   secrets:
     - db_password
   ```

---

## Diagnostic Commands

### Service Health Checks

```bash
# Check all service status
docker-compose -f docker-compose.pipeline services.yml ps

# Check service health
docker-compose -f docker-compose.pipeline services.yml exec pipeline services curl http://localhost:5678/healthz
docker-compose -f docker-compose.pipeline services.yml exec postgres pg_isready -U pipeline services
docker-compose -f docker-compose.pipeline services.yml exec redis redis-cli ping
```

### Resource Monitoring

```bash
# Monitor resource usage
docker stats --no-stream

# Check disk usage
docker system df

# Monitor logs in real-time
docker-compose -f docker-compose.pipeline services.yml logs -f
```

### Network Diagnostics

```bash
# Check network connectivity
docker exec zixly-pipeline services ping postgres
docker exec zixly-pipeline services ping redis

# Check port accessibility
netstat -tlnp | grep -E "(5678|5432|6379)"
```

---

## Prevention and Best Practices

### Regular Maintenance

1. **Monitor service health**:
   - Set up health checks
   - Monitor resource usage
   - Check log files regularly

2. **Keep services updated**:
   - Update Docker images regularly
   - Apply security patches
   - Monitor for vulnerabilities

3. **Backup data regularly**:
   - Automated backup scripts
   - Test backup restoration
   - Store backups securely

### Configuration Management

1. **Use version control**:
   - Track Docker Compose files
   - Document configuration changes
   - Maintain change history

2. **Environment separation**:
   - Separate dev/staging/prod environments
   - Use environment-specific configurations
   - Test changes in staging first

---

## Getting Help

### Self-Service Resources

1. **Check this troubleshooting guide**
2. **Review Docker logs and status**
3. **Test network connectivity**
4. **Monitor resource usage**

### When to Contact Support

Contact support if:

- **Services won't start** after troubleshooting
- **Data corruption** or loss occurs
- **Security issues** are identified
- **Performance problems** persist

### Support Information

- **Primary Contact**: Your Name (your_email@domain.com)
- **Documentation**: This troubleshooting guide
- **Logs Location**: Docker container logs and system logs

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Owner**: Zixly Technical Operations  
**Review Cycle**: Monthly
