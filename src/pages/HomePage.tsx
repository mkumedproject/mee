import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMedfly } from '../context/MedflyContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp,
  Stethoscope,
  GraduationCap,
  Heart,
  Brain,
  Activity,
  Star,
  Clock,
  Eye,
  ChevronRight,
  Microscope,
  Pill,
  UserCheck,
  Search,
  FileText   // ✅ Added missing import
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { state } = useMedfly();
  const { years, notes, units, lecturers, loading } = state;
  const [featuredNotes, setFeaturedNotes] = useState<any[]>([]);

  useEffect(() => {
    // Get featured notes (published and featured)
    const featured = notes
      .filter(note => note.is_published && note.is_featured)
      .slice(0, 6);
    setFeaturedNotes(featured);
  }, [notes]);

  const stats = [
    { 
      icon: BookOpen, 
      label: 'Study Notes', 
      value: notes.filter(n => n.is_published).length.toString(), 
      color: 'medical-blue',
      description: 'Comprehensive medical notes'
    },
    { 
      icon: GraduationCap, 
      label: 'Academic Years', 
      value: years.length.toString(), 
      color: 'medical-green',
      description: '6-year medical program'
    },
    { 
      icon: Microscope, 
      label: 'Medical Units', 
      value: units.length.toString(), 
      color: 'medical-purple',
      description: 'Specialized subjects'
    },
    { 
      icon: UserCheck, 
      label: 'Expert Lecturers', 
      value: lecturers.length.toString(), 
      color: 'medical-orange',
      description: 'Qualified medical educators'
    },
  ];

  const features = [
    {
      icon: Stethoscope,
      title: 'Clinical Excellence',
      description: 'Access comprehensive clinical notes from experienced medical professionals',
      color: 'medical-blue'
    },
    {
      icon: Brain,
      title: 'Structured Learning',
      description: 'Organized by academic years and subjects for systematic medical education',
      color: 'medical-green'
    },
    {
      icon: Heart,
      title: 'African Focus',
      description: 'Tailored for medical education across Africa with local context and cases',
      color: 'medical-red'
    },
    {
      icon: Activity,
      title: 'Real-time Updates',
      description: 'Stay current with the latest medical knowledge and educational resources',
      color: 'medical-purple'
    }
  ];

  const getYearColor = (yearNumber: number) => {
    const colors = [
      'medical-red',
      'medical-orange', 
      'medical-yellow',
      'medical-green',
      'medical-blue',
      'medical-purple'
    ];
    return colors[yearNumber - 1] || 'medical-blue';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Medfly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo and Brand */}
            <motion.div 
              className="flex items-center justify-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                  <Stethoscope className="w-10 h-10 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6 text-balance"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Welcome to{' '}
              <span className="text-gradient bg-gradient-to-r from-green-400 to-blue-300 bg-clip-text text-transparent">
                Medfly
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Your comprehensive medical notes platform designed for African medical students. 
              Access organized study materials, expert insights, and collaborative learning resources.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <SearchBar placeholder="Search medical notes, units, or topics..." />
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/search"
                  className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <BookOpen size={20} className="mr-2" />
                  Explore Notes
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300"
                >
                  <Users size={20} className="mr-2" />
                  Admin Access
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {/* ... unchanged ... */}

      {/* Academic Years Section */}
      {/* ... unchanged ... */}

      {/* Quick Access */}
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Access</h3>
          <p className="text-gray-600 mb-8">Jump directly to what you need</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* ... other items ... */}
            <Link
              to="/search"
              className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <Search className="w-6 h-6 text-purple-600" /> {/* ✅ Works */}
              </div>
              <span className="text-sm font-medium text-gray-900">Search All</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Featured Notes Section */}
      {featuredNotes.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Medical Notes</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our most popular and comprehensive medical study materials
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredNotes.map((note, index) => (
                <motion.article
                  key={note.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                    {note.featured_image ? (
                      <img
                        src={note.featured_image}
                        alt={note.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <FileText className="w-12 h-12 mx-auto mb-2 opacity-80" />
                          <div className="text-sm font-medium opacity-90">
                            {note.unit?.unit_code}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      {note.unit && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {note.unit.unit_code}
                        </span>
                      )}
                      {note.year && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          Year {note.year.year_number}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      <Link to={`/note/${note.slug}`} className="hover:text-blue-600 transition-colors">
                        {note.title}
                      </Link>
                    </h3>
                    
                    <div 
                      className="text-gray-600 text-sm mb-4 line-clamp-3 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: note.excerpt }}
                    />
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {note.estimated_read_time}m
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {note.view_count || 0}
                        </span>
                      </div>
                      <Link
                        to={`/note/${note.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        Read More
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {/* ... unchanged ... */}

      <Footer />
    </div>
  );
};

export default HomePage;
