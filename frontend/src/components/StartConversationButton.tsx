import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { messagesAPI } from '../lib/api';
import { Button } from './ui/Button';
import { MessageCircle } from 'lucide-react';
import { showToast } from './ui/Toast';

interface StartConversationButtonProps {
  userId: string;
  userName: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'lg';
  className?: string;
}

export function StartConversationButton({ 
  userId, 
  userName, 
  variant = 'outline',
  size = 'sm',
  className = ''
}: StartConversationButtonProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStartConversation = async () => {
    setLoading(true);
    try {
      // Send an initial message to create/ensure conversation exists
      await messagesAPI.send({
        receiverId: userId,
        content: `Hi ${userName}! 👋`
      });
      showToast.success(`Opening chat with ${userName}`);
      
      // Small delay to ensure message is sent
      setTimeout(() => {
        navigate('/messages', { state: { selectUserId: userId } });
      }, 300);
    } catch (error: any) {
      console.error('Error starting conversation:', error);
      // Even if sending fails, try to navigate to messages
      navigate('/messages', { state: { selectUserId: userId } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleStartConversation}
      disabled={loading}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      {loading ? 'Opening...' : 'Message'}
    </Button>
  );
}
