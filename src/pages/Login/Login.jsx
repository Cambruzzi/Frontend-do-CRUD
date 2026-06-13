import { ThemeToggle } from '../../components/ThemeToggle';
import { FeedbackMensagem } from '../../components/FeedbackMensagem';
import { RenderizadorCampos } from '../../components/RenderizadorCampos';
import { LinkAutenticacao } from '../../components/LinkAutenticacao';
import { BotaoPrimario } from '../../components/BotaoPrimario';
import { useLogin } from '../../hooks/useLogin';
import { CAMPOS_LOGIN } from '../../utils/formularios';
import '../../styles/layout-formulario.css'; 

export function Login() {
  const { credenciais, erro, carregando, lidarComMudanca, fazerLogin } = useLogin();

  return (
    <div className="login-container">
      <ThemeToggle />
      <h2>Acesso ao Sistema</h2>
      
      <form onSubmit={fazerLogin} className="login-form">
        
        <RenderizadorCampos 
          campos={CAMPOS_LOGIN}
          valores={credenciais}
          onChange={lidarComMudanca}
          disabled={carregando}
        />

        {erro && <FeedbackMensagem tipo="erro" texto={erro} />}
        
      <BotaoPrimario 
                carregando={carregando}
                texto="Entrar"
                textoCarregando="Entrando..."
                larguraTotal={true}
      />
        
        <LinkAutenticacao 
          texto="Ainda não tem acesso?"
          textoLink="Cadastre-se"
          rota="/cadastro"
        />
        
      </form>
    </div>
  );
}