import { useEffect, useState } from 'react';
import { adminAPI } from '../lib/api';
import { Users, Calendar, BookOpen, MessageSquare, Star, Search, Shield, UserX, Trash2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';
import { showToast } from '../components/ui/Toast';
import { getInitials } from '../lib/utils';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await adminAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      showToast.error('Failed to load statistics');
    }
  };

  const loadUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers({});
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
      showToast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    if (!window.confirm(`Change user role to ${role}?`)) return;
    
    setUpdatingUser(userId);
    try {
      await adminAPI.updateUserRole(userId, role);
      showToast.success('User role updated successfully');
      loadUsers();
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingUser(null);
    }
  };

  const deleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) return;
    
    setUpdatingUser(userId);
    try {
      await adminAPI.deleteUser(userId);
      showToast.success('User deleted successfully');
      loadUsers();
      loadStats(); // Update stats
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setUpdatingUser(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const getStatGrowth = () => {
    // Mock growth data - in real app, calculate from historical data
    return {
      users: '+12%',
      sessions: '+23%',
      skills: '+8%',
      messages: '+45%',
      reviews: '+15%',
    };
  };

  const growth = getStatGrowth();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform overview and management</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform overview and management</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
              <Users className="text-primary-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.stats.totalUsers || 0}</p>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp size={12} className="mr-1" />
              <span>{growth.users} from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Sessions</h3>
              <Calendar className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.stats.totalSessions || 0}</p>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp size={12} className="mr-1" />
              <span>{growth.sessions} from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Skills</h3>
              <BookOpen className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.stats.totalSkills || 0}</p>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp size={12} className="mr-1" />
              <span>{growth.skills} from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Messages</h3>
              <MessageSquare className="text-orange-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.stats.totalMessages || 0}</p>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp size={12} className="mr-1" />
              <span>{growth.messages} from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Reviews</h3>
              <Star className="text-yellow-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.stats.totalReviews || 0}</p>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp size={12} className="mr-1" />
              <span>{growth.reviews} from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{users.length} total users</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-3 px-4 font-semibold text-gray-700">User</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Role</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Joined</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      {searchQuery ? 'No users found matching your search' : 'No users yet'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            {user.bio && (
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                {user.bio}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'outline'}>
                          {user.role === 'ADMIN' ? (
                            <>
                              <Shield className="w-3 h-3 mr-1" />
                              ADMIN
                            </>
                          ) : (
                            'USER'
                          )}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {user.role === 'USER' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserRole(user.id, 'ADMIN')}
                              disabled={updatingUser === user.id}
                            >
                              <Shield className="w-4 h-4 mr-1" />
                              Make Admin
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => updateUserRole(user.id, 'USER')}
                              disabled={updatingUser === user.id}
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Remove Admin
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                            disabled={updatingUser === user.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
