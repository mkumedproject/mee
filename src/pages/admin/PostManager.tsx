import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlog } from '../../context/BlogContext';
import RichTextEditor from '../../components/RichTextEditor';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  Save,
  X,
  Image,
  Calendar,
  Tag,
  FileText,
  Clock,
  Settings,
  MoreHorizontal,
  Copy,
  ExternalLink
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  category_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
  };
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string;
  published: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image: '',
  category_id: '',
  published: false,
};

const PostManager: React.FC = () => {
  const { state, createPost, updatePost, deletePost } = useBlog();
  const { posts, categories, loading } = state;

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  // Memoized filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'published' && post.published) ||
                           (statusFilter === 'draft' && !post.published);
      const matchesCategory = categoryFilter === 'all' || post.category_id === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [posts, searchTerm, statusFilter, categoryFilter]);

  // Utility functions
  const generateSlug = useCallback((title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const calculateReadTime = useCallback((content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }, []);

  // Form handlers
  const handleTitleChange = useCallback((title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  }, [generateSlug]);

  const handleFormDataChange = useCallback(<K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!formData.title.trim()) {
      toast.error('Post title is required');
      return false;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Post excerpt is required');
      return false;
    }
    if (!formData.content.trim()) {
      toast.error('Post content is required');
      return false;
    }
    if (!formData.category_id) {
      toast.error('Please select a category');
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const postData = {
        ...formData,
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        slug: formData.slug || generateSlug(formData.title),
      };

      if (editingPost) {
        await updatePost(editingPost.id, postData);
        toast.success('Post updated successfully');
      } else {
        await createPost(postData);
        toast.success('Post created successfully');
      }
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(`Failed to save post: ${errorMessage}`);
      console.error('Error saving post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setEditingPost(null);
    setShowForm(false);
  }, []);

  const handleEdit = useCallback((post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featured_image || '',
      category_id: post.category_id,
      published: post.published,
    });
    setShowForm(true);
  }, []);

  const handleDelete = async (post: Post) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      await deletePost(post.id);
      toast.success('Post deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
      toast.error(errorMessage);
      console.error('Error deleting post:', error);
    }
  };

  const togglePublishStatus = async (post: Post) => {
    try {
      await updatePost(post.id, { published: !post.published });
      const action = !post.published ? 'published' : 'unpublished';
      toast.success(`Post ${action} successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update post status';
      toast.error(errorMessage);
      console.error('Error updating post status:', error);
    }
  };

  const copySlugToClipboard = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(`/blog/${slug}`);
      toast.success('Post URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  // Statistics
  const statistics = useMemo(() => {
    const published = posts.filter(p => p.published).length;
    const drafts = posts.filter(p => !p.published).length;
    return { total: posts.length, published, drafts };
  }, [posts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage and organize your blog content
              </p>
              <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                <span>Total: <strong className="text-gray-900">{statistics.total}</strong></span>
                <span>Published: <strong className="text-green-600">{statistics.published}</strong></span>
                <span>Drafts: <strong className="text-yellow-600">{statistics.drafts}</strong></span>
              </div>
            </div>
            <motion.button
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Filters */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search posts by title or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Drafts</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Posts Grid */}
              {filteredPosts.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {filteredPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                    >
                      {/* Post Image */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={post.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80'}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-3 left-3 flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          {post.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Tag className="w-3 h-3 mr-1" />
                              {post.category.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(post.created_at)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {calculateReadTime(post.content)} min read
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-1">
                            <motion.button
                              onClick={() => togglePublishStatus(post)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                                post.published 
                                  ? 'text-yellow-600 hover:bg-yellow-50' 
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={post.published ? 'Unpublish post' : 'Publish post'}
                            >
                              {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </motion.button>
                            <motion.button
                              onClick={() => handleEdit(post)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit post"
                            >
                              <Edit3 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => copySlugToClipboard(post.slug)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Copy post URL"
                            >
                              <Copy className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(post)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                          <span className="text-xs text-gray-400 font-medium">
                            {post.content.split(/\s+/).length} words
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm ? 'No posts found' : 'No posts yet'}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {searchTerm 
                      ? `No posts match your search for "${searchTerm}". Try adjusting your filters.`
                      : 'Start creating engaging content for your audience. Your first post is just a click away.'
                    }
                  </p>
                  {!searchTerm && (
                    <motion.button
                      onClick={() => setShowForm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Post
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Post Form */
            <motion.div
              key="form"
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {/* Form Header */}
              <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingPost ? 'Edit Post' : 'Create New Post'}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {editingPost ? 'Make changes to your existing post' : 'Create engaging content for your readers'}
                    </p>
                  </div>
                  <motion.button
                    onClick={resetForm}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                    title="Close form"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Post Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter an engaging title that captures attention..."
                        required
                        maxLength={100}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.title.length}/100 characters
                      </p>
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleFormDataChange('slug', e.target.value)}
                        className="w-full px-4 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="url-friendly-slug"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Preview: <code className="bg-gray-100 px-1 rounded">/blog/{formData.slug || 'your-post-slug'}</code>
                      </p>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Post Excerpt *
                      </label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => handleFormDataChange('excerpt', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Write a compelling summary that will appear in post previews and search results..."
                        required
                        maxLength={200}
                      />
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">
                          {formData.excerpt.length}/200 characters
                        </p>
                        <p className={`text-xs ${formData.excerpt.length > 160 ? 'text-amber-600' : 'text-gray-500'}`}>
                          Recommended: 150-160 characters for SEO
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Post Content *
                      </label>
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <RichTextEditor
                          value={formData.content}
                          onChange={(value) => handleFormDataChange('content', value)}
                          placeholder="Start writing your amazing content here. Use the toolbar to format your text, add links, and more..."
                          height="500px"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Word count: {formData.content.split(/\s+/).filter(word => word.length > 0).length} words
                        • Estimated read time: {calculateReadTime(formData.content)} min
                      </p>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Featured Image */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Featured Image
                      </label>
                      <div className="space-y-4">
                        <input
                          type="url"
                          value={formData.featured_image}
                          onChange={(e) => handleFormDataChange('featured_image', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                        />
                        {formData.featured_image && (
                          <div className="relative">
                            <img
                              src={formData.featured_image}
                              alt="Featured image preview"
                              className="w-full h-32 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          Recommended: 1200x630px for optimal social media sharing
                        </p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Category *
                      </label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => handleFormDataChange('category_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Publishing Options */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-4">Publishing Options</h3>
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.published}
                          onChange={(e) => handleFormDataChange('published', e.target.checked)}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Publish immediately
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Make this post visible to all readers. You can change this later.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Form Actions */}
                    <div className="space-y-3">
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {editingPost ? 'Updating Post...' : 'Creating Post...'}
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {editingPost ? 'Update Post' : 'Create Post'}
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={resetForm}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        disabled={submitting}
                      >
                        Cancel
                      </motion.button>
                    </div>

                    {/* Save Draft Helper */}
                    {!formData.published && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-blue-900">Saving as Draft</h4>
                            <p className="text-xs text-blue-700 mt-1">
                              This post will be saved as a draft and won't be visible to readers until you publish it.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostManager;