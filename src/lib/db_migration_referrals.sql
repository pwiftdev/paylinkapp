-- Migration: Add referral tracking to existing database
-- Run this if you already have a database with users/links tables

-- Add referrer_username column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS referrer_username TEXT;

-- Add missing columns to links table if they don't exist
ALTER TABLE links ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE links ADD COLUMN IF NOT EXISTS transaction_hash TEXT;
ALTER TABLE links ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;

-- Create indexes for referral lookups
CREATE INDEX IF NOT EXISTS idx_referrer_username ON users(referrer_username);
CREATE INDEX IF NOT EXISTS idx_link_status ON links(status);

