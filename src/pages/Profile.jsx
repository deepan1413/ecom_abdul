import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Package, Heart, LogOut, Edit2, Save, X } from 'lucide-react';
import { useAuthStore, useWishlistStore } from '@/stores';
import { userService } from '@/services';
import { Layout } from '@/components/layout';
import { Button, Card, Input, Badge } from '@/components/ui';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, signOut, setUser } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <User className="w-10 h-10 text-surface-400" />
            </div>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              Sign in to view profile
            </h2>
            <p className="text-surface-500 mb-6">
              Access your account details, orders, and preferences.
            </p>
            <Link to="/auth?redirect=/profile">
              <Button>Sign In</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await userService.updateUserDetails(formData);
      setUser({ ...user, ...formData });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-8">
          My Profile
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    leftIcon={<Edit2 className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      leftIcon={<X className="w-4 h-4" />}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      isLoading={isLoading}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                  {(user.name || user.email)?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-lg text-surface-900 dark:text-surface-100">
                    {user.name || 'User'}
                  </p>
                  <p className="text-surface-500">{user.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  leftIcon={<User className="w-5 h-5" />}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  leftIcon={<Mail className="w-5 h-5" />}
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="+965 1234 5678"
                  leftIcon={<Phone className="w-5 h-5" />}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Quick Links
              </h3>
              <nav className="space-y-2">
                <Link
                  to="/orders"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span>My Orders</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Wishlist</span>
                  </div>
                  {wishlistItems.length > 0 && (
                    <Badge variant="primary">{wishlistItems.length}</Badge>
                  )}
                </Link>
              </nav>
            </Card>

            {/* Sign Out */}
            <Card>
              <Button
                variant="danger"
                fullWidth
                onClick={signOut}
                leftIcon={<LogOut className="w-5 h-5" />}
              >
                Sign Out
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
