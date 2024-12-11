import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ObterThemeAsync } from './services/estabelecimentoService';

// Criando o contexto
const ThemeContext = createContext();

// Provider para gerenciar o estado do tema
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(useColorScheme()); // Definindo o tema inicial

  let ThemaDoCelular = useColorScheme();

  const themaEscolhido2 = async() => {
    let themaDobanco = await ObterThemeAsync();
    toggleTheme(themaDobanco);
    return themaDobanco;
  }

  useEffect(() =>{
    themaEscolhido2();
  }, [ThemaDoCelular]);

  const toggleTheme = (themaEscolhido) => {
    if(themaEscolhido == "auto" && ThemaDoCelular == "light"){
      setTheme("light");
    }else if(themaEscolhido == "auto" && ThemaDoCelular == "dark"){
      setTheme("dark");
    }else if(themaEscolhido == "light" && ThemaDoCelular == "light"){
      setTheme("light");
    }else if(themaEscolhido == "light" && ThemaDoCelular == "dark"){
      setTheme("light");
    }else if(themaEscolhido == "dark" && ThemaDoCelular == "light"){
      setTheme("dark");
    }else if(themaEscolhido == "dark" && ThemaDoCelular == "dark"){
      setTheme("dark");
    }
  };



  return (
    <ThemeContext.Provider value={{theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para consumir o contexto
export const useTheme = () => useContext(ThemeContext);
