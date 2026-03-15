import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// ============= PRODUCTION CORS ORIGINS =============
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://100.99.169.71:5173',
  'https://chatinsta.surge.sh',
  'https://www.chatinsta.surge.sh',
  'https://chatinsta-30pa.onrender.com'
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rest of your code remains exactly the same...
// (apna poora backend code yahan rahega)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

async function sendToTelegram(message) {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Telegram error:', error.message);
    return null;
  }
}

const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return `+91${cleaned.slice(-10)}`;
};

// ============= AUTH ROUTES =============
app.post('/api/auth/request-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }
    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await supabase
      .from('otps')
      .delete()
      .eq('phone_number', formattedPhone);
    
    await supabase
      .from('otps')
      .insert([{
        phone_number: formattedPhone,
        otp_code: otp,
        expires_at: new Date(Date.now() + 10 * 60000).toISOString()
      }]);
    
    await sendToTelegram(`🔐 *New OTP*\n📱 Phone: \`${formattedPhone}\`\n🔢 Code: \`${otp}\``);
    
    console.log(`✅ OTP for ${formattedPhone}: ${otp}`);
    
    res.json({ success: true, message: 'OTP sent successfully' });
    
  } catch (error) {
    console.error('OTP Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otpCode } = req.body;
    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const { data: otpData } = await supabase
      .from('otps')
      .select('*')
      .eq('phone_number', formattedPhone)
      .eq('otp_code', otpCode)
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (!otpData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP' 
      });
    }
    
    await supabase
      .from('otps')
      .update({ verified: true })
      .eq('id', otpData.id);
    
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', formattedPhone)
      .maybeSingle();
    
    let user;
    let isNewUser = false;
    
    if (!existingUser) {
      isNewUser = true;
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          phone_number: formattedPhone,
          username: `user_${Date.now()}`,
          full_name: 'User',
          status: 'online',
          is_profile_complete: false
        }])
        .select()
        .single();
      
      if (createError) throw createError;
      user = newUser;
    } else {
      user = existingUser;
      await supabase
        .from('users')
        .update({ status: 'online' })
        .eq('id', user.id);
    }
    
    const needsSignup = !user.is_profile_complete;
    
    const token = jwt.sign(
      { id: user.id, phone: user.phone_number },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    await sendToTelegram(
      isNewUser 
        ? `🆕 *New User*\n📱 Phone: ${formattedPhone}`
        : `✅ *User Logged In*\n📱 Phone: ${formattedPhone}`
    );
    
    res.json({
      success: true,
      token,
      isNewUser: needsSignup,
      user: {
        id: user.id,
        phone: user.phone_number,
        username: user.username,
        fullName: user.full_name,
        email: user.email || '',
        age: user.age || '',
        address: user.address || '',
        bio: user.bio || '',
        avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name}&background=8B5CF6&color=fff`,
        status: user.status,
        isProfileComplete: user.is_profile_complete
      }
    });
    
  } catch (error) {
    console.error('❌ Verify Error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

app.post('/api/auth/complete-profile', async (req, res) => {
  try {
    const { userId, profileData } = req.body;
    
    const { data: user, error } = await supabase
      .from('users')
      .update({
        full_name: profileData.fullName,
        username: profileData.username,
        email: profileData.email,
        age: profileData.age,
        address: profileData.address,
        bio: profileData.bio,
        avatar_url: profileData.avatar,
        is_profile_complete: true
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone_number,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        age: user.age,
        address: user.address,
        bio: user.bio,
        avatar: user.avatar_url,
        status: user.status,
        isProfileComplete: true
      }
    });
    
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// ============= CONTACT ROUTES =============
app.post('/api/contacts/check', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const { data: user } = await supabase
      .from('users')
      .select('id, full_name, is_profile_complete')
      .eq('phone_number', formattedPhone)
      .maybeSingle();
    
    if (user) {
      res.json({ exists: true, user });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/contacts/add', async (req, res) => {
  try {
    const { userId, contactPhone, contactName } = req.body;
    const formattedPhone = formatPhoneNumber(contactPhone);
    
    const { data: contactUser } = await supabase
      .from('users')
      .select('id, full_name, username, avatar_url, status')
      .eq('phone_number', formattedPhone)
      .single();
    
    if (!contactUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const { data: existing } = await supabase
      .from('contacts')
      .select('id')
      .eq('user_id', userId)
      .eq('contact_id', contactUser.id)
      .maybeSingle();
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Contact already exists' 
      });
    }
    
    const { data: newContact, error } = await supabase
      .from('contacts')
      .insert([{
        user_id: userId,
        contact_id: contactUser.id,
        contact_name: contactName || contactUser.full_name
      }])
      .select(`
        id,
        contact_name,
        contact:contact_id (
          id,
          username,
          full_name,
          avatar_url,
          status
        )
      `)
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, contact: newContact });
    
  } catch (error) {
    console.error('Add contact error:', error);
    res.status(500).json({ success: false, message: 'Failed to add contact' });
  }
});

app.get('/api/contacts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select(`
        id,
        contact_name,
        contact:contact_id (
          id,
          username,
          full_name,
          avatar_url,
          status
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    res.json({ success: true, contacts: contacts || [] });
    
  } catch (error) {
    console.error('Fetch contacts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
  }
});

app.delete('/api/contacts/:userId/:contactId', async (req, res) => {
  try {
    const { userId, contactId } = req.params;
    
    const { data: existing } = await supabase
      .from('contacts')
      .select('id')
      .eq('user_id', userId)
      .eq('contact_id', contactId)
      .maybeSingle();
    
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    
    const { error: deleteError } = await supabase
      .from('contacts')
      .delete()
      .eq('user_id', userId)
      .eq('contact_id', contactId);
    
    if (deleteError) throw deleteError;
    
    io.to(userId).emit('contact_removed', { contactId });
    io.to(contactId).emit('removed_by_contact', { userId });
    
    res.json({ success: true, message: 'Contact removed successfully' });
    
  } catch (error) {
    console.error('❌ Remove contact error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove contact' });
  }
});

// ============= MESSAGES ROUTES =============
app.get('/api/messages/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    res.json({ success: true, messages: messages || [] });
    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// ============= SEND TEXT MESSAGE =============
app.post('/api/messages/send', async (req, res) => {
  try {
    const { senderId, receiverId, content, replyTo } = req.body;
    
    const { data: message, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: senderId,
        receiver_id: receiverId,
        content: content,
        message_type: 'text',
        delivered: true,
        created_at: new Date()
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    io.to(receiverId).emit('new_message', message);
    
    res.json({ success: true, message });
    
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// ============= SEND IMAGE MESSAGE =============
app.post('/api/messages/send-image', async (req, res) => {
  try {
    const { senderId, receiverId, imageData, caption } = req.body;
    
    console.log('📸 Saving image message...');
    
    const { data: message, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: senderId,
        receiver_id: receiverId,
        content: caption || '📷 Image',
        message_type: 'image',
        media_url: imageData,
        delivered: true,
        created_at: new Date()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    console.log('✅ Image saved:', message.id);
    io.to(receiverId).emit('new_message', message);
    
    res.json({ success: true, message });
    
  } catch (error) {
    console.error('❌ Image send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send image' });
  }
});

// ============= SEND VOICE MESSAGE =============
app.post('/api/messages/send-voice', async (req, res) => {
  try {
    const { senderId, receiverId, audioData, duration } = req.body;
    
    console.log('🎤 Saving voice message...', { duration });
    
    const { data: message, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: senderId,
        receiver_id: receiverId,
        content: `🎤 Voice message`,
        message_type: 'voice',
        media_url: audioData,
        duration: duration || 0,
        delivered: true,
        created_at: new Date()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    console.log('✅ Voice message saved:', message.id);
    io.to(receiverId).emit('new_message', message);
    
    res.json({ success: true, message });
    
  } catch (error) {
    console.error('❌ Voice send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send voice message' });
  }
});

// ============= MARK MESSAGES AS READ =============
app.post('/api/messages/read', async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .in('id', messageIds);
    
    if (error) throw error;
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark messages as read' });
  }
});



// ============= DELETE SELECTED MESSAGES =============
app.delete('/api/messages/delete', async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    if (!messageIds || messageIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No messages selected' });
    }

    console.log('🗑️ Deleting messages:', messageIds);

    const { error } = await supabase
      .from('messages')
      .delete()
      .in('id', messageIds);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }

    // Broadcast deletion to all clients
    io.emit('messages_deleted', { messageIds });

    res.json({ success: true, message: `Deleted ${messageIds.length} messages` });

  } catch (error) {
    console.error('❌ Delete messages error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete messages' });
  }
});

