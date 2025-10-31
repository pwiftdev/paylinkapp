-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  wallet TEXT UNIQUE NOT NULL,
  referrer_username TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create links table (updated - no burn required)
CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  username TEXT NOT NULL,
  recipient TEXT NOT NULL,
  amount TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  transaction_hash TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_wallet ON users(wallet);
CREATE INDEX IF NOT EXISTS idx_referrer_username ON users(referrer_username);
CREATE INDEX IF NOT EXISTS idx_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_recipient ON links(recipient);
CREATE INDEX IF NOT EXISTS idx_link_status ON links(status);
