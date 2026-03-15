import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, UserPlus, MessageCircle, LogOut, Users,
  Settings, Phone, Video, CheckCircle, XCircle,
  Share2, Copy, Check, Smartphone, RefreshCw,
  UploadCloud, AlertCircle, Link as LinkIcon,
  Mail, Globe, Instagram, Facebook, Twitter,
  User, Star, Award, Clock, Filter, Grid3x3,
  List, MoreVertical, Heart, MessageSquare,
  Download, Upload, FileText, Trash2, UserMinus,
  Wifi, WifiOff, Zap, Shield, Bell, Moon
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import * as XLSX from 'xlsx';
import io from 'socket.io-client';

const API_URL = 'http://100.99.169.71:5000/api';
const SOCKET_URL = 'http://100.99.169.71:5000';
const INVITE_LINK = 'https://chatinsta.com/join';

function Contacts({ user, onLogout }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [deviceContacts, setDeviceContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactToRemove, setContactToRemove] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showDeviceContacts, setShowDeviceContacts] = useState(false);
  const [showManualUpload, setShowManualUpload] = useState(false);
  const [manualContacts, setManualContacts] = useState('');
  const [addingContacts, setAddingContacts] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filterOnline, setFilterOnline] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [socket, setSocket] = useState(null);
  const [removing, setRemoving] = useState(false);

  // Socket connection for real-time status
  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Socket connected for contacts');
    });

    newSocket.on('user_online', (userId) => {
      console.log(`User ${userId} came online`);
      updateContactStatus(userId, 'online');
    });

    newSocket.on('user_offline', (userId) => {
      console.log(`User ${userId} went offline`);
      updateContactStatus(userId, 'offline');
    });

    newSocket.on('contact_removed', ({ contactId }) => {
      console.log(`Contact ${contactId} was removed`);
      setContacts(prev => prev.filter(c => c.contact.id !== contactId));
      toast.success('Contact was removed', { icon: '🗑️' });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Update contact status in contacts list
  const updateContactStatus = (userId, status) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => {
        if (contact.contact.id === userId) {
          return {
            ...contact,
            contact: {
              ...contact.contact,
              status: status
            }
          };
        }
        return contact;
      })
    );
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_URL}/contacts/${user.id}`);
      setContacts(response.data.contacts || []);
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const syncDeviceContacts = () => {
    setShowManualUpload(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        const parsed = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row.length >= 2) {
            const name = String(row[0] || '').trim();
            const phone = String(row[1] || '').replace(/\D/g, '').slice(-10);
            if (phone.length === 10) {
              parsed.push({
                name: name || 'Unknown',
                phone,
                displayName: name || phone,
                selected: false
              });
            }
          }
        }

        setDeviceContacts(parsed);
        setShowDeviceContacts(true);
        setShowManualUpload(false);
        toast.success(`Loaded ${parsed.length} contacts from Excel!`);
      } catch (error) {
        toast.error('Failed to parse Excel file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const parseManualContacts = () => {
    const lines = manualContacts.split('\n');
    const parsed = lines.map(line => {
      let name = 'Unknown';
      let phone = '';

      const dashMatch = line.match(/(.+)[-\s]+(\d{10})/);
      const commaMatch = line.match(/(.+)[,\s]+(\d{10})/);
      
      if (dashMatch) {
        name = dashMatch[1].trim();
        phone = dashMatch[2];
      } else if (commaMatch) {
        name = commaMatch[1].trim();
        phone = commaMatch[2];
      } else {
        phone = line.replace(/\D/g, '').slice(-10);
      }

      if (phone && phone.length === 10) {
        return { 
          name: name !== 'Unknown' ? name : phone, 
          phone, 
          displayName: name !== 'Unknown' ? name : phone,
          selected: false 
        };
      }
      return null;
    }).filter(c => c && c.phone.length === 10);

    setDeviceContacts(parsed);
    setShowDeviceContacts(true);
    setShowManualUpload(false);
    setManualContacts('');
    toast.success(`Added ${parsed.length} contacts!`);
  };

  const checkAndAddContact = async (contactPhone, contactName) => {
    try {
      const response = await axios.post(`${API_URL}/contacts/check`, {
        phoneNumber: contactPhone
      });

      if (response.data.exists) {
        const addResponse = await axios.post(`${API_URL}/contacts/add`, {
          userId: user.id,
          contactPhone: contactPhone,
          contactName: contactName
        });

        if (addResponse.data.success) {
          setContacts(prev => [addResponse.data.contact, ...prev]);
          return { success: true, added: true, name: contactName };
        }
      } else {
        setSelectedContact({ 
          name: contactName, 
          phone: contactPhone,
          displayName: contactName 
        });
        setShowInviteModal(true);
        return { success: false, added: false, invite: true };
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setSelectedContact({ 
          name: contactName, 
          phone: contactPhone,
          displayName: contactName 
        });
        setShowInviteModal(true);
        return { success: false, added: false, invite: true };
      }
      return { success: false, added: false, error: true };
    }
  };

  // ============= FIXED REMOVE CONTACT FUNCTION =============
  const removeContact = async () => {
    if (!contactToRemove) return;

    setRemoving(true);
    try {
      console.log('Attempting to remove contact:', contactToRemove);
      
      const response = await axios.delete(
        `${API_URL}/contacts/${user.id}/${contactToRemove.contact.id}`
      );

      if (response.data.success) {
        // Remove from local state
        setContacts(prev => prev.filter(c => c.id !== contactToRemove.id));
        
        toast.success(
          <div className="flex items-center gap-2">
            <UserMinus className="w-4 h-4" />
            <span>{contactToRemove.contact_name || contactToRemove.contact.full_name} removed from contacts</span>
          </div>,
          { duration: 3000 }
        );
        
        setShowRemoveModal(false);
        setContactToRemove(null);
      }
    } catch (error) {
      console.error('Remove error:', error);
      
      let errorMessage = 'Failed to remove contact';
      if (error.response) {
        errorMessage = error.response.data?.message || 'Server error';
        console.log('Server response:', error.response.data);
      } else if (error.request) {
        errorMessage = 'Cannot connect to server';
      } else {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        icon: '❌',
        duration: 4000
      });
    } finally {
      setRemoving(false);
    }
  };

  const addSelectedContacts = async () => {
    const selected = deviceContacts.filter(c => c.selected);
    if (selected.length === 0) {
      toast.error('No contacts selected');
      return;
    }

    setAddingContacts(true);
    let added = 0;
    let invited = 0;

    for (const contact of selected) {
      const result = await checkAndAddContact(contact.phone, contact.name);
      if (result?.added) added++;
      else if (result?.invite) invited++;
    }

    setShowDeviceContacts(false);
    setAddingContacts(false);
    
    if (added > 0 || invited > 0) {
      toast.success(
        <div className="py-2">
          <p className="font-bold mb-2">Contacts Processed!</p>
          <p className="text-sm text-green-400">✓ {added} added to ChatInsta</p>
          <p className="text-sm text-yellow-400">✉ {invited} invited to join</p>
        </div>,
        { duration: 5000 }
      );
    }
  };

  const copyInviteLink = () => {
    const link = `${INVITE_LINK}?ref=${user.username}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Invite link copied!');
  };

  const shareViaWhatsApp = () => {
    const link = `${INVITE_LINK}?ref=${user.username}`;
    const text = `Join me on ChatInsta! ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaSMS = () => {
    const link = `${INVITE_LINK}?ref=${user.username}`;
    const text = `Join me on ChatInsta! ${link}`;
    window.open(`sms:${selectedContact?.phone}?body=${encodeURIComponent(text)}`, '_blank');
  };

  const handleRemoveClick = (contact, e) => {
    e.stopPropagation();
    console.log('Remove clicked for:', contact);
    setContactToRemove(contact);
    setShowRemoveModal(true);
  };

  const filteredContacts = contacts.filter(c => {
    const name = (c.contact_name || c.contact?.full_name || '').toLowerCase();
    return name.includes(search.toLowerCase()) && (filterOnline ? c.contact?.status === 'online' : true);
  });

  const onlineCount = contacts.filter(c => c.contact?.status === 'online').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/10 backdrop-blur-xl border-b border-white/10 px-4 py-3 sticky top-0 z-10"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-12 h-12 rounded-full ring-2 ring-purple-500"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
            </div>
            <div>
              <h1 className="font-bold text-white">{user.fullName}</h1>
              <p className="text-xs text-white/60 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFilterOnline(!filterOnline)}
              className={`p-2 rounded-full transition-all ${
                filterOnline ? 'bg-green-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              <Users className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 bg-white/10 text-white/60 rounded-full hover:bg-white/20 transition-all"
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/profile')}
              className="p-2 bg-white/10 text-white/60 rounded-full hover:bg-white/20 transition-all"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLogout}
              className="p-2 bg-white/10 text-white/60 rounded-full hover:bg-white/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="px-4 py-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
          />
          {onlineCount > 0 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-green-400">
              {onlineCount} online
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Contacts Button */}
      <div className="px-4 mb-6 max-w-7xl mx-auto">
        <motion.button
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={syncDeviceContacts}
          disabled={syncing}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          <Smartphone className="w-5 h-5" />
          Sync Phone Contacts
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Contacts', value: contacts.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
            { label: 'Online Now', value: onlineCount, icon: Wifi, color: 'from-green-500 to-emerald-500' },
            { label: 'Offline', value: contacts.length - onlineCount, icon: WifiOff, color: 'from-gray-500 to-gray-600' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`bg-gradient-to-r ${stat.color} p-4 rounded-xl text-white shadow-lg`}
              >
                <Icon className="w-6 h-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs opacity-80">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Contacts Grid/List */}
      <div className="px-4 pb-20 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white/60">Loading contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
          >
            <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No contacts yet</h3>
            <p className="text-white/50 mb-4">Sync your phone contacts to find friends</p>
            <button
              onClick={syncDeviceContacts}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              Sync Now
            </button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence>
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all border border-white/10 relative group"
                  onClick={() => navigate(`/chat/${contact.contact.id}`)}
                >
                  <div className="relative mb-3">
                    <img
                      src={contact.contact.avatar_url || `https://ui-avatars.com/api/?name=${contact.contact_name || contact.contact.full_name}&background=8B5CF6&color=fff`}
                      alt={contact.contact_name || contact.contact.full_name}
                      className="w-16 h-16 rounded-full mx-auto ring-2 ring-purple-500"
                    />
                    <span className={`absolute bottom-0 right-6 w-4 h-4 rounded-full ring-2 ring-white ${
                      contact.contact.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      {contact.contact.status === 'online' && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-300 rounded-full animate-ping"></span>
                      )}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-white text-center truncate">
                    {contact.contact_name || contact.contact.full_name}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {contact.contact.status === 'online' ? (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Online
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Offline
                      </span>
                    )}
                  </div>

                  {/* Remove button on hover */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={(e) => handleRemoveClick(contact, e)}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                  >
                    <UserMinus className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-all border border-white/10 relative group"
                  onClick={() => navigate(`/chat/${contact.contact.id}`)}
                >
                  <div className="relative">
                    <img
                      src={contact.contact.avatar_url || `https://ui-avatars.com/api/?name=${contact.contact_name || contact.contact.full_name}&background=8B5CF6&color=fff`}
                      alt={contact.contact_name || contact.contact.full_name}
                      className="w-12 h-12 rounded-full"
                    />
                    <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      contact.contact.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      {contact.contact.status === 'online' && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-300 rounded-full animate-ping"></span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">
                        {contact.contact_name || contact.contact.full_name}
                      </h3>
                      {contact.contact.status === 'online' ? (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Online
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Offline
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/60">
                      {contact.contact.phone || 'Available on ChatInsta'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 hover:bg-white/10 rounded-full transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle className="w-5 h-5 text-white/60 hover:text-white" />
                    </button>
                    
                    {/* Remove button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleRemoveClick(contact, e)}
                      className="p-2 hover:bg-red-500/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <UserMinus className="w-5 h-5 text-red-400 hover:text-red-500" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Manual Upload Modal */}
      <AnimatePresence>
        {showManualUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowManualUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Add Contacts</h2>
              
              <div className="space-y-4">
                {/* Excel Upload */}
                <div 
                  className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-purple-500 transition-colors cursor-pointer bg-white/5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="w-12 h-12 text-white/40 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white">Upload Excel/CSV file</p>
                  <p className="text-xs text-white/40 mt-1">Name, Phone number columns</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gradient-to-br from-purple-900 to-pink-900 text-white/60">or</span>
                  </div>
                </div>

                {/* Manual Entry */}
                <div>
                  <textarea
                    value={manualContacts}
                    onChange={(e) => setManualContacts(e.target.value)}
                    placeholder="John Doe - 9876543210&#10;Jane Smith,9876543211&#10;9876543212"
                    rows="5"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    Format: Name - Phone or just phone numbers (one per line)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={parseManualContacts}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Next
                </button>
                <button
                  onClick={() => setShowManualUpload(false)}
                  className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Device Contacts Modal */}
      <AnimatePresence>
        {showDeviceContacts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeviceContacts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto shadow-2xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Select Contacts</h2>
                <button
                  onClick={() => setShowDeviceContacts(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-all"
                >
                  <XCircle className="w-6 h-6 text-white/60" />
                </button>
              </div>

              <p className="text-white/70 mb-4">
                Select contacts to add. We'll check who's already on ChatInsta!
              </p>

              <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                {deviceContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all border border-white/10"
                  >
                    <input
                      type="checkbox"
                      checked={contact.selected}
                      onChange={() => {
                        const updated = [...deviceContacts];
                        updated[index].selected = !updated[index].selected;
                        setDeviceContacts(updated);
                      }}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {contact.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{contact.name}</p>
                      <p className="text-sm text-white/60">+91 {contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addSelectedContacts}
                  disabled={addingContacts}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {addingContacts ? (
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    `Add Selected (${deviceContacts.filter(c => c.selected).length})`
                  )}
                </button>
                <button
                  onClick={() => setShowDeviceContacts(false)}
                  className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remove Contact Confirmation Modal */}
      <AnimatePresence>
        {showRemoveModal && contactToRemove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowRemoveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/20"
            >
              <div className="text-center mb-6">
                <div className="inline-block p-3 bg-red-500/20 rounded-full mb-4">
                  <UserMinus className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Remove Contact
                </h2>
                <p className="text-white/70">
                  Are you sure you want to remove {contactToRemove.contact_name || contactToRemove.contact.full_name} from your contacts?
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src={contactToRemove.contact.avatar_url || `https://ui-avatars.com/api/?name=${contactToRemove.contact.full_name}&background=8B5CF6&color=fff`}
                    alt={contactToRemove.contact.full_name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">{contactToRemove.contact_name || contactToRemove.contact.full_name}</p>
                    <p className="text-sm text-white/60">{contactToRemove.contact.phone || 'Contact'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={removeContact}
                  disabled={removing}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {removing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    'Remove'
                  )}
                </button>
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/20"
            >
              <div className="text-center mb-6">
                <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Invite to ChatInsta
                </h2>
                <p className="text-white/70">
                  {selectedContact.displayName} isn't on ChatInsta yet
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                <p className="text-sm text-white/60 mb-1">Contact</p>
                <p className="font-medium text-white text-lg">{selectedContact.displayName}</p>
                <p className="text-white/70">+91 {selectedContact.phone}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={copyInviteLink}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Invite Link
                    </>
                  )}
                </button>

                <button
                  onClick={shareViaWhatsApp}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Share on WhatsApp
                </button>

                <button
                  onClick={shareViaSMS}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Send via SMS
                </button>
              </div>

              <button
                onClick={() => setShowInviteModal(false)}
                className="w-full mt-4 text-white/60 hover:text-white text-sm"
              >
                Maybe Later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Contacts;
