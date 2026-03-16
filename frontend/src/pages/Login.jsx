import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Send, ArrowLeft, Clock, CheckCircle, 
  MessageCircle, Instagram, Facebook, Twitter,
  Shield, Smartphone, Key, Sparkles, Heart
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'https://chatinsta-30pa.onrender.com/api';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const startTimer = (seconds) => {
    setTimer(seconds);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const requestOTP = async () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      toast.error('Please enter valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/request-otp`, {
        phoneNumber: cleanPhone
      });

      if (response.data.success) {
        setStep('otp');
        startTimer(60);
        toast.success('OTP sent successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        phoneNumber: cleanPhone,
        otpCode: otp
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('chatUser', JSON.stringify(response.data.user));
        setUser(response.data.user);
        
        toast.success('Login successful! 🎉');
        
        if (response.data.isNewUser) {
          navigate('/signup');
        } else {
          navigate('/contacts');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'phone') {
      navigate('/');
    } else {
      setStep('phone');
      setOtp('');
      setTimer(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-red-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              y: [null, -100, 0],
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

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleBack}
        className="absolute top-4 left-4 z-20 p-3 bg-white/10 backdrop-blur-xl rounded-full text-white hover:bg-white/20 transition-all border border-white/20"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-block mb-4"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-3xl rotate-12 transform mx-auto flex items-center justify-center shadow-2xl border border-white/30">
              <MessageCircle className="w-12 h-12 text-white -rotate-12" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white mb-2 drop-shadow-lg"
          >
            ChatInsta
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-1"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <p className="text-white/80 text-sm">Connect with friends and the world</p>
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div
          layout
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"
                  >
                    <Heart className="w-6 h-6 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome Back!
                  </h2>
                  <p className="text-white/70 text-sm">
                    Enter your phone number to continue
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-xl bg-white/10 border border-r-0 border-white/20 text-white font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210"
                        className="flex-1 px-4 py-4 bg-white/10 border border-white/20 rounded-r-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg"
                        maxLength={10}
                        autoFocus
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={requestOTP}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-2xl transition-all disabled:opacity-50 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        Continue <Send className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-white/60">or connect with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Instagram, color: 'hover:text-pink-500' },
                    { icon: Facebook, color: 'hover:text-blue-500' },
                    { icon: Twitter, color: 'hover:text-sky-500' },
                  ].map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-4 bg-white/10 rounded-xl text-white/80 hover:bg-white/20 transition-all border border-white/10"
                      >
                        <Icon className="w-5 h-5 mx-auto" />
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-xs text-center text-white/40">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"
                  >
                    <Smartphone className="w-6 h-6 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Verification Code
                  </h2>
                  <p className="text-white/70 text-sm">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="text-lg font-mono text-white mt-2 bg-white/10 px-4 py-2 rounded-xl inline-block">
                    +91 {phone}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-center text-3xl tracking-widest placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                      maxLength={6}
                      autoFocus
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={verifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-2xl transition-all disabled:opacity-50 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        Verify & Login <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  <div className="flex items-center justify-between">
                    {timer > 0 ? (
                      <div className="flex items-center gap-2 text-white/60">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Resend in {timer}s</span>
                      </div>
                    ) : (
                      <button
                        onClick={requestOTP}
                        className="text-sm text-white hover:underline"
                      >
                        Resend Code
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setStep('phone');
                        setOtp('');
                      }}
                      className="text-sm text-white/60 hover:text-white"
                    >
                      Change number
                    </button>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white/80 font-medium mb-1">
                        Secure Verification
                      </p>
                      <p className="text-xs text-white/60">
                        This code expires in 10 minutes. Never share it with anyone.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
