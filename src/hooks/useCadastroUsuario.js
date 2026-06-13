import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

/**
 * Hook customizado para gerenciar a criação de novas contas.
 * Separa a validação e a comunicação com o backend da parte visual.
 */
export function useCadastroUsuario() {
  const [credenciais, setCredenciais] = useState({ 
    username: '',
    password: '', 
    confirmPassword: '' 
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const lidarComMudanca = (e) => {
    const { name, value } = e.target;
    setCredenciais((prev) => ({ ...prev, [name]: value }));
  };

  const fazerCadastro = async (e) => {
    e.preventDefault();
    setErro('');

    if (credenciais.password !== credenciais.confirmPassword) {
      setErro('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    setCarregando(true);
    
    try {
      const payload = {
        username: credenciais.username,
        password: credenciais.password
      };

      await api.post('v1/registrar/', payload); 
      
      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      console.error('Falha ao cadastrar:', error);
      // Pega o erro específico do Django (ex: "Nome de usuário já existe")
      const mensagemBackend = error.response?.data?.detail || error.response?.data?.username?.[0];
      setErro(mensagemBackend || 'Ocorreu um erro ao criar a conta. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return {
    credenciais,
    erro,
    carregando,
    lidarComMudanca,
    fazerCadastro
  };
}