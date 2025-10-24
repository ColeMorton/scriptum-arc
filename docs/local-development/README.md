# Zixly Local Development Environment

## Quick Start

1. **Setup environment**:

   ```bash
   ./scripts/setup-local.sh
   ```

2. **Configure credentials**:
   - Update `.env.local` with your values
   - Configure pipeline services credentials in the interface

3. **Start the stack**:

   ```bash
   ./scripts/start-local.sh
   ```

4. **Access services**:
   - pipeline services: http://localhost:5678
   - Plane: http://localhost:8000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

5. **Configure Plane**:
   - Complete setup wizard
   - Generate API token
   - Update pipeline services credentials

6. **Import smoke test workflow**:
   - Import `plane-smoke-test.json` in pipeline services
   - Configure credentials
   - Execute workflow

## Development Workflow

### Daily Development

1. Start stack: `./scripts/start-local.sh`
2. Make changes to workflows
3. Test changes in pipeline services
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
- Use `env.local.template` as a reference for required variables
