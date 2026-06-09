/**
 * Arquivo que centraliza as configurações de formulários do sistema.
 * Se amanhã o produto precisar de um campo de "Categoria", você adiciona apenas aqui!
 */
export const CAMPOS_PRODUTO = [
  { name: 'nome', type: 'text', placeholder: 'Nome do Produto' },
  { name: 'codigo', type: 'text', placeholder: 'Código' },
  { name: 'valor', type: 'number', placeholder: 'Valor (R$)', step: '0.01' }
];