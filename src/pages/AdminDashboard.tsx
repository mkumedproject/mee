import React from 'react';
import { Link } from 'react-router-dom';
import { useMedfly } from '../context/MedflyContext';
import { 
  FileText, 
  BookOpen,
  GraduationCap,
  Users,
  Eye, 
  TrendingUp, 
  Calendar,
  PlusCircle,
  Stethoscope,
  Activity
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { state } = useMedfly();
  const { notes, years, units, lecturers } = state;

  const publishedNotes = notes.filter(note => note.is_published);
  const draftNotes = notes.filter(note => !note.is_published);
  const featuredNotes = notes.filter(note => note.is_featured);

  const stats = [
    {
      label: 'Total Notes',
      value: notes.length,
      icon: FileText,
      color: 'blue',
      change: '+12%'
    },
    {
      label: 'Published',
      value: publishedNotes.length,
      icon: Eye,
      color: 'green',
      change: '+5%'
    },
    {
      label: 'Academic Years',
      value: years.length,
      icon: GraduationCap,
      color: 'yellow',
      change: '0%'
    },
    {
      label: 'Medical Units',
      value: units.length,
      icon: BookOpen,
      color: 'purple',
      change: '+15%'
    },
    {
      label: 'Lecturers',
      value: lecturers.length,
      icon: Users,
      color: 'indigo',
      change: '+3%'
    },
    {
      label: 'Featured Notes',
      value: featuredNotes.length,
      icon: Activity,
      color: 'green',
      change: '+8%'
    },
  ];

  const quickActions = [
    { label: 'Create New Note', href: '/admin/notes', icon: FileText, color: 'blue' },
    { label: 'Manage Units', href: '/admin/units', icon: BookOpen, color: 'green' },
    { label: 'Manage Lecturers', href: '/admin/lecturers', icon: Users, color: 'purple' },
    { label: 'View All Notes', href: '/admin/notes', icon: Eye, color: 'indigo' },
  ];

  const recentNotes = notes.slice(0, 5);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medfly Dashboard</h1>
            <p className="text-gray-600">Medical Notes Platform Administration</p>
          </div>
        </div>
        <p className="text-gray-600">Welcome back! Here's what's happening with your medical notes platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon size={24} className={`text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp size={14} className="text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.href}
                    className={`flex items-center p-3 rounded-lg border hover:shadow-md transition-all bg-${action.color}-50 hover:bg-${action.color}-100 border-${action.color}-200`}
                  >
                    <Icon size={18} className={`text-${action.color}-600 mr-3`} />
                    <span className="font-medium text-gray-900">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notes</h2>
              <Link to="/admin/notes" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                      {note.unit && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {note.unit.unit_code}
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        note.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {note.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/admin/notes`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;