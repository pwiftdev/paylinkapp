-- Migration: Add custom slug/URL support to links table
-- Run this in your Supabase SQL Editor

-- Add slug column (optional, unique)
ALTER TABLE links ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_link_slug ON links(slug);

-- Note: Existing links will have NULL slugs and will still work with their UUID IDs

