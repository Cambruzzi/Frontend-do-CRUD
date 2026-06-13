import { Link } from 'react-router-dom';

/**
 * Componente de rodapé para telas de autenticação.
 * Renderiza uma mensagem descritiva acompanhada de um link de navegação.
 */
export function LinkAutenticacao({ texto, textoLink, rota }) {
  return (
    <div className="rodape-login" style={{ textAlign: 'center', marginTop: '15px' }}>
      <span style={{ color: 'var(--texto-secundario)', fontSize: '14px' }}>
        {texto}{' '}
      </span>
      <Link to={rota} style={{ color: 'var(--verde-neon)', textDecoration: 'none', fontWeight: 'bold' }}>
        {textoLink}
      </Link>
    </div>
  );
}