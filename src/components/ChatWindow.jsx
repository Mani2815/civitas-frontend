import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineSparkles } from 'react-icons/hi';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { sendChatMessage } from '../services/chatbotService';

const ChatWindow = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your **CIVITAS AI Assistant**. How can I help you today?\n\nI can assist with:\n* **Submitting** a new complaint\n* **Tracking** an existing complaint\n* Identifying complaint **categories**\n* Using the complaint **dashboard**", isBot: true }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text) => {
        // Add user message
        setMessages(prev => [...prev, { text, isBot: false }]);
        setIsLoading(true);

        try {
            const response = await sendChatMessage(text);
            setMessages(prev => [...prev, { text: response.reply, isBot: true }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                text: "I'm sorry, I'm having trouble connecting right now. Please try again later.", 
                isBot: true 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed bottom-24 right-4 md:right-8 w-[calc(100vw-32px)] md:w-[380px] h-[500px] max-h-[calc(100vh-120px)] bg-bg-primary rounded-3xl shadow-2xl border border-border z-[9999] flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                <HiOutlineSparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">CIVITAS AI Assistant</h3>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                    <span className="text-[10px] text-white/60">Always online</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <HiOutlineX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {messages.map((msg, i) => (
                            <ChatMessage key={i} message={msg.text} isBot={msg.isBot} />
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-bg-secondary border border-border rounded-2xl px-4 py-2.5 flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce [animation-delay:-0.3s]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatWindow;
