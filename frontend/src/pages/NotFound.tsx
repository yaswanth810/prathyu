import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="text-9xl font-bold text-primary-600 mb-2">404</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-gray-600">
              Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/dashboard" className="block">
              <Button className="w-full" size="lg">
                <Home className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/discover" className="block">
              <Button variant="ghost" className="w-full" size="lg">
                <Search className="w-5 h-5 mr-2" />
                Discover Skills
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help?{' '}
              <a href="mailto:support@skillswap.com" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
