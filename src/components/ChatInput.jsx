import React, { useState } from 'react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';

const ChatInput = ({ onSendMessage, isLoading }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-bg-secondary">
            <div className="relative">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask CIVITAS AI..."
                    className="w-full bg-bg-tertiary border border-border text-text-primary text-sm rounded-full pl-4 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <HiOutlinePaperAirplane className="w-4 h-4 rotate-90" />
                </button>
            </div>
        </form>
    );
};

export default ChatInput;
