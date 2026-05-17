import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';
import './Produtos.css'; // Importação do arquivo de estilos separado

/**
 * Componente responsável por listar os produtos cadastrados no sistema.
 * Realiza uma busca automática (GET) na API assim que a tela é montada,
 * trata estados de carregamento, erros de conexão e integra com o tema global.
 * * @returns {JSX.Element} A tela de listagem de produtos
 */
export function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Executa a chamada assíncrona para buscar a lista de produtos no Django.
     */
    const buscaProdutos = async () => {
      try { 
        const resposta = await api.get('v1/produtos/');
        setProdutos(resposta.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setErro('Não foi possível carregar os produtos. Tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };

    buscaProdutos();
  }, []);

  return (
    <div className="produtos-container">
      <header className="produtos-header">
        <button 
          className="btn-novo-produto" 
          onClick={() => navigate('/novo-produto')}
        >
          + Novo Produto
        </button>
        
        <h2>Meus Produtos</h2>
        
        <div className="header-acoes">
          <ThemeToggle />
          <button 
            className="btn-sair" 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {carregando && <p className="status-mensagem">Carregando dados do servidor...</p>}

      {erro && <p className="mensagem-erro">{erro}</p>}

      {!carregando && produtos.length === 0 && !erro && (
        <p className="status-mensagem">Nenhum produto cadastrado ainda.</p>
      )}
      <div className="produtos-grid">
        {produtos.map((produto) => (
          <div key={produto.id} className="produto-card">
            <div className="produto-info">
              <strong className="produto-nome">{produto.nome}</strong>
              <span className="produto-codigo">Código: {produto.codigo}</span>
            </div>
            
            <div className="produto-preco-wrapper">
              <strong className="produto-preco">
                R$ {produto.valor}
              </strong>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}