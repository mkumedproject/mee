import React, { useState, useEffect } from 'react';
import { useMedfly } from '../../context/MedflyContext';
import RichTextEditor from '../../components/RichTextEditor';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  FileText, 
  Eye, 
  Calendar,
  User,
  Search,
  Filter,
  Grid3X3,
  List,
  BookOpen,
  GraduationCap,
  Clock,
  Star,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const PostManager: React.FC = () => {
  const { state, createNote, updateNote, deleteNote } = useMedfly();
  const { notes, units, years, lecturers, loading } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    unit_id: '',
    year_id: '',
    lecturer_id: '',
    featured_image: '',
    difficulty_level: 'Intermediate',
    estimated_read_time: 5,
    is_published: false,
    is_featured: false,
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.content.trim()) {
      toast.error('Content is required');
      return false;
    }
    if (!formData.unit_id) {
      toast.error('Please select a unit');
      return false;
    }
    if (!formData.year_id) {
      toast.error('Please select a year');
      return false;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Excerpt is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started');
    console.log('📝 Form data:', formData);
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      // Calculate estimated read time
      const wordCount = formData.content.replace(/<[^>]*>/g, '').split(' ').length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      const noteData = {
        ...formData,
        estimated_read_time: readTime,
        slug: formData.slug || generateSlug(formData.title),
        created_at: editingNote ? undefined : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('💾 Submitting note data:', noteData);

      if (editingNote) {
        console.log('✏️ Updating existing note:', editingNote.id);
        await updateNote(editingNote.id, noteData);
        toast.success('Note updated successfully!');
      } else {
        console.log('➕ Creating new note');
        await createNote(noteData);
        toast.success('Note created successfully!');
      }
      
      resetForm();
    } catch (error: any) {
      console.error('❌ Error saving note:', error);
      console.error('📋 Full error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      const errorMessage = error.message || 'Failed to save note. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      unit_id: '',
      year_id: '',
      lecturer_id: '',
      featured_image: '',
      difficulty_level: 'Intermediate',
      estimated_read_time: 5,
      is_published: false,
      is_featured: false,
    });
    setEditingNote(null);
    setShowForm(false);
  };

  const handleEdit = (note: any) => {
    console.log('✏️ Editing note:', note);
    setEditingNote(note);
    setFormData({
      title: note.title || '',
      slug: note.slug || '',
      excerpt: note.excerpt || '',
      content: note.content || '',
      unit_id: note.unit_id || '',
      year_id: note.year_id || '',
      lecturer_id: note.lecturer_id || '',
      featured_image: note.featured_image || '',
      difficulty_level: note.difficulty_level || 'Intermediate',
      estimated_read_time: note.estimated_read_time || 5,
      is_published: note.is_published || false,
      is_featured: note.is_featured || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        console.log('🗑️ Deleting note:', noteId);
        await deleteNote(noteId);
        toast.success('Note deleted successfully!');
      } catch (error: any) {
        console.error('❌ Error deleting note:', error);
        toast.error('Failed to delete note. Please try again.');
      }
    }
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && note.is_published) ||
                         (filterStatus === 'draft' && !note.is_published);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Debug info
  useEffect(() => {
    console.log('🔄 PostManager state updated:', {
      notesCount: notes.length,
      unitsCount: units.length,
      yearsCount: years.length,
      lecturersCount: lecturers.length,
      loading
    });
  }, [notes, units, years, lecturers, loading]);

  // Ensure we have data before rendering
  if (loading && notes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medical notes platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Notes Management</h1>
              <p className="text-gray-600 mt-1">Create and manage medical study notes</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Total: {notes.length}</span>
                <span>Published: {notes.filter(n => n.is_published).length}</span>
                <span>Drafts: {notes.filter(n => !n.is_published).length}</span>
              </div>
            </div>
            <button
              onClick={() => {
                console.log('➕ Opening new note form');
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium shadow-sm"
            >
              <Plus size={20} />
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* Debug Panel */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>Notes: {notes.length} | Units: {units.length} | Years: {years.length} | Lecturers: {lecturers.length}</div>
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
              <div>Form visible: {showForm ? 'Yes' : 'No'}</div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  style={{ color: '#111827' }}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                style={{ color: '#111827' }}
              >
                <option value="all">All Notes ({notes.length})</option>
                <option value="published">Published ({notes.filter(n => n.is_published).length})</option>
                <option value="draft">Drafts ({notes.filter(n => !n.is_published).length})</option>
              </select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading notes...</p>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No notes found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm ? 'No notes match your search criteria.' : 'Get started by creating your first medical note.'}
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create First Note
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Note</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Unit/Year</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                        <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNotes.map((note) => (
                        <tr key={note.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText size={20} className="text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">{note.title}</h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.excerpt}</p>
                                <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                                  <span>Slug: {note.slug}</span>
                                  <span>{note.estimated_read_time} min read</span>
                                  <span>{note.view_count || 0} views</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              {note.unit && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <BookOpen size={12} className="mr-1" />
                                  {note.unit.unit_code}
                                </span>
                              )}
                              {note.year && (
                                <div>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <GraduationCap size={12} className="mr-1" />
                                    Year {note.year.year_number}
                                  </span>
                                </div>
                              )}
                              {note.lecturer && (
                                <div>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    <User size={12} className="mr-1" />
                                    {note.lecturer.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                note.is_published 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {note.is_published ? 'Published' : 'Draft'}
                              </span>
                              {note.is_featured && (
                                <div>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    <Star size={12} className="mr-1" />
                                    Featured
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm text-gray-900">{formatDate(note.created_at)}</div>
                            <div className="text-xs text-gray-500">
                              {note.updated_at !== note.created_at && 'Updated ' + formatDate(note.updated_at)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end space-x-2">
                              {note.is_published && (
                                <a
                                  href={`/note/${note.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="View Note"
                                >
                                  <Eye size={16} />
                                </a>
                              )}
                              <button
                                onClick={() => handleEdit(note)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(note.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Note Form */}
          <div className="xl:col-span-1">
            {showForm && (
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingNote ? 'Edit Note' : 'New Medical Note'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Enter note title"
                      required
                      style={{ color: '#111827 !important' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="note-slug"
                      style={{ color: '#111827 !important' }}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Academic Year *
                      </label>
                      <select
                        value={formData.year_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, year_id: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        required
                        style={{ color: '#111827 !important' }}
                      >
                        <option value="">Select Year</option>
                        {years.map((year) => (
                          <option key={year.id} value={year.id}>
                            Year {year.year_number} - {year.year_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Unit *
                      </label>
                      <select
                        value={formData.unit_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, unit_id: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        required
                        style={{ color: '#111827 !important' }}
                      >
                        <option value="">Select Unit</option>
                        {units
                          .filter(unit => !formData.year_id || unit.year_id === formData.year_id)
                          .map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.unit_code} - {unit.unit_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Lecturer
                    </label>
                    <select
                      value={formData.lecturer_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, lecturer_id: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      style={{ color: '#111827 !important' }}
                    >
                      <option value="">Select Lecturer</option>
                      {lecturers.map((lecturer) => (
                        <option key={lecturer.id} value={lecturer.id}>
                          {lecturer.title} {lecturer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty_level}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      style={{ color: '#111827 !important' }}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Brief description of the note"
                      required
                      style={{ color: '#111827 !important' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.featured_image}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="https://example.com/image.jpg"
                      style={{ color: '#111827 !important' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Content *
                    </label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                      placeholder="Write your medical note content here..."
                      height="400px"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="published"
                        checked={formData.is_published}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="published" className="text-sm font-medium text-gray-900">
                        Publish immediately
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="featured" className="text-sm font-medium text-gray-900">
                        Mark as featured
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Save size={18} />
                    <span>
                      {submitting 
                        ? (editingNote ? 'Updating...' : 'Creating...') 
                        : (editingNote ? 'Update Note' : 'Create Note')
                      }
                    </span>
                  </button>
                </form>
              </div>
            )}

            {/* Stats */}
            {!showForm && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Note Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Notes</span>
                    <span className="font-semibold text-gray-900">{notes.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Published</span>
                    <span className="font-semibold text-green-600">{notes.filter(n => n.is_published).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Drafts</span>
                    <span className="font-semibold text-yellow-600">{notes.filter(n => !n.is_published).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Featured</span>
                    <span className="font-semibold text-purple-600">{notes.filter(n => n.is_featured).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Views</span>
                    <span className="font-semibold text-blue-600">
                      {notes.reduce((sum, note) => sum + (note.view_count || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostManager;