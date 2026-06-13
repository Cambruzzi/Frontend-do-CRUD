import { ThemeToggle } from '../../components/ThemeToggle';
import { UploadImagemPreview } from '../../components/UploadImagemPreview';
import { FeedbackMensagem } from '../../components/FeedbackMensagem';
import { RenderizadorCampos } from '../../components/RenderizadorCampos';
import { FormAcoes } from '../../components/FormAcoes'; // <-- 1. Importamos o nosso novo componente
import { useCadastroProduto } from '../../hooks/useCadastroProduto';
import { CAMPOS_PRODUTO } from '../../utils/formularios'; 
import '../../styles/layout-formulario.css'; 

export function CadastroProduto() {
  const {
    modoEdicao,
    formData,
    imagemPreview,
    erro,
    carregando,
    lidarComMudanca,
    lidarComImagem,
    salvarProduto,
    navegarParaLista
  } = useCadastroProduto();

  return (
    <div className="login-container">
      <ThemeToggle />
      
      <h2>{modoEdicao ? 'Editar Produto' : 'Novo Produto'}</h2>
      
      <form onSubmit={salvarProduto} className="login-form">
        
        <UploadImagemPreview 
          imagemPreview={imagemPreview} 
          aoMudarImagem={lidarComImagem} 
        />

        <RenderizadorCampos 
          campos={CAMPOS_PRODUTO}
          valores={formData}
          onChange={lidarComMudanca}
          disabled={carregando}
        />

        {erro && <FeedbackMensagem tipo="erro" texto={erro} />}

        <FormAcoes 
          carregando={carregando} 
          onCancelar={navegarParaLista} 
        />
        
      </form>
    </div>
  );
}