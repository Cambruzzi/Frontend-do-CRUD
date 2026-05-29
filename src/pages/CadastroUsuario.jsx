import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';
import './Login.css';

/**
 * Componente para registro de novos usuários.
 * Valida a igualdade das senhas no front-end antes de enviar para a API.
 */
export function CadastroUsuario() {
  // Estado unificado para o formulário
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const navigate = useNavigate();

  const lidarComMudanca = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fazerCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (formData.password !== formData.confirmPassword) {
      setErro('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    setCarregando(true);

    try {
      await api.post('v1/registrar/', {
        username: formData.username,
        password: formData.password
      });
      setSucesso('Conta criada com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Erro no cadastro:', error);
      const mensagemBackend = error.response?.data?.username?.[0] || error.response?.data?.detail;
      setErro(mensagemBackend || 'Erro ao criar conta. O nome de usuário pode já estar em uso.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <ThemeToggle />
      
      <h2>Criar Nova Conta</h2>
      
      <form onSubmit={fazerCadastro} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Escolha um Nome de Usuário"
          value={formData.username}
          onChange={lidarComMudanca}
          disabled={carregando || sucesso}
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Crie uma Senha"
          value={formData.password}
          onChange={lidarComMudanca}
          disabled={carregando || sucesso}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirme sua Senha"
          value={formData.confirmPassword}
          onChange={lidarComMudanca}
          disabled={carregando || sucesso}
          required
        />
        
        {erro && <p className="mensagem-erro">{erro}</p>}
        {sucesso && (
          <p style={{ color: 'var(--verde-neon)', backgroundColor: 'rgba(85, 204, 112, 0.1)', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
            {sucesso}
          </p>
        )}
        
        <button type="submit" disabled={carregando || sucesso}>
          {carregando ? 'Criando conta...' : 'Cadastrar'}
        </button>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link to="/login" style={{ color: 'var(--texto-secundario)', textDecoration: 'none', fontSize: '14px' }}>
            Já tem uma conta? <strong>Faça Login</strong>
          </Link>
        </div>
      </form>
    </div>
  );
}