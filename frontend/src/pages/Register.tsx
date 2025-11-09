import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'medium' : 'weak';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-3xl">SS</span>
            </div>
          </Link>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Join SkillSwap</h2>
          <p className="text-gray-600">Start your learning journey today</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Sign up to connect with learners and teachers</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Registration Failed</p>
                    <p className="mt-1">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John"
                      className="pl-10"
                      required
                      autoComplete="given-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Doe"
                      className="pl-10"
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a strong password"
                    className="pl-10"
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      <div className={`h-1 flex-1 rounded ${
                        passwordStrength === 'weak' ? 'bg-red-500' :
                        passwordStrength === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <div className={`h-1 flex-1 rounded ${
                        passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-gray-200'
                      }`} />
                      <div className={`h-1 flex-1 rounded ${
                        passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    </div>
                    <p className="text-xs text-gray-600">
                      {passwordStrength === 'weak' && 'Weak password - Add more characters'}
                      {passwordStrength === 'medium' && 'Medium strength - Consider adding more characters'}
                      {passwordStrength === 'strong' && '✓ Strong password'}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 text-sm">
                  Sign in to your account
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="text-xs text-gray-600">
            <div className="font-semibold text-primary-600">100% Free</div>
            <div className="mt-1">No hidden fees</div>
          </div>
          <div className="text-xs text-gray-600">
            <div className="font-semibold text-primary-600">Secure</div>
            <div className="mt-1">Your data is safe</div>
          </div>
          <div className="text-xs text-gray-600">
            <div className="font-semibold text-primary-600">Community</div>
            <div className="mt-1">Join learners</div>
          </div>
        </div>
      </div>
    </div>
  );
}
