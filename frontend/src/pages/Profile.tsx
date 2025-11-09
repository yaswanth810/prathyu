import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { skillsAPI } from '../lib/api';
import { Skill } from '../types';
import { Trash2, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AddSkillDialog } from '../components/AddSkillDialog';
import { showToast } from '../components/ui/Toast';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const [skills, setSkills] = useState<{ teachSkills: Skill[]; learnSkills: Skill[] }>({
    teachSkills: [],
    learnSkills: [],
  });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const { data } = await skillsAPI.getMySkills();
      setSkills(data);
    } catch (error) {
      console.error('Failed to load skills:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      await skillsAPI.delete(id);
      showToast.success('Skill deleted successfully');
      loadSkills();
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Failed to delete skill');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account and skills</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <Button
              onClick={() => editing ? handleUpdate() : setEditing(true)}
              variant={editing ? 'default' : 'outline'}
            >
              {editing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>

        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900">{user?.firstName} {user?.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            {user?.bio && (
              <div>
                <label className="text-sm font-medium text-gray-500">Bio</label>
                <p className="text-gray-900">{user.bio}</p>
              </div>
            )}
          </div>
        )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Skills to Teach</CardTitle>
            <AddSkillDialog type="teach" onSkillAdded={loadSkills} />
          </div>
        </CardHeader>
        <CardContent>
          {skills.teachSkills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No teaching skills added yet</p>
              <p className="text-sm mt-1">Share your expertise with others!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {skills.teachSkills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{skill.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{skill.category}</Badge>
                      <Badge variant="outline">{skill.level}</Badge>
                    </div>
                    {skill.description && (
                      <p className="text-sm text-gray-600 mt-2">{skill.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSkill(skill.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Skills to Learn</CardTitle>
            <AddSkillDialog type="learn" onSkillAdded={loadSkills} />
          </div>
        </CardHeader>
        <CardContent>
          {skills.learnSkills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No learning goals added yet</p>
              <p className="text-sm mt-1">Add skills you want to learn!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {skills.learnSkills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{skill.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="info">{skill.category}</Badge>
                      <Badge variant="outline">{skill.level}</Badge>
                    </div>
                    {skill.description && (
                      <p className="text-sm text-gray-600 mt-2">{skill.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSkill(skill.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
