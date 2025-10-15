# Scriptum Arc - Financial Projections & Unit Economics

**3-Year Financial Model for Premium BI SaaS Platform**

**Document Version**: 1.0
**Last Updated**: 2025-10-15
**Planning Horizon**: FY2026-FY2028
**Currency**: AUD

---

## Executive Summary

### Financial Overview (3-Year Projection)

| Metric | Year 1 (FY2026) | Year 2 (FY2027) | Year 3 (FY2028) |
|--------|-----------------|-----------------|-----------------|
| **Total Customers** | 18 | 42 | 78 |
| **MRR (End of Year)** | $30,600 | $72,200 | $134,800 |
| **ARR (End of Year)** | $367,200 | $866,400 | $1,617,600 |
| **Total Revenue** | $241,200 | $653,800 | $1,242,000 |
| **Gross Profit** | $193,500 | $555,225 | $1,075,530 |
| **Operating Expenses** | $212,400 | $273,700 | $361,950 |
| **EBITDA** | -$18,900 | $281,525 | $713,580 |
| **Net Profit** | -$18,900 | $281,525 | $713,580 |
| **Gross Margin** | 80.2% | 84.9% | 86.6% |
| **EBITDA Margin** | -7.8% | 43.1% | 57.5% |

### Key Unit Economics (Steady State)

| Metric | Value | Notes |
|--------|-------|-------|
| **Customer Acquisition Cost (CAC)** | $2,850 | Blended average across all tiers |
| **Lifetime Value (LTV)** | $38,880 | Based on 24-month avg. retention, $1,620 ARPU |
| **LTV:CAC Ratio** | 13.6:1 | Excellent (target >3:1) |
| **Payback Period** | 1.8 months | Time to recover CAC from gross profit |
| **Monthly Churn Rate** | 3.5% | Annual churn ~35% (typical SME SaaS) |
| **Net Revenue Retention (NRR)** | 92% | Accounts for churn + expansion |
| **Average Revenue Per Account (ARPA)** | $1,620/month | Weighted across tiers |

### Investment Requirements

**Total Capital Required**: $85,000 (Year 1 only)

- **Bootstrapped**: Founder equity + savings
- **Use of Funds**: Operating expenses during ramp-up (Months 1-9 until breakeven)
- **No external funding required**: Positive cash flow by Month 10

---

## Revenue Model

### Pricing Tiers (Monthly Recurring Revenue)

| Tier | Monthly Price | Setup Fee (One-Time) | Target Customer Profile |
|------|---------------|----------------------|-------------------------|
| **Starter** | $1,200 | $2,500 | $1-2M revenue, 3 integrations, 1 dashboard |
| **Professional** | $1,800 | $2,500 | $2-5M revenue, 8 integrations, 2 dashboards |
| **Enterprise** | $3,500 | $4,000 | $5M+ revenue, unlimited integrations/dashboards |

### Revenue Assumptions

**Customer Acquisition Cadence (Monthly)**

| Month | New Customers | Cumulative Customers | MRR Added | Cumulative MRR |
|-------|---------------|---------------------|-----------|----------------|
| 1 | 0 | 0 | $0 | $0 |
| 2 | 1 | 1 | $1,200 | $1,200 |
| 3 | 1 | 2 | $1,200 | $2,400 |
| 4 | 2 | 4 | $2,400 | $4,800 |
| 5 | 2 | 6 | $3,000 | $7,800 |
| 6 | 2 | 8 | $3,600 | $11,400 |
| 7 | 2 | 10 | $3,600 | $15,000 |
| 8 | 2 | 12 | $3,600 | $18,600 |
| 9 | 2 | 14 | $3,600 | $22,200 |
| 10 | 2 | 16 | $3,600 | $25,800 |
| 11 | 2 | 18 | $3,600 | $29,400 |
| 12 | 2 | 20 | $3,600 | $33,000 |

**Churn Assumptions**:
- Churn begins Month 7 (after first cohort reaches 6-month mark)
- 3.5% monthly churn rate (~35% annually, typical for SME SaaS)
- Net new customers = New signups - Churned customers

**Tier Distribution**:
- Starter: 40% of customers
- Professional: 50% of customers (most popular)
- Enterprise: 10% of customers

**Weighted Average MRR per Customer**: $1,620

### Year 1 Revenue Breakdown

