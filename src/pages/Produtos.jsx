import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
export function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  useEffect(() => {
    const buscaProdutos = async () => {
      try { 
        const resposta = await api.get('v1/produtos/');
        setProdutos(resposta.data);
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar os produtos. Tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };
    buscaProdutos();
  }, []);
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       <button onClick={() => navigate('/novo-produto')} style={{ marginRight: '10px' }}>
        + Novo Produto
      </button>
       <h2>Meus Produtos</h2>
        <button onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }}>Sair</button>
      </div>

      {/* Se estiver carregando, mostra um aviso */}
      {carregando && <p>Carregando dados do servidor...</p>}

      {/* Se deu erro, mostra em vermelho */}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {/* Se a lista estiver vazia, avisa o usuário */}
      {!carregando && produtos.length === 0 && !erro && (
        <p>Nenhum produto cadastrado ainda.</p>
      )}

      {/* O .map() é o 'for loop' do React. Ele desenha um card para cada produto */}
      <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
        {produtos.map((produto) => (
          <div 
            key={produto.id} 
            style={{ 
              border: '1px solid #3d2750', 
              padding: '15px', 
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <strong style={{ color: '#f0eaf5' }}>{produto.nome}</strong>
              <p style={{ margin: '5px 0', color: '#c084fc', backgroundColor: '#3d2750', padding: '2px 8px', borderRadius: '4px' }}>Código: {produto.codigo}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ color: 'green', fontSize: '18px' }}>
                R$ {produto.valor}
              </strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
