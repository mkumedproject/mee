import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Plus, Edit3, Trash2, Save, X, FolderOpen } from 'lucide-react';

const CategoryManager: React.FC = () => {
  const { state, dispatch } = useBlog();
  const { categories, posts, loading } = state;
  const { createCategory, updateCategory, deleteCategory } = useBlog();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    const postsInCategory = posts.filter(post => post.category_id === categoryId);
    if (postsInCategory.length > 0) {
      alert(`Cannot delete category. It contains ${postsInCategory.length} post(s).`);
      return;
    }

    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category. Please try again.');
      }
    }
  };

  const getPostCount = (categoryId: string) => {
    return posts.filter(post => post.category_id === categoryId).length;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Organize your posts with categories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-500">Category</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-500">Posts</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-500">Date Created</th>
                    <th className="text-right py-3 px-6 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FolderOpen size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Slug: {category.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getPostCount(category.id)} posts
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(category.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
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
          </div>
        </div>

        {/* Category Form */}
        <div className="lg:col-span-1">
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'New Category'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  <span>
                    {submitting 
                      ? (editingCategory ? 'Updating...' : 'Creating...') 
                      : (editingCategory ? 'Update Category' : 'Create Category')
                    }
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* Category Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Categories</span>
                <span className="font-medium">{categories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Posts</span>
                <span className="font-medium">{posts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Published Posts</span>
                <span className="font-medium">{posts.filter(p => p.published).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;