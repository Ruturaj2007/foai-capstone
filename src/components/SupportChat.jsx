import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, AlertTriangle, CheckCircle, Tag, Smile, Frown, Meh, Hash } from 'lucide-react';

const SupportChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Speech Recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

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

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    }
  }, [recognition]);

  const toggleRecording = () => {
    if (!recognition) {
      alert("Speech recognition isn't supported in your browser. Please use Chrome or Safari.");
      return;
    }

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

  const getMoodEmoji = (moodStr) => {
    if (!moodStr) return <Meh className="w-4 h-4" />;
    const normalized = moodStr.toLowerCase();
    if (normalized.includes('angry') || normalized.includes('negative')) return '😤';
    if (normalized.includes('casual') || normalized.includes('positive')) return '😊';
    return '😐';
  };

  const getTopicIcon = (topicStr) => {
    if (!topicStr) return '💬';
    const normalized = topicStr.toLowerCase();
    if (normalized.includes('billing')) return '💳';
    if (normalized.includes('technical')) return '🔧';
    if (normalized.includes('account')) return '👤';
    return '💬';
  };

  const getPriorityColor = (priority) => {
    if (!priority) return 'text-zinc-400 border-zinc-500/30 bg-zinc-500/10';
    const normalized = priority.toLowerCase();
    if (normalized === 'urgent') return 'text-red-400 border-red-500/30 bg-red-500/10';
    if (normalized === 'high') return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    if (normalized === 'medium') return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-green-400 border-green-500/30 bg-green-500/10';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://psychodiagnostic-isidro-increasingly.ngrok-free.dev/webhook/155c6388-3ca2-439b-957a-4c2e8bbdd600', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      setMessages((prev) => [...prev, { role: 'ai', ...data }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { 
        role: 'ai', 
        customer_reply: "Sorry, I couldn't reach the support server. Please try again.",
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="support" className="py-24 relative z-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-12">
          Submit Your <span className="text-indigo-400">Query</span>
        </h2>

        <div className="glass rounded-3xl overflow-hidden flex flex-col h-[600px] border border-white/10 shadow-2xl relative">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <Tag className="w-12 h-12 mb-4 text-cyan-400" />
                <p className="font-heading text-xl">How can we help you today?</p>
                <p className="text-sm">Type a message or use the mic.</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col animate-[slideIn_0.3s_ease-out] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-coral-500 text-white rounded-br-sm'
                      : 'bg-indigo-600/40 border border-indigo-500/30 text-white rounded-bl-sm'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed">
                    {msg.role === 'user' ? msg.content : msg.customer_reply}
                  </p>
                </div>
                
                {/* AI Badges row */}
                {msg.role === 'ai' && !msg.error && (
                  <div className="mt-3 flex flex-wrap gap-2 max-w-[80%] pl-2">
                    {msg.ticket_id && (
                      <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                        <Hash className="w-3 h-3" /> {msg.ticket_id}
                      </span>
                    )}
                    {msg.topic && (
                      <span className="flex items-center gap-1 text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-md text-zinc-300">
                        {getTopicIcon(msg.topic)} {msg.topic}
                      </span>
                    )}
                    {msg.mood && (
                      <span className="flex items-center gap-1 text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-md text-zinc-300 capitalize">
                        {getMoodEmoji(msg.mood)} {msg.mood}
                      </span>
                    )}
                    {msg.priority && (
                      <span className={`text-xs px-2 py-1 border rounded-md capitalize ${getPriorityColor(msg.priority)}`}>
                        {msg.priority} Priority
                      </span>
                    )}
                    {msg.escalated !== undefined && (
                      <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${msg.escalated ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                        {msg.escalated ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {msg.escalated ? 'Escalated to Human' : 'Resolved by AI'}
                      </span>
                    )}
                    {msg.response_quality_score !== undefined && (
                      <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-md">
                        ⭐ {msg.response_quality_score}/10
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-indigo-600/40 border border-indigo-500/30 rounded-2xl rounded-bl-sm p-4 flex gap-1 items-center h-12">
                  <div className="w-2 h-2 rounded-full bg-indigo-200 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-indigo-200 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-indigo-200 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-zinc-900/50 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isRecording ? 'Listening...' : 'Type your issue here...'}
                disabled={isLoading || isRecording}
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-24 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              
              <div className="absolute right-2 flex items-center gap-1">
                <button 
                  type="button"
                  onClick={toggleRecording}
                  className={`p-2.5 rounded-full transition-all ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse-fast' : 'hover:bg-white/10 text-zinc-400 hover:text-cyan-400'}`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                >
                  <Send className="w-5 h-5 ml-[2px]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportChat;
