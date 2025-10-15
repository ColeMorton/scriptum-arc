# Scriptum Arc Documentation

This directory contains comprehensive documentation for the Scriptum Arc platform.

## Quick Links

- **[📖 Main Documentation](https://scriptumarc.github.io/scriptum-arc/)** - Full documentation site
- **[Product Requirements](./product/product-requirements-document.md)** - User stories and features
- **[System Architecture](./architecture/system-architecture.md)** - Technical architecture
- **[Financial Model](./financial/financial-projections-unit-economics.md)** - Business projections

## Documentation Structure

```
docs/
├── index.md                    # Main documentation landing page
├── product/                    # Product requirements and specifications
│   └── product-requirements-document.md
├── architecture/               # Technical architecture and design
│   ├── system-architecture.md
│   ├── database-schema-diagram.md
│   ├── database-migrations.md
│   ├── database-monitoring.md
│   ├── rag-strategy.md
│   └── row-level-security-policies.md
├── financial/                  # Business model and projections
│   └── financial-projections-unit-economics.md
├── sales/                      # Sales strategy and materials
│   └── sales-deck-demo-script.md
├── implementation/             # Development phases and roadmaps
│   ├── README.md
│   └── phase-1-data-foundation.md
├── concepts/                   # Business concepts and relationships
│   └── entity-relationship-explained.md
├── integrations/               # Integration documentation
│   ├── n8n-automation-workflows.md
│   └── sme-software-comparison.md
└── specs/                      # Technical specifications
    └── product-specification.md
```

## Contributing to Documentation

1. All documentation changes should be made in this `/docs` directory
2. Use clear, descriptive filenames
3. Include cross-references to related documents
4. Update the main index.md when adding new sections
5. Test all links before committing

## Documentation Standards

- **Markdown**: Use standard Markdown syntax
- **Links**: Use relative paths for internal links
- **Images**: Store in `/docs/assets/` directory
- **Versioning**: Include version information in document headers

## Key Documents by Role

### For Developers

- [System Architecture](./architecture/system-architecture.md) - Technical stack and design
- [Phase 1 Implementation](./implementation/phase-1-data-foundation.md) - Database and API setup
- [Database Schema](./architecture/database-schema-diagram.md) - Data model and relationships

### For Product Managers

- [Product Requirements](./product/product-requirements-document.md) - User stories and features
- [Product Specification](./specs/product-specification.md) - Product vision and scope

### For Business Stakeholders

- [Financial Projections](./financial/financial-projections-unit-economics.md) - Business model and unit economics
- [Sales Strategy](./sales/sales-deck-demo-script.md) - Go-to-market approach

### For Sales & Marketing

- [Sales Deck](./sales/sales-deck-demo-script.md) - Demo scripts and objection handling
- [SME Software Comparison](./integrations/sme-software-comparison.md) - Competitive analysis

## Documentation Maintenance

- **Review Cycle**: Quarterly or after major feature releases
- **Ownership**: Each document has a designated owner
- **Updates**: Documentation is updated alongside code changes
- **Quality**: All documents are reviewed for accuracy and completeness

---

**Last Updated**: 2025-01-27  
**Maintained By**: Scriptum Arc Development Team
