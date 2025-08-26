import React, { useState } from 'react';
import { useMedfly } from '../../context/MedflyContext';
import { Plus, Edit3, Trash2, Save, X, BookOpen, GraduationCap, User } from 'lucide-react';
import toast from 'react-hot-toast';

const UnitsManager: React.FC = () => {
  const { state, createUnit, updateUnit, deleteUnit } = useMedfly();
  const { units, years, lecturers, loading } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    unit_name: '',
    unit_code: '',
    year_id: '',
    lecturer_id: '',
    description: '',
    credit_hours: 3,
    semester: '1',
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingUnit) {
        await updateUnit(editingUnit.id, formData);
        toast.success('Unit updated successfully');
      } else {
        await createUnit(formData);
        toast.success('Unit created successfully');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving unit:', error);
      toast.error('Error saving unit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      unit_name: '',
      unit_code: '',
      year_id: '',
      lecturer_id: '',
      description: '',
      credit_hours: 3,
      semester: '1',
      is_active: true,
    });
    setEditingUnit(null);
    setShowForm(false);
  };

  const handleEdit = (unit: any) => {
    setEditingUnit(unit);
    setFormData({
      unit_name: unit.unit_name,
      unit_code: unit.unit_code,
      year_id: unit.year_id,
      lecturer_id: unit.lecturer_id || '',
      description: unit.description,
      credit_hours: unit.credit_hours,
      semester: unit.semester,
      is_active: unit.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (unitId: string) => {
    if (confirm('Are you sure you want to delete this unit?')) {
      try {
        await deleteUnit(unitId);
        toast.success('Unit deleted successfully');
      } catch (error) {
        console.error('Error deleting unit:', error);
        toast.error('Error deleting unit. Please try again.');
      }
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Units Management</h1>
          <p className="text-gray-600">Manage academic units and subjects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>New Unit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Units List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-500">Unit</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-500">Year</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-500">Lecturer</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-500">Credits</th>
                    <th className="text-right py-3 px-6 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((unit) => (
                    <tr key={unit.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <BookOpen size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{unit.unit_code}</h3>
                            <p className="text-sm text-gray-600">{unit.unit_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <GraduationCap size={12} className="mr-1" />
                          Year {unit.year?.year_number}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {unit.lecturer ? (
                          <div className="flex items-center">
                            <User size={14} className="mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900">{unit.lecturer.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not assigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900">{unit.credit_hours}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(unit)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(unit.id)}
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

        {/* Unit Form */}
        <div className="lg:col-span-1">
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingUnit ? 'Edit Unit' : 'New Unit'}
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
                    Unit Code *
                  </label>
                  <input
                    type="text"
                    value={formData.unit_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit_code: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g., ANAT101"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Name *
                  </label>
                  <input
                    type="text"
                    value={formData.unit_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit_name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g., Human Anatomy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year *
                  </label>
                  <select
                    value={formData.year_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, year_id: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    required
                  >
                    <option value="">Select a year</option>
                    {years.map((year) => (
                      <option key={year.id} value={year.id}>
                        Year {year.year_number} - {year.year_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lecturer
                  </label>
                  <select
                    value={formData.lecturer_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, lecturer_id: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select a lecturer</option>
                    {lecturers.map((lecturer) => (
                      <option key={lecturer.id} value={lecturer.id}>
                        {lecturer.title} {lecturer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Unit description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Hours
                    </label>
                    <input
                      type="number"
                      value={formData.credit_hours}
                      onChange={(e) => setFormData(prev => ({ ...prev, credit_hours: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      min="1"
                      max="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                      <option value="Both">Both Semesters</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  <span>
                    {submitting 
                      ? (editingUnit ? 'Updating...' : 'Creating...') 
                      : (editingUnit ? 'Update Unit' : 'Create Unit')
                    }
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* Unit Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Units</span>
                <span className="font-medium text-gray-900">{units.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Units</span>
                <span className="font-medium text-gray-900">{units.filter(u => u.is_active).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">With Lecturers</span>
                <span className="font-medium text-gray-900">{units.filter(u => u.lecturer_id).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitsManager;