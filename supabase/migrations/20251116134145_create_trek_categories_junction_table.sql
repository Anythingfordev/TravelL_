/*
  # Create Trek Categories Junction Table

  1. New Tables
    - `trek_categories`
      - `id` (uuid, primary key)
      - `trek_id` (uuid, foreign key to treks)
      - `category_id` (uuid, foreign key to categories)
      - `created_at` (timestamptz, creation timestamp)

  2. Security
    - Enable RLS on `trek_categories` table
    - Add policy for anyone to read trek-category relationships
    - Add policy for authenticated users to create relationships
    - Add policy for authenticated users to delete relationships
*/

CREATE TABLE IF NOT EXISTS trek_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trek_id uuid NOT NULL REFERENCES treks(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(trek_id, category_id)
);

ALTER TABLE trek_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read trek categories"
  ON trek_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create trek categories"
  ON trek_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete trek categories"
  ON trek_categories
  FOR DELETE
  TO authenticated
  USING (true);