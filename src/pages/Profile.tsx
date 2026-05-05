import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPatch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Calendar, User, Shield, Edit, Save, X } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileData {
  id: number;
  email: string;
  full_name: string;
  username: string;
  is_active: boolean;
  date_joined: string;
}

interface ProfileUpdateData {
  full_name: string;
  username: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ProfileUpdateData>({
    full_name: '',
    username: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiGet("http://127.0.0.1:8000/api/auth/profile/");
        
        if (response.ok) {
          const data = await response.json();
          console.log("Profile API response:", data);
          setProfileData(data);
          setEditForm({
            full_name: data.full_name || '',
            username: (data.username && data.username !== data.email) ? data.username : ''
          });
          setIsInitialized(true);
          setError(null);
        } else {
          const errorData = await response.json();
          setError("Failed to load profile data");
          console.error("Profile API error:", errorData);
        }
      } catch (err) {
        setError("Network error. Please try again.");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profileData) {
      setEditForm({
        full_name: profileData.full_name,
        username: profileData.username
      });
    }
  };

  const handleSave = async () => {
    if (!profileData) return;

    // Form validation
    if (!editForm.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }

    // Username validation - make it optional since it might be derived from email
    if (editForm.username.trim()) {
      if (editForm.username.length < 3) {
        toast.error("Username must be at least 3 characters long");
        return;
      }

      if (!/^[a-zA-Z0-9_@.-]+$/.test(editForm.username)) {
        toast.error("Username can only contain letters, numbers, underscores, @, dots, and hyphens");
        return;
      }
    }

    try {
      setIsSaving(true);
      const response = await apiPatch("http://127.0.0.1:8000/api/auth/profile/edit/", editForm);
      
      if (response.ok) {
        const responseData = await response.json();
        const updatedData = responseData.user || responseData;
        setProfileData(updatedData);
        setIsEditing(false);
        toast.success("Profile updated successfully");
        
        // Update auth context if needed
        // This would depend on your auth implementation
      } else {
        const errorData = await response.json();
        if (errorData.full_name) {
          toast.error(errorData.full_name[0] || "Invalid full name");
        } else if (errorData.username) {
          toast.error(errorData.username[0] || "Invalid username");
        } else if (errorData.email) {
          toast.error(errorData.email[0] || "Invalid email");
        } else {
          toast.error("Failed to update profile");
        }
        console.error("Profile update error:", errorData);
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
      console.error("Profile update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileUpdateData, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <h1 className="font-bold text-4xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage your account information
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {profileData?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl mb-2">
                      {profileData?.full_name || 'User'}
                    </CardTitle>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={profileData?.is_active ? "default" : "secondary"}
                      className="gap-1"
                    >
                      <Shield className="w-3 h-3" />
                      {profileData?.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">
                      ID: {profileData?.id}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Mail className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {profileData?.email}
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <User className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                  {isEditing && isInitialized ? (
                    <Input
                      value={editForm.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {profileData?.full_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <User className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Username</p>
                  {isEditing && isInitialized ? (
                    <Input
                      value={editForm.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="mt-1"
                      placeholder="Enter your username"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {profileData?.username && profileData.username !== profileData.email 
                        ? profileData.username 
                        : profileData?.email || 'N/A'}
                    </p>
                  )}
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Calendar className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Member Since</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {profileData?.date_joined ? formatDate(profileData.date_joined) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Account Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-3">
                  {isEditing ? (
                    <>
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full sm:w-auto"
                        onClick={() => navigate("/dashboard")}
                      >
                        Back to Dashboard
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full sm:w-auto"
                        onClick={async () => {
                          try {
                            await logout();
                            toast.success("Logged out successfully");
                            navigate("/login");
                          } catch (error) {
                            toast.error("Failed to logout");
                          }
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