| Revenue Stream | Q1 | Q2 | Q3 | Q4 | Year 1 Total |
|----------------|-----|-----|-----|-----|--------------|
| **Monthly Subscriptions (MRR)** | $3,600 | $23,400 | $57,000 | $87,000 | $171,000 |
| **Setup Fees (One-Time)** | $5,000 | $12,500 | $12,500 | $12,500 | $42,500 |
| **Integration Changes** | $0 | $2,500 | $7,500 | $10,200 | $20,200 |
| **Dashboard Add-Ons** | $0 | $1,500 | $3,000 | $3,000 | $7,500 |
| **Total Revenue** | $8,600 | $39,900 | $80,000 | $112,700 | $241,200 |

**Average Contract Value (ACV)**: $1,620 × 12 = $19,440 + $2,500 setup = **$21,940 first year**

### Year 2-3 Growth Assumptions

**Year 2**:
- Customer base grows from 18 to 42 (133% growth)
- MRR grows from $30,600 to $72,200
- Churn stabilizes at 3.5% monthly
- Tier mix shifts toward Professional/Enterprise (35% Starter, 50% Pro, 15% Enterprise)
- Setup fees: 24 new customers × $2,500 avg = $60,000
- Total Revenue: $653,800

**Year 3**:
- Customer base grows from 42 to 78 (86% growth)
- MRR grows from $72,200 to $134,800
- Churn remains at 3.5% monthly
- Tier mix: 30% Starter, 50% Professional, 20% Enterprise
- Setup fees: 36 new customers × $2,500 avg = $90,000
- Total Revenue: $1,242,000

---

## Cost Structure

### Cost of Goods Sold (COGS)

| Expense Category | Year 1 | Year 2 | Year 3 | Notes |
|------------------|--------|--------|--------|-------|
| **Infrastructure (Supabase)** | $3,600 | $9,600 | $18,000 | Scales with data volume |
| **Hosting (Vercel)** | $4,800 | $7,200 | $9,600 | Pro plan + bandwidth |
| **n8n Infrastructure** | $3,600 | $4,800 | $6,000 | VPS for self-hosted n8n |
| **Third-Party API Costs** | $2,400 | $6,000 | $12,000 | Xero, HubSpot, etc. usage fees |
| **Email/Communications (SendGrid)** | $600 | $1,200 | $1,800 | Transactional emails, alerts |
| **Monitoring & Security** | $2,400 | $3,600 | $4,800 | DataDog, Sentry, CloudFlare |
| **Data Storage & Backups** | $1,200 | $2,400 | $3,600 | S3/equivalent for backups |
| **Support Tools (Slack, Notion)** | $1,200 | $1,800 | $2,400 | Customer communication |
| **SSL Certificates & Domain** | $300 | $300 | $300 | Annual renewals |
| **Payment Processing (Stripe)** | $7,200 | $19,614 | $37,260 | 2.9% + $0.30 per transaction |
| **Subtotal: Variable COGS** | $27,300 | $56,514 | $95,760 | |
| **Implementation Labor (Allocated)** | $20,400 | $42,061 | $70,710 | 40 hrs/customer × $30/hr loaded cost |
| **Total COGS** | $47,700 | $98,575 | $166,470 | |

**Gross Profit**: Revenue - COGS
- Year 1: $241,200 - $47,700 = **$193,500** (80.2% margin)
- Year 2: $653,800 - $98,575 = **$555,225** (84.9% margin)
- Year 3: $1,242,000 - $166,470 = **$1,075,530** (86.6% margin)

### Operating Expenses (OpEx)

| Expense Category | Year 1 | Year 2 | Year 3 | Notes |
|------------------|--------|--------|--------|-------|
| **Founder Salary** | $120,000 | $140,000 | $160,000 | Below-market initially |
| **Superannuation** | $13,200 | $15,400 | $17,600 | 11% of salary |
| **Insurance (Professional Indemnity, Cyber)** | $4,800 | $6,000 | $8,000 | Increases with revenue |
| **Accounting & Legal** | $6,000 | $8,000 | $10,000 | Annual tax, compliance |
| **Marketing & Advertising** | $36,000 | $48,000 | $60,000 | Google Ads, LinkedIn, content |
| **Sales Tools (CRM, LinkedIn Sales Nav)** | $3,600 | $4,800 | $6,000 | HubSpot, sales automation |
| **Professional Development** | $3,000 | $4,000 | $5,000 | Conferences, courses |
| **Office & Equipment** | $6,000 | $8,000 | $10,000 | Laptop, monitors, software licenses |
| **Travel (Client Meetings)** | $4,800 | $9,600 | $15,600 | Domestic flights, accommodation |
| **Contingency (10%)** | $15,000 | $19,900 | $29,750 | Unexpected costs |
| **Total OpEx** | $212,400 | $273,700 | $361,950 | |

