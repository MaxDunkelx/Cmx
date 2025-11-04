import { createContext, useContext } from 'react';
import theme from '../styles/theme';

const ThemeContext = createContext();

export function ThemeProvider({ children, userType = 'user' }) {
  const currentTheme = theme[userType];
  
  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

