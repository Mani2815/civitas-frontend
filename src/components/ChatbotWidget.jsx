import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import ChatWindow from './ChatWindow';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 md:right-8 w-14 h-14 rounded-2xl bg-neutral-900 text-white shadow-lg flex items-center justify-center z-[9999] hover:bg-black transition-all group"
            >
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary-teal rounded-full border-2 border-bg-primary group-hover:scale-110 transition-transform" />
                <HiOutlineChatAlt2 className="w-7 h-7" />
            </motion.button>

            <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default ChatbotWidget;
