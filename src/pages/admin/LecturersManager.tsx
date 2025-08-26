import React, { useState } from 'react';
import { useMedfly } from '../../context/MedflyContext';
import { Plus, Edit3, Trash2, Save, X, User, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const LecturersManager: React.FC = () => {
  const { state, createLecturer, updateLecturer, deleteLecturer } = useMedfly();
  const { lecturers, loading } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: 'Dr.',
    specialization: '',
    email: '',
    phone: '',
    office_location: '',
    bio: '',
    profile_image: '',
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingLecturer) {
        await updateLecturer(editingLecturer.id, formData);
        toast.success('Lecturer updated successfully');
      } else {
        await createLecturer(formData);
        toast.success('Lecturer created successfully');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving lecturer:', error);
      toast.error('Error saving lecturer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: 'Dr.',
      specialization: '',
      email: '',
      phone: '',
      office_location: '',
      bio: '',
      profile_image: '',
      is_active: true,
    });
    setEditingLecturer(null);
    setShowForm(false);
  };

  const handleEdit = (lecturer: any) => {
    setEditingLecturer(lecturer);
    setFormData({
      name: lecturer.name,
      title: lecturer.title,
      specialization: lecturer.specialization,
      email: lecturer.email || '',
      phone: lecturer.phone || '',
      office_location: lecturer.office_location || '',
      bio: lecturer.bio || '',
      profile_image: lecturer.profile_image || '',
      is_active: lecturer.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (lecturerId: string) => {
    if (confirm('Are you sure you want to delete this lecturer?')) {
      try {
        await deleteLecturer(lecturerId);
        toast.success('Lecturer deleted successfully');
      } catch (error) {
        console.error('Error deleting lecturer:', error);
        toast.error('Error deleting lecturer. Please try again.');
      }
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lecturers Management</h1>
          <p className="text-gray-600">Manage medical faculty and lecturers</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>New Lecturer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lecturers List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-500">Lecturer</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-500">Specialization</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-500">Contact</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-6 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lecturers.map((lecturer) => (
                    <tr key={lecturer.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {lecturer.title} {lecturer.name}
                            </h3>
                            <p className="text-sm text-gray-600">{lecturer.office_location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900">{lecturer.specialization}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {lecturer.email && (
                            <div className="flex items-center text-xs text-gray-600">
                              <Mail size={12} className="mr-1" />
                              {lecturer.email}
                            </div>
                          )}
                          {lecturer.phone && (
                            <div className="flex items-center text-xs text-gray-600">
                              <Phone size={12} className="mr-1" />
                              {lecturer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          lecturer.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {lecturer.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(lecturer)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(lecturer.id)}
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

        {/* Lecturer Form */}
        <div className="lg:col-span-1">
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingLecturer ? 'Edit Lecturer' : 'New Lecturer'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <select
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      style={{ color: '#111827' }}
                    >
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Full name"
                      required
                      style={{ color: '#111827' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g., Cardiology, Anatomy"
                    required
                    style={{ color: '#111827' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="email@example.com"
                    style={{ color: '#111827' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="+254 712 345 678"
                    style={{ color: '#111827' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Office Location
                  </label>
                  <input
                    type="text"
                    value={formData.office_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, office_location: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Room 101, Medical Building"
                    style={{ color: '#111827' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Brief biography..."
                    style={{ color: '#111827' }}
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  <span>
                    {submitting 
                      ? (editingLecturer ? 'Updating...' : 'Creating...') 
                      : (editingLecturer ? 'Update Lecturer' : 'Create Lecturer')
                    }
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* Lecturer Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lecturer Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Lecturers</span>
                <span className="font-medium text-gray-900">{lecturers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Lecturers</span>
                <span className="font-medium text-gray-900">{lecturers.filter(l => l.is_active).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">With Contact Info</span>
                <span className="font-medium text-gray-900">{lecturers.filter(l => l.email || l.phone).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturersManager;