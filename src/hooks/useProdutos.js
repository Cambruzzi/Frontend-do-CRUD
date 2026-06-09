import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Custom Hook que encapsula toda a regra de negócio e chamadas de API
 * relacionadas à listagem de produtos.
 */
export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
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

  const deletarProduto = async (id, nome) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir o produto "${nome}"? Esta ação não pode ser desfeita.`);
    if (!confirmacao) return; 
    
    try {
      await api.delete(`v1/produtos/${id}/`);
      setProdutos((listaAtual) => listaAtual.filter((produto) => produto.id !== id));
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('Ocorreu um erro ao tentar excluir o produto. Tente novamente.');
    }
  };

  return {
    produtos,
    carregando,
    erro,
    deletarProduto
  };
}