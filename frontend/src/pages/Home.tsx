import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Calendar, MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">SkillSwap</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Exchange Skills, Learn Together
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with people who want to learn what you know, and teach what they know. 
            A community-driven platform for skill exchange.
          </p>
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2">
            <span>Start Learning Today</span>
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="text-primary-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Find Teachers</h3>
            <p className="text-gray-600">Discover skilled individuals ready to share their expertise</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-primary-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Share Skills</h3>
            <p className="text-gray-600">Teach what you know and help others grow</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-primary-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Schedule Sessions</h3>
            <p className="text-gray-600">Book learning sessions at your convenience</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-primary-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Chat</h3>
            <p className="text-gray-600">Connect instantly with your learning partners</p>
          </div>
        </div>
      </div>
    </div>
  );
}
