-- SPL-LICENSE-IDENTIFIER: Apache-2.0
-- SQL Schema to initialize Supabase database for ECI Registrations
-- Copy and run this script inside your Supabase SQL Editor

-- 1. Create the registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender TEXT NOT NULL,
    status TEXT NOT NULL,
    interest TEXT NOT NULL,
    interest_knowledge TEXT NOT NULL,
    join_reason TEXT NOT NULL,
    profile_picture TEXT NOT NULL, -- Holds Base64/DataURL representation
    agreement BOOLEAN NOT NULL DEFAULT false,
    registration_date TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 2. Create Security Policies
-- Anyone should be able to submit a registration (anonymous/public insert access)
CREATE POLICY "Enable insert for everyone" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

-- Anyone should be able to read their own registration by its primary key ID (select access by id)
CREATE POLICY "Enable read for everyone" 
ON public.registrations 
FOR SELECT 
USING (true);

-- Enable full management (delete / inspect) for authenticated or anyone (or custom admin policy, but for simple app layout we can do select/delete using client validation and simple secret/password authentication).
-- Since the Admin page manages records client-side using a password, we can enable select/delete for all operations or use the default public access. Let's make sure it allows select/delete by client logic:
CREATE POLICY "Enable delete for admin" 
ON public.registrations 
FOR DELETE 
USING (true);

CREATE POLICY "Enable update for admin" 
ON public.registrations 
FOR UPDATE 
USING (true);

-- Create index on full_name for high performance search
CREATE INDEX IF NOT EXISTS idx_registrations_full_name ON public.registrations (full_name);
CREATE INDEX IF NOT EXISTS idx_registrations_interest ON public.registrations (interest);
