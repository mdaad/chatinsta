import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Calendar, MapPin, Camera,
  Sparkles, Heart, Star, ArrowRight, CheckCircle,
  Gift, Rocket, Zap, Shield, Globe, Smile,
  Phone, Key, Clock, Award, ChevronRight,
  Instagram, Facebook, Twitter, Github,
  Music, Video, Book, Coffee, Code
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'http://100.99.169.71:5000/api';

function Signup({ user, setUser }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    age: '',
    address: '',
    bio: '',
    avatar: null,
    interests: []
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const interestsList = [
    { icon: Music, name: 'Music', color: 'from-purple-500 to-pink-500' },
    { icon: Video, name: 'Movies', color: 'from-blue-500 to-cyan-500' },
    { icon: Book, name: 'Reading', color: 'from-green-500 to-emerald-500' },
    { icon: Coffee, name: 'Coffee', color: 'from-yellow-500 to-orange-500' },
    { icon: Code, name: 'Coding', color: 'from-red-500 to-rose-500' },
    { icon: Camera, name: 'Photography', color: 'from-indigo-500 to-purple-500' },
    { icon: Heart, name: 'Travel', color: 'from-pink-500 to-red-500' },
    { icon: Star, name: 'Gaming', color: 'from-violet-500 to-purple-500' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'bio') {
      setCharCount(value.length);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateUsername = () => {
    if (formData.fullName) {
      const base = formData.fullName.toLowerCase().replace(/\s+/g, '');
      const random = Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({ ...prev, username: `${base}_${random}` }));
    }
  };

  const toggleInterest = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter(i => i !== interest)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const handleCompleteSignup = async () => {
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!formData.username.trim()) {
      toast.error('Please choose a username');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/complete-profile`, {
        userId: user.id,
        profileData: formData
      });

      if (response.data.success) {
        const updatedUser = {
          ...user,
          ...response.data.user,
          isProfileComplete: true
        };

        localStorage.setItem('chatUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast.success('🎉 Profile created successfully!');
        navigate('/contacts');
      }
    } catch (error) {
      toast.error('Failed to complete signup');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { 
      number: 1, 
      title: 'Welcome', 
      subtitle: 'Let\'s get started',
      icon: Sparkles,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-500/20 to-orange-500/20'
    },
    { 
      number: 2, 
      title: 'Profile', 
      subtitle: 'Tell us about yourself',
      icon: User,
      color: 'from-blue-400 to-purple-500',
      bgColor: 'from-blue-500/20 to-purple-500/20'
    },
    { 
      number: 3, 
      title: 'Interests', 
      subtitle: 'What do you like?',
      icon: Heart,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-500/20 to-rose-500/20'
    },
    { 
      number: 4, 
      title: 'Complete', 
      subtitle: 'Almost there!',
      icon: Rocket,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-500/20 to-emerald-500/20'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-spin-slow"></div>
        
        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              y: [null, -200, 0],
              x: [null, Math.random() * 200 - 100, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block p-4 bg-white/10 backdrop-blur-xl rounded-[2rem] mb-4"
          >
            <Rocket className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-white/70 text-lg">
            Tell us a bit about yourself to get started
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 w-full h-1 bg-white/10 rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((step - 1) / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Step Indicators */}
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step >= s.number;
              const isCompleted = step > s.number;

              return (
                <motion.div
                  key={s.number}
                  className="relative z-10 flex flex-col items-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      isActive
                        ? `bg-gradient-to-r ${s.color} shadow-lg`
                        : 'bg-white/10'
                    }`}
                    animate={{
                      scale: isActive ? [1, 1.1, 1] : 1,
                      rotate: isActive ? [0, 5, -5, 0] : 0,
                    }}
                    transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className="w-6 h-6 text-white" />
                    )}
                  </motion.div>
                  <span className={`mt-3 text-sm font-medium ${
                    isActive ? 'text-white' : 'text-white/40'
                  }`}>
                    {s.title}
                  </span>
                  <span className={`text-xs ${
                    isActive ? 'text-white/60' : 'text-white/20'
                  }`}>
                    {s.subtitle}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          layout
          className="max-w-2xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Welcome */}
            {step === 1 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-block p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl mb-6"
                  >
                    <Gift className="w-16 h-16 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Welcome to ChatInsta! 🎉
                  </h2>
                  <p className="text-white/70 text-lg max-w-md mx-auto">
                    You're just a few steps away from connecting with amazing people
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    { icon: Rocket, title: 'Quick Setup', desc: 'Complete your profile in under 2 minutes', color: 'from-blue-500 to-cyan-500' },
                    { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and safe with us', color: 'from-green-500 to-emerald-500' },
                    { icon: Globe, title: 'Connect Globally', desc: 'Chat with friends around the world', color: 'from-purple-500 to-pink-500' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/10"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{item.title}</h3>
                          <p className="text-white/60 text-sm">{item.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white/60 text-xs">Your registered number</p>
                      <p className="text-white font-mono text-lg">{user?.phone}</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 group"
                >
                  Let's Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Profile Info */}
            {step === 2 && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-4">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-1">
                      <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
                            <User className="w-12 h-12 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Tell us about yourself
                  </h2>
                  <p className="text-white/70">
                    This is how others will see you on ChatInsta
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name *"
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Username *"
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />
                    <button
                      onClick={generateUsername}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white text-sm rounded-lg hover:shadow-lg transition-all"
                    >
                      Generate
                    </button>
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address (Optional)"
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us something about yourself... (Optional)"
                      rows="3"
                      maxLength="150"
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                    />
                    <span className="absolute bottom-2 right-2 text-xs text-white/40">
                      {charCount}/150
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Interests */}
            {step === 3 && (
              <motion.div
                key="interests"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block p-4 bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl mb-4"
                  >
                    <Heart className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Select Your Interests
                  </h2>
                  <p className="text-white/70">
                    Choose topics you love to help us personalize your experience
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {interestsList.map((interest, index) => {
                    const Icon = interest.icon;
                    const isSelected = formData.interests.includes(interest.name);
                    
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleInterest(interest.name)}
                        className={`p-4 rounded-xl border transition-all ${
                          isSelected
                            ? `bg-gradient-to-r ${interest.color} border-white/30 shadow-lg`
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-white/60'}`} />
                          <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/60'}`}>
                            {interest.name}
                          </span>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-white ml-auto" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 px-4 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 bg-gradient-to-r from-pink-400 to-rose-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Complete */}
            {step === 4 && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl mb-4"
                  >
                    <Rocket className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    You're Ready to Go! 🚀
                  </h2>
                  <p className="text-white/70">
                    Review your profile before we launch
                  </p>
                </div>

                {/* Profile Preview */}
                <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-1">
                      <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl">
                        {formData.fullName || 'Your Name'}
                      </h3>
                      <p className="text-white/60">@{formData.username || 'username'}</p>
                    </div>
                  </div>

                  {formData.bio && (
                    <p className="text-white/80 text-sm mb-4 bg-white/5 p-3 rounded-lg">
                      {formData.bio}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    {formData.email && (
                      <div className="flex items-center gap-2 text-white/60">
                        <Mail className="w-4 h-4" />
                        <span>{formData.email}</span>
                      </div>
                    )}
                    {formData.age && (
                      <div className="flex items-center gap-2 text-white/60">
                        <Calendar className="w-4 h-4" />
                        <span>{formData.age} years old</span>
                      </div>
                    )}
                    {formData.address && (
                      <div className="flex items-center gap-2 text-white/60">
                        <MapPin className="w-4 h-4" />
                        <span>{formData.address}</span>
                      </div>
                    )}
                  </div>

                  {formData.interests.length > 0 && (
                    <div className="mt-4">
                      <p className="text-white/60 text-xs mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.interests.map((interest, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCompleteSignup}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating your profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Signup</span>
                      <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
