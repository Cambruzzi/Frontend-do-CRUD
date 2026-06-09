import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

/**
 * Componente de cabeçalho para as telas do painel.
 * Gerencia o título, o botão de tema, a função de logout e permite
 * a injeção de ações customizadas (children) no lado esquerdo.
 */
export function HeaderDashboard({ titulo, children }) {
  const navigate = useNavigate();

  const lidarComLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="produtos-header">
      {children} 
      
      <h2>{titulo}</h2>
      
      <div className="header-acoes">
        <ThemeToggle />
        <button className="btn-sair" onClick={lidarComLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}