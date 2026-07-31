-- Supabase schema for Civic Companion
-- Run these statements in the Supabase SQL editor to create required tables.

CREATE TABLE IF NOT EXISTS service_rules (
  id TEXT PRIMARY KEY,
  service TEXT NOT NULL,
  state TEXT NOT NULL,
  eligibility TEXT,
  fee TEXT,
  processing_time TEXT,
  department TEXT,
  official_url TEXT
);

CREATE TABLE IF NOT EXISTS service_documents (
  id TEXT PRIMARY KEY,
  service TEXT NOT NULL,
  state TEXT NOT NULL,
  document_name TEXT NOT NULL,
  mandatory BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS service_offices (
  id TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  district TEXT,
  office_name TEXT NOT NULL,
  address TEXT,
  official_url TEXT
);

CREATE TABLE IF NOT EXISTS source_records (
  id TEXT PRIMARY KEY,
  service TEXT NOT NULL,
  source_name TEXT,
  source_url TEXT,
  last_reviewed TIMESTAMPTZ
);

-- Applications table used by the frontend and server. Includes optional plan snapshot.
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  service TEXT NOT NULL,
  state TEXT NOT NULL,
  purpose TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  plan JSONB
);
