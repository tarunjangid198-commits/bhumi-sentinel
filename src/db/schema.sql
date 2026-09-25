-- ========================================================
-- BHUMI-SENTINEL: Land Acquisition Lifecycle Database Schema
-- Production-Ready PostgreSQL DDL
-- ========================================================

-- Enums
CREATE TYPE user_role AS ENUM (
  'National Admin',
  'State Officer',
  'District Officer',
  'Survey Officer',
  'Legal Officer',
  'Finance Officer',
  'Project Authority'
);

CREATE TYPE file_status AS ENUM (
  'SENT',
  'RECEIVED',
  'UNDER_REVIEW',
  'ACCEPTED',
  'REJECTED',
  'RETURNED',
  'FORWARDED',
  'COMPLETED'
);

CREATE TYPE workflow_status AS ENUM (
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
  'DELAYED',
  'BLOCKED',
  'REJECTED'
);

CREATE TYPE parcel_status AS ENUM (
  'NOT_STARTED',
  'IN_PROGRESS',
  'ACQUIRED',
  'DELAYED',
  'DISPUTED'
);

CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TYPE doc_status AS ENUM (
  'MISSING',
  'UPLOADED',
  'UNDER_VERIFICATION',
  'VERIFIED',
  'REJECTED'
);

-- 1. Infrastructure Projects
CREATE TABLE IF NOT EXISTS projects (
  project_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  state VARCHAR(100) NOT NULL,
  districts TEXT[] NOT NULL,
  total_area_ha NUMERIC(10, 2) NOT NULL,
  total_parcels INTEGER NOT NULL DEFAULT 0,
  budget_cr NUMERIC(12, 2) NOT NULL,
  disbursed_cr NUMERIC(12, 2) DEFAULT 0,
  start_date DATE NOT NULL,
  target_completion_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Land Parcels
CREATE TABLE IF NOT EXISTS parcels (
  parcel_id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) REFERENCES projects(project_id),
  khasra_number VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  tehsil VARCHAR(100) NOT NULL,
  village VARCHAR(100) NOT NULL,
  area_ha NUMERIC(8, 3) NOT NULL,
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  boundary_geom JSONB,
  status parcel_status DEFAULT 'IN_PROGRESS',
  current_stage VARCHAR(100) NOT NULL,
  risk_level risk_level DEFAULT 'LOW',
  risk_score INTEGER DEFAULT 0,
  risk_reasons TEXT[] DEFAULT '{}',
  owner_reference VARCHAR(150) NOT NULL,
  owner_type VARCHAR(100) NOT NULL,
  current_officer VARCHAR(150),
  current_department VARCHAR(150),
  progress_pct NUMERIC(5, 2) DEFAULT 0.00,
  delay_days INTEGER DEFAULT 0,
  delay_reason TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Acquisition Workflow Stages (11 Standard Stages per Land Parcel)
CREATE TABLE IF NOT EXISTS acquisition_stages (
  stage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id VARCHAR(50) REFERENCES parcels(parcel_id) ON DELETE CASCADE,
  stage_number INTEGER NOT NULL,
  stage_name VARCHAR(100) NOT NULL,
  status workflow_status DEFAULT 'NOT_STARTED',
  assigned_officer VARCHAR(150),
  assigned_department VARCHAR(150),
  start_date DATE,
  due_date DATE NOT NULL,
  completed_date DATE,
  delay_days INTEGER DEFAULT 0,
  delay_reason TEXT,
  remarks TEXT,
  CONSTRAINT unique_parcel_stage UNIQUE(parcel_id, stage_number)
);

-- 4. Digital Files (Case Files tracked across departments)
CREATE TABLE IF NOT EXISTS digital_files (
  file_id VARCHAR(50) PRIMARY KEY,
  parcel_id VARCHAR(50) REFERENCES parcels(parcel_id) ON DELETE CASCADE,
  project_id VARCHAR(50) REFERENCES projects(project_id),
  current_stage VARCHAR(100) NOT NULL,
  current_officer VARCHAR(150) NOT NULL,
  current_department VARCHAR(150) NOT NULL,
  previous_officer VARCHAR(150),
  previous_department VARCHAR(150),
  status file_status NOT NULL DEFAULT 'SENT',
  received_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  risk risk_level DEFAULT 'LOW',
  return_reason_category VARCHAR(100),
  return_remarks TEXT,
  required_correction TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. File Movement History
CREATE TABLE IF NOT EXISTS file_movement_history (
  step_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id VARCHAR(50) REFERENCES digital_files(file_id) ON DELETE CASCADE,
  from_officer VARCHAR(150) NOT NULL,
  from_department VARCHAR(150) NOT NULL,
  to_officer VARCHAR(150) NOT NULL,
  to_department VARCHAR(150) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status file_status NOT NULL,
  purpose VARCHAR(255) NOT NULL,
  remarks TEXT,
  return_reason VARCHAR(100),
  required_correction TEXT,
  due_date TIMESTAMP WITH TIME ZONE
);

-- 6. Case Documents & Extraction Data
CREATE TABLE IF NOT EXISTS case_documents (
  document_id VARCHAR(50) PRIMARY KEY,
  parcel_id VARCHAR(50) REFERENCES parcels(parcel_id) ON DELETE CASCADE,
  doc_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size VARCHAR(50),
  uploaded_by VARCHAR(150) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status doc_status DEFAULT 'UPLOADED',
  verified_by VARCHAR(150),
  verified_at TIMESTAMP WITH TIME ZONE,
  extracted_data JSONB,
  mismatches JSONB,
  remarks TEXT
);

-- 7. Tasks
CREATE TABLE IF NOT EXISTS tasks (
  task_id VARCHAR(50) PRIMARY KEY,
  parcel_id VARCHAR(50) REFERENCES parcels(parcel_id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  stage_name VARCHAR(100) NOT NULL,
  assigned_officer VARCHAR(150) NOT NULL,
  department VARCHAR(150) NOT NULL,
  status workflow_status DEFAULT 'NOT_STARTED',
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  created_date DATE DEFAULT CURRENT_DATE,
  start_date DATE,
  due_date DATE NOT NULL,
  completed_date DATE,
  delay_days INTEGER DEFAULT 0,
  delay_reason TEXT,
  remarks TEXT
);

-- 8. Audit Trail (Immutable security & compliance log)
CREATE TABLE IF NOT EXISTS audit_logs (
  audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_name VARCHAR(150) NOT NULL,
  user_role user_role NOT NULL,
  action VARCHAR(255) NOT NULL,
  file_id VARCHAR(50),
  parcel_id VARCHAR(50),
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  remarks TEXT,
  ip_address VARCHAR(50)
);

-- 9. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  parcel_id VARCHAR(50),
  file_id VARCHAR(50),
  read_flag BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'MEDIUM'
);

-- Indexes for lightning fast queries
CREATE INDEX idx_parcels_project ON parcels(project_id);
CREATE INDEX idx_parcels_status ON parcels(status);
CREATE INDEX idx_parcels_risk ON parcels(risk_level);
CREATE INDEX idx_parcels_district ON parcels(district);
CREATE INDEX idx_files_officer ON digital_files(current_officer, status);
CREATE INDEX idx_tasks_officer ON tasks(assigned_officer, status);
CREATE INDEX idx_docs_parcel ON case_documents(parcel_id);
