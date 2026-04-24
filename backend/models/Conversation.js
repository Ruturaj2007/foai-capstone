import mongoose from 'mongoose';
import supportConn from '../config/supportDb.js';

const conversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userEmail: {
    type: String,
    default: 'anonymous',
  },
  messages: [{
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    ticket_id: String,
    escalated: Boolean,
    timestamp: { type: Date, default: Date.now },
  }],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Use the support DB connection, NOT the default auth connection
export default supportConn.model('Conversation', conversationSchema);
