import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function Login() {
  // 1. O ESTADO: Aqui nós guardamos o que o usuário digita, em tempo real.
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  
  // O useNavigate é o nosso "motorista". Ele nos leva para outras telas.
  const navigate = useNavigate();

  // 2. A AÇÃO: O que acontece quando o botão "Entrar" é clicado
  const fazerLogin = async (e) => {
    e.preventDefault(); // Impede a página de recarregar (padrão do HTML antigo)
    setErro(''); // Limpa mensagens de erro antigas

    try {
      // O Axios envia o JSON para a sua URL de login do Django
      // ATENÇÃO: Confirme se a sua URL de login no urls.py é 'login/' mesmo.
      const resposta = await api.post('login/', { 
        username: usuario, 
        password: senha 
      });

      // 3. O SUCESSO: O Django devolveu o Token!
      const token = resposta.data.token;
      
      // Guardamos o Token na "gaveta" do navegador
      localStorage.setItem('token', token);

      // O motorista nos leva para a tela de Produtos instantaneamente
      navigate('/produtos');

    } catch (error) {
      // 4. A FALHA: O Django barrou (Senha errada ou usuário não existe)
      console.error(error);
      setErro('Usuário ou senha incorretos. Tente novamente.');
    }
  };

  // 5. O VISUAL (JSX)
  return (
    <div style={{ padding: '20px', maxWidth: '300px', margin: '0 auto' }}>
      <h2>Acesso ao Sistema</h2>
      
      <form onSubmit={fazerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Nome de Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)} // Atualiza o estado a cada letra digitada
          required
        />
        
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        
        {/* Se a variável 'erro' tiver algum texto, ele desenha esse aviso vermelho */}
        {erro && <p style={{ color: 'red', fontSize: '14px' }}>{erro}</p>}
        
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}