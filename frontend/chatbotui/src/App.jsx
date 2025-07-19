import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const botAvatar = (
  <div className="relative">
    <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg animate-pulse-glow">
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="drop-shadow-sm">
        <path d="M9.5 2A1.5 1.5 0 008 3.5v1A1.5 1.5 0 009.5 6h5A1.5 1.5 0 0016 4.5v-1A1.5 1.5 0 0014.5 2h-5zM6.5 6A2.5 2.5 0 004 8.5V18a4 4 0 004 4h8a4 4 0 004-4V8.5A2.5 2.5 0 0017.5 6h-11zM8 10a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1z" fill="currentColor"/>
      </svg>
    </span>
    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-zinc-950 animate-bounce"></div>
  </div>
);

const userAvatar = (
  <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="drop-shadow-sm">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M15 9.5V12H13V10H11V12H9V9.5L15 9.5ZM21 10V12C21 13.1 20.1 14 19 14H18V16C18 17.1 17.1 18 16 18H8C6.9 18 6 17.1 6 16V14H5C3.9 14 3 13.1 3 12V10H21Z" fill="currentColor"/>
    </svg>
  </span>
);

const App = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatActive, setIsChatActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  useEffect(() => {
    if (!conversationId) {
      setConversationId(Date.now().toString());
    }
  }, [conversationId]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === '') return;
    
    const userMessage = message.trim();
    setMessage('');
    setLoading(true);
    setIsTyping(true);
    
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'user', text: userMessage, timestamp: new Date() },
    ]);

    try {
      const response = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, conversation_id: conversationId }),
      });
      
      if (!response.ok) throw new Error('Error with API request');
      
      const data = await response.json();
      
      // Add a small delay for better UX
      setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: 'ai', text: data.response, timestamp: new Date() },
        ]);
        setIsTyping(false);
      }, 800);
      
    } catch (error) {
      setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() },
        ]);
        setIsTyping(false);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setConversationId(Date.now().toString());
  };

  return (
    <div className="bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-900 min-h-screen flex justify-center items-center p-2 sm:p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/3 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-2xl bg-zinc-950/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-800/50 flex flex-col relative z-10 overflow-hidden">
        {/* Header with glassmorphism effect */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/50 bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {botAvatar}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent tracking-tight">
                AI Assistant
              </h1>
              <p className="text-zinc-400 text-sm">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 hover:bg-zinc-800/50 rounded-xl transition-all duration-200 text-zinc-400 hover:text-white"
              title="Clear chat"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Chat History with improved styling */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto h-96 max-h-[60vh] space-y-4 px-6 py-6 bg-gradient-to-b from-zinc-950/50 to-zinc-900/50 custom-scrollbar"
        >
          {chatHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-blue-400">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-zinc-300 text-lg font-semibold mb-2">Start a conversation</h3>
              <p className="text-zinc-500 text-sm">Send a message to begin chatting with your AI assistant</p>
            </div>
          )}
          
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {msg.sender === 'ai' && (
                <div className="flex-shrink-0 mb-1">
                  {botAvatar}
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md shadow-blue-500/25'
                    : 'bg-gradient-to-r from-zinc-800 to-zinc-700 text-zinc-100 rounded-bl-md border border-zinc-700/50'
                }`}
              >
                <div className="break-words">{msg.text}</div>
                <div className={`text-xs mt-2 opacity-60 ${msg.sender === 'user' ? 'text-blue-100' : 'text-zinc-400'}`}>
                  {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="flex-shrink-0 mb-1">
                  {userAvatar}
                </div>
              )}
            </div>
          ))}
          
          {(loading || isTyping) && (
            <div className="flex items-end gap-3 justify-start animate-slide-in">
              <div className="flex-shrink-0 mb-1">
                {botAvatar}
              </div>
              <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-gradient-to-r from-zinc-800 to-zinc-700 text-zinc-100 shadow-lg border border-zinc-700/50 rounded-bl-md">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-zinc-300">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Input Area */}
        {isChatActive && (
          <form onSubmit={sendMessage} className="flex items-center gap-3 px-6 py-4 border-t border-zinc-800/50 bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-2xl border border-zinc-700/50 bg-zinc-900/80 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
                placeholder="Type your message..."
                autoFocus
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
              </div>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-200 text-white p-3 rounded-2xl shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              disabled={loading || !message.trim()}
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </form>
        )}
      </div>

      {/* Enhanced animations and styles */}
      <style>{`
        @keyframes slide-in {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.3); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
};

export default App;