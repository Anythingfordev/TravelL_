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
      - `payment_id` (text, Razorpay payment ID)
      - `payment_status` (text, enum: pending, completed, failed, refunded)
      - `booking_status` (text, enum: confirmed, cancelled, completed)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for booking management

  3. Indexes
    - Add indexes for performance optimization
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trek_id uuid REFERENCES treks(id) ON DELETE CASCADE,
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

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_trek_id ON bookings(trek_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_email ON bookings(user_email);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- RLS Policies
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_email = (jwt() ->> 'email'));

CREATE POLICY "Allow public booking creation"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING ((jwt() ->> 'email') = 'admin@trekzone.com');

CREATE POLICY "Admin can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING ((jwt() ->> 'email') = 'admin@trekzone.com')
  WITH CHECK ((jwt() ->> 'email') = 'admin@trekzone.com');

CREATE POLICY "Admin can delete bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING ((jwt() ->> 'email') = 'admin@trekzone.com');