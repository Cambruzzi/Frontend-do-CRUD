import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { CadastroUsuario } from './CadastroUsuario';
import api from '../services/api';

/**
 * Suíte de testes integrados e unitários para a tela de Cadastro de Usuário.
 * Garante o correto funcionamento das validações de cliente, integração com barramento HTTP
 * e manipulação de temporizadores assíncronos de navegação.
 */

// 1. CONFIGURAÇÃO DE INFRAESTRUTURA DE MOCKS
vi.mock('../services/api');

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
    // Restaura o estado inicial de todas as chamadas e implementações simuladas
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Garante o descarte seguro de mocks de temporizadores após a execução do cenário
    vi.useRealTimers();
  });

  // --- CENÁRIO 1: VALIDAÇÃO DE CLIENT-SIDE (FRONT-END) ---
  it('deve interromper o fluxo de envio caso as senhas digitadas sejam divergentes', async () => {
    // Arrange (Preparar)
    const usuario = userEvent.setup(); 
    
    render(
      <ThemeProvider>
        <BrowserRouter>
          <CadastroUsuario />
        </BrowserRouter>
      </ThemeProvider>
    );

    // Act (Agir)
    await usuario.type(screen.getByPlaceholderText('Escolha um Nome de Usuário'), 'novo_admin');
    await usuario.type(screen.getByPlaceholderText('Crie uma Senha'), 'senha123');
    await usuario.type(screen.getByPlaceholderText('Confirme sua Senha'), 'senhaERRADA');
    await usuario.click(screen.getByRole('button', { name: /cadastrar/i }));

    // Assert (Garantir)
    expect(api.post).not.toHaveBeenCalled();
    expect(screen.getByText('As senhas não coincidem. Verifique e tente novamente.')).toBeInTheDocument();
  });

  // --- CENÁRIO 2: SUCESSO DE INFRAESTRUTURA E FLUXO DE TEMPO ---
  it('deve registrar o usuário com sucesso e efetuar o redirecionamento programado', async () => {
    // Arrange (Preparar)
    vi.useFakeTimers();
    api.post.mockResolvedValueOnce({ status: 201 });

    render(
      <ThemeProvider>
        <BrowserRouter>
          <CadastroUsuario />
        </BrowserRouter>
      </ThemeProvider>
    );

    // Act (Agir)
    // Decisão técnica: Uso do fireEvent adotado estrategicamente para evitar colisões
    // de microtarefas do loop do userEvent quando em ambiente de timers artificiais.
    fireEvent.change(screen.getByPlaceholderText('Escolha um Nome de Usuário'), { target: { value: 'novo_admin' } });
    fireEvent.change(screen.getByPlaceholderText('Crie uma Senha'), { target: { value: 'senha123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirme sua Senha'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    // Avanço síncrono controlado do relógio global e resolução de promessas pendentes
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Assert (Garantir)
    expect(api.post).toHaveBeenCalledWith('v1/registrar/', {
      username: 'novo_admin',
      password: 'senha123'
    });
    expect(screen.getByText('Conta criada com sucesso! Redirecionando...')).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  // --- CENÁRIO 3: TRATAMENTO DE EXCEÇÕES DA API (BACK-END) ---
  it('deve interceptar a rejeição do servidor e expor a mensagem de erro correspondente', async () => {
    // Arrange (Preparar)
    // Suprime mensagens poluentes no terminal originadas pelo console.error intencional da captura
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

    // Act (Agir)
    await usuario.type(screen.getByPlaceholderText('Escolha um Nome de Usuário'), 'admin_existente');
    await usuario.type(screen.getByPlaceholderText('Crie uma Senha'), 'senha123');
    await usuario.type(screen.getByPlaceholderText('Confirme sua Senha'), 'senha123');
    await usuario.click(screen.getByRole('button', { name: /cadastrar/i }));

    // Assert (Garantir)
    await waitFor(() => {
      expect(screen.getByText('Este nome de usuário já está em uso.')).toBeInTheDocument();
    });
    
    // Cleanup (Limpeza)
    consoleSpy.mockRestore();
  });

});