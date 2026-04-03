import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore, useCartStore } from '@/stores';
import { Layout } from '@/components/layout';
import { Button, Input, Card } from '@/components/ui';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, isLoading, error, clearError, user } = useAuthStore();
  const { mergeWithServerCart } = useCartStore();
  
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  useEffect(() => {
    clearError();
  }, [isSignUp, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        await signUp(formData);
        toast.success('Account created successfully!');
      } else {
        const response = await signIn({
          email: formData.email,
          password: formData.password,
        });
        toast.success('Welcome back!');
        
        // Merge cart after login
        if (response.user?.cart) {
          await mergeWithServerCart(response.user.cart);
        }
      }
      navigate(redirect);
    } catch (err) {
      toast.error(error || 'Authentication failed');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="text-surface-500">
              {isSignUp
                ? 'Start shopping with personalized recommendations'
                : 'Sign in to access your cart and orders'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <Input
                label="Full Name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                leftIcon={<User className="w-5 h-5" />}
                required
              />
            )}

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
              required
            />

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-surface-500">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Guest Notice */}
          <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700 text-center">
            <p className="text-sm text-surface-500">
              Want to browse first?{' '}
              <Link
                to="/products"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                Continue as guest
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
