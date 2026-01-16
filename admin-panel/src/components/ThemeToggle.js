import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className={`toggle-track ${darkMode ? 'dark' : 'light'}`}>
        <div className="toggle-thumb">
          {darkMode ? <FaMoon /> : <FaSun />}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
