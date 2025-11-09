import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, MessageSquare, Calendar, Search, User, LogOut, Shield } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">SS</span>
                </div>
                <span className="text-xl font-bold text-gray-900">SkillSwap</span>
              </Link>
              
              <div className="hidden md:flex space-x-4">
                <Link to="/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Home size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/discover" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Search size={20} />
                  <span>Discover</span>
                </Link>
                <Link to="/sessions" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Calendar size={20} />
                  <span>Sessions</span>
                </Link>
                <Link to="/messages" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MessageSquare size={20} />
                  <span>Messages</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                  <Shield size={20} />
                  <span>Admin</span>
                </Link>
              )}
              <Link to="/profile" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <User size={20} />
                <span>{user?.firstName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
