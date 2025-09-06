import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MedflyProvider } from './context/MedflyContext';
import { BlogProvider } from './context/BlogContext';
import HomePage from './pages/HomePage';
import YearPage from './pages/YearPage';
import UnitPage from './pages/UnitPage';
import NotePage from './pages/NotePage';
import SearchPage from './pages/SearchPage';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import NotesManager from './pages/admin/NotesManager';
import UnitsManager from './pages/admin/UnitsManager';
import LecturersManager from './pages/admin/LecturersManager';
import PostManager from './pages/admin/PostManager';
import './App.css';

// Optional: Simple 404 page
const NotFoundPage = () => (
  <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
    404 - Page Not Found
  </div>
);

function App() {
  return (
    <MedflyProvider>
      <BlogProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/year/:yearNumber" element={<YearPage />} />
              <Route path="/unit/:unitId" element={<UnitPage />} />
              <Route path="/note/:slug" element={<NotePage />} />
              <Route path="/search" element={<SearchPage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="notes" element={<PostManager />} />
                <Route path="units" element={<UnitsManager />} />
                <Route path="lecturers" element={<LecturersManager />} />
              </Route>

              {/* Catch-all for unknown routes */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
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
          </div>
        </Router>
      </BlogProvider>
    </MedflyProvider>
  );
}

export default App;
