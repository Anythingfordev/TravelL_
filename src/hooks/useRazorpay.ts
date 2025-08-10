import { useState } from 'react'
import { loadRazorpayScript, createRazorpayOrder, RAZORPAY_KEY_ID, RazorpayOptions, RazorpayResponse } from '../lib/razorpay'

interface PaymentData {
  amount: number
  currency?: string
  name: string
  description: string
  prefill: {
    name: string
    email: string
    contact: string
  }
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initiatePayment = async (
    paymentData: PaymentData,
    onSuccess: (response: RazorpayResponse) => void,
    onFailure?: (error: string) => void
  ) => {
    if (!RAZORPAY_KEY_ID) {
      const errorMsg = 'Razorpay key not configured. Please add VITE_RAZORPAY_KEY_ID to your environment variables.'
      setError(errorMsg)
      onFailure?.(errorMsg)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script')
      }

      // Create order
      const orderResult = await createRazorpayOrder(paymentData.amount, paymentData.currency)
      if (!orderResult.success) {
        throw new Error(orderResult.error || 'Failed to create order')
      }

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: RAZORPAY_KEY_ID,
        amount: orderResult.amount,
        currency: orderResult.currency,
        name: paymentData.name,
        description: paymentData.description,
        order_id: orderResult.order_id,
        prefill: paymentData.prefill,
        theme: {
          color: '#10b981' // Emerald color to match your theme
        },
        handler: (response: RazorpayResponse) => {
          console.log('Payment successful:', response)
          onSuccess(response)
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed')
            onFailure?.('Payment cancelled by user')
          }
        }
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment initialization failed'
      console.error('Razorpay error:', err)
      setError(errorMessage)
      onFailure?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    initiatePayment,
    loading,
    error
  }
}