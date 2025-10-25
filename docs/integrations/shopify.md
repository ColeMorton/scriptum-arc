# Shopify Integration Guide

**Version**: 1.0  
**Last Updated**: 2025-10-25  
**Integration Type**: E-commerce  
**Authentication**: OAuth 2.0

---

## Overview

Shopify is the leading e-commerce platform. Integrating Shopify with accounting, inventory, and customer service systems automates order processing and eliminates manual data entry.

---

## What Shopify Integration Enables

### Automatic Order Processing

- Order placed → Invoice created in Xero → Inventory reduced → Pick list generated → Customer notification
- 20 hours/week of manual order processing reduced to 3 hours/week

### Multi-Channel Inventory Sync

- Sell on Shopify + eBay + Amazon → Single inventory system → No overselling or stockouts
- Inventory updated once, reflected everywhere instantly

### Customer Lifecycle Automation

- Order shipped → Thank you email → Delivery notification → Review request (7 days later) → Reorder reminder (30 days)
- Increase repeat purchase rate by 25-40%

### Automated Reordering

- Stock level low → Supplier notified → Purchase order created → Inventory updated when received
- Eliminate stockouts, reduce emergency ordering

---

## Common Workflows

### Order to Fulfillment

1. Order placed in Shopify
2. Inventory allocated automatically
3. Pick list sent to warehouse (email or integration with warehouse system)
4. Shipping label generated
5. Customer notification with tracking
6. Invoice recorded in Xero

### Inventory Management

1. Product sold → Inventory decremented
2. Stock level < threshold → Alert + Supplier notification
3. Stock received → Inventory updated + Bill in Xero
4. Monthly inventory valuation automatic

### Customer Service

1. Customer emails about order → Support ticket created with order details attached
2. Return requested → Return label generated → Refund processed → Inventory adjusted
3. Product inquiry → Automated response with product details

---

## Workflow Example

**Scenario**: Online homewares store processing 100 orders/week

**Before automation** (20 hours/week):

- Check Shopify for new orders: 2 hours/week
- Create pick lists manually: 3 hours/week
- Generate shipping labels: 4 hours/week
- Send customer notifications: 2 hours/week
- Update inventory across channels: 5 hours/week
- Enter into accounting: 4 hours/week
- **Total: 20 hours/week = $52,000/year**

**After automation** (3 hours/week):

- Everything happens automatically
- Review exceptions and issues: 2 hours/week
- Restock decisions: 1 hour/week
- **Total: 3 hours/week = $7,800/year**
- **Time saved: 17 hours/week = $44,200/year**

**Additional benefits**:

- Stockouts reduced 70% (was 12-15/month, now 3-4/month) = $30,000/year in saved lost sales
- Customer satisfaction improved (faster processing, better communication)

**ROI**: $74,200/year value on $14,500 investment = **5:1 return, 10-week payback**

---

## Setup Requirements

**Shopify Plan Requirements**:

- **Basic** ($39/month): Suitable for most small businesses
- **Shopify** ($105/month): Better features, recommended
- **Advanced** ($399/month): Advanced reporting, large businesses
- **Plus** ($2,000/month): Enterprise

**Recommendation**: Shopify plan ($105/month) for most SMEs

**OAuth Connection**: You grant permission via Shopify admin. Takes 2-3 minutes.

---

## Common Integrations

**Shopify + Xero**:

- Daily sales summary → Xero invoice
- Or individual orders → Individual Xero invoices (if needed for detail)
- Inventory sync with COGS tracking

**Shopify + eBay/Amazon**:

- Centralized inventory
- Orders from all channels flow through same fulfillment process
- Prevent overselling across channels

**Shopify + Email Marketing**:

- New customer → Welcome series
- Abandoned cart → Recovery sequence
- Post-purchase → Thank you + Review request + Reorder reminders

---

## Best Practices

1. **Product SKUs**: Consistent SKUs across all systems (critical for inventory sync)
2. **Inventory Tracking**: Enable Shopify inventory tracking for all products
3. **Fulfillment Service**: Configure fulfillment settings correctly
4. **Tax Settings**: Configure tax collection for your regions
5. **Shipping Zones**: Set up shipping zones and rates before automation

---

## Support

**Documentation**: This guide + workflow diagrams  
**Implementation**: Included in Complete or Enterprise packages  
**Additional Workflows**: $1,000-$2,000 each

**Contact**: hello@zixly.dev or 0412 345 678

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-25  
**Owner**: Zixly Technical Architecture
