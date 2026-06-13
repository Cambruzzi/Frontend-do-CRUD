import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { CadastroUsuario } from './CadastroUsuario';
import api from '../../services/api';

/**
 * Suíte de testes integrados e unitários para a tela de Cadastro de Usuário.
 * Atualizado para refletir o padrão de formulários dinâmicos e Custom Hooks.
 */

// 1. CONFIGURAÇÃO DE INFRAESTRUTURA DE MOCKS
vi.mock('../../services/api');

const mockNavigate = vi.fn(); 
vi.mock('react-router-dom', async () => {
  const moduloReal = await vi.importActual('react-router-dom');
  return {
    ...moduloReal,
    useNavigate: () => mockNavigate,
  };
});

describe('Tela de Cadastro de Usuário', () => {
  
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- CENÁRIO 1: VALIDAÇÃO DE CLIENT-SIDE (FRONT-END) ---
  it('deve interromper o fluxo de envio caso as senhas digitadas sejam divergentes', async () => {

    // ARRANGE
    const usuario = userEvent.setup(); 
    
    render(
      <ThemeProvider>
        <BrowserRouter>
          <CadastroUsuario />
        </BrowserRouter>
      </ThemeProvider>
    );

    // ACT
    await usuario.type(screen.getByPlaceholderText('Nome de Usuário'), 'novo_admin');
    await usuario.type(screen.getByPlaceholderText('Senha'), 'senha123');
    await usuario.type(screen.getByPlaceholderText('Confirme a Senha'), 'senhaERRADA');
    
    await usuario.click(screen.getByRole('button', { name: /criar conta/i }));

    // ASSERT
    expect(api.post).not.toHaveBeenCalled();
    expect(screen.getByText('As senhas não coincidem. Verifique e tente novamente.')).toBeInTheDocument();
  });

  // --- CENÁRIO 2: SUCESSO E REDIRECIONAMENTO ---
  it('deve registrar o usuário com sucesso, exibir o alerta e efetuar o redirecionamento', async () => {
    

    // ARRANGE
    const usuario = userEvent.setup(); 
    api.post.mockResolvedValueOnce({ status: 201 });
    
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <ThemeProvider>
        <BrowserRouter>
          <CadastroUsuario />
        </BrowserRouter>
      </ThemeProvider>
    );

    // 2. ACT
    await usuario.type(screen.getByPlaceholderText('Nome de Usuário'), 'novo_admin');
    await usuario.type(screen.getByPlaceholderText('Senha'), 'senha123');
    await usuario.type(screen.getByPlaceholderText('Confirme a Senha'), 'senha123');
    
    await usuario.click(screen.getByRole('button', { name: /criar conta/i }));

    // ASSERT 
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('v1/registrar/', {
        username: 'novo_admin',
        password: 'senha123'
      });
      expect(alertSpy).toHaveBeenCalledWith('Conta criada com sucesso! Faça login para continuar.');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    // Limpeza após o Assert
    alertSpy.mockRestore();
  });

  // --- CENÁRIO 3: TRATAMENTO DE EXCEÇÕES DA API (BACK-END) ---
  it('deve interceptar a rejeição do servidor e expor a mensagem de erro correspondente', async () => {
    
    // ARRANGE
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const usuario = userEvent.setup(); 

    api.post.mockRejectedValueOnce({
      response: { 
        data: { username: ['Este nome de usuário já está em uso.'] } 
      }
    });

    render(
      <ThemeProvider>
        <BrowserRouter>
          <CadastroUsuario />
        </BrowserRouter>
      </ThemeProvider>
    );

    // ACT
    await usuario.type(screen.getByPlaceholderText('Nome de Usuário'), 'admin_existente');
    await usuario.type(screen.getByPlaceholderText('Senha'), 'senha123');
    await usuario.type(screen.getByPlaceholderText('Confirme a Senha'), 'senha123');
    
    await usuario.click(screen.getByRole('button', { name: /criar conta/i }));

    // ASSERT 
    await waitFor(() => {
      expect(screen.getByText('Este nome de usuário já está em uso.')).toBeInTheDocument();
    });
    
    // Limpeza após o Assert
    consoleSpy.mockRestore();
  });

});