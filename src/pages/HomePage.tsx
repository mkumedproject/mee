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
  UserCheck
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={index} 
                  className="text-center group"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-${stat.color}-100 text-${stat.color}-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 font-medium mb-1">{stat.label}</p>
                  <p className="text-sm text-gray-500">{stat.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Academic Years Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
              6-Year Medical Program
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive medical education resources organized by academic years - from foundation to clinical practice
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {years.map((year, index) => {
              const yearColor = getYearColor(year.year_number);
              const yearUnits = units.filter(unit => unit.year_id === year.id);
              const yearNotes = notes.filter(note => note.year_id === year.id && note.is_published);
              
              return (
                <motion.div
                  key={year.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group card-hover transform hover:scale-105 transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -12 }}
                >
                  <div className={`year-${year.year_number}-bg h-40 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto backdrop-blur-sm">
                          <span className="text-2xl font-bold">{year.year_number}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-1">Year {year.year_number}</h3>
                        <p className="text-xs opacity-90">{yearUnits.length} Units • {yearNotes.length} Notes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {year.year_name}
                    </h4>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                      {year.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="flex items-center">
                        <BookOpen size={12} className="mr-1" />
                        {yearNotes.length} Notes
                      </span>
                      <span className="flex items-center">
                        <Microscope size={12} className="mr-1" />
                        {yearUnits.length} Units
                      </span>
                    </div>
                    
                    <Link
                      to={`/year/${year.year_number}`}
                      className={`inline-flex items-center justify-center w-full px-4 py-2.5 bg-${yearColor}-50 text-${yearColor}-700 rounded-lg hover:bg-${yearColor}-100 transition-colors group text-sm font-medium`}
                    >
                      <span>Explore Year {year.year_number}</span>
                      <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
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
                <Link
                  to="/search?view=recent"
                  className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Recent Notes</span>
                </Link>
                <Link
                  to="/search?featured=true"
                  className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-yellow-200 transition-colors">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Featured</span>
                </Link>
                <Link
                  to="/search?difficulty=Beginner"
                  className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Beginner</span>
                </Link>
                <Link
                  to="/search"
                  className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                    <Search className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Search All</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Notes Section */}
      {featuredNotes.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">Featured Notes</h2>
                <p className="text-xl text-gray-600">Essential study materials recommended by our medical experts</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ x: 5 }}
              >
                <Link 
                  to="/search" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg group"
                >
                  View All Notes
                  <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredNotes.map((note, index) => (
                <motion.article
                  key={note.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group card-hover"
                  variants={itemVariants}
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`badge badge-${note.difficulty_level?.toLowerCase() || 'intermediate'}`}>
                        {note.difficulty_level || 'Intermediate'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm opacity-90">{note.unit?.unit_name}</p>
                      <p className="text-xs opacity-75">Year {note.year?.year_number}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link to={`/note/${note.slug}`}>{note.title}</Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {note.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {note.estimated_read_time} min read
                      </span>
                      <span className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        {note.view_count} views
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCheck size={14} className="text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-600">{note.lecturer?.name}</span>
                      </div>
                      <Link
                        to={`/note/${note.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm group"
                      >
                        Read More
                        <ChevronRight size={14} className="inline ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
              Why Choose Medfly?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed specifically for African medical education with comprehensive resources and expert guidance
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-${feature.color}-100 text-${feature.color}-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;