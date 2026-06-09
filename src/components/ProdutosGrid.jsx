import { ProdutoCard } from './ProdutoCard';

/**
 * Componente responsável por renderizar a grade de produtos.
 * Isola a lógica de iteração (.map) e prepara o terreno para futuras
 * funcionalidades como paginação ou ordenação.
 */
export function ProdutosGrid({ produtos, onDeletar, urlBackend }) {
  return (
    <div className="produtos-grid">
      {produtos.map((produto) => (
        <ProdutoCard 
          key={produto.id} 
          produto={produto} 
          onDeletar={onDeletar}
          urlBackend={urlBackend}
        />
      ))}
    </div>
  );
}