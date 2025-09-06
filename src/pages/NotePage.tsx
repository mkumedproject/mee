import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMedfly } from '../context/MedflyContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  BookOpen, 
  GraduationCap,
  Clock,
  Eye,
  Download,
  Share2,
  Bookmark,
  Tag,
  FileText,
  Stethoscope,
  Heart,
  ChevronRight
} from 'lucide-react';

const NotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { state, incrementNoteView } = useMedfly();
  const { notes, loading } = state;
  const [currentNote, setCurrentNote] = useState<any>(null);
  const [relatedNotes, setRelatedNotes] = useState<any[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (slug && notes.length > 0) {
      const note = notes.find(n => n.slug === slug && n.is_published);
      if (note) {
        setCurrentNote(note);
        incrementNoteView(note.id);
        const related = notes
          .filter(n => 
            n.id !== note.id && 
            n.is_published && 
            (n.unit_id === note.unit_id || n.year_id === note.year_id)
          )
          .slice(0, 3);
        setRelatedNotes(related);
      }
    }
  }, [slug, notes, incrementNoteView]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentNote.title,
          text: currentNote.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Note Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              The medical note you're looking for doesn't exist or has been removed.
            </p>
            <div className="space-y-4">
              <Link
                to="/search"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse All Notes
              </Link>
              <div>
                <Link
                  to="/"
                  className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Add top padding to account for fixed header */}
      <div className="pt-32">
        {/* Breadcrumb */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {currentNote.year && (
                <>
                  <Link 
                    to={`/year/${currentNote.year.year_number}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Year {currentNote.year.year_number}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </>
              )}
              {currentNote.unit && (
                <>
                  <Link 
                    to={`/unit/${currentNote.unit.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    {currentNote.unit.unit_name}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </>
              )}
              <span className="text-gray-600 font-medium truncate">{currentNote.title}</span>
            </nav>
          </div>
        </section>

        {/* Main Content */}
        <article className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Back Button */}
                <Link
                  to="/search"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors font-medium group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Notes
                </Link>

                {/* Note Header */}
                <motion.div 
                  className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                    {currentNote.unit && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {currentNote.unit.unit_code}
                      </span>
                    )}
                    {currentNote.year && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Year {currentNote.year.year_number}
                      </span>
                    )}
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {currentNote.difficulty_level || 'Intermediate'}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4 font-display">
                    {currentNote.title}
                  </h1>

                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    {currentNote.excerpt}
                  </p>

                  {/* Note Stats */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(currentNote.created_at)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {currentNote.estimated_read_time} min read
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      {currentNote.view_count} views
                    </span>
                    {currentNote.lecturer && (
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {currentNote.lecturer.title} {currentNote.lecturer.name}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={toggleBookmark}
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                        isBookmarked 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </button>
                  </div>
                </motion.div>

                {/* Note Content */}
                <motion.div 
                  className="bg-white rounded-2xl shadow-lg p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div 
                    className="prose prose-lg max-w-none 
                      prose-headings:text-gray-900 prose-headings:font-bold prose-headings:font-display
                      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-base prose-p:mb-4
                      prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900 prose-strong:font-semibold
                      prose-ul:my-6 prose-ol:my-6 prose-li:text-gray-700 prose-li:my-2
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-300 prose-blockquote:pl-6 prose-blockquote:text-gray-600 prose-blockquote:italic prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:my-6
                      prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                      prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                      prose-hr:border-gray-300 prose-hr:my-8
                      prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-3 prose-td:border prose-td:border-gray-300 prose-td:p-3
                      prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:leading-tight
                      prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:leading-tight
                      prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5 prose-h3:leading-tight
                      prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-4 prose-h4:leading-tight
                      prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-blue-600
                      max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentNote.content }}
                  />
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Note Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                    Note Details
                  </h3>
                  <div className="space-y-4">
                    {currentNote.unit && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Unit</dt>
                        <dd className="text-sm text-gray-900 font-medium">
                          {currentNote.unit.unit_code} - {currentNote.unit.unit_name}
                        </dd>
                      </div>
                    )}
                    {currentNote.year && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Academic Year</dt>
                        <dd className="text-sm text-gray-900 font-medium">
                          Year {currentNote.year.year_number} - {currentNote.year.year_name}
                        </dd>
                      </div>
                    )}
                    {currentNote.lecturer && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Lecturer</dt>
                        <dd className="text-sm text-gray-900 font-medium">
                          {currentNote.lecturer.title} {currentNote.lecturer.name}
                        </dd>
                        <dd className="text-xs text-gray-600">
                          {currentNote.lecturer.specialization}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Difficulty</dt>
                      <dd className={`text-sm font-medium ${
                        currentNote.difficulty_level === 'Beginner' ? 'text-green-600' :
                        currentNote.difficulty_level === 'Advanced' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {currentNote.difficulty_level || 'Intermediate'}
                      </dd>
                    </div>
                  </div>
                </div>

                {/* Related Notes */}
                {relatedNotes.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Notes</h3>
                    <div className="space-y-4">
                      {relatedNotes.map((note) => (
                        <Link
                          key={note.id}
                          to={`/note/${note.slug}`}
                          className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                            {note.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 space-x-3">
                            {note.unit && (
                              <span>{note.unit.unit_code}</span>
                            )}
                            <span>{note.estimated_read_time} min</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
};

export default NotePage;