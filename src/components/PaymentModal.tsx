import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, CreditCard, User, Mail, Phone, MapPin, Calendar, Users, DollarSign } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useRazorpay } from '../hooks/useRazorpay'
import { useBookings } from '../hooks/useBookings'
import { Trek } from '../types'

interface PaymentModalProps {
  trek: Trek
  onClose: () => void
  onPaymentSuccess: (paymentId: string) => void
}

interface PaymentFormData {
  name: string
  email: string
  phone: string
  participants: number
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ trek, onClose, onPaymentSuccess }) => {
  const { initiatePayment, loading } = useRazorpay()
  const { createBooking } = useBookings()
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form')
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PaymentFormData>({
    defaultValues: {
      participants: 1
    }
  })

  const participants = watch('participants')
  const totalAmount = trek.price * participants

  const onSubmit = async (data: PaymentFormData) => {
    if (participants > (trek.max_participants - trek.current_participants)) {
      alert(`Only ${trek.max_participants - trek.current_participants} spots available`)
      return
    }

    setPaymentStep('processing')

    const paymentData = {
      amount: totalAmount,
      currency: 'INR',
      name: 'TrekZone',
      description: `Booking for ${trek.title} - ${participants} participant(s)`,
      prefill: {
        name: data.name,
        email: data.email,
        contact: data.phone
      }
    }

    await initiatePayment(
      paymentData,
      async (response) => {
        console.log('Payment successful:', response)
        
        // Create booking record
        const bookingResult = await createBooking({
          trek_id: trek.id,
          user_name: data.name,
          user_email: data.email,
          user_phone: data.phone,
          participants: participants,
          total_amount: totalAmount,
          payment_id: response.razorpay_payment_id,
          payment_status: 'completed',
          booking_status: 'confirmed'
        })
        
        if (!bookingResult.success) {
          console.error('Failed to create booking:', bookingResult.error)
          alert('Payment successful but failed to create booking record. Please contact support.')
          return
        }
        
        setPaymentStep('success')
        setTimeout(() => {
          onPaymentSuccess(response.razorpay_payment_id)
          onClose()
        }, 2000)
      },
      (error) => {
        console.error('Payment failed:', error)
        setPaymentStep('form')
        alert('Payment failed: ' + error)
      }
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <CreditCard className="h-6 w-6 mr-3 text-emerald-600" />
            Book Your Trek
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {paymentStep === 'form' && (
          <>
            {/* Trek Summary */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 mb-6 border border-emerald-200">
              <div className="flex items-start space-x-4">
                <img 
                  src={trek.image_url} 
                  alt={trek.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{trek.title}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>{trek.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>{trek.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <span>{formatDate(trek.start_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Users className="h-4 w-4 text-orange-600" />
                      <span>{trek.max_participants - trek.current_participants} spots left</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[+]?[\d\s\-\(\)]{10,}$/,
                          message: 'Invalid phone number'
                        }
                      })}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Number of Participants *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                      {...register('participants', { 
                        required: 'Number of participants is required',
                        min: { value: 1, message: 'At least 1 participant required' },
                        max: { 
                          value: trek.max_participants - trek.current_participants, 
                          message: `Maximum ${trek.max_participants - trek.current_participants} participants available` 
                        }
                      })}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {Array.from({ length: Math.min(5, trek.max_participants - trek.current_participants) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} participant{i > 0 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.participants && (
                    <p className="text-red-500 text-sm mt-1">{errors.participants.message}</p>
                  )}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
                  Price Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Price per person</span>
                    <span className="font-medium">₹{trek.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Number of participants</span>
                    <span className="font-medium">{participants}</span>
                  </div>
                  <div className="border-t border-slate-300 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-800">Total Amount</span>
                      <span className="text-2xl font-bold text-emerald-600">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Pay ₹{totalAmount}</span>
                  </>
                )}
              </motion.button>
            </form>
          </>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Processing Payment</h3>
            <p className="text-slate-600">Please complete the payment in the Razorpay window...</p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Payment Successful!</h3>
            <p className="text-slate-600">Your booking has been confirmed. You'll receive a confirmation email shortly.</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            <strong>Secure Payment:</strong> Your payment is processed securely through Razorpay. 
            We don't store your card details.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}