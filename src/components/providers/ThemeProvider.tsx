'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default to dark
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
      
      setIsDarkMode(initialDarkMode);
      
      // Apply theme immediately
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(initialDarkMode ? 'dark' : 'light');
    } catch (error) {
      // Fallback to dark mode if there's an error
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return;
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    if (!mounted) return;
    
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
