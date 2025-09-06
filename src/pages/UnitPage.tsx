import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMedfly } from '../context/MedflyContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BookOpen, ArrowLeft } from 'lucide-react';

const UnitPage: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const { state } = useMedfly();
  const { units, notes, loading } = state;
  
  const unit = units.find(u => u.id === unitId);
  const unitNotes = notes.filter(n => n.unit_id === unitId && n.is_published);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Unit Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              The unit you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Search
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {unit.unit_code} - {unit.unit_name}
            </h1>
            <p className="text-gray-600 mb-6">{unit.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Credit Hours</h3>
                <p className="text-blue-700">{unit.credit_hours}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Semester</h3>
                <p className="text-green-700">{unit.semester}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Notes Available</h3>
                <p className="text-purple-700">{unitNotes.length}</p>
              </div>
            </div>
            
            {unitNotes.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Notes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unitNotes.map((note) => (
                    <Link
                      key={note.id}
                      to={`/note/${note.slug}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
                      <p className="text-gray-600 text-sm">{note.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UnitPage;
