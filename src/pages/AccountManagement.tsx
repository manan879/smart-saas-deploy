
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Check, Settings, User } from 'lucide-react';

const AccountManagement = () => {
  const { user, isAuthenticated, loading, signOut, supabase } = useAuth();
  const navigate = useNavigate();
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      setError(null);
      setSuccess(null);
      
      // Basic validation
      if (newPassword !== confirmPassword) {
        setError("New passwords don't match");
        return;
      }
      
      if (newPassword) {
        // Update password
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        
        if (error) throw error;
        
        toast.success("Password updated successfully");
        setSuccess("Password updated successfully");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        // No changes were made
        setError("No changes to update");
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (confirmDelete) {
      try {
        // Note: In a real app, you'd use a Supabase Edge Function for this,
        // as client-side deletion is not directly supported
        toast.error("Account deletion requires backend implementation with Supabase Edge Functions");
        
        // For now, just sign the user out
        await signOut();
        navigate('/');
      } catch (err: any) {
        console.error("Account deletion error:", err);
        toast.error(err.message || "Failed to delete account");
      }
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated && !loading) {
    return <Navigate to="/auth" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Account Management</h1>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile">
                <TabsList className="mb-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        value={email} 
                        disabled 
                        className="bg-gray-50"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Email address cannot be changed directly. Please contact support.
                      </p>
                    </div>
                    
                    <div>
                      <Label>Account Type</Label>
                      <div className="px-3 py-2 border rounded bg-gray-50">
                        {user?.app_metadata?.provider === 'google' ? 'Google' : 'Email'} Account
                      </div>
                    </div>
                    
                    <div>
                      <Label>User ID</Label>
                      <div className="px-3 py-2 border rounded bg-gray-50 text-sm font-mono break-all">
                        {user?.id || 'Not available'}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="security">
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert className="bg-green-50 border-green-200 text-green-800">
                        <Check className="h-4 w-4 text-green-500" />
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}
                    
                    {user?.app_metadata?.provider !== 'google' && (
                      <>
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input 
                            id="currentPassword" 
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required={!!newPassword || !!confirmPassword}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input 
                            id="newPassword" 
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input 
                            id="confirmPassword" 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="bg-billflow-600 hover:bg-billflow-700"
                          disabled={profileLoading}
                        >
                          {profileLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                      </>
                    )}
                    
                    {user?.app_metadata?.provider === 'google' && (
                      <Alert>
                        <AlertDescription>
                          Password management is handled by Google for this account.
                        </AlertDescription>
                      </Alert>
                    )}
                  </form>
                  
                  <div className="border-t mt-8 pt-6">
                    <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                    >
                      Delete Account
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
