import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { sessionsAPI, skillsAPI } from '../lib/api';
import { Session, Skill } from '../types';
import { Calendar, BookOpen, Plus, Clock, Users, MessageSquare, Search, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';
import { format } from 'date-fns';
import { getInitials } from '../lib/utils';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [skills, setSkills] = useState<{ teachSkills: Skill[]; learnSkills: Skill[] }>({
    teachSkills: [],
    learnSkills: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sessionsRes, skillsRes] = await Promise.all([
        sessionsAPI.getMySessions({ upcoming: true }),
        skillsAPI.getMySkills(),
      ]);
      setSessions(sessionsRes.data.slice(0, 5));
      setSkills(skillsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-10 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const completedSessions = sessions.filter((s) => s.status === 'COMPLETED').length;
  const pendingSessions = sessions.filter((s) => s.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's your learning overview</p>
        </div>
        <Avatar className="w-16 h-16">
          <AvatarFallback className="text-lg">
            {getInitials(user?.firstName || '', user?.lastName || '')}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Teaching</h3>
              <BookOpen className="text-primary-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{skills.teachSkills.length}</p>
            <Link to="/profile" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              Manage <ArrowRight size={12} />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Learning</h3>
              <Award className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{skills.learnSkills.length}</p>
            <Link to="/profile" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              Add more <ArrowRight size={12} />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Upcoming</h3>
              <Calendar className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{sessions.length}</p>
            <Link to="/sessions" className="text-xs text-purple-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Completed</h3>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{completedSessions}</p>
            <span className="text-xs text-green-600">Great progress!</span>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/discover">
              <Button variant="outline" className="w-full h-full py-6 flex flex-col items-center gap-2 hover:bg-primary-50 hover:border-primary-300">
                <Search className="w-6 h-6 text-primary-600" />
                <span className="font-semibold">Discover Skills</span>
                <span className="text-xs text-gray-500">Find teachers</span>
              </Button>
            </Link>
            <Link to="/messages">
              <Button variant="outline" className="w-full h-full py-6 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <span className="font-semibold">Messages</span>
                <span className="text-xs text-gray-500">Chat with peers</span>
              </Button>
            </Link>
            <Link to="/sessions">
              <Button variant="outline" className="w-full h-full py-6 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300">
                <Calendar className="w-6 h-6 text-purple-600" />
                <span className="font-semibold">My Sessions</span>
                <span className="text-xs text-gray-500">Manage bookings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Sessions</CardTitle>
              <Link to="/discover">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Book
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="font-medium">No upcoming sessions</p>
                <p className="text-sm mt-1">Book a session to start learning</p>
                <Link to="/discover">
                  <Button variant="outline" size="sm" className="mt-4">
                    Discover Skills
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-3 hover:border-primary-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {getInitials(session.teacher.firstName, session.teacher.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{session.title}</h3>
                          <Badge
                            variant={session.status === 'CONFIRMED' ? 'default' : 'secondary'}
                            className="shrink-0"
                          >
                            {session.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          with {session.teacher.firstName} {session.teacher.lastName}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {format(new Date(session.scheduledAt), 'MMM dd')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {session.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {sessions.length > 3 && (
                  <Link to="/sessions">
                    <Button variant="ghost" size="sm" className="w-full">
                      View all {sessions.length} sessions
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Skills</CardTitle>
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {skills.teachSkills.length === 0 && skills.learnSkills.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="font-medium">No skills added yet</p>
                <p className="text-sm mt-1">Add skills you want to teach or learn</p>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="mt-4">
                    Add Skills
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {skills.teachSkills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BookOpen size={16} className="text-primary-600" />
                      Teaching ({skills.teachSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.teachSkills.slice(0, 5).map((skill) => (
                        <Badge key={skill.id} variant="default">
                          {skill.name}
                        </Badge>
                      ))}
                      {skills.teachSkills.length > 5 && (
                        <Badge variant="secondary">
                          +{skills.teachSkills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                {skills.learnSkills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Award size={16} className="text-blue-600" />
                      Learning ({skills.learnSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.learnSkills.slice(0, 5).map((skill) => (
                        <Badge key={skill.id} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                      {skills.learnSkills.length > 5 && (
                        <Badge variant="secondary">
                          +{skills.learnSkills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    Manage all skills
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
