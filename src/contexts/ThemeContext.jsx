import { createContext, useState, useContext, useEffect } from 'react';
const ThemeContext = createContext();
/**
 * Provedor do Tema. Ele deve envelopar a aplicação para distribuir
 * o estado de Dark/Light mode para todas as telas.
 */
export function ThemeProvider({ children }) {
  const [temaClaro, setTemaClaro] = useState(() => {
    return localStorage.getItem('temaClaro') === 'true';
  });
  useEffect(() => {
    localStorage.setItem('temaClaro', temaClaro);
  }, [temaClaro]);
  const alternarTema = () => setTemaClaro(!temaClaro);
  return (
    <ThemeContext.Provider value={{ temaClaro, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);