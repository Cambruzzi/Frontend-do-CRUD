import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';
import './Login.css'; 

/**
 * CONFIGURAÇÃO ESTÁTICA
 * Declarada fora do componente para não ser recriada a cada renderização (Digitação).
 * Isso economiza processamento do navegador.
 */
const CAMPOS_FORMULARIO = [
  { name: 'nome', type: 'text', placeholder: 'Nome do Produto' },
  { name: 'codigo', type: 'text', placeholder: 'Código' },
  { name: 'valor', type: 'number', placeholder: 'Valor (R$)', step: '0.01' }
];

/**
 * Componente híbrido de formulário de Produto.
 * Atua tanto para Criação (POST) quanto para Edição (PUT).
 */
export function CadastroProduto() {
  const { id } = useParams();
  const location = useLocation(); 
  const navigate = useNavigate();
  
  const modoEdicao = Boolean(id); 
  
  const [formData, setFormData] = useState({ nome: '', codigo: '', valor: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // 1. GESTÃO DE CICLO DE VIDA E DADOS
  useEffect(() => {
    // Se for um novo cadastro, ignora o bloco inteiro
    if (!modoEdicao) return; 

    const recuperarDadosProduto = () => {
      // Cenário A: Dados vieram limpos da navegação
      const produtoDaLista = location.state?.produtoNaMala;
      
      if (produtoDaLista) {
        setFormData({
          nome: produtoDaLista.nome,
          codigo: produtoDaLista.codigo,
          valor: produtoDaLista.valor
        });
        sessionStorage.setItem(`produto_${id}`, JSON.stringify(produtoDaLista));
        return; // Early return: interrompe a execução aqui, não precisa do "else"
      }

      // Cenário B: Usuário deu F5 (Procura no cofre de segurança)
      const copiaSeguranca = sessionStorage.getItem(`produto_${id}`);
      
      if (copiaSeguranca) {
        const produtoRecuperado = JSON.parse(copiaSeguranca);
        setFormData({
          nome: produtoRecuperado.nome,
          codigo: produtoRecuperado.codigo,
          valor: produtoRecuperado.valor
        });
        return; 
      }

      // Cenário C: Acesso direto pelo link sem dados, volta para a base
      navigate('/produtos', { replace: true });
    };

    recuperarDadosProduto();

    // Cleanup: Remove os dados do cofre ao sair da tela de forma natural
    return () => sessionStorage.removeItem(`produto_${id}`);
  }, [modoEdicao, id, location.state, navigate]);

  // 2. MANIPULAÇÃO DE EVENTOS
  const lidarComMudanca = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const salvarProduto = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    // Isola a montagem do "pacote" (Payload) para não repetir código
    const payload = {
      nome: formData.nome,
      codigo: formData.codigo,
      valor: parseFloat(formData.valor)
    };

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

  // 3. RENDERIZAÇÃO DA INTERFACE
  return (
    <div className="login-container">
      <ThemeToggle />
      
      <h2>{modoEdicao ? 'Editar Produto' : 'Novo Produto'}</h2>
      
      <form onSubmit={salvarProduto} className="login-form">
        
        {CAMPOS_FORMULARIO.map((campo) => (
          <input
            key={campo.name}
            name={campo.name}
            type={campo.type}
            step={campo.step}
            placeholder={campo.placeholder}
            value={formData[campo.name]}
            onChange={lidarComMudanca}
            disabled={carregando}
            required
          />
        ))}

        {erro && <p className="mensagem-erro">{erro}</p>}
        
        <div className="form-acoes">
          <button type="submit" disabled={carregando} className="btn-primario">
            {carregando ? 'Salvando...' : 'Salvar'}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/produtos')} 
            disabled={carregando}
            className="btn-secundario"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}