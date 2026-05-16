import { useTheme } from '../contexts/ThemeContext';
/**
 * Componente de botão reutilizável para alternar o tema do sistema.
 */
export function ThemeToggle() {
  const { temaClaro, alternarTema } = useTheme();

  return (
    <button className="btn-troca-tema" onClick={alternarTema}>
      {temaClaro ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
    </button>
  );
}