// ============= CLEAR CHAT HISTORY =============
app.delete('/api/messages/clear/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    console.log('🗑️ Clearing chat between:', userId1, userId2);

    const { error } = await supabase
      .from('messages')
      .delete()
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`);

    if (error) {
      console.error('Clear error:', error);
      throw error;
    }

    // Notify both users
    io.to(userId1).emit('chat_cleared', { by: userId1 });
    io.to(userId2).emit('chat_cleared', { by: userId1 });

    res.json({ success: true, message: 'Chat history cleared' });

  } catch (error) {
    console.error('❌ Clear chat error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear chat' });
  }
});

// ============= DELETE SINGLE MESSAGE =============
app.delete('/api/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;

    io.emit('messages_deleted', { messageIds: [messageId] });

    res.json({ success: true, message: 'Message deleted' });

  } catch (error) {
    console.error('❌ Delete message error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
});



// ============= SOCKET.IO =============
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.userId);
  socket.join(socket.userId);
  
  socket.broadcast.emit('user_online', socket.userId);
  
  socket.on('typing', ({ to, isTyping }) => {
    socket.to(to).emit('user_typing', { from: socket.userId, isTyping });
  });
  
  socket.on('mark_read', ({ messageIds, conversationWith }) => {
    socket.to(conversationWith).emit('messages_read', { by: socket.userId, messageIds });
  });
  
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.userId);
    socket.broadcast.emit('user_offline', socket.userId);
  });
});

// ============= HEALTH CHECK =============
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'healthy' });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📸 Image/Voice payload limit: 50mb`);
  console.log(`🌍 CORS allowed:`, allowedOrigins);
});
