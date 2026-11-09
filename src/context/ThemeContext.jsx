import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  isDarkMode: false
});

const THEME_STORAGE_KEY = 'davp_library_theme';

let memoryTheme = 'light';

const safeStorage = {
  getTheme: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
          memoryTheme = saved;
          return saved;
        }
      }
    } catch (e) {
      // Storage access blocked or restricted
    }

    try {
      if (typeof document !== 'undefined' && document.cookie) {
        const match = document.cookie.match(/davp_library_theme=(dark|light)/);
        if (match && (match[1] === 'dark' || match[1] === 'light')) {
          memoryTheme = match[1];
          return match[1];
        }
      }
    } catch (e) {
      // Cookie access blocked
    }

    return memoryTheme || 'light'; // Default to Light Mode for first-time visitors
  },
  setTheme: (theme) => {
    memoryTheme = theme;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    } catch (e) {
      // Storage access blocked
    }

    try {
      if (typeof document !== 'undefined') {
        document.cookie = `davp_library_theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch (e) {
      // Cookie access blocked
    }
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => safeStorage.getTheme());

  useEffect(() => {
    safeStorage.setTheme(theme);

    const isDark = theme === 'dark';

    // Apply data-theme attribute and classes to documentElement and body
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    if (isDark) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
