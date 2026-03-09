/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['selector', '[data-theme="dark"]'],
    content: [
        './index.html',
        './src/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    dark: 'var(--primary-blue-dark)',
                    DEFAULT: 'var(--primary-blue)',
                    light: 'var(--primary-blue-light)',
                    lighter: 'var(--primary-blue-lighter)',
                },
                accent: {
                    DEFAULT: 'var(--accent-orange)',
                    light: 'var(--accent-orange-light)',
                    pale: 'var(--accent-orange-pale)',
                },
                secondary: {
                    teal: 'var(--secondary-teal)',
                    purple: 'var(--secondary-purple)',
                },
                neutral: {
                    white: 'var(--neutral-white)',
                    50: 'var(--neutral-50)',
                    100: 'var(--neutral-100)',
                    200: 'var(--neutral-200)',
                    300: 'var(--neutral-300)',
                    400: 'var(--neutral-400)',
                    500: 'var(--neutral-500)',
                    600: 'var(--neutral-600)',
                    700: 'var(--neutral-700)',
                    800: 'var(--neutral-800)',
                },
                bg: {
                    primary: 'var(--bg-primary)',
                    secondary: 'var(--bg-secondary)',
                    tertiary: 'var(--bg-tertiary)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    tertiary: 'var(--text-tertiary)',
                    inverse: 'var(--text-inverse)',
                },
                border: {
                    DEFAULT: 'var(--border-color)',
                    light: 'var(--border-light)',
                    dark: 'var(--border-dark)',
                },
                success: {
                    DEFAULT: 'var(--success)',
                    light: 'var(--success-light)',
                },
                warning: {
                    DEFAULT: 'var(--warning)',
                    light: 'var(--warning-light)',
                },
                error: {
                    DEFAULT: 'var(--error)',
                    light: 'var(--error-light)',
                },
                info: {
                    DEFAULT: 'var(--info)',
                    light: 'var(--info-light)',
                },
            },
            fontFamily: {
                heading: 'var(--font-heading)',
                body: 'var(--font-body)',
                mono: 'var(--font-mono)',
            },
            fontSize: {
                xs: 'var(--font-size-xs)',
                sm: 'var(--font-size-sm)',
                md: 'var(--font-size-md)',
                lg: 'var(--font-size-lg)',
                xl: 'var(--font-size-xl)',
                '2xl': 'var(--font-size-2xl)',
                '3xl': 'var(--font-size-3xl)',
            },
            fontWeight: {
                regular: 'var(--font-weight-regular)',
                medium: 'var(--font-weight-medium)',
                semibold: 'var(--font-weight-semibold)',
                bold: 'var(--font-weight-bold)',
                extrabold: 'var(--font-weight-extrabold)',
            },
            boxShadow: {
                xs: 'var(--shadow-xs)',
                sm: 'var(--shadow-sm)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                xl: 'var(--shadow-xl)',
                '2xl': 'var(--shadow-2xl)',
            },
            borderRadius: {
                none: 'var(--radius-none)',
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                full: 'var(--radius-full)',
            },
            spacing: {
                xs: 'var(--spacing-xs)',
                sm: 'var(--spacing-sm)',
                md: 'var(--spacing-md)',
                lg: 'var(--spacing-lg)',
                xl: 'var(--spacing-xl)',
                '2xl': 'var(--spacing-2xl)',
                '3xl': 'var(--spacing-3xl)',
                '4xl': 'var(--spacing-4xl)',
            }
        },
    },
    plugins: [],
};
