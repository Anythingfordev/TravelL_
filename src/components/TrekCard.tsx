import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, Users, DollarSign, X, Star, Shield, Camera, Mountain } from 'lucide-react'
import { Trek } from '../types'

interface TrekCardProps {
  trek: Trek
  index: number
  onViewDetails: () => void
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800',
  Moderate: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-orange-100 text-orange-800',
  Expert: 'bg-red-100 text-red-800'
}

const difficultyIcons = {
  Easy: '🌱',
  Moderate: '⚡',
  Hard: '🔥',
  Expert: '💀'
}

export const TrekCard: React.FC<TrekCardProps> = ({ trek, index, onViewDetails }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  }

  const hoverVariants = {
    hover: { 
      y: -4, 
      transition: { duration: 0.2, ease: "easeOut" }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover="hover"
      variants={hoverVariants}
      className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer relative"
      style={{ willChange: 'transform' }}
    >
      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.3), rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3))',
          backgroundSize: '200% 200%',
        }}
      />
    </motion.div>
  )
}