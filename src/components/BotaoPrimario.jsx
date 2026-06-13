/**
 * Componente padronizado para a ação principal (submit) das telas.
 * Gerencia o estado de carregamento e permite expansão de largura.
 */
export function BotaoPrimario({ 
  carregando, 
  texto, 
  textoCarregando, 
  type = 'submit',
  larguraTotal = false 
}) {
  const estiloDinamico = larguraTotal ? { width: '100%', marginTop: '10px' } : {};

  return (
    <button 
      type={type} 
      disabled={carregando} 
      className="btn-primario" 
      style={estiloDinamico}
    >
      {carregando ? textoCarregando : texto}
    </button>
  );
}