### Total Expenses

| Year | COGS | OpEx | Total Expenses |
|------|------|------|----------------|
| **Year 1** | $47,700 | $212,400 | $260,100 |
| **Year 2** | $98,575 | $273,700 | $372,275 |
| **Year 3** | $166,470 | $361,950 | $528,420 |

---

## Profitability Analysis

### Income Statement (3-Year Projection)

| Line Item | Year 1 (FY2026) | Year 2 (FY2027) | Year 3 (FY2028) |
|-----------|-----------------|-----------------|-----------------|
| **Total Revenue** | $241,200 | $653,800 | $1,242,000 |
| **Less: COGS** | -$47,700 | -$98,575 | -$166,470 |
| **Gross Profit** | $193,500 | $555,225 | $1,075,530 |
| **Gross Margin %** | 80.2% | 84.9% | 86.6% |
| | | | |
| **Operating Expenses** | -$212,400 | -$273,700 | -$361,950 |
| **EBITDA** | -$18,900 | $281,525 | $713,580 |
| **EBITDA Margin %** | -7.8% | 43.1% | 57.5% |
| | | | |
| **Depreciation & Amortization** | $0 | $0 | $0 |
| **EBIT** | -$18,900 | $281,525 | $713,580 |
| | | | |
| **Interest Expense** | $0 | $0 | $0 |
| **Tax (25% corporate rate)** | $0 | -$70,381 | -$178,395 |
| **Net Profit** | -$18,900 | $211,144 | $535,185 |
| **Net Margin %** | -7.8% | 32.3% | 43.1% |

### Cash Flow Projections

| Category | Year 1 | Year 2 | Year 3 |
|----------|--------|--------|--------|
| **Cash Inflows** | | | |
| Subscription Revenue | $171,000 | $613,800 | $1,152,000 |
| Setup Fees | $42,500 | $60,000 | $90,000 |
| Professional Services | $27,700 | $40,000 | $60,000 |
| **Total Cash Inflows** | $241,200 | $713,800 | $1,302,000 |
| | | | |
| **Cash Outflows** | | | |
| COGS (Variable) | -$27,300 | -$56,514 | -$95,760 |
| Implementation Labor | -$20,400 | -$42,061 | -$70,710 |
| Operating Expenses | -$212,400 | -$273,700 | -$361,950 |
| Tax Payments | $0 | -$70,381 | -$178,395 |
| **Total Cash Outflows** | -$260,100 | -$442,656 | -$706,815 |
| | | | |
| **Net Cash Flow** | -$18,900 | $271,144 | $595,185 |
| **Cumulative Cash** | -$18,900 | $252,244 | $847,429 |

**Breakeven Month**: Month 10 (October Year 1)
- MRR reaches ~$21,666 (covering monthly COGS + OpEx)
- Cumulative cash flow turns positive

**Funding Requirement**: $85,000 initial capital
- Covers $18,900 Year 1 loss + $66,100 buffer for working capital
- No additional funding required; cash-flow positive from Year 2 onward

---

## Unit Economics Deep-Dive

### Customer Acquisition Cost (CAC)

**Calculation**: Total Sales & Marketing Spend ÷ Number of New Customers

**Year 1 CAC Calculation**:
- Marketing & Advertising: $36,000
- Sales Tools: $3,600
- Founder Time Allocated to Sales (30%): $39,960
- Travel (Sales Meetings): $4,800
- **Total Sales & Marketing**: $84,360
- **New Customers (Year 1)**: 24 (accounting for churn, net 18)
- **CAC**: $84,360 ÷ 24 = **$3,515**

**Blended CAC (Steady State, Year 2-3)**: $2,850
- Improved efficiency as processes mature
- Content marketing begins generating inbound leads (lower cost)
- Referrals from satisfied customers (zero cost)

### Customer Lifetime Value (LTV)

