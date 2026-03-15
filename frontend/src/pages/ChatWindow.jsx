import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Send, Phone, Video, MoreVertical, 
  Image, Smile, Paperclip, Check, CheckCheck,
  Mic, User, Heart, Star, Clock, Calendar,
  Download, Copy, Trash2, Flag, Volume2,
  Play, Pause, X, Circle, CheckCircle2,
  Reply, CornerUpLeft, MessageCircle, Maximize2,
  Minimize2, VolumeX, Volume1, Camera,
  GalleryHorizontal, File, Music, Headphones,
  AudioLines, Image as ImageIcon, StopCircle,
  PauseCircle, PlayCircle, Loader, Trash,
  Delete, Eraser, CheckSquare, Square,
  AlertTriangle, Info, Settings, Menu
} from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://100.99.169.71:5000/api';
const SOCKET_URL = 'http://100.99.169.71:5000';

// Image Modal Component
const ImageModal = ({ isOpen, onClose, imageUrl, caption }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative max-w-6xl max-h-[90vh] m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={caption || 'Image'}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
        >
          <X className="w-6 h-6" />
        </button>
        {caption && caption !== '📷 Image' && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg backdrop-blur-sm">
            {caption}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-6 w-full max-w-md border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-500/20 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        
        <p className="text-white/70 mb-6">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Select Mode Modal
const SelectModeModal = ({ isOpen, onClose, selectedCount, onDeleteSelected, onClearAll }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900 to-pink-900 border-t border-white/20 p-4 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">{selectedCount} messages selected</p>
            <p className="text-white/60 text-sm">Tap to select more</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onDeleteSelected}
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
          <button
            onClick={onClearAll}
            className="px-4 py-2 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <Eraser className="w-4 h-4" />
            Clear All
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function ChatWindow({ user, onLogout }) {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [contact, setContact] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageCaption, setSelectedImageCaption] = useState('');
  
  // ============= NEW DELETE FEATURES =============
  const [showMenu, setShowMenu] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // 'clear' or 'selected'
  const [deleting, setDeleting] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io(SOCKET_URL, { 
      auth: { token },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      if (message.sender_id !== user.id) {
        markMessageAsRead(message.id);
      }
    });

    newSocket.on('user_typing', ({ from, isTyping }) => {
      if (from === contactId) {
        setIsTyping(isTyping);
      }
    });

    newSocket.on('messages_read', ({ messageIds }) => {
      setMessages(prev => prev.map(msg => 
        messageIds.includes(msg.id) ? { ...msg, read: true } : msg
      ));
    });

    // Listen for messages deleted by other user
    newSocket.on('messages_deleted', ({ messageIds }) => {
      setMessages(prev => prev.filter(msg => !messageIds.includes(msg.id)));
      if (selectMode) {
        setSelectedMessages(prev => prev.filter(id => !messageIds.includes(id)));
      }
    });

    // Listen for chat cleared by other user
    newSocket.on('chat_cleared', ({ userId }) => {
      setMessages([]);
      setSelectMode(false);
      setSelectedMessages([]);
      toast.info('Chat was cleared by the other user');
    });

    setSocket(newSocket);

    fetchContact();
    fetchMessages();

    return () => {
      newSocket.disconnect();
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [contactId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchContact = async () => {
    try {
      const response = await axios.get(`${API_URL}/contacts/${user.id}`);
      const found = response.data.contacts.find(c => c.contact.id === contactId);
      setContact(found);
    } catch (error) {
      toast.error('Failed to load contact');
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages/${user.id}/${contactId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await axios.post(`${API_URL}/messages/read`, { messageIds: [messageId] });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  // ============= DELETE FUNCTIONS =============

  // Toggle message selection in select mode
  const toggleMessageSelection = (messageId) => {
    if (!selectMode) return;
    
    setSelectedMessages(prev => {
      if (prev.includes(messageId)) {
        return prev.filter(id => id !== messageId);
      } else {
        return [...prev, messageId];
      }
    });
  };

  // Enter select mode
  const enterSelectMode = () => {
    setSelectMode(true);
    setShowMenu(false);
    setSelectedMessages([]);
  };

  // Exit select mode
  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedMessages([]);
  };

  // Clear entire chat history
  const clearChatHistory = async () => {
    setDeleting(true);
    try {
      const response = await axios.delete(`${API_URL}/messages/clear/${user.id}/${contactId}`);
      
      if (response.data.success) {
        setMessages([]);
        exitSelectMode();
        toast.success('Chat history cleared!');
        
        // Notify other user via socket
        if (socket) {
          socket.emit('chat_cleared', { with: contactId });
        }
      }
    } catch (error) {
      toast.error('Failed to clear chat history');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Delete selected messages
  const deleteSelectedMessages = async () => {
    if (selectedMessages.length === 0) {
      toast.error('No messages selected');
      return;
    }

    setDeleting(true);
    try {
      const response = await axios.delete(`${API_URL}/messages/delete`, {
        data: { messageIds: selectedMessages }
      });
      
      if (response.data.success) {
        setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg.id)));
        exitSelectMode();
        toast.success(`${selectedMessages.length} messages deleted!`);
        
        // Notify other user via socket
        if (socket) {
          socket.emit('messages_deleted', { 
            to: contactId, 
            messageIds: selectedMessages 
          });
        }
      }
    } catch (error) {
      toast.error('Failed to delete messages');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Handle delete confirmation
  const confirmDelete = (type) => {
    setDeleteType(type);
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  // Execute delete based on type
  const executeDelete = () => {
    if (deleteType === 'clear') {
      clearChatHistory();
    } else if (deleteType === 'selected') {
      deleteSelectedMessages();
    }
  };

  // ============= TEXT MESSAGE =============
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageToSend = newMessage;
    setNewMessage('');
    
    try {
      const response = await axios.post(`${API_URL}/messages/send`, {
        senderId: user.id,
        receiverId: contactId,
        content: messageToSend
      });

      setMessages(prev => [...prev, response.data.message]);
      
      if (socket) {
        socket.emit('typing', { to: contactId, isTyping: false });
      }
    } catch (error) {
      toast.error('Failed to send message');
      setNewMessage(messageToSend);
    }
  };

  // ============= IMAGE HANDLING =============
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setUploading(true);
    const toastId = toast.loading('Uploading image...');

    const reader = new FileReader();
    reader.onload = async (readerEvent) => {
      const imageData = readerEvent.target.result;
      
      try {
        const response = await axios.post(`${API_URL}/messages/send-image`, {
          senderId: user.id,
          receiverId: contactId,
          imageData: imageData,
          caption: newMessage || '📷 Image'
        });

        setMessages(prev => [...prev, response.data.message]);
        setNewMessage('');
        
        toast.success('Image sent!', { id: toastId });
        
        if (socket) {
          socket.emit('typing', { to: contactId, isTyping: false });
        }
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error('Failed to send image', { id: toastId });
      } finally {
        setUploading(false);
      }
    };
    
    reader.readAsDataURL(file);
  };

  // ============= VOICE MESSAGE HANDLING =============
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
    }
  };

  const sendVoiceMessage = async () => {
    if (!audioBlob) return;

    setUploading(true);
    const toastId = toast.loading('Sending voice message...');

    const reader = new FileReader();
    reader.onload = async (readerEvent) => {
      const audioData = readerEvent.target.result;
      
      try {
        const response = await axios.post(`${API_URL}/messages/send-voice`, {
          senderId: user.id,
          receiverId: contactId,
          audioData: audioData,
          duration: recordingTime
        });

        setMessages(prev => [...prev, response.data.message]);
        setAudioBlob(null);
        setAudioUrl(null);
        
        toast.success('Voice message sent!', { id: toastId });
      } catch (error) {
        console.error('Voice send error:', error);
        toast.error('Failed to send voice message', { id: toastId });
      } finally {
        setUploading(false);
      }
    };
    
    reader.readAsDataURL(audioBlob);
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
      setAudioBlob(null);
      setAudioUrl(null);
    }
  };

  // ============= AUDIO PLAYBACK =============
  const toggleAudioPlayback = (messageId, audioUrl) => {
    if (playingAudio === messageId) {
      const audio = document.getElementById(`audio-${messageId}`);
      if (audio) {
        audio.pause();
      }
      setPlayingAudio(null);
    } else {
      if (playingAudio) {
        const prevAudio = document.getElementById(`audio-${playingAudio}`);
        if (prevAudio) {
          prevAudio.pause();
        }
      }

      const audio = document.getElementById(`audio-${messageId}`);
      if (audio) {
        audio.play();
        audio.addEventListener('ended', () => {
          setPlayingAudio(null);
        });
        setPlayingAudio(messageId);
      }
    }
  };

  const handleTyping = () => {
    if (socket && newMessage.length === 1) {
      socket.emit('typing', { to: contactId, isTyping: true });
    }
    
    if (socket && newMessage.length === 0) {
      socket.emit('typing', { to: contactId, isTyping: false });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openImageModal = (imageUrl, caption) => {
    setSelectedImage(imageUrl);
    setSelectedImageCaption(caption);
    setModalOpen(true);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/10 backdrop-blur-xl border-b border-white/10 px-4 py-3 sticky top-0 z-10"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (selectMode) {
                  exitSelectMode();
                } else {
                  navigate('/contacts');
                }
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-all"
            >
              {selectMode ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <ArrowLeft className="w-5 h-5 text-white" />
              )}
            </motion.button>
            
            {!selectMode && contact && (
              <>
                <div className="relative">
                  <img
                    src={contact.contact.avatar_url || `https://ui-avatars.com/api/?name=${contact.contact.full_name}&background=8B5CF6&color=fff`}
                    alt={contact.contact.full_name}
                    className="w-10 h-10 rounded-full ring-2 ring-purple-500"
                  />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                    contact.contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
                
                <div>
                  <h1 className="font-semibold text-white">
                    {contact.contact_name || contact.contact.full_name}
                  </h1>
                  <p className="text-xs text-white/60">
                    {isTyping ? (
                      <span className="text-green-400 flex items-center gap-1">
                        <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce delay-200"></span>
                        Typing...
                      </span>
                    ) : (
                      contact.contact.status === 'online' ? 'Online' : 'Offline'
                    )}
                  </p>
                </div>
              </>
            )}

            {selectMode && (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-white font-semibold">{selectedMessages.length} selected</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 relative">
            {!selectMode ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/10 rounded-full transition-all"
                >
                  <Phone className="w-5 h-5 text-white/60 hover:text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/10 rounded-full transition-all"
                >
                  <Video className="w-5 h-5 text-white/60 hover:text-white" />
                </motion.button>
                
                {/* Menu Button */}
                <div ref={menuRef} className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-white/10 rounded-full transition-all"
                  >
                    <MoreVertical className="w-5 h-5 text-white/60 hover:text-white" />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden z-20"
                      >
                        <button
                          onClick={enterSelectMode}
                          className="w-full px-4 py-3 text-left text-white hover:bg-white/10 flex items-center gap-3 transition-all"
                        >
                          <CheckSquare className="w-5 h-5" />
                          <span>Select Messages</span>
                        </button>
                        <button
                          onClick={() => confirmDelete('clear')}
                          className="w-full px-4 py-3 text-left text-red-400 hover:bg-white/10 flex items-center gap-3 transition-all"
                        >
                          <Eraser className="w-5 h-5" />
                          <span>Clear Chat History</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            // Add more options here
                          }}
                          className="w-full px-4 py-3 text-left text-white hover:bg-white/10 flex items-center gap-3 transition-all"
                        >
                          <Info className="w-5 h-5" />
                          <span>Contact Info</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => confirmDelete('selected')}
                  disabled={selectedMessages.length === 0 || deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
                <button
                  onClick={exitSelectMode}
                  className="px-4 py-2 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white/60">Loading messages...</p>
          </div>
        ) : Object.keys(groupedMessages).length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-12 h-12 text-white/40" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No messages yet</h3>
            <p className="text-white/60 max-w-sm">
              Send a message to start chatting
            </p>
          </motion.div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages], dateIndex) => (
            <div key={date}>
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dateIndex * 0.1 }}
                className="flex justify-center mb-4"
              >
                <span className="text-xs bg-white/10 backdrop-blur-sm text-white/60 px-3 py-1 rounded-full border border-white/20">
                  {date}
                </span>
              </motion.div>
              
              <div className="space-y-2">
                {dateMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                    onClick={() => selectMode && toggleMessageSelection(message.id)}
                  >
                    {/* Selection Indicator */}
                    {selectMode && (
                      <div className="flex items-center mr-2">
                        {selectedMessages.includes(message.id) ? (
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-white/30 rounded-full" />
                        )}
                      </div>
                    )}

                    {message.sender_id !== user.id && !selectMode && (
                      <img
                        src={contact?.contact.avatar_url || `https://ui-avatars.com/api/?name=${contact?.contact.full_name}&background=8B5CF6&color=fff`}
                        className="w-8 h-8 rounded-full mr-2 self-end"
                        alt=""
                      />
                    )}
                    
                    {/* TEXT MESSAGE */}
                    {message.message_type === 'text' && (
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl relative group ${
                          message.sender_id === user.id
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                            : 'bg-white/10 backdrop-blur-sm text-white rounded-bl-none border border-white/20'
                        } ${selectMode ? 'cursor-pointer' : ''}`}
                      >
                        {message.replyTo && (
                          <div className="text-xs opacity-70 mb-1 p-1 bg-black/20 rounded flex items-center gap-1">
                            <CornerUpLeft className="w-3 h-3" />
                            <span>Replying to previous message</span>
                          </div>
                        )}
                        
                        <p className="break-words pr-6">{message.content}</p>
                        
                        <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                          message.sender_id === user.id ? 'text-purple-200' : 'text-white/40'
                        }`}>
                          <span>{formatTime(message.created_at)}</span>
                          {message.sender_id === user.id && (
                            message.read ? (
                              <CheckCheck className="w-3 h-3 text-blue-300" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* IMAGE MESSAGE */}
                    {message.message_type === 'image' && (
                      <div
                        className={`max-w-[70%] rounded-2xl overflow-hidden relative group ${
                          message.sender_id === user.id
                            ? 'rounded-br-none'
                            : 'rounded-bl-none'
                        } ${selectMode ? 'cursor-pointer' : ''}`}
                      >
                        <div className="relative">
                          <img
                            src={message.media_url}
                            alt={message.content}
                            className="w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={(e) => {
                              if (!selectMode) {
                                e.stopPropagation();
                                openImageModal(message.media_url, message.content);
                              }
                            }}
                          />
                          
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                            <Maximize2 className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        
                        {message.content && message.content !== '📷 Image' && (
                          <p className="p-2 bg-black/50 text-white text-sm backdrop-blur-sm">
                            {message.content}
                          </p>
                        )}
                        
                        <div className={`absolute bottom-2 right-2 flex items-center gap-1 text-xs bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm`}>
                          <span>{formatTime(message.created_at)}</span>
                          {message.sender_id === user.id && (
                            message.read ? (
                              <CheckCheck className="w-3 h-3 text-blue-300" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* VOICE MESSAGE */}
                    {message.message_type === 'voice' && (
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl relative group ${
                          message.sender_id === user.id
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                            : 'bg-white/10 backdrop-blur-sm text-white rounded-bl-none border border-white/20'
                        } ${selectMode ? 'cursor-pointer' : ''}`}
                      >
                        <audio
                          id={`audio-${message.id}`}
                          src={message.media_url}
                          preload="metadata"
                        />
                        
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAudioPlayback(message.id, message.media_url);
                            }}
                            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"
                          >
                            {playingAudio === message.id ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </motion.button>

                          <div className="flex-1">
                            <div className="h-8 bg-white/10 rounded-full overflow-hidden flex items-center">
                              <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                                   style={{ width: playingAudio === message.id ? '60%' : '0%' }} />
                            </div>
                          </div>

                          <span className="text-xs opacity-80 min-w-[40px]">
                            {formatDuration(message.duration || 0)}
                          </span>
                        </div>

                        <div className={`flex items-center justify-end gap-1 mt-2 text-xs ${
                          message.sender_id === user.id ? 'text-purple-200' : 'text-white/40'
                        }`}>
                          <span>{formatTime(message.created_at)}</span>
                          {message.sender_id === user.id && (
                            message.read ? (
                              <CheckCheck className="w-3 h-3 text-blue-300" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <img
              src={contact?.contact.avatar_url || `https://ui-avatars.com/api/?name=${contact?.contact.full_name}&background=8B5CF6&color=fff`}
              className="w-8 h-8 rounded-full mr-2"
              alt=""
            />
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl rounded-bl-none border border-white/20">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-white/10 backdrop-blur-xl border-t border-white/10 px-4 py-2"
          >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-2 flex-1">
                <Reply className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white/60">Replying to</span>
                <span className="text-sm text-white truncate">{replyTo.content}</span>
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-red-500/20 backdrop-blur-xl border-t border-red-500/30 px-4 py-2"
          >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white">Recording... {formatDuration(recordingTime)}</span>
              </div>
              <button
                onClick={stopRecording}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Stop
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Preview */}
      <AnimatePresence>
        {audioUrl && !isRecording && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-white/10 backdrop-blur-xl border-t border-white/10 px-4 py-2"
          >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-3 flex-1">
                <Headphones className="w-5 h-5 text-white/60" />
                <span className="text-white">Voice message ({formatDuration(recordingTime)})</span>
                <audio src={audioUrl} controls className="h-8 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={sendVoiceMessage}
                  disabled={uploading}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 disabled:opacity-50"
                >
                  {uploading ? 'Sending...' : 'Send'}
                </button>
                <button
                  onClick={cancelRecording}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      {!selectMode && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl border-t border-white/10 p-3"
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto">
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              className="p-2 hover:bg-white/10 rounded-full transition-all disabled:opacity-50"
            >
              <Image className="w-5 h-5 text-white/60 hover:text-white" />
            </motion.button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={handleKeyPress}
                placeholder={uploading ? 'Uploading...' : 'Type a message...'}
                disabled={uploading}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 pr-12 disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
              >
                <Smile className="w-5 h-5 text-white/60 hover:text-white" />
              </motion.button>
            </div>
            
            {newMessage.trim() ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                disabled={uploading}
                className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                disabled={uploading}
                className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all disabled:opacity-50"
              >
                <Mic className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDelete}
        title={deleteType === 'clear' ? 'Clear Chat History' : 'Delete Messages'}
        message={
          deleteType === 'clear'
            ? 'Are you sure you want to clear all messages? This action cannot be undone.'
            : `Are you sure you want to delete ${selectedMessages.length} selected message(s)? This action cannot be undone.`
        }
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={selectedImage}
        caption={selectedImageCaption}
      />
    </div>
  );
}

export default ChatWindow;
