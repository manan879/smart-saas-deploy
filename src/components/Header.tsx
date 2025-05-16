
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-2xl text-billflow-600">BillFlow</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-4 items-center">
          <Link to="/" className="text-gray-600 hover:text-billflow-600 px-3 py-2 rounded-md text-sm font-medium">
            Home
          </Link>
          <Link to="/pricing" className="text-gray-600 hover:text-billflow-600 px-3 py-2 rounded-md text-sm font-medium">
            Pricing
          </Link>
          <Link to="/features" className="text-gray-600 hover:text-billflow-600 px-3 py-2 rounded-md text-sm font-medium">
            Features
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-billflow-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Button 
                onClick={handleSignOut} 
                variant="ghost"
                className="text-gray-600 hover:text-billflow-600"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="bg-billflow-600 hover:bg-billflow-700">
                Sign In
              </Button>
            </Link>
          )}
        </nav>
        
        {/* Mobile menu button - we could expand this with a dropdown */}
        <div className="md:hidden">
          <Button variant="ghost">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
};
