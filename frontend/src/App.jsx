import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Intro from './pages/Intro';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contacts from './pages/Contacts';
import ChatWindow from './pages/ChatWindow';
import Profile from './pages/Profile';
import DeveloperPortfolio from './pages/DeveloperPortfolio';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('chatUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user:', e);
        localStorage.removeItem('chatUser');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('chatUser');
    setUser(null);
  };

  const isProfileComplete = user?.fullName && user?.fullName !== 'User';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-red-600 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route 
              path="/login" 
              element={!user ? <Login setUser={setUser} /> : <Navigate to={isProfileComplete ? "/contacts" : "/signup"} />} 
            />
            <Route 
              path="/signup" 
              element={user && !isProfileComplete ? <Signup user={user} setUser={setUser} /> : <Navigate to={user ? "/contacts" : "/login"} />} 
            />
            <Route 
              path="/contacts" 
              element={user && isProfileComplete ? <Contacts user={user} onLogout={handleLogout} /> : <Navigate to={user ? "/signup" : "/login"} />} 
            />
            <Route 
              path="/chat/:contactId" 
              element={user && isProfileComplete ? <ChatWindow user={user} onLogout={handleLogout} /> : <Navigate to={user ? "/signup" : "/login"} />} 
            />
            <Route 
              path="/profile" 
              element={user && isProfileComplete ? <Profile user={user} setUser={setUser} onLogout={handleLogout} /> : <Navigate to={user ? "/signup" : "/login"} />} 
            />
            <Route 
              path="/developer" 
              element={<DeveloperPortfolio />} 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
