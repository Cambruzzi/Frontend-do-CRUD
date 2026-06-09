import { useNavigate } from 'react-router-dom';
import { HeaderDashboard } from '../components/HeaderDashboard';
import { FeedbackMensagem } from '../components/FeedbackMensagem';
import { ProdutosGrid } from '../components/ProdutosGrid';
import { useProdutos } from '../hooks/useProdutos'; // <-- Importamos o nosso Hook!
import './Produtos.css'; 

const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;

export function Produtos() {
  const navigate = useNavigate();
  
  // A tela simplesmente "pede" os dados e as funções prontas para o Hook
  const { produtos, carregando, erro, deletarProduto } = useProdutos();

  return (
    <div className="produtos-container">
      
      <HeaderDashboard titulo="Meus Produtos">
        <button className="btn-novo-produto" onClick={() => navigate('/novo-produto')}>
          + Novo Produto
        </button>
      </HeaderDashboard>

      {carregando && <FeedbackMensagem tipo="carregando" texto="Carregando dados do servidor..." />}
      {erro && <FeedbackMensagem tipo="erro" texto={erro} />}
      {!carregando && produtos.length === 0 && !erro && (
        <FeedbackMensagem tipo="vazio" texto="Nenhum produto cadastrado ainda." />
      )}

      {!carregando && produtos.length > 0 && (
        <ProdutosGrid 
          produtos={produtos} 
          onDeletar={deletarProduto} 
          urlBackend={URL_BACKEND} 
        />
      )}
      
    </div>
  );
}