import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Bot, User, Sparkles } from 'lucide-react';
import { sendDeepSeekMessageStream, initDeepSeekSession } from '../services/deepseekService';
import { ChatMessage } from '../types';

const Lab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // 只在有实际对话时才滚动（消息数>1），避免打字机效果导致页面跳动
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    initDeepSeekSession();
  }, []);

  // 打字机效果
  useEffect(() => {
    const fullText = 'DeepForge\n\nHow can I help you today?';
    let i = 0;
    const timer = setInterval(() => {
      setMessages([{ role: 'model', text: fullText.slice(0, i) }]);
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = sendDeepSeekMessageStream(userMessage.text);
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'model') {
            lastMsg.text = fullText;
          }
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Connection lost. Please try again.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-3xl mx-auto w-full px-4 sm:px-0">
      
      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto py-8 space-y-8 scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            {/* Model Icon */}
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center flex-shrink-0 bg-surface overflow-hidden">
                 <img src="/deepforge_logo_black.jpg" alt="DeepForge" className="w-full h-full object-cover" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] py-2 text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-surfaceHighlight px-4 py-3 rounded-2xl text-primary font-medium'
                  : msg.isError
                  ? 'text-red-600'
                  : 'text-primary'
              }`}
            >
              {msg.text}
            </div>
            
            {/* User Icon (Optional, often hidden in modern chat UIs, but kept for balance) */}
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
                <User size={14} />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="py-6 bg-white/90 backdrop-blur-sm sticky bottom-0">
        <div className="relative shadow-xl shadow-black/5 rounded-3xl overflow-hidden border border-border bg-white">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything..."
            rows={1}
            className="w-full bg-white text-primary placeholder-secondary/50 py-4 pl-6 pr-14 focus:outline-none resize-none max-h-32"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 bottom-3 p-2 bg-black text-white rounded-full hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </div>
        <div className="text-center mt-3">
          <span className="text-xs text-secondary/60 font-medium">DeepForge &bull; Chat</span>
        </div>
      </div>
    </div>
  );
};

export default Lab;