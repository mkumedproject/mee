import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen,
  GraduationCap,
  Users,
  Settings, 
  LogOut, 
  User,
  Home,
  Stethoscope
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = React.useState<any>(null);
  
  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = localStorage.getItem('medfly_admin');
      if (!isAdmin) {
        navigate('/admin/login');
      } else {
        setUser({ email: 'admin@medfly.com', name: 'Admin User' });
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('medfly_admin');
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Notes', href: '/admin/notes', icon: FileText },
    { name: 'Units', href: '/admin/units', icon: BookOpen },
    { name: 'Lecturers', href: '/admin/lecturers', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-2 rounded-xl">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Medfly Admin</h1>
              <p className="text-sm text-gray-600">Medical Notes Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || 'Admin User'}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home size={14} className="mr-1" />
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={14} className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;