// ThemeContext.js
import React, { createContext, useContext, useState } from 'react';
import theme from './theme'; // senin tema dosyan

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(true);

    const toggleTheme = () => {
        setIsDarkTheme(prev => !prev);
    };

    const currentTheme = isDarkTheme ? theme[0] : theme[1];

    return (
        <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, currentTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