**Calculation**: (Average Revenue Per Account × Gross Margin) ÷ Monthly Churn Rate

**Assumptions**:
- Average Revenue Per Account (ARPA): $1,620/month
- Gross Margin: 85% (steady state)
- Monthly Churn Rate: 3.5%
- Average Customer Lifetime: 28.6 months (1 ÷ 0.035)

**LTV Calculation**:
- Monthly Gross Profit per Customer: $1,620 × 0.85 = $1,377
- Customer Lifetime: 28.6 months
- **LTV**: $1,377 × 28.6 = **$39,382**

**Alternative LTV (Conservative)**:
- If ARPA = $1,500, Gross Margin = 82%, Churn = 4%
- LTV = ($1,500 × 0.82) ÷ 0.04 = **$30,750**

### LTV:CAC Ratio

**Optimal Scenario**: $39,382 ÷ $2,850 = **13.8:1**

**Conservative Scenario**: $30,750 ÷ $3,515 = **8.7:1**

**Industry Benchmarks**:
- <3:1 = Unsustainable
- 3:1 to 5:1 = Healthy for growth-stage SaaS
- >5:1 = Excellent unit economics

**Scriptum Arc**: 8.7:1 to 13.8:1 = **Excellent**

### Payback Period

**Calculation**: CAC ÷ (Monthly Revenue per Customer × Gross Margin)

**Payback Period**: $2,850 ÷ ($1,620 × 0.85) = **2.1 months**

**Industry Benchmarks**:
- <12 months = Excellent
- 12-18 months = Good
- >18 months = Concerning

**Scriptum Arc**: 2.1 months = **Excellent** (immediate cash recovery)

### Monthly Recurring Revenue (MRR) Movements

**MRR Components**:
- **New MRR**: Revenue from new customers
- **Expansion MRR**: Upgrades (Starter → Professional → Enterprise)
- **Contraction MRR**: Downgrades
- **Churned MRR**: Lost customers

**Year 1 MRR Movement (Example Month 12)**:
- Starting MRR (Month 11): $29,400
- New MRR: 2 customers × $1,620 avg = $3,240
- Expansion MRR: 1 upgrade (Starter → Pro) = $600
- Contraction MRR: 0
- Churned MRR: 1 customer × $1,200 = -$1,200
- **Ending MRR (Month 12)**: $32,040

**Net MRR Growth Rate**: ($32,040 - $29,400) ÷ $29,400 = **9% monthly growth**

### Net Revenue Retention (NRR)

**Calculation**: (Starting MRR + Expansion - Contraction - Churn) ÷ Starting MRR

**Year 2 NRR Calculation**:
- Starting Cohort MRR (Year 1): $30,600
- Expansion MRR (Upgrades): $4,200
- Churned MRR: -$10,710 (35% annual churn)
- **Ending MRR from Year 1 Cohort**: $24,090
- **NRR**: $24,090 ÷ $30,600 = **78.7%**

**Industry Context**:
- SaaS companies with NRR >100% are growing without new customers
- SME SaaS typically has NRR of 85-95% due to higher churn
- Scriptum Arc Year 2 NRR of 78.7% is **below target**

**Improvement Strategies** (to reach 90%+ NRR):
1. Reduce churn through quarterly business reviews (QBRs)
2. Increase expansion revenue via dashboard add-ons and tier upgrades
3. Introduce annual contracts with discounts (locks in customers, reduces churn)
4. Implement customer success playbooks (proactive value delivery)

---

## Scenario Analysis

### Best-Case Scenario

**Assumptions**:
- Customer acquisition 25% higher than base case
- Churn reduced to 2.5% monthly (30% annually)
- 20% of customers upgrade to higher tier annually

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| **Customers (End of Year)** | 23 | 58 | 118 |
| **MRR (End of Year)** | $39,780 | $102,900 | $209,480 |
| **Total Revenue** | $298,500 | $874,200 | $1,893,600 |
| **Net Profit** | $12,400 | $412,850 | $1,048,320 |
| **LTV:CAC Ratio** | 18.2:1 | 19.5:1 | 20.1:1 |

### Worst-Case Scenario

