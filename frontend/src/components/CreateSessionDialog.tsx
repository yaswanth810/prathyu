import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Calendar, Clock, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { showToast } from './ui/Toast';
import { format } from 'date-fns';

interface CreateSessionDialogProps {
  teacherId?: string;
  teacherName?: string;
  onSessionCreated?: () => void;
}

export function CreateSessionDialog({ teacherId, teacherName, onSessionCreated }: CreateSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: '60',
    meetingLink: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teacherId) {
      showToast.error('Teacher ID is required');
      return;
    }

    setLoading(true);

    try {
      // Combine date and time
      const scheduledAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      await api.post('/sessions', {
        teacherId,
        title: formData.title,
        description: formData.description,
        scheduledAt: scheduledAt.toISOString(),
        duration: parseInt(formData.duration),
        meetingLink: formData.meetingLink || undefined,
      });

      showToast.success('Session booked successfully!');
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        scheduledDate: '',
        scheduledTime: '',
        duration: '60',
        meetingLink: '',
      });
      onSessionCreated?.();
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Book Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Book a Learning Session</DialogTitle>
            <DialogDescription>
              {teacherName ? `Schedule a session with ${teacherName}` : 'Create a new learning session'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Session Title *
              </label>
              <Input
                id="title"
                placeholder="e.g. React Basics, Guitar Lesson"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                placeholder="What would you like to learn or discuss?"
                className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date *
                </label>
                <Input
                  id="date"
                  type="date"
                  min={today}
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time *
                </label>
                <Input
                  id="time"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="duration" className="text-sm font-medium">
                Duration (minutes) *
              </label>
              <select
                id="duration"
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="meetingLink" className="text-sm font-medium">
                Meeting Link (Optional)
              </label>
              <Input
                id="meetingLink"
                type="url"
                placeholder="https://zoom.us/j/... or Google Meet link"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                You can add this later if you don't have it now
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Booking...' : 'Book Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
