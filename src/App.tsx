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
        {/* Categories Section */}
        {activeCategories.length > 0 && (
          <motion.section
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
                Weekend Trips from Bangalore
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl text-slate-600 max-w-2xl mx-auto"
              >
                Escape the city and explore amazing destinations perfect for weekend getaways
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {activeCategories.map((category, categoryIndex) => {
                const categoryTreks = getTreksForCategory(category.id, 3)
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1, duration: 0.8 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image Collage */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-400 to-emerald-500 overflow-hidden">
                      {categoryTreks.length > 0 ? (
                        <div className="grid grid-cols-3 gap-1 h-full p-2">
                          {categoryTreks.slice(0, 6).map((trek, index) => (
                            <motion.div
                              key={trek.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className={`relative overflow-hidden rounded-lg ${
                                index === 0 ? 'col-span-2 row-span-2' : 
                                index < 3 ? 'col-span-1' : 'hidden'
                              }`}
                            >
                              <img 
                                src={trek.image_url} 
                                alt={trek.title}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
                            </motion.div>
                          ))}
                          {categoryTreks.length > 3 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                              +{categoryTreks.length - 3} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-white">
                            <Mountain className="h-12 w-12 mx-auto mb-2 opacity-70" />
                            <p className="text-sm opacity-80">Coming Soon</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{category.title}</h3>
                        <p className="text-slate-600 text-sm line-clamp-2">{category.description}</p>
                      </div>
                      
                      {/* Trek Count and Price Range */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-slate-500">
                          {getTotalTreksForCategory(category.id)} trips available
                        </div>
                        {categoryTreks.length > 0 && (
                          <div className="text-right">
                            <div className="text-sm text-slate-500">Starting from</div>
                            <div className="text-lg font-bold text-emerald-600">
                              ₹{Math.min(...categoryTreks.map(t => t.price))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Book Now Button */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigateToCategory(category.id)}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            
            {/* View All Categories Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All Categories
              </motion.button>
            </div>
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