import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../services/api';

/**
 * Hook customizado que concentra toda a regra de negócio do cadastro:
 * - Recuperação de dados do F5 (sessionStorage)
 * - Manipulação do FormData para upload de arquivos
 * - Lógica de submissão (POST vs PUT)
 */
export function useCadastroProduto() {
  const { id } = useParams();
  const location = useLocation(); 
  const navigate = useNavigate();
  
  const modoEdicao = Boolean(id); 
  
  const [formData, setFormData] = useState({ nome: '', codigo: '', valor: '' });
  const [imagemArquivo, setImagemArquivo] = useState(null); 
  const [imagemPreview, setImagemPreview] = useState(''); 
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!modoEdicao) return; 

    const recuperarDadosProduto = () => {
      const produtoDaLista = location.state?.produtoNaMala;
      
      if (produtoDaLista) {
        setFormData({
          nome: produtoDaLista.nome,
          codigo: produtoDaLista.codigo,
          valor: produtoDaLista.valor
        });
        
        if (produtoDaLista.imagem) {
          setImagemPreview(produtoDaLista.imagem);
        }
        
        sessionStorage.setItem(`produto_${id}`, JSON.stringify(produtoDaLista));
        return; 
      }

      const copiaSeguranca = sessionStorage.getItem(`produto_${id}`);
      
      if (copiaSeguranca) {
        const produtoRecuperado = JSON.parse(copiaSeguranca);
        setFormData({
          nome: produtoRecuperado.nome,
          codigo: produtoRecuperado.codigo,
          valor: produtoRecuperado.valor
        });
        
        if (produtoRecuperado.imagem) {
          setImagemPreview(produtoRecuperado.imagem);
        }
        return; 
      }

      navigate('/produtos', { replace: true });
    };

    recuperarDadosProduto();

    return () => sessionStorage.removeItem(`produto_${id}`);
  }, [modoEdicao, id, location.state, navigate]);

  const lidarComMudanca = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const lidarComImagem = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemArquivo(file);
      setImagemPreview(URL.createObjectURL(file)); 
    }
  };

  const salvarProduto = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    const payload = new FormData();
    payload.append('nome', formData.nome);
    payload.append('codigo', formData.codigo);
    payload.append('valor', formData.valor);
    
    if (imagemArquivo) {
      payload.append('imagem', imagemArquivo);
    }

    try {
      if (modoEdicao) {
        await api.put(`v1/produtos/${id}/`, payload);
      } else {
        await api.post('v1/produtos/', payload);
      }
      navigate('/produtos');
    } catch (error) {
      console.error('Erro na submissão:', error);
      setErro(`Erro ao ${modoEdicao ? 'atualizar' : 'salvar'} o produto.`);
    } finally {
      setCarregando(false);
    }
  };

  const navegarParaLista = () => navigate('/produtos');

  return {
    modoEdicao,
    formData,
    imagemPreview,
    erro,
    carregando,
    lidarComMudanca,
    lidarComImagem,
    salvarProduto,
    navegarParaLista
  };
}