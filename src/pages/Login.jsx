import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';
import './Login.css'; 
/**
 * Componente responsável pela tela de acesso ao sistema.
 * Gerencia a captura das credenciais do usuário, envia para a API do Django
 * e salva o Token de segurança no navegador (localStorage).
 * * @returns {JSX.Element} O formulário de login renderizado
 */
export function Login() {
  const [credenciais, setCredenciais] = useState({ username: '', password: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false); 
  const navigate = useNavigate();
  /**
   * Atualiza o estado unificado do formulário a cada tecla digitada.
   * Utiliza a propriedade 'name' do input para identificar qual campo alterar.
   * * @param {Object} e - O evento de mudança (onChange) disparado pelo input
   */
  const lidarComMudanca = (e) => {
    const { name, value } = e.target;
    setCredenciais((estadoAnterior) => ({ ...estadoAnterior, [name]: value }));
  };
  /**
   * Dispara a requisição de autenticação para o servidor.
   * Em caso de sucesso, redireciona para a rota /produtos.
   * * @param {Object} e - O evento de submissão (onSubmit) do formulário
   */
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
      const mensagemBackend = error.response?.data?.detail;
      setErro(mensagemBackend || 'Usuário ou senha incorretos. Tente novamente.');
    } finally {
      setCarregando(false); 
    }
  };

  return (
    <div className="login-container">
      <ThemeToggle />
      <h2>Acesso ao Sistema</h2>
      <form onSubmit={fazerLogin} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Nome de Usuário"
          value={credenciais.username}
          onChange={lidarComMudanca}
          disabled={carregando}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={credenciais.password}
          onChange={lidarComMudanca}
          disabled={carregando}
          required
        />
        {erro && <p className="mensagem-erro">{erro}</p>}
        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}