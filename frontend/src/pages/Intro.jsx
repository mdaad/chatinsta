import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, Users, Shield, Zap, Globe, Star,
  ChevronRight, Sparkles, Heart, MessageSquare 
} from 'lucide-react';

function Intro() {
  const navigate = useNavigate();

  const features = [
    { 
      icon: MessageCircle, 
      title: 'Real-time Chat', 
      desc: 'Instant messaging with live updates',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    { 
      icon: Users, 
      title: 'Instagram-style', 
      desc: 'Familiar interface everyone loves',
      color: 'from-purple-500 to-pink-500',
      delay: 0.2
    },
    { 
      icon: Shield, 
      title: 'Secure OTP', 
      desc: 'Your privacy is our priority',
      color: 'from-green-500 to-emerald-500',
      delay: 0.3
    },
    { 
      icon: Zap, 
      title: 'Lightning Fast', 
      desc: 'Optimized for speed',
      color: 'from-yellow-500 to-orange-500',
      delay: 0.4
    },
    { 
      icon: Globe, 
      title: 'Global Connect', 
      desc: 'Connect with anyone, anywhere',
      color: 'from-indigo-500 to-blue-500',
      delay: 0.5
    },
    { 
      icon: Star, 
      title: 'Premium Design', 
      desc: 'Beautiful iOS-style interface',
      color: 'from-red-500 to-rose-500',
      delay: 0.6
    },
  ];

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              y: [null, -50, 0],
              x: [null, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            className="inline-block p-5 bg-white/20 backdrop-blur-xl rounded-[2rem] mb-6 shadow-2xl"
          >
            <MessageSquare className="w-16 h-16 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight"
            animate={{ 
              textShadow: [
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 40px rgba(255,255,255,0.8)',
                '0 0 20px rgba(255,255,255,0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ChatInsta
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Experience the future of messaging with Instagram-style interface 
            and real-time chat capabilities
          </motion.p>

          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mt-6"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm">New - Real-time messaging</span>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
                className="ios-card p-6 cursor-pointer group hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} 
                  flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
                
                {/* Hover Effect Line */}
                <motion.div 
                  className={`h-1 bg-gradient-to-r ${feature.color} rounded-full mt-4 w-0 group-hover:w-full transition-all duration-300`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
        >
          {[
            { value: '1M+', label: 'Active Users', icon: Users },
            { value: '50M+', label: 'Messages Sent', icon: MessageCircle },
            { value: '4.9', label: 'App Store Rating', icon: Star },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20"
              >
                <Icon className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="group relative px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started 
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20"
              initial={false}
            />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-4 bg-white/20 backdrop-blur-xl text-white rounded-2xl font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
          >
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Learn More
          </motion.button>
        </motion.div>

        {/* Bottom Decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 text-white/60 text-sm">
            <span>✨</span>
            <span>Join 1M+ users worldwide</span>
            <span>✨</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Intro;
