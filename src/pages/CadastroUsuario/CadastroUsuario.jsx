import { ThemeToggle } from '../../components/ThemeToggle';
import { FeedbackMensagem } from '../../components/FeedbackMensagem';
import { RenderizadorCampos } from '../../components/RenderizadorCampos';
import { LinkAutenticacao } from '../../components/LinkAutenticacao';
import { BotaoPrimario } from '../../components/BotaoPrimario';
import { useCadastroUsuario } from '../../hooks/useCadastroUsuario';
import { CAMPOS_CADASTRO } from '../../utils/formularios';
import '../../styles/layout-formulario.css'; 

export function CadastroUsuario() {
  const { credenciais, erro, carregando, lidarComMudanca, fazerCadastro } = useCadastroUsuario();

  return (
    <div className="login-container">
      <ThemeToggle />
      <h2>Criar Nova Conta</h2>
      
      <form onSubmit={fazerCadastro} className="login-form">
        
        <RenderizadorCampos 
          campos={CAMPOS_CADASTRO}
          valores={credenciais}
          onChange={lidarComMudanca}
          disabled={carregando}
        />

        {erro && <FeedbackMensagem tipo="erro" texto={erro} />}
        
        <BotaoPrimario 
          carregando={carregando}
          texto="Criar Conta"
          textoCarregando="Cadastrando..."
          larguraTotal={true}
        />
        
        <LinkAutenticacao 
          texto="Já possui uma conta?"
          textoLink="Fazer Login"
          rota="/login"
        />
        
      </form>
    </div>
  );
}