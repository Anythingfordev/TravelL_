/*
  # Create Enquiries Table

  1. New Tables
    - `enquiries`
      - `id` (uuid, primary key)
      - `trek_id` (uuid, foreign key to treks)
      - `name` (text, enquirer name)
      - `email` (text, enquirer email)
      - `phone` (text, enquirer phone)
      - `message` (text, enquiry message)
      - `status` (text, enquiry status)
      - `created_at` (timestamptz, creation timestamp)

  2. Security
    - Enable RLS on `enquiries` table
    - Add policy for authenticated users to read all enquiries
    - Add policy for anyone to create enquiries
    - Add policy for authenticated users to update enquiries
    - Add policy for authenticated users to delete enquiries
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trek_id uuid NOT NULL REFERENCES treks(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read enquiries"
  ON enquiries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create enquiries"
  ON enquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update enquiries"
  ON enquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete enquiries"
  ON enquiries
  FOR DELETE
  TO authenticated
  USING (true);