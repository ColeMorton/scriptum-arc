-- Create databases for local development
CREATE DATABASE pipeline;
CREATE DATABASE plane;

-- Create service users
CREATE USER pipeline_user WITH PASSWORD 'pipeline_password' SUPERUSER;
CREATE USER plane_user WITH PASSWORD 'plane_password' SUPERUSER;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE pipeline TO pipeline_user;
GRANT ALL PRIVILEGES ON DATABASE plane TO plane_user;

-- Grant schema permissions
\c pipeline;
GRANT ALL ON SCHEMA public TO pipeline_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pipeline_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pipeline_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO pipeline_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO pipeline_user;

\c plane;
GRANT ALL ON SCHEMA public TO plane_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO plane_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO plane_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO plane_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO plane_user;

-- Enable required extensions
\c pipeline;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c plane;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
