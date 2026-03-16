import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Code, Smartphone, Globe, Server, Database,
  Github, ExternalLink, Mail, MapPin, Calendar, Award,
  Star, Zap, Shield, Rocket, Heart, Cpu, Coffee,
  BookOpen, PenTool, Layers, Target, TrendingUp,
  Users, MessageCircle, Download, Share2, Linkedin,
  Twitter, Instagram, Figma, Chrome, Terminal,
  CheckCircle, XCircle, AlertCircle, Info
} from 'lucide-react';

function DeveloperPortfolio() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse move effect for Gojo's infinity
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const skills = [
    { name: 'HTML5', icon: Globe, level: 95, color: 'from-orange-500 to-red-500' },
    { name: 'CSS3', icon: PenTool, level: 90, color: 'from-blue-500 to-cyan-500' },
    { name: 'JavaScript', icon: Code, level: 88, color: 'from-yellow-500 to-amber-500' },
    { name: 'React', icon: Layers, level: 85, color: 'from-cyan-500 to-blue-500' },
    { name: 'Vite', icon: Zap, level: 80, color: 'from-purple-500 to-pink-500' },
    { name: 'GitHub', icon: Github, level: 87, color: 'from-gray-700 to-gray-900' },
  ];

  const projects = [
    {
      title: 'ChatInsta',
      description: 'Advanced chat application with voice & image messages',
      icon: MessageCircle,
      color: 'from-purple-600 to-pink-600',
      tech: ['React', 'Socket.io', 'Supabase']
    },
    {
      title: 'Portfolio Website',
      description: 'Personal portfolio with Gojo theme',
      icon: Globe,
      color: 'from-blue-600 to-cyan-600',
      tech: ['React', 'Framer Motion', 'Tailwind']
    },
    {
      title: 'E-Commerce App',
      description: 'Full-stack shopping platform',
      icon: ShoppingBag,
      color: 'from-green-600 to-emerald-600',
      tech: ['Node.js', 'MongoDB', 'Express']
    }
  ];

  const achievements = [
    { label: 'Projects Completed', value: '15+', icon: Rocket },
    { label: 'Happy Clients', value: '10+', icon: Users },
    { label: 'Code Commits', value: '500+', icon: Github },
    { label: 'Coffee Consumed', value: '∞', icon: Coffee },
  ];

  const education = [
    { 
      title: 'Class 11 PCM', 
      institution: 'CBSE Board',
      year: '2024 - Present',
      percentage: '85%',
      icon: BookOpen,
      color: 'from-blue-500 to-purple-500'
    },
    { 
      title: 'Class 10', 
      institution: 'CBSE Board',
      year: '2023',
      percentage: '92%',
      icon: Award,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Infinity Background Effect (Gojo's Domain) */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              x: mousePosition.x + (Math.random() - 0.5) * 100,
              y: mousePosition.y + (Math.random() - 0.5) * 100,
              scale: [0, 1, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Purple Domain Expansion Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10 animate-pulse"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              y: [null, -100, 0],
              x: [null, Math.random() * 200 - 100, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/profile')}
        className="absolute top-4 left-4 z-20 p-3 bg-white/10 backdrop-blur-xl rounded-full text-white hover:bg-white/20 transition-all border border-white/20"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Gojo Image */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block">
            {/* Animated Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 border-b-blue-500 border-l-indigo-500"
              style={{ width: '130%', height: '130%', left: '-15%', top: '-15%' }}
            />
            
            {/* Gojo Image */}
            <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
              <img
                src="/images/gojo.jpg"
                alt="Gojo Satoru"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/160/8B5CF6/ffffff?text=GOJO";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/50 via-transparent to-transparent"></div>
            </div>

            {/* Infinity Symbol */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl"
            >
              ∞
            </motion.div>
          </div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-2"
            animate={{ 
              textShadow: [
                '0 0 20px rgba(139,92,246,0.5)',
                '0 0 40px rgba(236,72,153,0.8)',
                '0 0 20px rgba(139,92,246,0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Mohd Saad
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2"
          >
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-purple-300 text-sm border border-white/20">
              ⚡ Class 11 PCM
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-pink-300 text-sm border border-white/20">
              🚀 Full Stack Developer
            </span>
          </motion.div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'about', label: 'About', icon: Info },
            { id: 'skills', label: 'Skills', icon: Code },
            { id: 'projects', label: 'Projects', icon: Rocket },
            { id: 'education', label: 'Education', icon: BookOpen },
            { id: 'achievements', label: 'Achievements', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-400" />
                    About Me
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    I'm a passionate developer from India, currently studying in Class 11 PCM. 
                    I love creating modern web applications with cutting-edge technologies. 
                    My journey in coding started with HTML and CSS, and now I'm building full-stack 
                    applications with React and Node.js.
                  </p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-white/70">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">India</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                      <Mail className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">saad@chatinsta.dev</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">Born in 2008</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-pink-400" />
                    Tech Stack
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {skills.map((skill, index) => {
                      const Icon = skill.icon;
                      return (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="bg-white/5 rounded-xl p-3 text-center border border-white/10"
                        >
                          <Icon className="w-6 h-6 text-white/80 mx-auto mb-2" />
                          <span className="text-xs text-white/60">{skill.name}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid gap-4">
                {skills.map((skill, index) => {
                  const Icon = skill.icon;
                  const isHovered = hoveredSkill === index;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onHoverStart={() => setHoveredSkill(index)}
                      onHoverEnd={() => setHoveredSkill(null)}
                      className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${skill.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className="text-white font-medium">{skill.name}</span>
                            <span className="text-white/60 text-sm">{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-full bg-gradient-to-r ${skill.color}`}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-3 text-sm text-white/60 border-t border-white/10 pt-2"
                          >
                            <span className="text-purple-400">✦</span> Advanced proficiency with 2+ years experience
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((project, index) => {
                  const Icon = project.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 group"
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${project.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-white/60 text-sm mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="text-purple-400 text-sm flex items-center gap-1 group-hover:text-purple-300"
                      >
                        View Project <ExternalLink className="w-3 h-3" />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {education.map((edu, index) => {
                  const Icon = edu.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${edu.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{edu.title}</h3>
                      <p className="text-white/60 text-sm mb-2">{edu.institution}</p>
                      <p className="text-white/40 text-xs mb-4">{edu.year}</p>
                      
                      {/* Circular Percentage */}
                      <div className="flex items-center justify-center">
                        <div className="relative w-24 h-24">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="8"
                            />
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={`url(#gradient-${index})`}
                              strokeWidth="8"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: parseInt(edu.percentage) / 100 }}
                              transition={{ duration: 1, delay: 0.5 }}
                              transform="rotate(-90 50 50)"
                            />
                            <defs>
                              <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#EC4899" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{edu.percentage}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-12">
                        <Icon className="w-8 h-8 text-white -rotate-12" />
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-2">{achievement.value}</h3>
                      <p className="text-white/60 text-sm">{achievement.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-3 mt-8"
        >
          {[
            { icon: Github, href: '#', color: 'hover:text-gray-300' },
            { icon: Linkedin, href: '#', color: 'hover:text-blue-400' },
            { icon: Twitter, href: '#', color: 'hover:text-sky-400' },
            { icon: Instagram, href: '#', color: 'hover:text-pink-400' },
            { icon: Mail, href: '#', color: 'hover:text-red-400' },
          ].map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/60 ${social.color} hover:bg-white/20 transition-all border border-white/20`}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            );
          })}
        </motion.div>

        {/* Infinity Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-white/40 text-sm italic">
            "Throughout Heaven and Earth, I alone am the honored one." - Gojo Satoru
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default DeveloperPortfolio;
