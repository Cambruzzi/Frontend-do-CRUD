import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function CadastroProduto() {
  // 1. ESTADO UNIFICADO: Um único objeto para todo o formulário
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    valor: '',
    imagem: null
  });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  // 2. FUNÇÃO INTELIGENTE: Atualiza qualquer campo do formulário dinamicamente
  const lidarComMudanca = (e) => {
    // Extrai o 'name' (qual input está sendo digitado) e o 'value' (o que foi digitado)
    const { name, value } = e.target;
    
    setFormData((estadoAnterior) => ({
      ...estadoAnterior, // Mantém os dados dos outros campos
      [name]: value      // Atualiza apenas o campo que está sendo digitado
    }));
  };

  const salvarProduto = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      await api.post('v1/produtos/', {
        nome: formData.nome,
        codigo: formData.codigo,
        valor: parseFloat(formData.valor)
      });
      navigate('/produtos');
    } catch (error) {
      console.error(error);
      setErro('Erro ao salvar o produto.');
    }
  };

  // 3. CONFIGURAÇÃO DOS CAMPOS: Uma lista simples
  const camposDoFormulario = [
    { name: 'nome', type: 'text', placeholder: 'Nome do Produto', accept: '' ,required: true, step: ''},
    { name: 'codigo', type: 'text', placeholder: 'Código', accept: '', step: '', required: false  },
    { name: 'imagem', type: 'file', placeholder: 'URL da Imagem', accept: 'image/*', step: '', required: false },
    { name: 'valor', type: 'number', placeholder: 'Valor (R$)', accept: '',step: '0.01', required: true }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Novo Produto</h2>
      
      <form onSubmit={salvarProduto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* 4. O MAP: Desenha todos os inputs de uma vez */}
        {camposDoFormulario.map((campo) => (
          <input
            key={campo.name} // O React exige uma chave única no map
            name={campo.name}
            type={campo.type}
            step={campo.step}
            placeholder={campo.placeholder}
            value={formData[campo.name]} // Pega o valor correspondente no objeto unificado
            onChange={lidarComMudanca}   // Usa a mesma função para todos
            required ={campo.required}
            accept={campo.accept}
          />
        ))}

        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 1, backgroundColor: '#55CC70', color: 'white', border: 'none', padding: '10px' }}>
            Salvar
          </button>
          <button type="button" onClick={() => navigate('/produtos')} style={{ flex: 1, padding: '10px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}