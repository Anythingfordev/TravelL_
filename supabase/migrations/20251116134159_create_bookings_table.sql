/*
  # Create Bookings Table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `trek_id` (uuid, foreign key to treks)
      - `user_name` (text, booking user name)
      - `user_email` (text, booking user email)
      - `user_phone` (text, booking user phone)
      - `participants` (integer, number of participants)
      - `total_amount` (integer, total booking amount)
      - `payment_id` (text, payment transaction id)
      - `payment_status` (text, payment status)
      - `booking_status` (text, booking status)
      - `created_at` (timestamptz, creation timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for authenticated users to read all bookings
    - Add policy for anyone to create bookings
    - Add policy for authenticated users to update bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trek_id uuid NOT NULL REFERENCES treks(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_phone text NOT NULL,
  participants integer NOT NULL DEFAULT 1,
  total_amount integer NOT NULL DEFAULT 0,
  payment_id text,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  booking_status text NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);