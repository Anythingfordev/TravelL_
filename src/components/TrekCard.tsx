import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Users, DollarSign, Star } from 'lucide-react'
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

export const TrekCard: React.FC<TrekCardProps> = ({ trek, index, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group"
    >
      <div className="relative">
        <img 
          src={trek.image_url} 
          alt={trek.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[trek.difficulty]}`}>
            {trek.difficulty}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-slate-700">4.8</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
          {trek.title}
        </h3>
        
        <div className="flex items-center space-x-2 text-slate-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{trek.location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-slate-600">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{trek.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{trek.current_participants}/{trek.max_participants}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(trek.start_date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold">${trek.price}</span>
          </div>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {trek.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-emerald-600">
            ${trek.price}
            <span className="text-sm text-slate-500 font-normal">/person</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewDetails}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}