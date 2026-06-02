-- SafeSpace Database Schema (Supabase PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  companion_name TEXT DEFAULT 'Companion',
  theme_preferences JSONB DEFAULT '{"theme": "system"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Journal Entries Table
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('text', 'voice', 'image')),
  content TEXT NOT NULL,
  image_url TEXT,
  ai_reflection TEXT,
  burnout_risk INTEGER CHECK (burnout_risk >= 0 AND burnout_risk <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Unfiltered Vents Table (Auto-deleting logic to be handled via cron/Supabase Edge Functions)
CREATE TABLE unfiltered_vents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('text', 'voice', 'image')),
  content TEXT,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SOS Contacts Table
CREATE TABLE sos_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  relationship TEXT,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Analytics Table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  journal_entries INTEGER DEFAULT 0,
  stress_break_sessions INTEGER DEFAULT 0,
  vent_sessions INTEGER DEFAULT 0,
  average_mood INTEGER CHECK (average_mood >= 1 AND average_mood <= 10),
  burnout_risk INTEGER CHECK (burnout_risk >= 0 AND burnout_risk <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Storage Buckets (To be created via Supabase Dashboard or API)
-- bucket_id: "journal-images"
-- bucket_id: "chat-attachments"
-- bucket_id: "user-uploads"
