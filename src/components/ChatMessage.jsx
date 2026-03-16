import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatMessage = ({ message, isBot }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
        >
            <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm prose prose-sm dark:prose-invert ${
                    isBot
                        ? 'bg-bg-secondary text-text-primary border border-border rounded-bl-none'
                        : 'bg-neutral-900 text-white rounded-br-none'
                }`}
            >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
};

export default ChatMessage;
