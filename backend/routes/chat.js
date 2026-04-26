import express from 'express';
import Conversation from '../models/Conversation.js';

const router = express.Router();

const MAX_STORED_MESSAGES = 50; // Cap messages per user

// GET /api/chat/:sessionId?limit=20&skip=0 — fetch paginated messages
router.get('/:sessionId', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const skip = parseInt(req.query.skip) || 0;

    const convo = await Conversation.findOne({ sessionId: req.params.sessionId }).lean();

    if (!convo || !convo.messages || convo.messages.length === 0) {
      return res.json({ messages: [], hasMore: false, total: 0 });
    }

    const total = convo.messages.length;
    // Get the latest messages first, paginate backwards
    const start = Math.max(0, total - skip - limit);
    const end = total - skip;
    const sliced = convo.messages.slice(start, end);

    res.json({
      messages: sliced,
      hasMore: start > 0,
      total
    });
  } catch (error) {
    console.error('Fetch chat error:', error.message);
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
});

// POST /api/chat/save — save a message pair + auto-trim to last 50
router.post('/save', async (req, res) => {
  try {
    const { sessionId, userEmail, userMessage, aiReply, ticket_id, escalated } = req.body;

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
            $slice: -MAX_STORED_MESSAGES
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
