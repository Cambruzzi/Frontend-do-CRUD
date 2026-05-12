import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function CadastroProduto() {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');
  
  const navigate = useNavigate();

  const salvarProduto = async (e) => {
    e.preventDefault(); // Impede a tela de piscar
    setErro('');

    try {
      // O Axios envia o POST com os dados no formato JSON exato que o Django espera
      await api.post('produtos/', {
        nome: nome,
        codigo: codigo,
        valor: parseFloat(valor) // Garante que o valor seja enviado como número (decimal)
      });

      // Se deu tudo certo, volta para a tela de lista de produtos automaticamente
      navigate('/produtos');
    } catch (error) {
      console.error(error);
      setErro('Erro ao salvar o produto. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Novo Produto</h2>
      
      <form onSubmit={salvarProduto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        
        <input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />
        
        <input
          type="number"
          step="0.01" // Permite centavos
          placeholder="Valor (R$)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />

        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 1, backgroundColor: '#55CC70', color: 'white', border: 'none', padding: '10px' }}>
            Salvar
          </button>
          {/* Botão para cancelar e voltar */}
          <button type="button" onClick={() => navigate('/produtos')} style={{ flex: 1, padding: '10px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}