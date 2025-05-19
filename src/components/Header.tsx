
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              BillFlow
            </Link>
          </div>

          <nav className="hidden md:flex space-x-4 mx-4 flex-1 justify-center">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            
            <Link 
              to="/pricing" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/pricing' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Pricing
            </Link>
            
            <Link 
              to="/features" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/features' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Features
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/account" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/account' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Account
                </Link>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="default" size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
