import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, messagesAPI } from '../lib/api';
import { User } from '../types';
import { Search, Users, Filter, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';
import { StarRating } from '../components/ui/StarRating';
import { CreateSessionDialog } from '../components/CreateSessionDialog';
import { showToast } from '../components/ui/Toast';
import { getInitials } from '../lib/utils';

export default function Discover() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minRating: 0,
  });
  const [messagingUser, setMessagingUser] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [search, filters]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (filters.category) params.category = filters.category;
      if (filters.minRating) params.minRating = filters.minRating;
      
      const { data } = await usersAPI.searchUsers(params);
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All',
    'Programming',
    'Design',
    'Business',
    'Marketing',
    'Language',
    'Music',
    'Art',
    'Cooking',
    'Sports',
  ];

  const resetFilters = () => {
    setSearch('');
    setFilters({ category: '', minRating: 0 });
  };

  const startConversation = async (userId: string, userName: string) => {
    setMessagingUser(userId);
    try {
      // Send a conversation starter message
      await messagesAPI.send({
        receiverId: userId,
        content: `Hi ${userName}! 👋 I'd like to connect with you.`
      });
      showToast.success(`Opening chat with ${userName}`);
      // Navigate to messages page
      setTimeout(() => navigate('/messages'), 300);
    } catch (error: any) {
      // If there's an error, still try to navigate to messages
      console.log('Starting new conversation');
      navigate('/messages');
    } finally {
      setMessagingUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Discover Skills</h1>
        <p className="text-gray-600 mt-2">Find people to learn from</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or skill..."
                className="pl-10"
              />
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={filters.category === (cat === 'All' ? '' : cat) ? 'default' : 'outline'}
                      onClick={() => setFilters({ ...filters, category: cat === 'All' ? '' : cat })}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="flex items-center gap-4">
                  <StarRating
                    rating={filters.minRating}
                    onRatingChange={(rating) => setFilters({ ...filters, minRating: rating })}
                  />
                  <span className="text-sm text-gray-600">
                    {filters.minRating === 0 ? 'Any rating' : `${filters.minRating}+ stars`}
                  </span>
                </div>
              </div>

              <Button size="sm" variant="ghost" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">
              {search || filters.category || filters.minRating
                ? 'Try adjusting your filters or search query'
                : 'Be the first to add skills and connect with others!'}
            </p>
            {(search || filters.category || filters.minRating) && (
              <Button onClick={resetFilters}>Clear Filters</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-lg">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    {user.averageRating ? (
                      <div className="flex items-center gap-1 mt-1">
                        <StarRating rating={Math.round(user.averageRating)} readonly size="sm" />
                        <span className="text-sm text-gray-600 ml-1">
                          ({user.averageRating.toFixed(1)})
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">New teacher</p>
                    )}
                  </div>
                </div>

                {user.bio && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{user.bio}</p>
                )}

                {user.skillsToTeach && user.skillsToTeach.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {user.skillsToTeach.slice(0, 3).map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="text-xs">
                        {skill.name}
                      </Badge>
                    ))}
                    {user.skillsToTeach.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.skillsToTeach.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => startConversation(user.id, `${user.firstName} ${user.lastName}`)}
                    disabled={messagingUser === user.id}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {messagingUser === user.id ? 'Opening...' : 'Message'}
                  </Button>
                  <CreateSessionDialog
                    teacherId={user.id}
                    teacherName={`${user.firstName} ${user.lastName}`}
                    onSessionCreated={() => {
                      // Optionally redirect to sessions page
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
