import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { useBlog } from '../context/BlogContext';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Calendar,
  TrendingUp,
  BookOpen,
  Clock,
  X,
  ChevronDown
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  created_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'alphabetical', label: 'A-Z' }
];

const VIEW_MODES = [
  { value: 'grid', icon: Grid3X3, label: 'Grid View' },
  { value: 'list', icon: List, label: 'List View' }
];

const BlogPage: React.FC = () => {
  const { state } = useBlog();
  const { posts, categories } = state;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent default browser behavior and handle navigation gracefully
      event.preventDefault();
      // You can add custom logic here if needed
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  // Memoized filtered and sorted posts
  const { filteredPosts, totalPosts, categoryStats } = useMemo(() => {
    let filtered = posts.filter(post => post.published);

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category?.slug === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.category?.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort posts
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'popular':
          // Assuming we have a view count or similar metric
          return Math.random() - 0.5; // Placeholder for demo
        default:
          return 0;
      }
    });

    // Calculate category statistics
    const stats = categories.reduce((acc, category) => {
      const count = posts.filter(post => 
        post.published && post.category?.slug === category.slug
      ).length;
      acc[category.slug] = count;
      return acc;
    }, {} as Record<string, number>);

    return {
      filteredPosts: sorted,
      totalPosts: posts.filter(p => p.published).length,
      categoryStats: stats
    };
  }, [posts, categories, selectedCategory, searchTerm, sortBy]);

  // Handlers
  const handleCategoryChange = useCallback((categorySlug: string) => {
    setSelectedCategory(categorySlug);
    if (categorySlug === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categorySlug });
    }
  }, [setSearchParams]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('newest');
    setSearchParams({});
  }, [setSearchParams]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (searchTerm.trim()) count++;
    if (sortBy !== 'newest') count++;
    return count;
  }, [selectedCategory, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Knowledge Hub
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover insights, best practices, and cutting-edge resources for modern educators
            </p>
            
            {/* Quick Stats */}
            <div className="flex items-center justify-center space-x-8 text-blue-100">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-medium">{totalPosts} Articles</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">{categories.length} Categories</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Updated Daily</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles by title, content, or category..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
                {VIEW_MODES.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setViewMode(value as 'grid' | 'list')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === value
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-6 border-t border-gray-100 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Categories ({totalPosts})</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.slug}>
                            {category.name} ({categoryStats[category.slug] || 0})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <button
                        onClick={handleClearFilters}
                        disabled={activeFiltersCount === 0}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Results Summary */}
      <section className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredPosts.length}</span>
                {' '}article{filteredPosts.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && (
                  <span className="text-gray-500">
                    {' '}in{' '}
                    <span className="font-medium text-gray-700">
                      {categories.find(cat => cat.slug === selectedCategory)?.name}
                    </span>
                  </span>
                )}
                {searchTerm && (
                  <span className="text-gray-500">
                    {' '}matching{' '}
                    <span className="font-medium text-gray-700">"{searchTerm}"</span>
                  </span>
                )}
              </p>
            </div>

            {/* Active Filters Pills */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center space-x-2">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {categories.find(cat => cat.slug === selectedCategory)?.name}
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Search: {searchTerm.slice(0, 20)}{searchTerm.length > 20 ? '...' : ''}
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Articles Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {filteredPosts.length > 0 ? (
              <motion.div
                key="articles"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className={`grid gap-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1 max-w-4xl mx-auto'
                }`}
              >
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <PostCard post={post} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="text-center py-20"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
                  <div className="text-gray-300 mb-6">
                    <Search size={80} className="mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Articles Found
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {searchTerm
                      ? `We couldn't find any articles matching "${searchTerm}". Try adjusting your search terms or filters.`
                      : selectedCategory !== 'all'
                      ? `No articles found in the "${categories.find(cat => cat.slug === selectedCategory)?.name}" category.`
                      : 'No articles are currently available.'}
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleClearFilters}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Clear All Filters
                    </button>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="w-full text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Clear Search Only
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;