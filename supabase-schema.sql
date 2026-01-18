-- EthosChat Messages Table
-- Run this in your Supabase SQL Editor (supabase.com > Your Project > SQL Editor)

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster room queries
CREATE INDEX IF NOT EXISTS idx_messages_room_timestamp 
ON messages(room_id, timestamp DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages (public chat)
CREATE POLICY "Allow public read access" ON messages
  FOR SELECT USING (true);

-- Allow anyone to insert messages (for now - you can restrict later)
CREATE POLICY "Allow public insert access" ON messages
  FOR INSERT WITH CHECK (true);

-- Enable real-time for this table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
