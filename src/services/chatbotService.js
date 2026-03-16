const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const sendChatMessage = async (message) => {
    try {
        const res = await fetch(`${API_URL}/chatbot/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        return await res.json();
    } catch (error) {
        console.error('Chatbot service error:', error);
        return {
            reply: 'CIVITAS Assistant is temporarily unavailable. Please try again later.'
        };
    }
};

export default { sendChatMessage };
