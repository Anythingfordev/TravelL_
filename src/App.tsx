import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, MapPin, Calendar, Clock, Users, ArrowRight, Compass, Mountain, Sunrise } from 'lucide-react'
import { useAuth } from './hooks/useAuth'
import { useTreks } from './hooks/useTreks'
import { useCategories } from './hooks/useCategories'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { TrekCard } from './components/TrekCard'
import { LoadingSpinner } from './components/LoadingSpinner'
import { AdminPage } from './pages/AdminPage'
import { ManageCategoriesPage } from './pages/ManageCategoriesPage'
import { CategoryPage } from './pages/CategoryPage'
import { TrekDetailsPage } from './pages/TrekDetailsPage'
import { ManageEnquiriesPage } from './pages/ManageEnquiriesPage'
import { Trek, Category } from './types'

type Page = 'home' | 'admin' | 'categories' | 'category' | 'trek-details' | 'enquiries'

function App() {
  const { user, loading: authLoading, isAdminUser } = useAuth()
  const { treks, loading: treksLoading, getTreksForCategory, treksByCategory } = useTreks()
  const { categories, loading: categoriesLoading, fetchActiveCategories, fetchAllCategories } = useCategories()
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  // Load appropriate categories based on user role
  React.useEffect(() => {
    if (!authLoading && categories.length === 0) {
      if (isAdminUser) {
        fetchAllCategories()
      } else {
        fetchActiveCategories()
      }
    }
  }, [isAdminUser, authLoading, categories.length, fetchActiveCategories, fetchAllCategories])

  // Helper function to get total trek count for a category
  const getTotalTreksForCategory = React.useCallback((categoryId: string) => {
    const allCategoryTreks = treksByCategory[categoryId] || []
    return allCategoryTreks.length
  }, [treksByCategory])

  const handleAdminToggle = () => {
    setCurrentPage(currentPage === 'admin' ? 'home' : 'admin')
  }

  const handleNavigateToCategories = () => {
    setCurrentPage('categories')
  }

  const handleNavigateToEnquiries = () => {
    setCurrentPage('enquiries')
  }

  const handleNavigateHome = () => {
    setCurrentPage('home')
  }

  const handleNavigateToCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setCurrentPage('category')
  }

  const handleViewTrekDetails = (trek: Trek) => {
    setSelectedTrek(trek)
    setCurrentPage('trek-details')
  }

  const handleBackFromTrekDetails = () => {
    setSelectedTrek(null)
    if (selectedCategoryId) {
      setCurrentPage('category')
    } else {
      setCurrentPage('home')
    }
  }

  const handleBackFromCategory = () => {
    setSelectedCategoryId(null)
    setCurrentPage('home')
  }

  const handleBackFromCategories = () => {
    setCurrentPage('admin')
  }

  const handleBackFromEnquiries = () => {
    setCurrentPage('admin')
  }

  if (authLoading) {
    return <LoadingSpinner />
  }

  // Render different pages based on current page
  if (currentPage === 'admin' && isAdminUser) {
    return (
      <AdminPage 
        onNavigateHome={handleNavigateHome}
        onNavigateToCategories={handleNavigateToCategories}
        onNavigateToEnquiries={handleNavigateToEnquiries}
      />
    )
  }

  if (currentPage === 'categories' && isAdminUser) {
    return (
      <ManageCategoriesPage 
        onNavigateBack={handleBackFromCategories}
      />
    )
  }

  if (currentPage === 'enquiries' && isAdminUser) {
    return (
      <ManageEnquiriesPage 
        onNavigateBack={handleBackFromEnquiries}
      />
    )
  }

  if (currentPage === 'category' && selectedCategoryId) {
    return (
      <CategoryPage 
        categoryId={selectedCategoryId}
        onNavigateBack={handleBackFromCategory}
        onViewTrekDetails={handleViewTrekDetails}
      />
    )
  }

  if (currentPage === 'trek-details' && selectedTrek) {
    return (
      <TrekDetailsPage 
        trek={selectedTrek}
        onNavigateBack={handleBackFromTrekDetails}
      />
    )
  }

  // Home page
  const activeCategories = categories.filter(cat => cat.is_active)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header 
        onAdminToggle={handleAdminToggle}
        currentPage={currentPage}
      />
      <Hero />
      
      <div className="container mx-auto px-4 py-16">
        {/* Categories Section - Only show active categories to regular users */}
        {activeCategories.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            {/* Zen-inspired header with spiritual elements */}
            <div className="text-center mb-16 relative">
              {/* Decorative elements */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-2 border-amber-300/30 rounded-full flex items-center justify-center"
                >
                  <Compass className="h-8 w-8 text-amber-600/60" />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-24"></div>
                  <Sunrise className="h-8 w-8 text-amber-600" />
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-24"></div>
                </div>
                
                <h2 className="text-5xl md:text-6xl font-light text-slate-800 mb-6 tracking-wide">
                  Sacred <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-red-500">Journeys</span>
                </h2>
                
                <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                  Discover your path through mindful adventures that nourish the soul and awaken the spirit
                </p>
                
                {/* Zen quote */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mt-8 italic text-slate-500 text-lg font-light"
                >
                  "The journey of a thousand miles begins with a single step" - Lao Tzu
                </motion.div>
              </motion.div>
            </div>

            <div className="space-y-20">
              {activeCategories.map((category, categoryIndex) => {
                const categoryTreks = getTreksForCategory(category.id, 3)
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1, duration: 0.8 }}
                    className="relative"
                  >
                    {/* Background with natural texture */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-3xl opacity-60"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-3xl"></div>
                    
                    {/* Decorative corner elements */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-amber-300/40 rounded-tl-2xl"></div>
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-amber-300/40 rounded-br-2xl"></div>
                    
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200/50 p-10">
                      <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-6">
                            {/* Zen-inspired icon container */}
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="relative p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-lg border border-amber-200"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-2xl"></div>
                              <Mountain className="h-10 w-10 text-amber-700 relative z-10" />
                            </motion.div>
                            <div>
                              <h3 className="text-3xl font-light text-slate-800 mb-2 tracking-wide">{category.title}</h3>
                              <p className="text-slate-600 text-lg font-light leading-relaxed">{category.description}</p>
                              
                              {/* Mindful subtitle */}
                              <div className="flex items-center space-x-2 mt-3">
                                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                <span className="text-sm text-amber-700 font-medium tracking-wider uppercase">
                                  Mindful Adventures
                                </span>
                                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          
                          {getTotalTreksForCategory(category.id) > 0 && (
                            <motion.button
                              whileHover={{ scale: 1.05, y: -3 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleNavigateToCategory(category.id)}
                              className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white rounded-2xl font-medium transition-all duration-500 shadow-lg hover:shadow-2xl relative overflow-hidden"
                            >
                              {/* Animated background */}
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                              
                              <span className="relative z-10 text-lg">Explore All ({getTotalTreksForCategory(category.id)})</span>
                              <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {treksLoading || categoriesLoading ? (
                        <div className="text-center py-12">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-3 border-amber-200 border-t-amber-600 rounded-full mx-auto mb-4"
                          ></motion.div>
                          <p className="text-slate-600 font-light">Discovering sacred paths...</p>
                        </div>
                      ) : categoryTreks.length === 0 ? (
                        <div className="text-center py-12">
                          <motion.div
                            animate={{ 
                              y: [0, -10, 0],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="mb-6"
                          >
                            <Mountain className="h-16 w-16 text-amber-300 mx-auto" />
                          </motion.div>
                          <p className="text-slate-500 text-lg font-light">New adventures are being prepared for this sacred journey.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {categoryTreks.map((trek, index) => (
                            <motion.div
                              key={trek.id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1, duration: 0.6 }}
                              className="relative group"
                            >
                              {/* Zen-inspired trek card wrapper */}
                              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                              <div className="relative">
                                <TrekCard 
                                  trek={trek} 
                                  index={index} 
                                  onViewDetails={() => handleViewTrekDetails(trek)}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      
                      {/* Show "View All" link at bottom if there are more than 3 treks */}
                      {getTotalTreksForCategory(category.id) > 3 && (
                        <div className="text-center mt-10">
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleNavigateToCategory(category.id)}
                            className="group text-amber-700 hover:text-amber-800 font-medium text-xl flex items-center justify-center space-x-3 mx-auto relative"
                          >
                            {/* Decorative line */}
                            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-16 group-hover:w-24 transition-all duration-300"></div>
                            
                            <span className="relative">
                              Discover {getTotalTreksForCategory(category.id) - categoryTreks.length} more sacred paths in {category.title}
                            </span>
                            
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                            
                            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-16 group-hover:w-24 transition-all duration-300"></div>
                          </motion.button>
                        </div>
                      )}
                    </div>
                    
                    {/* Floating meditation elements */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: categoryIndex * 0.5
                      }}
                      className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-60 shadow-lg"
                    ></motion.div>
                    
                    <motion.div
                      animate={{
                        y: [0, 8, 0],
                        rotate: [0, -3, 0]
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: categoryIndex * 0.3
                      }}
                      className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-red-200 to-pink-200 rounded-full opacity-50 shadow-md"
                    ></motion.div>
                  </motion.div>
                )
              })}
            </div>
            
            {/* Closing zen element */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-center mt-20"
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-32"></div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border border-amber-400 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                </motion.div>
                <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-32"></div>
              </div>
              
              <p className="mt-6 text-slate-500 font-light italic text-lg">
                "Every mountain top is within reach if you just keep climbing"
              </p>
            </motion.div>
          </motion.section>
        )}


        {/* All Treks Section (fallback when no categories) */}
        {categories.length === 0 && (
          <motion.section
            id="treks"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold text-slate-800 mb-4"
              >
                Featured Treks
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl text-slate-600 max-w-2xl mx-auto"
              >
                Discover breathtaking adventures curated by our expert guides
              </motion.p>
            </div>
            
            {treksLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading amazing treks...</p>
              </motion.div>
            ) : treks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-4"
                >
                  <MapPin className="h-16 w-16 text-slate-300 mx-auto" />
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-slate-500"
                >
                  No treks available yet. Check back soon for amazing adventures!
                </motion.p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, staggerChildren: 0.1 }}
              >
                {treks.slice(0, 6).map((trek, index) => (
                  <TrekCard 
                    key={trek.id} 
                    trek={trek} 
                    index={index} 
                    onViewDetails={() => handleViewTrekDetails(trek)}
                  />
                ))}
              </motion.div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  )
}

export default App