
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthForm } from '@/components/AuthForm';
import { Header } from '@/components/Header';

const Auth = () => {
  const { isAuthenticated, loading } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !loading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-12">
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
