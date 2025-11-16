/*
  # Create Treks Table

  1. New Tables
    - `treks`
      - `id` (uuid, primary key)
      - `title` (text, trek name)
      - `description` (text, trek details)
      - `location` (text, trek location)
      - `duration` (text, trek duration)
      - `difficulty` (text, difficulty level)
      - `price` (integer, price per person)
      - `image_url` (text, trek image)
      - `start_date` (date, trek start date)
      - `end_date` (date, trek end date)
      - `max_participants` (integer, maximum participants)
      - `current_participants` (integer, current bookings)
      - `inclusions` (jsonb, array of included items)
      - `exclusions` (jsonb, array of excluded items)
      - `things_to_carry` (jsonb, array of items to carry)
      - `itinerary` (jsonb, detailed day-by-day itinerary)
      - `created_at` (timestamptz, creation timestamp)
      - `created_by` (uuid, creator user id)

  2. Security
    - Enable RLS on `treks` table
    - Add policy for anyone to read treks
    - Add policy for authenticated users to create treks
    - Add policy for creators to update their own treks
    - Add policy for creators to delete their own treks
*/

CREATE TABLE IF NOT EXISTS treks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  duration text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Easy', 'Moderate', 'Hard', 'Expert')),
  price integer NOT NULL DEFAULT 0,
  image_url text DEFAULT 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
  start_date date NOT NULL,
  end_date date NOT NULL,
  max_participants integer NOT NULL DEFAULT 20,
  current_participants integer NOT NULL DEFAULT 0,
  inclusions jsonb DEFAULT '[]'::jsonb,
  exclusions jsonb DEFAULT '[]'::jsonb,
  things_to_carry jsonb DEFAULT '[]'::jsonb,
  itinerary jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE treks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read treks"
  ON treks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create treks"
  ON treks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own treks"
  ON treks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own treks"
  ON treks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);