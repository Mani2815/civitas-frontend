import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30000,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AuthProvider>
                        <App />
                        <Toaster
                            position="top-right"
                            containerStyle={{ top: 16, zIndex: 99999 }}
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: 'rgb(var(--c-s-800))',
                                    color: 'rgb(var(--c-s-50))',
                                    border: '1px solid rgb(var(--c-s-700) / 0.4)',
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                },
                                success: {
                                    iconTheme: { primary: '#10b981', secondary: '#ffffff' },
                                },
                                error: {
                                    iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
                                },
                            }}
                        />
                    </AuthProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
