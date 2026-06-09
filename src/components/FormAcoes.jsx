/**
 * Componente padronizado para botões de submissão de formulários.
 * Garante que todos os formulários do sistema tenham o mesmo visual
 * e comportamento de "loading" ao salvar.
 */
export function FormAcoes({ carregando, onCancelar, textoSalvar = 'Salvar' }) {
  return (
    <div className="form-acoes">
      <button 
        type="submit" 
        disabled={carregando} 
        className="btn-primario"
      >
        {carregando ? 'Salvando...' : textoSalvar}
      </button>
      
      <button 
        type="button" 
        onClick={onCancelar} 
        disabled={carregando}
        className="btn-secundario"
      >
        Cancelar
      </button>
    </div>
  );
}