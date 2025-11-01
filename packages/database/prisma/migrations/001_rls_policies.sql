-- Row-Level Security Policies for Multi-Tenant Isolation
-- This file contains the RLS policies that enforce tenant isolation

-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create a function to get current tenant ID from JWT
CREATE OR REPLACE FUNCTION auth.tenant_id() RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'tenant_id',
    (current_setting('request.jwt.claims', true)::json->'user_metadata'->>'tenant_id')
  );
$$;

-- Users table policies
CREATE POLICY tenant_isolation_users ON users
  USING (tenant_id = auth.tenant_id());

-- Client KPIs table policies
CREATE POLICY tenant_isolation_client_kpis ON client_kpis
  USING (tenant_id = auth.tenant_id());

-- Financials table policies (transitive through client_kpis)
CREATE POLICY tenant_isolation_financials ON financials
  USING (client_kpi_id IN (
    SELECT id FROM client_kpis WHERE tenant_id = auth.tenant_id()
  ));

-- Lead Events table policies (transitive through client_kpis)
CREATE POLICY tenant_isolation_lead_events ON lead_events
  USING (client_kpi_id IN (
    SELECT id FROM client_kpis WHERE tenant_id = auth.tenant_id()
  ));

-- Custom Metrics table policies (transitive through client_kpis)
CREATE POLICY tenant_isolation_custom_metrics ON custom_metrics
  USING (client_kpi_id IN (
    SELECT id FROM client_kpis WHERE tenant_id = auth.tenant_id()
  ));

-- Integrations table policies
CREATE POLICY tenant_isolation_integrations ON integrations
  USING (tenant_id = auth.tenant_id());

-- Tenants table policies (users can only see their own tenant)
CREATE POLICY tenant_isolation_tenants ON tenants
  USING (id = auth.tenant_id());

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Allow service role to bypass RLS for ETL operations
ALTER TABLE tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_kpis DISABLE ROW LEVEL SECURITY;
ALTER TABLE financials DISABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE custom_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE integrations DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
