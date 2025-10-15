-- Create a simple function to get current tenant ID (we'll set this in application code)
CREATE OR REPLACE FUNCTION get_current_tenant_id() RETURNS text
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', true);
END;
$$;

-- Users table policies
CREATE POLICY tenant_isolation_users ON users
  USING ("tenantId" = get_current_tenant_id());

-- Client KPIs table policies
CREATE POLICY tenant_isolation_client_kpis ON client_kpis
  USING ("tenantId" = get_current_tenant_id());

-- Financials table policies (transitive through client_kpis)
CREATE POLICY tenant_isolation_financials ON financials
  USING ("clientKPIId" IN (
    SELECT id FROM client_kpis WHERE "tenantId" = get_current_tenant_id()
  ));

-- Lead Events table policies (transitive through client_kpis)
CREATE POLICY tenant_isolation_lead_events ON lead_events
  USING ("clientKPIId" IN (
    SELECT id FROM client_kpis WHERE "tenantId" = get_current_tenant_id()
  ));

-- Custom Metrics table policies (transitive through client_kpis)
CREATE POLICY tenant_isolation_custom_metrics ON custom_metrics
  USING ("clientKPIId" IN (
    SELECT id FROM client_kpis WHERE "tenantId" = get_current_tenant_id()
  ));

-- Integrations table policies
CREATE POLICY tenant_isolation_integrations ON integrations
  USING ("tenantId" = get_current_tenant_id());

-- Tenants table policies (users can only see their own tenant)
CREATE POLICY tenant_isolation_tenants ON tenants
  USING (id = get_current_tenant_id());
