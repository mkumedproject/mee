import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMedfly } from '../context/MedflyContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  User, 
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  GraduationCap,
  Stethoscope,
  Award,
  TrendingUp
} from 'lucide-react';

const YearPage: React.FC = () => {
  const { yearNumber } = useParams<{ yearNumber: string }>();
  const { state } = useMedfly();
  const { years, units, notes, lecturers, loading } = state;
  const [currentYear, setCurrentYear] = useState<any>(null);
  const [yearUnits, setYearUnits] = useState<any[]>([]);
  const [yearNotes, setYearNotes] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>('all');

  useEffect(() => {
    if (yearNumber && years.length > 0) {
      const year = years.find(y => y.year_number === parseInt(yearNumber));
      if (year) {
        setCurrentYear(year);
        
        // Get units for this year
        const unitsForYear = units.filter(unit => unit.year_id === year.id);
        setYearUnits(unitsForYear);
        
        // Get notes for this year
        const notesForYear = notes.filter(note => 
          note.year_id === year.id && note.is_published
        );
        setYearNotes(notesForYear);
      }
    }
  }, [yearNumber, years, units, notes]);

  const getYearColor = (yearNum: number) => {
    const colors = [
      'red', 'orange', 'yellow', 'green', 'blue', 'purple'
    ];
    return colors[yearNum - 1] || 'blue';
  };

  const filteredNotes = selectedUnit === 'all' 
    ? yearNotes 
    : yearNotes.filter(note => note.unit_id === selectedUnit);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentYear) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Year Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The academic year you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const yearColor = getYearColor(currentYear.year_number);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 font-medium">Year {currentYear.year_number}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br from-${yearColor}-600 via-${yearColor}-700 to-${yearColor}-800 text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <Link
              to="/"
              className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors font-medium group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to All Years
            </Link>

            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mr-6">
                <span className="text-3xl font-bold">{currentYear.year_number}</span>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {currentYear.year_name}
                </h1>
                <p className="text-xl text-white/90">
                  Year {currentYear.year_number} Medical Program
                </p>
              </div>
            </div>

            <p className="text-lg text-white/90 mb-8 max-w-3xl">
              {currentYear.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <BookOpen className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Units</span>
                </div>
                <div className="text-2xl font-bold">{yearUnits.length}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <FileText className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Notes</span>
                </div>
                <div className="text-2xl font-bold">{yearNotes.length}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <User className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Lecturers</span>
                </div>
                <div className="text-2xl font-bold">
                  {new Set(yearUnits.map(unit => unit.lecturer_id).filter(Boolean)).size}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Total Views</span>
                </div>
                <div className="text-2xl font-bold">
                  {yearNotes.reduce((sum, note) => sum + (note.view_count || 0), 0)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Units Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Academic Units</h2>
            <div className="flex items-center space-x-4">
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Units ({yearNotes.length} notes)</option>
                {yearUnits.map((unit) => {
                  const unitNotes = yearNotes.filter(note => note.unit_id === unit.id);
                  return (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit_code} ({unitNotes.length} notes)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Units Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {yearUnits.map((unit, index) => {
              const unitNotes = yearNotes.filter(note => note.unit_id === unit.id);
              const lecturer = lecturers.find(l => l.id === unit.lecturer_id);
              
              return (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`bg-gradient-to-br from-${yearColor}-500 to-${yearColor}-600 p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                        {unitNotes.length} notes
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{unit.unit_code}</h3>
                    <p className="text-white/90 text-sm">{unit.unit_name}</p>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {unit.description}
                    </p>
                    
                    {lecturer && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <User className="w-4 h-4 mr-2" />
                        <span>{lecturer.title} {lecturer.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{unit.credit_hours} Credits</span>
                        <span>Semester {unit.semester}</span>
                      </div>
                      <Link
                        to={`/unit/${unit.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm group-hover:translate-x-1 transition-all"
                      >
                        View Unit →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedUnit === 'all' ? 'All Notes' : 'Unit Notes'} ({filteredNotes.length})
              </h3>
            </div>

            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note, index) => (
                  <motion.article
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${yearColor}-100 text-${yearColor}-800`}>
                        {note.unit?.unit_code}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Eye className="w-3 h-3 mr-1" />
                        {note.view_count}
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      <Link to={`/note/${note.slug}`}>
                        {note.title}
                      </Link>
                    </h4>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {note.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(note.created_at)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {note.estimated_read_time}m
                        </span>
                      </div>
                      <Link
                        to={`/note/${note.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Read →
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Notes Available</h4>
                <p className="text-gray-600">
                  {selectedUnit === 'all' 
                    ? 'No notes have been published for this year yet.'
                    : 'No notes available for the selected unit.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default YearPage;