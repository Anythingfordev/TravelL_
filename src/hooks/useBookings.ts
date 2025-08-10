import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Booking {
  id: string
  trek_id: string
  user_name: string
  user_email: string
  user_phone: string
  participants: number
  total_amount: number
  payment_id: string | null
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  booking_status: 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  trek?: {
    id: string
    title: string
    location: string
    image_url: string
    start_date: string
    end_date: string
  }
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    try {
      if (!supabase) {
        setError('Supabase client is not initialized. Cannot fetch bookings.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          trek:treks(
            id,
            title,
            location,
            image_url,
            start_date,
            end_date
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }
      setBookings(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'trek'>) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client not configured. Cannot create booking.' }
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single()

      if (error) throw error
      
      // Add to local state
      setBookings((prev: Booking[]) => [data, ...prev])
      
      return { success: true, data }
    } catch (err) {
      console.error('Error creating booking:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create booking' }
    }
  }

  const updateBookingStatus = async (id: string, status: Booking['booking_status']) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client not configured. Cannot update booking.' }
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({ booking_status: status })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }
      
      setBookings((prev: Booking[]) => prev.map((booking: Booking) => booking.id === id ? { ...booking, booking_status: status } : booking))
      return { success: true, data }
    } catch (err) {
      console.error('Error updating booking status:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update booking status' }
    }
  }

  const updatePaymentStatus = async (id: string, paymentStatus: Booking['payment_status'], paymentId?: string) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client not configured. Cannot update payment status.' }
      }

      const updateData: any = { payment_status: paymentStatus }
      if (paymentId) {
        updateData.payment_id = paymentId
      }

      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }
      
      setBookings((prev: Booking[]) => prev.map((booking: Booking) => 
        booking.id === id 
          ? { ...booking, payment_status: paymentStatus, payment_id: paymentId || booking.payment_id } 
          : booking
      ))
      return { success: true, data }
    } catch (err) {
      console.error('Error updating payment status:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update payment status' }
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    updatePaymentStatus,
    refetch: fetchBookings,
  }
}