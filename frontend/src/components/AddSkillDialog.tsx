import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { showToast } from './ui/Toast';

interface AddSkillDialogProps {
  type: 'teach' | 'learn';
  onSkillAdded: () => void;
}

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const SKILL_CATEGORIES = [
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Language',
  'Music',
  'Art',
  'Cooking',
  'Sports',
  'Other',
];

export function AddSkillDialog({ type, onSkillAdded }: AddSkillDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    level: 'Intermediate',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/skills', {
        ...formData,
        type,
      });
      showToast.success(`Skill added to ${type === 'teach' ? 'teaching' : 'learning'} list!`);
      setOpen(false);
      setFormData({
        name: '',
        category: 'Programming',
        level: 'Intermediate',
        description: '',
      });
      onSkillAdded();
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add {type === 'teach' ? 'Teaching' : 'Learning'} Skill</DialogTitle>
            <DialogDescription>
              Add a new skill you want to {type === 'teach' ? 'teach' : 'learn'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Skill Name *
              </label>
              <Input
                id="name"
                placeholder="e.g. React, Guitar, Spanish"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category *
              </label>
              <select
                id="category"
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {SKILL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="level" className="text-sm font-medium">
                Level *
              </label>
              <select
                id="level"
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                required
              >
                {SKILL_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <textarea
                id="description"
                placeholder="Tell us more about your experience or learning goals..."
                className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Skill'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
