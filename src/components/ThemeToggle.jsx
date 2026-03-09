import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { toggleTheme } = useTheme();

    return (
        <button
            id="theme-toggle"
            className="theme-toggle"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
        >
            <span className="sun-icon">☀️</span>
            <span className="moon-icon">🌙</span>
        </button>
    );
};

export default ThemeToggle;
