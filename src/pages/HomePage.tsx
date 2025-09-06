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
  FileText // ✅ fixed missing import
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { notes, blogs } = useMedfly();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(notes);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(
        notes.filter(note =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, notes]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to Medfly
            </motion.h1>
            <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto">
              Your ultimate companion for medical learning, notes, and resources.
            </p>
            <SearchBar
              placeholder="Search notes, blogs, and resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Featured Notes Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Notes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredNotes.slice(0, 3).map((note) => (
                <motion.div
                  key={note.id}
                  className="bg-gray-50 rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                  whileHover={{ scale: 1.02 }}
                >
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-80" />
                  <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                  <p className="text-gray-600 mb-4">{note.description}</p>
                  <Link
                    to={`/notes/${note.id}`}
                    className="text-blue-600 hover:underline flex items-center justify-center"
                  >
                    Read More <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Blogs Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Latest Blogs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.slice(0, 3).map((blog) => (
                <motion.div
                  key={blog.id}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                  <Link
                    to={`/blog/${blog.id}`}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    Read Blog <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
