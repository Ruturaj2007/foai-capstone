import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Mic, Send, ChevronUp } from 'lucide-react';
import { useUser } from '../auth/UserContext';

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:5000/api/chat';
const MESSAGES_PER_PAGE = 20;
const CONTEXT_WINDOW = 6; // Send last 6 messages (3 pairs) to n8n
const MAX_CONTEXT_LENGTH = 200; // Trim AI replies to 200 chars for webhook context

const SupportWidget = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Unique session ID per user (based on their MongoDB _id)
  const sessionId = useMemo(() => {
    return user?.id ? `session_${user.id}` : `session_anon_${Date.now()}`;
  }, [user]);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // Fetch recent chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${CHAT_API_URL}/${sessionId}?limit=${MESSAGES_PER_PAGE}&skip=0`);
        if (res.ok) {
          const data = await res.json();
          const formattedMessages = data.messages.map(m => ({
            role: m.role,
            content: m.role === 'user' ? m.content : undefined,
            customer_reply: m.role === 'ai' ? m.content : undefined,
            ticket_id: m.ticket_id,
            escalated: m.escalated
          }));
          setMessages(formattedMessages);
          setHasMore(data.hasMore);
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };
    fetchHistory();
  }, [sessionId, user]);

  // Load older messages
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    const container = chatContainerRef.current;
    const prevHeight = container?.scrollHeight || 0;

    try {
      const res = await fetch(`${CHAT_API_URL}/${sessionId}?limit=${MESSAGES_PER_PAGE}&skip=${messages.length}`);
      if (res.ok) {
        const data = await res.json();
        const olderMessages = data.messages.map(m => ({
          role: m.role,
          content: m.role === 'user' ? m.content : undefined,
          customer_reply: m.role === 'ai' ? m.content : undefined,
          ticket_id: m.ticket_id,
          escalated: m.escalated
        }));
        setMessages(prev => [...olderMessages, ...prev]);
        setHasMore(data.hasMore);

        // Maintain scroll position after prepending
        requestAnimationFrame(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - prevHeight;
          }
        });
      }
    } catch (err) {
      console.error("Failed to load more messages:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [sessionId, messages.length, hasMore, isLoadingMore]);

  useEffect(() => {
    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev.length > 0 ? ' ' : '') + transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
    }
  }, [recognition]);

  const toggleRecording = () => {
    if (!recognition) return alert("Speech recognition unsupported. Use Chrome/Safari.");
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Build trimmed chat history — last 6 messages (3 pairs), truncate long AI replies
    const chatHistory = messages.slice(-CONTEXT_WINDOW).map(m => {
      const content = m.role === 'user' 
        ? m.content 
        : (m.customer_reply || m.content || '');
      return {
        role: m.role,
        content: content.length > MAX_CONTEXT_LENGTH 
          ? content.substring(0, MAX_CONTEXT_LENGTH) + '...' 
          : content
      };
    });

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://n8n-service-tkip.onrender.com/webhook/868f294f-23e4-4a4b-b81b-219f9b0e669d', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          sessionId: sessionId,
          userEmail: user?.email || 'anonymous',
          chatHistory: chatHistory
        }),
      });

      if (!response.ok) throw new Error('Network error');
      const data = await response.json();

      setMessages((prev) => [...prev, { role: 'ai', ...data }]);

      // Save the conversation to the database (auto-trims to last 50)
      try {
        await fetch(`${CHAT_API_URL}/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionId,
            userEmail: user?.email || 'anonymous',
            userMessage: userMessage,
            aiReply: data.customer_reply || data.content,
            ticket_id: data.ticket_id,
            escalated: data.escalated
          })
        });
      } catch (saveError) {
        console.error("Failed to save chat to DB:", saveError);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: 'ai', 
        customer_reply: "Apologies, our systems are currently out of reach.",
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-16 w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-heading font-bold mb-2 text-white">Have a Question? Ask Our Support</h3>
        <p className="text-zinc-400 text-sm">Get instant answers about admissions, fees, academics and more</p>
      </div>

      <div className="bg-[#222222] border border-white/10 overflow-hidden rounded-xl">
        <div ref={chatContainerRef} className="h-[400px] overflow-y-auto p-6 space-y-6 flex flex-col bg-[#111111]/50">
          
          {/* Load More Button */}
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="mx-auto flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all disabled:opacity-50"
            >
              <ChevronUp className="w-3 h-3" />
              {isLoadingMore ? 'Loading...' : 'Load older messages'}
            </button>
          )}

          {messages.length === 0 && (
            <div className="m-auto text-zinc-500 text-sm text-center">
              Send a message to speak with Scaler Support.
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col animate-fade-in ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-scaler-red text-white rounded-br-sm'
                    : 'bg-[#1a1a1a] text-zinc-200 border border-white/5 rounded-bl-sm'
                }`}
              >
                {msg.role === 'user' ? msg.content : msg.customer_reply}
              </div>

              {msg.role === 'ai' && !msg.error && (
                <div className="mt-2 flex items-center gap-3 pl-1 text-[11px] font-sans">
                  {msg.ticket_id && (
                    <span className="text-zinc-500 flex items-center gap-1 font-mono">
                       # {msg.ticket_id}
                    </span>
                  )}
                  {msg.escalated !== undefined && (
                    <span className="flex items-center gap-1 text-zinc-400">
                      <span className={`w-2 h-2 rounded-full ${msg.escalated ? 'bg-scaler-red' : 'bg-green-500'}`} />
                      {msg.escalated ? 'Escalated to our team' : 'Resolved'}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start">
              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 flex gap-1 items-center h-10 rounded-bl-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/5 bg-[#1a1a1a]">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRecording ? 'Listening...' : 'Type your question here...'}
              disabled={isLoading || isRecording}
              className="w-full bg-[#111111] border border-white/10 rounded-lg py-3 pl-4 pr-20 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-scaler-red transition-all"
            />
            
            <div className="absolute right-2 flex items-center gap-1">
              <button 
                type="button"
                onClick={toggleRecording}
                className={`p-1.5 rounded-md transition-all ${isRecording ? 'text-scaler-red animate-pulse-fast bg-scaler-red/10' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-1.5 bg-scaler-red text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          <div className="text-center mt-3 text-[10px] text-zinc-600">
            Powered by n8n + Groq AI
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportWidget;
