import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedfly } from '../context/MedflyContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Calendar,
  BookOpen,
  GraduationCap,
  User,
  Clock,
  Eye,
  Star,
  Tag,
  ChevronDown,
  X,
  FileText,
  Stethoscope
} from 'lucide-react';

const SearchPage: React.FC = () => {
  const { state, searchNotes } = useMedfly();
  const { notes, years, units, lecturers, searchResults, isSearching } = state;
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || 'all');
  const [selectedUnit, setSelectedUnit] = useState(searchParams.get('unit') || 'all');
  const [selectedLecturer, setSelectedLecturer] = useState(searchParams.get('lecturer') || 'all');
  const [difficultyLevel, setDifficultyLevel] = useState(searchParams.get('difficulty') || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Perform search when parameters change
  useEffect(() => {
    const filters = {
      yearId: selectedYear !== 'all' ? selectedYear : undefined,
      unitId: selectedUnit !== 'all' ? selectedUnit : undefined,
      lecturerId: selectedLecturer !== 'all' ? selectedLecturer : undefined,
      difficultyLevel: difficultyLevel !== 'all' ? difficultyLevel : undefined,
    };

    if (searchTerm || Object.values(filters).some(f => f)) {
      searchNotes(searchTerm, filters);
    }
  }, [searchTerm, selectedYear, selectedUnit, selectedLecturer, difficultyLevel, searchNotes]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (selectedYear !== 'all') params.set('year', selectedYear);
    if (selectedUnit !== 'all') params.set('unit', selectedUnit);
    if (selectedLecturer !== 'all') params.set('lecturer', selectedLecturer);
    if (difficultyLevel !== 'all') params.set('difficulty', difficultyLevel);
    
    setSearchParams(params);
  }, [searchTerm, selectedYear, selectedUnit, selectedLecturer, difficultyLevel, setSearchParams]);

  // Get display results
  const displayResults = useMemo(() => {
    const results = searchTerm || selectedYear !== 'all' || selectedUnit !== 'all' || selectedLecturer !== 'all' || difficultyLevel !== 'all' 
      ? searchResults 
      : notes.filter(note => note.is_published);

    // Sort results
    return [...results].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'popular':
          return (b.view_count || 0) - (a.view_count || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [searchResults, notes, searchTerm, selectedYear, selectedUnit, selectedLecturer, difficultyLevel, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedYear('all');
    setSelectedUnit('all');
    setSelectedLecturer('all');
    setDifficultyLevel('all');
    setSearchParams({});
  };

  const activeFiltersCount = [selectedYear, selectedUnit, selectedLecturer, difficultyLevel].filter(f => f !== 'all').length + (searchTerm ? 1 : 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Add top padding to account for fixed header */}
      <div className="pt-32">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 font-display">
                Medical Notes Library
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Search through comprehensive medical notes organized by years, units, and specializations
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <SearchBar 
                  placeholder="Search medical notes, topics, or units..."
                  onSearch={(term) => setSearchTerm(term)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-white border-b border-gray-200 sticky top-24 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Quick Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Quick search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    style={{ color: '#111827' }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* View Mode */}
                <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  style={{ color: '#111827' }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="alphabetical">A-Z</option>
                </select>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Year Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Academic Year
                        </label>
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          style={{ color: '#111827' }}
                        >
                          <option value="all">All Years</option>
                          {years.map((year) => (
                            <option key={year.id} value={year.id}>
                              Year {year.year_number}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Unit Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit/Subject
                        </label>
                        <select
                          value={selectedUnit}
                          onChange={(e) => setSelectedUnit(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          style={{ color: '#111827' }}
                        >
                          <option value="all">All Units</option>
                          {units
                            .filter(unit => selectedYear === 'all' || unit.year_id === selectedYear)
                            .map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.unit_code}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Lecturer Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lecturer
                        </label>
                        <select
                          value={selectedLecturer}
                          onChange={(e) => setSelectedLecturer(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          style={{ color: '#111827' }}
                        >
                          <option value="all">All Lecturers</option>
                          {lecturers.map((lecturer) => (
                            <option key={lecturer.id} value={lecturer.id}>
                              {lecturer.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Difficulty Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty
                        </label>
                        <select
                          value={difficultyLevel}
                          onChange={(e) => setDifficultyLevel(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          style={{ color: '#111827' }}
                        >
                          <option value="all">All Levels</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      {/* Clear Filters */}
                      <div className="flex items-end">
                        <button
                          onClick={clearFilters}
                          disabled={activeFiltersCount === 0}
                          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isSearching ? 'Searching...' : `${displayResults.length} Notes Found`}
                </h2>
                <p className="text-gray-600 mt-1">
                  {searchTerm && `Results for "${searchTerm}"`}
                  {activeFiltersCount > 0 && ` with ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied`}
                </p>
              </div>
            </div>

            {/* Results Grid */}
            <AnimatePresence mode="wait">
              {isSearching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayResults.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1 max-w-4xl mx-auto'
                  }`}
                >
                  {displayResults.map((note, index) => (
                    <motion.article
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      {/* Note Image/Icon */}
                      <div className={`relative overflow-hidden ${
                        note.featured_image 
                          ? '' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      } ${
                        viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'
                      }`}>
                        {note.featured_image ? (
                          <img
                            src={note.featured_image}
                            alt={note.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-white">
                                <FileText className="w-12 h-12 mx-auto mb-2 opacity-80" />
                                <div className="text-xs font-medium opacity-90">
                                  {note.unit?.unit_code}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          {note.is_featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            note.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-800' :
                            note.difficulty_level === 'Advanced' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {note.difficulty_level || 'Intermediate'}
                          </span>
                        </div>
                      </div>

                      {/* Note Content */}
                      <div className="p-6 flex-1">
                        {/* Meta Info */}
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          {note.year && (
                            <span className="flex items-center">
                              <GraduationCap className="w-3 h-3 mr-1" />
                              Year {note.year.year_number}
                            </span>
                          )}
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(note.created_at)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {note.estimated_read_time} min
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {note.view_count}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                          <Link to={`/note/${note.slug}`}>
                            {note.title}
                          </Link>
                        </h3>

                        {/* Excerpt */}
                        <div 
                          className="text-gray-600 text-sm mb-4 line-clamp-3 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: note.excerpt }}
                        />

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            {note.lecturer && (
                              <div className="flex items-center text-xs text-gray-500">
                                <User className="w-3 h-3 mr-1" />
                                {note.lecturer.name}
                              </div>
                            )}
                          </div>
                          <Link
                            to={`/note/${note.slug}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            Read More →
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="bg-white rounded-2xl shadow-sm border p-12 max-w-md mx-auto">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Notes Found</h3>
                    <p className="text-gray-600 mb-8">
                      {searchTerm 
                        ? `No notes match your search for "${searchTerm}". Try different keywords or adjust your filters.`
                        : 'No notes match your current filters. Try adjusting your search criteria.'
                      }
                    </p>
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;