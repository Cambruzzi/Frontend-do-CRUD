import { useNavigate } from 'react-router-dom';

/**
 * Componente de apresentação (Dumb Component).
 * Sua única responsabilidade é renderizar o visual de um produto e repassar as ações de clique.
 */
export function ProdutoCard({ produto, onDeletar, urlBackend }) {
  const navigate = useNavigate();

  return (
    <div className="produto-card">
      
      <div className="produto-imagem-container">
        {produto.imagem ? (
          <img 
            src={`${urlBackend}${produto.imagem}`}
            alt={`Foto do produto ${produto.nome}`} 
            className="produto-thumbnail"
          />
        ) : (
          <div className="produto-imagem-placeholder" title="Sem imagem">
            📦
          </div>
        )}
      </div>

      <div className="produto-info">
        <strong className="produto-nome">{produto.nome}</strong>
        <span className="produto-codigo">Código: {produto.codigo}</span>
      </div>

      <div className="produto-acoes">
        <strong className="produto-preco">R$ {produto.valor}</strong>
        
        <button 
          onClick={() => navigate(`/editar-produto/${produto.id}`, { state: { produtoNaMala: produto } })}
          className="btn-acao btn-editar"
          aria-label={`Editar ${produto.nome}`}
        >
          ✏️ Editar
        </button>
        
        <button 
          onClick={() => onDeletar(produto.id, produto.nome)}
          className="btn-acao btn-excluir"
          aria-label={`Excluir ${produto.nome}`}
        >
          🗑️ Excluir
        </button> 
      </div>

    </div>
  );
}