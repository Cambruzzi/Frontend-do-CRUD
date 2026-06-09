/**
 * Componente unificado para exibição de estados da interface.
 * @param {string} tipo - Pode ser 'carregando', 'erro' ou 'vazio'.
 * @param {string} texto - A mensagem que será exibida para o usuário.
 */
export function FeedbackMensagem({ tipo, texto }) {
  const classeFeedback = tipo === 'erro' ? 'mensagem-erro' : 'status-mensagem';
    const icone = {
    carregando: '⏳',
    erro: '❌',
    vazio: '📭'
  }[tipo];

  return (
    <p className={classeFeedback} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
      {icone && <span>{icone}</span>}
      {texto}
    </p>
  );
}