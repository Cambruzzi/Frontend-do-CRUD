import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { Login } from './Login';
import api from '../../services/api';
vi.mock('../../services/api');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const moduloReal = await vi.importActual('react-router-dom');
  return {
    ...moduloReal,
    useNavigate: () => mockNavigate,
  };
});

describe('Tela de Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();      
    localStorage.clear();    
  });
  // --- CENÁRIO 1: SUCESSO ---
  it('deve fazer login com sucesso, salvar o token e redirecionar para /produtos', async () => {
    const usuario = userEvent.setup();
    api.post.mockResolvedValueOnce({
      data: { token: 'token-falso-123' }
    });

    render(
      <ThemeProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </ThemeProvider>
    );
    await usuario.type(screen.getByPlaceholderText('Nome de Usuário'), 'admin');
    await usuario.type(screen.getByPlaceholderText('Senha'), 'senha123');
    await usuario.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('login/', {
        username: 'admin',
        password: 'senha123'
      });
            expect(localStorage.getItem('token')).toBe('token-falso-123');
            expect(mockNavigate).toHaveBeenCalledWith('/produtos');
    });
  });

  // --- CENÁRIO 2: FALHA / ERRO --- 
  it('deve bloquear o acesso e exibir a mensagem de erro do backend', async () => {
    const usuario = userEvent.setup();
    api.post.mockRejectedValueOnce({
      response: { 
        data: { detail: 'Usuário ou senha incorretos. Tente novamente.' } 
      }
    });

    render(
      <ThemeProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </ThemeProvider>
    );

    await usuario.type(screen.getByPlaceholderText('Nome de Usuário'), 'hacker');
    await usuario.type(screen.getByPlaceholderText('Senha'), 'senhaerrada');
    await usuario.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(screen.getByText('Usuário ou senha incorretos. Tente novamente.')).toBeInTheDocument();
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

});