**Assumptions**:
- Customer acquisition 30% lower than base case
- Churn increases to 5% monthly (46% annually)
- No tier upgrades; 10% of customers downgrade

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| **Customers (End of Year)** | 12 | 24 | 42 |
| **MRR (End of Year)** | $19,440 | $38,880 | $68,040 |
| **Total Revenue** | $156,800 | $364,320 | $625,680 |
| **Net Profit** | -$68,500 | $8,245 | $144,530 |
| **LTV:CAC Ratio** | 4.2:1 | 5.8:1 | 6.9:1 |

**Implications**:
- Worst-case still achieves profitability by Year 2
- Even at reduced scale, unit economics remain viable (LTV:CAC >3:1)
- Lower revenue requires tighter cost control (reduce OpEx by 15-20%)

### Most-Likely Scenario (Base Case)

**As presented in main projections**:
- 18 customers Year 1, 42 Year 2, 78 Year 3
- Breakeven Month 10
- Profitable from Year 2 onward
- No external funding required

---

## Key Performance Indicators (KPIs)

### Financial KPIs

| KPI | Year 1 Target | Year 2 Target | Year 3 Target | Measurement Frequency |
|-----|---------------|---------------|---------------|----------------------|
| **MRR Growth Rate** | 15% monthly avg | 10% monthly avg | 8% monthly avg | Monthly |
| **ARR** | $367,200 | $866,400 | $1,617,600 | Quarterly |
| **Gross Margin** | 80%+ | 84%+ | 86%+ | Monthly |
| **EBITDA Margin** | -7.8% (acceptable) | 43%+ | 57%+ | Quarterly |
| **CAC Payback Period** | <3 months | <2.5 months | <2 months | Quarterly |
| **LTV:CAC Ratio** | >8:1 | >10:1 | >12:1 | Quarterly |
| **Cash Runway** | 6+ months | N/A (profitable) | N/A (profitable) | Monthly |

### Customer KPIs

| KPI | Year 1 Target | Year 2 Target | Year 3 Target | Measurement Frequency |
|-----|---------------|---------------|---------------|----------------------|
| **Net New Customers** | 24 | 36 | 48 | Monthly |
| **Monthly Churn Rate** | 3.5% | 3.0% | 2.5% | Monthly |
| **Annual Churn Rate** | 35% | 31% | 26% | Annual |
| **Net Revenue Retention** | 85% | 90% | 95% | Annual |
| **Customer Satisfaction (NPS)** | 50+ | 60+ | 70+ | Quarterly |
| **Average Deal Size (ACV)** | $21,940 | $24,134 | $26,547 | Quarterly |

### Operational KPIs

| KPI | Target | Measurement Frequency |
|-----|--------|----------------------|
| **Implementation Time** | <21 days (3 weeks) | Per customer |
| **Support Response Time** | <4 hours (business hours) | Daily |
| **System Uptime** | >99.9% | Monthly |
| **Data Sync Failure Rate** | <1% | Weekly |
| **Customer Onboarding Completion** | >95% | Monthly |

---

## Risk Analysis & Mitigation

### Revenue Risks

**Risk 1: Higher-than-expected churn**
- **Impact**: Reduces LTV, increases CAC payback period, slows MRR growth
- **Mitigation**:
  - Implement customer success program (QBRs, proactive support)
  - Offer annual contracts with 15% discount (locks in customers)
  - Build churn prediction model (identify at-risk customers early)
  - Add product features that increase stickiness (saved reports, custom alerts)

**Risk 2: Slower customer acquisition**
- **Impact**: Delays profitability, extends cash runway requirements
- **Mitigation**:
  - Diversify lead generation (content marketing, partnerships, referrals)
  - Reduce CAC through inbound marketing (SEO, LinkedIn thought leadership)
  - Pilot channel partnerships with accountants (referral fees)
  - Offer pilot programs to reduce purchase friction

**Risk 3: Pricing pressure / inability to charge premium rates**
- **Impact**: Lower ARPA, compressed margins, reduced profitability
- **Mitigation**:
  - Emphasize bespoke value in positioning (not competing on price)
  - Demonstrate ROI clearly (case studies, calculators)
  - Bundle additional services (strategy consulting, annual health checks)
  - Target less price-sensitive segments (professional services, construction)

### Cost Risks

**Risk 4: Infrastructure costs scale faster than expected**
- **Impact**: COGS increase, gross margin compression
- **Mitigation**:
  - Negotiate volume discounts with Supabase/Vercel at customer milestones
  - Architect for efficiency (query optimization, caching strategies)
  - Monitor unit costs monthly (cost per customer)
  - Consider reserved instances or annual commitments for predictable savings

