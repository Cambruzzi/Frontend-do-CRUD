import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

/**
 * Hook customizado que encapsula toda a regra de negócio da autenticação.
 * Ele gerencia o estado dos inputs, faz a chamada para o Django e salva o token.
 */
export function useLogin() {
  const [credenciais, setCredenciais] = useState({ username: '', password: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false); 
  const navigate = useNavigate();

  const lidarComMudanca = (e) => {
    const { name, value } = e.target;
    setCredenciais((estadoAnterior) => ({ ...estadoAnterior, [name]: value }));
  };

  const fazerLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    
    try {
      const resposta = await api.post('login/', credenciais);
      localStorage.setItem('token', resposta.data.token);
      navigate('/produtos');
    } catch (error) {
      console.error('Falha na autenticação:', error);
      // Busca a mensagem de erro específica do Django ou usa um fallback genérico
      const mensagemBackend = error.response?.data?.detail;
      setErro(mensagemBackend || 'Usuário ou senha incorretos. Tente novamente.');
    } finally {
      setCarregando(false); 
    }
  };

  return {
    credenciais,
    erro,
    carregando,
    lidarComMudanca,
    fazerLogin
  };
}