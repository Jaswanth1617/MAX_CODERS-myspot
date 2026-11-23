import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Headphones,
  Send,
  Sparkles,
  PhoneCall,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  ShieldCheck,
  Bot
} from 'lucide-react';

export const CustomerServiceModal = () => {
  const { isSupportModalOpen, setIsSupportModalOpen, user } = useApp();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello ${user ? user.name.split(' ')[0] : 'there'}! 👋 Welcome to myspot 24/7 Smart Mobility Support. How can I assist you with your parking spot today?`,
      time: 'Just now',
    }
  ]);

  const [inputText, setInputText] = useState('');

  if (!isSupportModalOpen) return null;

  const quickQuestions = [
    'How does offline hold booking work?',
    'How do I scan my QR pass at the boom barrier?',
    'How can I extend my active parking time?',
    'What if another car is in my assigned bay?',
  ];

  const handleSend = (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate intelligent AI response
    setTimeout(() => {
      let reply = 'Thank you for reaching out. Our support marshal has logged this inquiry.';
      const lower = text.toLowerCase();

      if (lower.includes('offline') || lower.includes('hold')) {
        reply = 'When you choose Offline Payment, your slot is placed on "HOLD" so nobody else can take it. The slot owner/supervisor gets an instant notification to confirm your spot. Once approved, you get your confirmed entry pass!';
      } else if (lower.includes('qr') || lower.includes('barrier') || lower.includes('scan')) {
        reply = 'Simply open your "Digital Parking Pass" from the Slot tab, hold your phone QR code 6 inches in front of the boom barrier scanner, and the gate will lift automatically!';
      } else if (lower.includes('extend')) {
        reply = 'You can tap the "+ Extend (+1h)" button on your digital pass card in the Slot tab anytime before your session expires.';
      } else if (lower.includes('blocked') || lower.includes('another car') || lower.includes('bay')) {
        reply = 'Please tap the "Report" button in the bottom navigation to submit a Blocked Spot report. Our on-ground marshal will relocate the vehicle or assign you an alternative VIP bay within 5 minutes.';
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200 flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-myspot-700 to-indigo-600 text-white flex items-center justify-center shadow-glow">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                <span>myspot AI Smart Concierge</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-[11px] text-slate-500">24/7 Real-Time Customer Support</p>
            </div>
          </div>
          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Call Banner */}
        <div className="py-2 px-3 my-2 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-purple-950 font-bold">
            <PhoneCall className="w-4 h-4 text-purple-700" />
            <span>Emergency Marshal Hotline:</span>
          </div>
          <a
            href="tel:1800697768"
            className="font-mono font-extrabold text-purple-700 hover:underline"
          >
            1800-MYSPOT-247
          </a>
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 p-1 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-myspot-700 to-indigo-600 text-white rounded-br-none shadow-sm font-medium'
                    : 'bg-purple-50/80 border border-purple-100 text-slate-800 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[9px] block mt-1 ${
                    msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="py-2 overflow-x-auto flex gap-1.5 no-scrollbar text-xs">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-purple-100/70 hover:bg-purple-100 text-purple-900 font-bold text-[11px] shrink-0 transition-colors border border-purple-200"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-2 border-t border-purple-100 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-myspot-700 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white shadow-glow transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