**Risk 5: Implementation time exceeds estimates**
- **Impact**: Reduced throughput (fewer customers per month), higher labor costs
- **Mitigation**:
  - Standardize implementation playbooks
  - Build reusable dashboard templates by industry
  - Automate integration setup (OAuth flows, schema mapping)
  - Qualify customers better (reject overly complex edge cases early)

### Market Risks

**Risk 6: Competitive response (incumbents drop prices or new entrants)**
- **Impact**: Pricing pressure, differentiation challenges
- **Mitigation**:
  - Focus on bespoke positioning (hard to commoditize)
  - Build proprietary IP (custom n8n workflows, industry templates)
  - Lock in customers with high switching costs (integrated workflows)
  - Expand into adjacent services (BI consulting, data strategy)

**Risk 7: Integration partners change APIs or pricing**
- **Impact**: Development work required, potential COGS increases
- **Mitigation**:
  - Diversify integration portfolio (don't over-rely on one API)
  - Build abstraction layer (easier to swap integrations)
  - Monitor partner roadmaps and maintain relationships
  - Pass through API cost increases to customers (contractual provision)

### Operational Risks

**Risk 8: Solo operator dependency (founder burnout or unavailability)**
- **Impact**: Customer support suffers, sales pipeline stalls, churn increases
- **Mitigation**:
  - Document all processes (implementation, support, sales)
  - Automate repetitive tasks (onboarding emails, data syncs, alerts)
  - Hire part-time contractor at 20 customers for overflow support
  - Plan for first full-time hire at 40 customers (customer success role)

---

## Capital Requirements & Funding Strategy

### Initial Capital Required: $85,000

**Use of Funds**:
1. **Operating Expenses (Months 1-9)**: $159,300
2. **Initial Infrastructure Setup**: $5,000
3. **Marketing Launch Campaign**: $10,000
4. **Working Capital Buffer**: $10,700

**Funding Sources**:
- **Founder Equity/Savings**: $85,000 (bootstrapped)
- **No debt or external equity** required

### Path to Profitability

- **Month 10**: Operational breakeven (MRR covers monthly expenses)
- **Month 12**: Cumulative cash flow positive
- **Year 2**: EBITDA positive ($281,525)
- **Year 3**: Strong profitability ($713,580 EBITDA, 57.5% margin)

### Growth Funding Options (Optional, Year 2+)

If pursuing aggressive growth in Year 2-3, consider:

**Option 1: Revenue-Based Financing**
- Borrow $200k at 1.3-1.5x repayment (total $260-300k)
- Repay 5-8% of monthly revenue until repaid
- Use funds for: Sales team hire, expanded marketing, product development
- **Pros**: No equity dilution, fast access
- **Cons**: Cost of capital (~15-20% APR equivalent), repayment burden

**Option 2: Angel/Seed Investment**
- Raise $300-500k at $2-3M pre-money valuation (10-20% dilution)
- Use funds for: Team expansion (sales, customer success, dev), market expansion
- **Pros**: Mentorship, network access, runway extension
- **Cons**: Equity dilution, investor management overhead

**Option 3: Strategic Partnerships**
- Partner with Xero, MYOB, or HubSpot for co-marketing
- Leverage their customer base for distribution
- Potential for partnership fees or rev-share agreements
- **Pros**: Low-cost customer acquisition, credibility boost
- **Cons**: Dependency on partner priorities, rev-share reduces margins

**Recommended Approach**: Bootstrap through Year 2, reassess in Q4 FY2027 based on growth trajectory

---

## Sensitivity Analysis

### Key Drivers of Profitability

| Variable | Base Case | Change | Impact on Year 3 EBITDA | Sensitivity |
|----------|-----------|--------|-------------------------|-------------|
| **Monthly Churn Rate** | 3.5% | +1% (to 4.5%) | -$142,716 (-20%) | **High** |
| **ARPA** | $1,620 | -10% (to $1,458) | -$124,200 (-17.4%) | **High** |
| **Customer Acquisition Rate** | 4/month avg | -25% (to 3/month) | -$178,395 (-25%) | **High** |
| **CAC** | $2,850 | +30% (to $3,705) | -$30,780 (-4.3%) | **Low** |
| **Gross Margin** | 86.6% | -5% (to 81.6%) | -$62,100 (-8.7%) | **Medium** |
| **Infrastructure Costs** | $95,760 | +50% (to $143,640) | -$47,880 (-6.7%) | **Low** |

**Insights**:
- **Churn** is the highest-leverage variable; reducing churn by 1% adds $142k to EBITDA
- **Customer acquisition rate** and **ARPA** are also critical drivers
- **CAC** and **infrastructure costs** have lower impact (business model is resilient to cost fluctuations)

### Break-Even Analysis

**Question**: At what customer count does Scriptum Arc become profitable?

**Fixed Costs (Monthly)**:
- Founder Salary + Super: $11,100
- Marketing: $3,000
- Sales Tools: $300
- Insurance: $400
- Accounting: $500
- Office: $500
- Other OpEx: $1,200
- **Total Fixed Costs**: $17,000/month

**Variable Costs per Customer (Monthly)**:
- Infrastructure: $20
- API Fees: $15
- Support Tools: $5
- Payment Processing: ~$47 (2.9% of $1,620)
- **Total Variable Costs**: $87/customer/month

**Contribution Margin per Customer**:
- Revenue per Customer: $1,620
- Variable Costs per Customer: $87
- **Contribution Margin**: $1,533/customer/month

**Breakeven Customer Count**:
- $17,000 ÷ $1,533 = **11.1 customers**

**Conclusion**: Scriptum Arc becomes operationally profitable at 12 customers (Month 8 in base case projection)

---

## Benchmarking Against SaaS Industry Standards

### Scriptum Arc vs. SaaS Benchmarks

| Metric | Scriptum Arc (Year 3) | SaaS Industry Benchmark | Assessment |
|--------|----------------------|------------------------|------------|
| **Gross Margin** | 86.6% | 70-80% | ✅ Excellent |
| **EBITDA Margin** | 57.5% | 20-30% (mature SaaS) | ✅ Excellent |
| **LTV:CAC Ratio** | 13.6:1 | 3:1 to 5:1 | ✅ Excellent |
| **CAC Payback Period** | 1.8 months | 12-18 months | ✅ Excellent |
| **Monthly Churn Rate** | 3.5% | 3-7% (SMB SaaS) | ✅ Good |
| **Net Revenue Retention** | 92% | 100-120% (best-in-class) | ⚠️ Below target |
| **Annual Growth Rate** | 90% (Y2-Y3) | 40-60% (growth stage) | ✅ Excellent |
| **Rule of 40** | 147% (90% growth + 57% margin) | >40% is healthy | ✅ Exceptional |

**Overall Assessment**: Scriptum Arc demonstrates **exceptional unit economics** with margins and efficiency metrics significantly above industry benchmarks. The primary area for improvement is **Net Revenue Retention** (target >100% through reduced churn and increased expansion revenue).

---

## Financial Milestones & Success Metrics

### Year 1 Milestones

| Milestone | Target Date | Success Criteria | Status |
|-----------|-------------|------------------|--------|
| **First Customer** | Month 2 | Starter tier customer live | 🎯 |
| **$10k MRR** | Month 6 | 6-7 customers, recurring revenue established | 🎯 |
| **Operational Breakeven** | Month 10 | MRR covers monthly COGS + OpEx | 🎯 |
| **20 Customers** | Month 12 | Customer base sufficient for product-market fit validation | 🎯 |
| **Positive Cash Flow** | Month 12 | Cumulative cash flow positive, no additional funding needed | 🎯 |

### Year 2 Milestones

| Milestone | Target Date | Success Criteria |
|-----------|-------------|------------------|
| **$50k MRR** | Q2 Year 2 | Scaling velocity confirmed |
| **First Enterprise Customer** | Q2 Year 2 | Upmarket validation |
| **40 Customers** | Q4 Year 2 | 2x customer base growth |
| **$600k ARR** | Q4 Year 2 | Approaching 7-figure revenue run rate |
| **First Contractor Hire** | Q3 Year 2 | Scale beyond solo operation |

### Year 3 Milestones

| Milestone | Target Date | Success Criteria |
|-----------|-------------|------------------|
| **$100k MRR** | Q3 Year 3 | $1.2M ARR run rate |
| **75 Customers** | Q4 Year 3 | Diversified customer base |
| **$700k EBITDA** | Q4 Year 3 | Strong profitability, optionality for growth investments |
| **<2.5% Monthly Churn** | Q4 Year 3 | Customer retention excellence |
| **First Full-Time Hire** | Q2 Year 3 | Team expansion to support growth |

---

## Exit Scenarios & Business Valuation

### Potential Exit Strategies (Year 5-7)

**Option 1: Strategic Acquisition**
- **Acquirers**: Xero, MYOB, HubSpot, Intuit, or Australian accounting firms (BDO, Grant Thornton)
- **Rationale**: Scriptum Arc provides complementary BI capabilities to core accounting/CRM products
- **Valuation Multiple**: 4-6x ARR (typical for profitable SaaS with strong unit economics)
- **Example**: At $2.5M ARR in Year 5, valuation = $10-15M

**Option 2: Private Equity Buyout**
- **Acquirers**: Australian SMB-focused PE firms (eg. Next Capital, Odyssey)
- **Rationale**: Predictable recurring revenue, high margins, consolidation opportunity
- **Valuation Multiple**: 6-8x EBITDA
- **Example**: At $1.2M EBITDA in Year 5, valuation = $7.2-9.6M

**Option 3: Lifestyle Business (No Exit)**
- **Strategy**: Continue as solo operator or small team, optimize for profitability over growth
- **Annual Distributions**: $700k+ (Year 3), scaling to $1-2M+ (Year 5+)
- **Founder Benefit**: Flexibility, autonomy, no investor/acquirer obligations

**Option 4: Management Buyout / Succession**
- **Strategy**: Hire GM/COO in Year 4-5, transition to advisory role, sell equity over time
- **Structure**: Seller financing or earnout over 3-5 years
- **Founder Benefit**: Gradual exit, ongoing passive income

### Valuation Scenarios (End of Year 3)

| Scenario | Valuation Method | Multiple | Estimated Valuation |
|----------|------------------|----------|---------------------|
| **Conservative** | 3x ARR | 3x $1,617,600 | $4,852,800 |
| **Base Case** | 5x ARR | 5x $1,617,600 | $8,088,000 |
| **Optimistic** | 8x EBITDA | 8x $713,580 | $5,708,640 |
| **Best Case** | 6x ARR | 6x $1,617,600 | $9,705,600 |

**Expected Range**: $5-10M by end of Year 3, assuming continued growth and profitability

---

## Appendix: Detailed Assumptions

### Customer Acquisition Assumptions

- **Lead Generation Channels**: Google Ads (40%), LinkedIn (30%), Referrals (20%), Content/SEO (10%)
- **Sales Conversion Rate**: 25% (1 in 4 qualified leads convert)
- **Average Sales Cycle**: 21 days (discovery call → demo → proposal → signature)
- **Implementation Capacity**: 2-3 customers per month (solo operator limit)

### Retention & Expansion Assumptions

- **Churn Triggers**: Business closure (40%), budget cuts (30%), switching to in-house (20%), dissatisfaction (10%)
- **Expansion Path**: Starter → Professional (25% of Starter customers upgrade in Year 1), Professional → Enterprise (15% upgrade in Year 2)
- **Dashboard Add-Ons**: 30% of customers purchase additional dashboard ($1,500 one-time) in first 12 months

### Technology Cost Assumptions

- **Supabase**: $25/month base + $10/GB data + $5/month per 100k API requests
- **Vercel**: $20/month Pro + $40/month avg bandwidth overages
- **n8n Hosting**: $40/month DigitalOcean Droplet (4GB RAM)
- **API Costs**: Xero API ($50/month per customer), HubSpot free tier (< 1M requests/month), others $5-15/customer/month

### Labor Assumptions

- **Implementation Time**: 40 hours per customer (integration + dashboard build + training)
- **Support Time**: 2 hours per customer per month (ongoing maintenance, questions)
- **Sales Time**: 5 hours per customer (discovery, demo, proposal, contracting)
- **Founder Hourly Rate (Loaded)**: $60/hour for labor allocation calculations

---

**End of Financial Projections Document**

**Next Steps**:
1. Review and validate assumptions with market research
2. Build dynamic financial model in Google Sheets (linked to actuals for variance tracking)
3. Establish monthly KPI dashboard for real-time performance monitoring
4. Conduct quarterly variance analysis and re-forecast as needed

**Document Owner**: Founder / CEO
**Review Frequency**: Quarterly
**Last Updated**: 2025-10-15
