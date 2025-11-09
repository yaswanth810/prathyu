import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { messagesAPI } from '../lib/api';
import { Conversation, Message } from '../types';
import { Send, MessageCircle, Search, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';
import { Skeleton } from '../components/ui/Skeleton';
import { showToast } from '../components/ui/Toast';
import { socketService } from '../lib/socket';
import { useAuthStore } from '../store/authStore';
import { getInitials, formatDateTime } from '../lib/utils';
import { format, isToday, isYesterday } from 'date-fns';

export default function Messages() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadConversations();
    setupSocketListeners();

    // Check if we need to auto-select a conversation from navigation state
    const state = location.state as { selectUserId?: string };
    if (state?.selectUserId) {
      setTimeout(() => {
        setSelectedConversation(state.selectUserId!);
      }, 500);
    }

    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedConversation) {
      markAsRead(selectedConversation);
    }
  }, [selectedConversation, messages]);

  const loadConversations = async () => {
    try {
      const { data } = await messagesAPI.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      showToast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.connect();

    // Listen for new messages
    socketService.on('receive_message', (message: Message) => {
      if (selectedConversation === message.senderId || selectedConversation === message.receiverId) {
        setMessages((prev) => [...prev, message]);
      }
      loadConversations(); // Update conversation list
    });

    // Listen for typing events
    socketService.on('user_typing', ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => new Set(prev).add(userId));
    });

    socketService.on('user_stopped_typing', ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markAsRead = async (userId: string) => {
    try {
      await messagesAPI.markAsRead(userId);
      // Update unread count in conversations
      setConversations((prev) =>
        prev.map((conv) =>
          conv.partner.id === userId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const loadMessages = async (userId: string, partner: any) => {
    try {
      const { data } = await messagesAPI.getMessages(userId);
      setMessages(data);
      setSelectedConversation(userId);
      setSelectedPartner(partner);
    } catch (error) {
      console.error('Failed to load messages:', error);
      showToast.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    const messageContent = newMessage;
    setNewMessage(''); // Optimistic UI update

    try {
      const { data } = await messagesAPI.send({ content: messageContent, receiverId: selectedConversation });
      
      // Emit via socket for real-time delivery
      socketService.emit('send_message', {
        receiverId: selectedConversation,
        content: messageContent,
      });

      // Stop typing indicator
      socketService.emit('stop_typing', { receiverId: selectedConversation });
      
      // Add message to local state (optimistic)
      setMessages((prev) => [...prev, data]);
      loadConversations(); // Update conversation list
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Failed to send message');
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    if (!selectedConversation) return;

    // Emit typing event
    socketService.emit('typing', { receiverId: selectedConversation });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit('stop_typing', { receiverId: selectedConversation });
    }, 1000);
  };

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm');
    } else if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, 'HH:mm')}`;
    } else {
      return format(messageDate, 'MMM dd, HH:mm');
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    `${conv.partner.firstName} ${conv.partner.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          <Card className="col-span-1">
            <CardContent className="p-4">
              <Skeleton className="h-10 w-full mb-4" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardContent className="p-6 h-full flex items-center justify-center">
              <Skeleton className="h-32 w-64" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MessageCircle className="w-5 h-5" />
          <span>{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
        {/* Conversations List */}
        <Card className="col-span-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto space-y-1">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm">
                    {searchQuery ? 'No conversations found' : 'No messages yet'}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.partner.id}
                    onClick={() => loadMessages(conv.partner.id, conv.partner)}
                    className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors relative ${
                      selectedConversation === conv.partner.id ? 'bg-primary-50 border border-primary-200' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {getInitials(conv.partner.firstName, conv.partner.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900 truncate">
                            {conv.partner.firstName} {conv.partner.lastName}
                          </span>
                          {conv.unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatMessageTime(conv.lastMessage.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="col-span-2 flex flex-col">
          {selectedConversation && selectedPartner ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {getInitials(selectedPartner.firstName, selectedPartner.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {selectedPartner.firstName} {selectedPartner.lastName}
                      </CardTitle>
                      {typingUsers.has(selectedConversation) && (
                        <p className="text-xs text-gray-500 italic">typing...</p>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isOwn = msg.senderId === user?.id;
                    const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;

                    return (
                      <div key={msg.id} className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        {!isOwn && showAvatar && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(selectedPartner.firstName, selectedPartner.lastName)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {!isOwn && !showAvatar && <div className="w-8" />}
                        
                        <div className={`flex flex-col max-w-xs ${isOwn ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isOwn
                                ? 'bg-primary-600 text-white rounded-br-sm'
                                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                            }`}
                          >
                            <p className="break-words">{msg.content}</p>
                          </div>
                          <span className="text-xs text-gray-400 mt-1 px-1">
                            {formatMessageTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={sending}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim() || sending}>
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm mt-1">Choose from your existing conversations or start a new one</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
