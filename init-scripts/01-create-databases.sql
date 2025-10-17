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
