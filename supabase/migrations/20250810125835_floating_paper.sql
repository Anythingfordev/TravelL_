/*
  # Create bookings table for trek reservations

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `trek_id` (uuid, foreign key to treks)
      - `user_name` (text)
      - `user_email` (text)
      - `user_phone` (text)
      - `participants` (integer)
      - `total_amount` (numeric)
      - `payment_id` (text, nullable)
      - `payment_status` (text, default 'pending')
      - `booking_status` (text, default 'confirmed')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for public to create bookings
    - Add policies for authenticated users to manage bookings

  3. Indexes
    - Index on trek_id for efficient lookups
    - Index on payment_status for filtering
    - Index on booking_status for filtering
    - Index on created_at for ordering
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trek_id uuid NOT NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_phone text NOT NULL,
  participants integer NOT NULL DEFAULT 1,
  total_amount numeric NOT NULL DEFAULT 0,
  payment_id text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  booking_status text DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint to establish relationship with treks table
ALTER TABLE bookings 
ADD CONSTRAINT bookings_trek_id_fkey 
FOREIGN KEY (trek_id) REFERENCES treks(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_trek_id ON bookings(trek_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view all bookings"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);