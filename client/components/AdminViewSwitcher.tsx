import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, User, Eye, EyeOff } from 'lucide-react';

export const AdminViewSwitcher: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAdmin) return null;

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleSwitchView = () => {
    if (isAdminRoute) {
      // Switch to user view
      navigate('/');
    } else {
      // Switch to admin view
      navigate('/admin');
    }
  };

  return (
    <div className="fixed top-24 left-6 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isAdminRoute ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isAdminRoute ? 'Mode Admin' : 'Mode Utilisateur'}
            </span>
          </div>
          
          <button
            onClick={handleSwitchView}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              isAdminRoute
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
            title={isAdminRoute ? 'Passer en vue utilisateur' : 'Passer en vue admin'}
          >
            {isAdminRoute ? (
              <>
                <User size={16} />
                <span>Vue User</span>
              </>
            ) : (
              <>
                <Settings size={16} />
                <span>Vue Admin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
