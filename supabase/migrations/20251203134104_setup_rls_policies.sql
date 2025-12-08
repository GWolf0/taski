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
