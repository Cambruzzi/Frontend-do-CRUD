/**
 * Arquivo que centraliza as configurações de formulários do sistema.
 */
export const CAMPOS_PRODUTO = [
  { name: 'nome', type: 'text', placeholder: 'Nome do Produto' },
  { name: 'codigo', type: 'text', placeholder: 'Código' },
  { name: 'valor', type: 'number', placeholder: 'Valor (R$)', step: '0.01' }
];

export const CAMPOS_LOGIN = [
  { name: 'username', type: 'text', placeholder: 'Nome de Usuário' },
  { name: 'password', type: 'password', placeholder: 'Senha' }
];

export const CAMPOS_CADASTRO = [
  { name: 'username', type: 'text', placeholder: 'Nome de Usuário' },
  { name: 'password', type: 'password', placeholder: 'Senha' },
  { name: 'confirmPassword', type: 'password', placeholder: 'Confirme a Senha' }
];