import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // For now, we'll scroll to treks section
      // In a real app, this would navigate to search results
      document.getElementById('treks')?.scrollIntoView({ behavior: 'smooth' })
      console.log('Searching for:', searchQuery)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900 text-white overflow-hidden"
      style={{ height: '70vh', minHeight: '600px' }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg" 
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/80 via-purple-700/70 to-purple-900/80" />
      </div>

      <div className="container mx-auto px-4 h-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 h-full items-center">
          
          {/* Left Side - Traveler Illustration */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              {/* Traveler Illustration - Using a placeholder that represents a traveler */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-80 h-80 lg:w-96 lg:h-96"
              >
                <img 
                  src="https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg"
                  alt="Traveler with backpack"
                  className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white/20"
                />
                
                {/* Floating elements around traveler */}
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    x: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-2xl">🏔️</span>
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                    x: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-2 -left-6 w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-xl">🎒</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Main Headline */}
            <div>
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-5xl lg:text-7xl font-bold leading-tight mb-4"
              >
                Discover Your Next{' '}
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255, 235, 59, 0.3)",
                      "0 0 30px rgba(255, 235, 59, 0.5)",
                      "0 0 20px rgba(255, 235, 59, 0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Travel
                </motion.span>
              </motion.h1>
              
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-2xl"
              >
                Find curated trekking and travel experiences across India's most breathtaking destinations
              </motion.p>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="max-w-2xl"
            >
              <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                <input
                  type="text"
                  placeholder="Search destinations, treks, adventures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-6 py-4 lg:py-5 text-gray-800 text-lg placeholder-gray-500 bg-transparent focus:outline-none"
                />
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(239, 68, 68, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="px-6 lg:px-8 py-4 lg:py-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span className="hidden sm:inline">Search</span>
                </motion.button>
              </div>
              
              {/* Search suggestions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-start"
              >
                <span className="text-gray-300 text-sm">Popular:</span>
                {['Himalayan Treks', 'Beach Tours', 'Wildlife Safari', 'Cultural Tours'].map((tag, index) => (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full border border-white/20 transition-all duration-300"
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            </motion.div>

            {/* Additional CTA */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: "0 20px 40px rgba(255, 255, 255, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300"
                onClick={() => {
                  document.getElementById('treks')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Explore All Treks
              </motion.button>
              
              <motion.div
                className="flex items-center justify-center lg:justify-start space-x-4 text-gray-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-xs font-bold"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-sm">
                  <strong>2,500+</strong> Happy Travelers
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 hidden xl:block opacity-20"
      >
        <div className="w-32 h-32 border-4 border-white rounded-full" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 right-10 hidden xl:block opacity-20"
      >
        <div className="w-24 h-24 border-4 border-yellow-300 rounded-full" />
      </motion.div>
    </motion.section>
  )
}