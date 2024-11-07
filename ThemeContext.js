import React, { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';

// Criando o contexto
const ThemeContext = createContext();

// Provider para gerenciar o estado do tema
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(useColorScheme()); // Definindo o tema inicial
  console.log(theme);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para consumir o contexto
export const useTheme = () => useContext(ThemeContext);
