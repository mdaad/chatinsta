import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, Phone, Mail, Calendar, MapPin, Camera, 
  LogOut, ArrowLeft, Save, Heart, Star, Award,
  Shield, Bell, Moon, Globe, Code, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

function Profile({ user, setUser, onLogout }) {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    username: user.username || '',
    email: user.email || '',
    age: user.age || '',
    address: user.address || '',
    bio: user.bio || ''
  });
  const [charCount, setCharCount] = useState((user.bio || '').length);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'bio') {
      setCharCount(value.length);
    }
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('chatUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditMode(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const stats = [
    { icon: Heart, label: 'Friends', value: '24' },
    { icon: Star, label: 'Moments', value: '12' },
    { icon: Award, label: 'Badges', value: '5' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10 shadow-sm"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/contacts')}
              className="p-2 hover:bg-purple-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
          </div>
          
          {!editMode && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-full transition-colors group"
            >
              <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
            </motion.button>
          )}
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&size=120&background=8B5CF6&color=fff`}
                  alt={user.fullName}
                  className="w-24 h-24 rounded-full ring-4 ring-white shadow-lg"
                />
                {editMode && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors ring-2 ring-white">
                    <Camera className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-14 px-6 pb-6">
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <div className="relative">
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      maxLength="150"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                    <span className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {charCount}/150
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
                  <p className="text-gray-500">@{user.username}</p>
                </div>

                {user.bio && (
                  <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl">
                    {user.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="bg-gray-50 rounded-xl p-3 text-center">
                        <Icon className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <div className="font-bold text-gray-800">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Info Cards */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="text-gray-800 font-medium">{user.phone}</p>
                    </div>
                  </div>
                  
                  {user.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-gray-800 font-medium">{user.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {user.age && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Age</p>
                        <p className="text-gray-800 font-medium">{user.age} years</p>
                      </div>
                    </div>
                  )}
                  
                  {user.address && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-gray-800 font-medium">{user.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings Menu */}
                <div className="space-y-2 mb-6">
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all group">
                    <Bell className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    <span className="text-gray-700 group-hover:text-purple-600">Notifications</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all group">
                    <Moon className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    <span className="text-gray-700 group-hover:text-purple-600">Dark Mode</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all group">
                    <Shield className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    <span className="text-gray-700 group-hover:text-purple-600">Privacy</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all group">
                    <Globe className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    <span className="text-gray-700 group-hover:text-purple-600">Language</span>
                  </button>
                </div>

                {/* MEET DEVELOPER BUTTON - ATTRACTIVE */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/developer')}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-2xl transition-all relative overflow-hidden group mb-3"
                >
                  {/* Animated Background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Meet the Developer
                    <Code className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                  
                  {/* Glowing Effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                </motion.button>

                {/* Edit Profile Button */}
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;
