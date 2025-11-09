import { useEffect, useState } from 'react';
import { sessionsAPI } from '../lib/api';
import { Session } from '../types';
import { Calendar, Clock, Video, CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { ReviewDialog } from '../components/ReviewDialog';
import { showToast } from '../components/ui/Toast';
import { useAuthStore } from '../store/authStore';
import VideoCallButton from '../components/VideoCallButton';

export default function Sessions() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data } = await sessionsAPI.getMySessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      showToast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId: string, status: string) => {
    setUpdatingStatus(sessionId);
    try {
      await sessionsAPI.updateStatus(sessionId, status);
      showToast.success(`Session ${status.toLowerCase()}`);
      await loadSessions();
      
      // If session is marked as COMPLETED and user is the student, trigger review reminder
      if (status === 'COMPLETED') {
        const completedSession = sessions.find(s => s.id === sessionId);
        if (completedSession && completedSession.learner.id === user?.id) {
          // Show success message prompting to leave review
          setTimeout(() => {
            showToast.success('✅ Session completed! Please leave a review for your teacher.');
          }, 800);
        }
      }
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Failed to update session');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'COMPLETED': return 'info';
      case 'CANCELLED': return 'destructive';
      default: return 'outline';
    }
  };

  const canConfirm = (session: Session) => {
    return session.status === 'PENDING' && user?.id === session.teacher.id;
  };

  const canCancel = (session: Session) => {
    return session.status === 'PENDING' || session.status === 'CONFIRMED';
  };

  const canComplete = (session: Session) => {
    return session.status === 'CONFIRMED' && new Date(session.scheduledAt) < new Date();
  };

  const canReview = (session: Session) => {
    return session.status === 'COMPLETED' && !session.review;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-2">Manage your learning sessions</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full" />
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
        <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
        <p className="text-gray-600 mt-2">Manage your learning sessions</p>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-600 mb-4">Start by discovering teachers and booking your first session!</p>
            <Button onClick={() => window.location.href = '/discover'}>Discover Teachers</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{session.title}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {user?.id === session.teacher.id ? (
                        <>Teaching <span className="font-semibold">{session.learner.firstName} {session.learner.lastName}</span></>
                      ) : (
                        <>Learning from <span className="font-semibold">{session.teacher.firstName} {session.teacher.lastName}</span></>
                      )}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(session.status)}>
                    {session.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {session.description && (
                  <p className="text-gray-700 mb-4">{session.description}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(session.scheduledAt), 'EEEE, MMM dd, yyyy')}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {format(new Date(session.scheduledAt), 'HH:mm')} • {session.duration} min
                  </span>
                  {session.meetingLink && session.status === 'CONFIRMED' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-800">
                          <Video className="w-5 h-5" />
                          <span className="font-medium">Video meeting ready</span>
                        </div>
                        <VideoCallButton 
                          meetingLink={session.meetingLink} 
                          sessionTitle={session.title}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {canConfirm(session) && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => updateSessionStatus(session.id, 'CONFIRMED')}
                      disabled={updatingStatus === session.id}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm
                    </Button>
                  )}
                  
                  {canComplete(session) && (
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        if (window.confirm('Mark this session as completed? This will allow the student to leave a review.')) {
                          updateSessionStatus(session.id, 'COMPLETED');
                        }
                      }}
                      disabled={updatingStatus === session.id}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Session
                    </Button>
                  )}
                  
                  {canCancel(session) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel this session?')) {
                          updateSessionStatus(session.id, 'CANCELLED');
                        }
                      }}
                      disabled={updatingStatus === session.id}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                  
                  {canReview(session) && (
                    <ReviewDialog
                      sessionId={session.id}
                      revieweeId={user?.id === session.teacher.id ? session.learner.id : session.teacher.id}
                      revieweeName={user?.id === session.teacher.id ? 
                        `${session.learner.firstName} ${session.learner.lastName}` : 
                        `${session.teacher.firstName} ${session.teacher.lastName}`
                      }
                      onReviewSubmitted={loadSessions}
                      trigger={
                        <Button size="sm" variant="outline">
                          <Star className="w-4 h-4 mr-2" />
                          Leave Review
                        </Button>
                      }
                    />
                  )}
                  
                  {session.status === 'PENDING' && user?.id !== session.teacher.id && (
                    <div className="flex items-center text-xs text-gray-500 ml-auto">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Waiting for teacher confirmation
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
