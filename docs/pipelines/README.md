# Pipeline Specifications

This directory contains specifications for webhook-triggered pipeline jobs that process data from external APIs and generate insights for client projects.

## Available Pipelines

### [Trading API Strategy Sweep](./trading-api-strategy-sweep.md)

**Purpose**: Automated trading strategy backtesting pipeline that evaluates multiple trading strategies across different market conditions.

**Status**: Implemented  
**Integration**: Trading API webhook callbacks  
**Processing**: Async job queue (Redis/Bull)

**Key Features**:

- Multi-strategy backtesting
- Historical data analysis
- Performance metrics calculation
- Results stored in PostgreSQL + S3

### [LocalStack Testing Guide](./testing-localstack.md)

**Purpose**: Guide for testing AWS-dependent pipelines locally using LocalStack for zero-cost development.

**Status**: Active  
**Components**: S3, SQS, Secrets Manager emulation

### [SME Software Comparison](./sme-software-comparison.md)

**Purpose**: Analysis of SME business automation software options and integration patterns.

**Status**: Research/Planning

---

## Pipeline Architecture

All pipelines follow the webhook event-driven architecture:

1. **Webhook Receiver** - Accepts incoming webhooks from external APIs
2. **Job Queue** - Redis/Bull for async processing
3. **Pipeline Worker** - Processes jobs in background
4. **Result Storage** - PostgreSQL (metadata) + S3 (datasets)
5. **Dashboard** - Real-time monitoring UI

See [ADR-007: Webhook Event Architecture](../architecture/decisions/adr-007-webhook-event-architecture.md) for complete architecture details.

---

## Related Documentation

- [System Architecture](../architecture/system-architecture.md) - Overall technical architecture
- [Architecture Decisions](../architecture/decisions/) - ADRs for pipeline design
- [Local Development](../local-development/README.md) - Running pipelines locally
- [Operations Guide](../operations/internal-operations-guide.md) - Managing pipeline operations

---

**Last Updated**: 2025-10-25  
**Maintained By**: Zixly DevOps Team
