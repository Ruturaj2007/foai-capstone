import express from 'express';
import Conversation from '../models/Conversation.js';

const router = express.Router();

// GET /api/chat/:sessionId — fetch previous messages
router.get('/:sessionId', async (req, res) => {
  try {
    const convo = await Conversation.findOne({ sessionId: req.params.sessionId });
    if (!convo) {
      return res.json({ messages: [] });
    }
    res.json({ messages: convo.messages });
  } catch (error) {
    console.error('Fetch chat error:', error.message);
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
});

// POST /api/chat/save — save a message pair (user + ai)
router.post('/save', async (req, res) => {
  try {
    const { sessionId, userEmail, userMessage, aiReply, ticket_id, escalated } = req.body;

    const update = {
      $set: { userEmail, updatedAt: new Date() },
      $push: {
        messages: {
          $each: [
            { role: 'user', content: userMessage, timestamp: new Date() },
            { role: 'ai', content: aiReply, ticket_id, escalated, timestamp: new Date() },
          ]
        }
      }
    };

    await Conversation.findOneAndUpdate(
      { sessionId },
      update,
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Save chat error:', error.message);
    res.status(500).json({ message: 'Failed to save chat' });
  }
});

export default router;
