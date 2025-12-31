-- Enable uuid extension (recommended by Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

--------------------------------------------------------------------------------
-- PROFILES TABLE  (extends auth.users)
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    providers JSONB NOT NULL DEFAULT '[]',
    auth_provider VARCHAR(50) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'free',
    meta JSONB,
    last_auth TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles (email);


--------------------------------------------------------------------------------
-- PROJECTS TABLE
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    data TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects (user_id);

--------------------------------------------------------------------------------
-- AUTO-UPDATE "updated_at" TRIGGERS
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to profiles
DROP TRIGGER IF EXISTS set_timestamp_profiles ON profiles;
CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_timestamp();

-- Attach trigger to projects
DROP TRIGGER IF EXISTS set_timestamp_projects ON projects;
CREATE TRIGGER set_timestamp_projects
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_timestamp();

---------------------------------------------------
-- RLS Policies

-- =========================
-- PROFILES TABLE POLICIES
-- =========================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Select own profile or allow admin
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (id = auth.uid());

-- Insert own profile or allow admin
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
WITH CHECK (id = auth.uid());

-- Update own profile or allow admin
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (id = auth.uid());

-- Delete profile (optional) or allow admin
CREATE POLICY "Users can delete their own profile"
ON profiles
FOR DELETE
USING (id = auth.uid());

------------------------------------------------------
-- =========================
-- PROJECTS TABLE POLICIES
-- =========================

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Select own projects or allow admin
CREATE POLICY "Users can read their own projects"
ON projects
FOR SELECT
USING (user_id = auth.uid());

-- Insert own projects or allow admin
CREATE POLICY "Users can create their own projects"
ON projects
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Update own projects or allow admin
CREATE POLICY "Users can update their own projects"
ON projects
FOR UPDATE
USING (user_id = auth.uid());

-- Delete own projects or allow admin
CREATE POLICY "Users can delete their own projects"
ON projects
FOR DELETE
USING (user_id = auth.uid());
