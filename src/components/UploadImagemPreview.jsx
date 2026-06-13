/**
 * Componente isolado para gerenciar o visual de upload de imagens.
 * Recebe a string de preview (blob temporário ou link do banco) e a função de captura.
 */
export function UploadImagemPreview({ imagemPreview, aoMudarImagem }) {
  const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;

  const obterCaminhoPreview = () => {
    if (!imagemPreview) return null;
    if (imagemPreview.startsWith('blob:')) return imagemPreview;
    return `${URL_BACKEND}${imagemPreview}`;
  };

  return (
    <div className="upload-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
      {imagemPreview ? (
        <img 
          src={obterCaminhoPreview()} 
          alt="Preview do Produto" 
          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--texto-secundario)' }}
        />
      ) : (
        <div style={{ width: '100px', height: '100px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--texto-secundario)', fontSize: '24px' }} title="Sem imagem">
          📦
        </div>
      )}
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={aoMudarImagem}
        style={{ fontSize: '14px', width: '100%' }}
      />
    </div>
  );
}