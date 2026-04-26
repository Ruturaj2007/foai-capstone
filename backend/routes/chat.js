import express from 'express';
import Conversation from '../models/Conversation.js';

const router = express.Router();

const MAX_STORED_MESSAGES = 50; // Cap messages per user

// GET /api/chat/:sessionId?limit=20&skip=0 — fetch paginated messages
router.get('/:sessionId', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const skip = parseInt(req.query.skip) || 0;

    const convo = await Conversation.findOne(
      { sessionId: req.params.sessionId },
      {
        messages: { $slice: [-(skip + limit), limit] },
        'messages.content': 1,
        'messages.role': 1,
        'messages.ticket_id': 1,
        'messages.escalated': 1,
        'messages.timestamp': 1,
      }
    );

    if (!convo) {
      return res.json({ messages: [], hasMore: false });
    }

    // Check if there are older messages
    const totalConvo = await Conversation.findOne(
      { sessionId: req.params.sessionId },
      { 'messages': { $size: '$messages' } }
    ).lean();

    const totalCount = totalConvo?.messages?.length || 0;
    const hasMore = (skip + limit) < totalCount;

    res.json({ messages: convo.messages, hasMore, total: totalCount });
  } catch (error) {
    console.error('Fetch chat error:', error.message);
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
});

// POST /api/chat/save — save a message pair + auto-trim to last 50
router.post('/save', async (req, res) => {
  try {
    const { sessionId, userEmail, userMessage, aiReply, ticket_id, escalated } = req.body;

    // Push new messages
    const convo = await Conversation.findOneAndUpdate(
      { sessionId },
      {
        $set: { userEmail, updatedAt: new Date() },
        $push: {
          messages: {
            $each: [
              { role: 'user', content: userMessage, timestamp: new Date() },
              { role: 'ai', content: aiReply, ticket_id, escalated, timestamp: new Date() },
            ],
            $slice: -MAX_STORED_MESSAGES // Keep only last 50 messages
          }
        }
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, messageCount: convo.messages.length });
  } catch (error) {
    console.error('Save chat error:', error.message);
    res.status(500).json({ message: 'Failed to save chat' });
  }
});

export default router;
