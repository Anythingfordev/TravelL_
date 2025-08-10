// Razorpay configuration and utilities
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id?: string
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
  handler: (response: RazorpayResponse) => void
  modal: {
    ondismiss: () => void
  }
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id?: string
  razorpay_signature?: string
}

export interface RazorpayInstance {
  open(): void
  close(): void
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById('razorpay-script')
    
    if (existingScript) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    
    document.body.appendChild(script)
  })
}

export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  try {
    // This would typically call your backend API to create a Razorpay order
    // For now, we'll simulate the order creation
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      success: true,
      order_id: orderId,
      amount: amount * 100, // Razorpay expects amount in paise
      currency
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return {
      success: false,
      error: 'Failed to create payment order'
    }
  }
}