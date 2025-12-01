-- Create flowcharts table
CREATE TABLE IF NOT EXISTS flowcharts (
  id TEXT PRIMARY KEY,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  edges JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE flowcharts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read flowcharts
CREATE POLICY "Enable read access for all users" ON flowcharts
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert/update/delete flowcharts
CREATE POLICY "Enable insert for admins only" ON flowcharts
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'is_admin' = 'true' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true OR
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "Enable update for admins only" ON flowcharts
  FOR UPDATE
  USING (
    auth.jwt() ->> 'is_admin' = 'true' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true OR
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "Enable delete for admins only" ON flowcharts
  FOR DELETE
  USING (
    auth.jwt() ->> 'is_admin' = 'true' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true OR
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- Create an index on id for faster lookups
CREATE INDEX IF NOT EXISTS flowcharts_id_idx ON flowcharts(id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_flowcharts_updated_at
  BEFORE UPDATE ON flowcharts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial flowchart data (optional)
-- This can be run separately if needed
INSERT INTO flowcharts (id, nodes, edges) VALUES (
  'main-flowchart',
  '[
    {
      "id": "1",
      "type": "customNode",
      "position": {"x": 100, "y": 50},
      "data": {
        "date": "1878-01-01",
        "body": "Begin the process",
        "country": "United Kingdom"
      }
    },
    {
      "id": "2",
      "type": "customNode",
      "position": {"x": 100, "y": 180},
      "data": {
        "date": "1890-06-15",
        "body": "First processing step"
      }
    },
    {
      "id": "3",
      "type": "customNode",
      "position": {"x": 300, "y": 180},
      "data": {
        "date": "1905-03-20",
        "body": "Second processing step",
        "country": "United States"
      }
    },
    {
      "id": "4",
      "type": "customNode",
      "position": {"x": 200, "y": 310},
      "data": {
        "date": "1920-12-10",
        "body": "Make a choice"
      }
    },
    {
      "id": "5",
      "type": "customNode",
      "position": {"x": 200, "y": 440},
      "data": {
        "date": "1945-05-08",
        "body": "Process complete"
      }
    }
  ]'::jsonb,
  '[
    {"id": "e1-2", "source": "1", "target": "2", "animated": true},
    {"id": "e2-3", "source": "2", "target": "3", "animated": true},
    {"id": "e2-4", "source": "2", "target": "4", "animated": true},
    {"id": "e3-4", "source": "3", "target": "4", "animated": true},
    {"id": "e4-5", "source": "4", "target": "5", "animated": true}
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;