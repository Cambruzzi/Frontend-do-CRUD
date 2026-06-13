import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { Produtos } from './Produtos';
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

describe('Tela de Listagem de Produtos', () => {
  const produtosMock = [
    { id: 1, nome: 'Teclado Mecânico', codigo: 'TEC-001', valor: 350.00, imagem: 'http://link-falso.com/teclado.jpg' },
    { id: 2, nome: 'Mouse Gamer', codigo: 'MOU-001', valor: 150.00, imagem: null }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- CENÁRIO 1: RENDERIZAÇÃO DA LISTA ---
  it('deve buscar e exibir a lista de produtos ao carregar a tela', async () => {
    // Arrange
    api.get.mockResolvedValueOnce({ data: produtosMock });

    render(
      <ThemeProvider>
        <BrowserRouter>
          <Produtos />
        </BrowserRouter>
      </ThemeProvider>
    );

    expect(screen.getByText('Carregando dados do servidor...')).toBeInTheDocument();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Teclado Mecânico')).toBeInTheDocument();
      expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
      expect(api.get).toHaveBeenCalledWith('v1/produtos/');
    });
  });

  // --- CENÁRIO 2: EXCLUSÃO COM SUCESSO (UPDATE OTIMISTA) ---
  it('deve excluir o produto e removê-lo da tela quando o usuário confirmar', async () => {
    const usuario = userEvent.setup();
    api.get.mockResolvedValueOnce({ data: produtosMock });
    api.delete.mockResolvedValueOnce({ status: 204 });
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <ThemeProvider>
        <BrowserRouter>
          <Produtos />
        </BrowserRouter>
      </ThemeProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Teclado Mecânico')).toBeInTheDocument();
    });

    // Act
    const botaoApagarTeclado = screen.getByRole('button', { name: 'Excluir Teclado Mecânico' });
    await usuario.click(botaoApagarTeclado);

    // Assert
    expect(confirmSpy).toHaveBeenCalledWith('Tem certeza que deseja excluir o produto "Teclado Mecânico"? Esta ação não pode ser desfeita.');

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('v1/produtos/1/');
      expect(screen.queryByText('Teclado Mecânico')).not.toBeInTheDocument();
      expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
    });
  });

  // --- CENÁRIO 3: DESISTÊNCIA DA EXCLUSÃO ---
  it('deve abortar a exclusão se o usuário clicar em "Cancelar" no balão', async () => {
    const usuario = userEvent.setup();
    api.get.mockResolvedValueOnce({ data: produtosMock });
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(
      <ThemeProvider>
        <BrowserRouter>
          <Produtos />
        </BrowserRouter>
      </ThemeProvider>
    );

    await waitFor(() => expect(screen.getByText('Teclado Mecânico')).toBeInTheDocument());

    const botaoApagarTeclado = screen.getByRole('button', { name: 'Excluir Teclado Mecânico' });
    await usuario.click(botaoApagarTeclado);

    // Assert
    expect(confirmSpy).toHaveBeenCalled();
    expect(api.delete).not.toHaveBeenCalled();
    expect(screen.getByText('Teclado Mecânico')).toBeInTheDocument();
  });

  // --- CENÁRIO 4: FALHA NA API DURANTE A EXCLUSÃO ---
  it('deve mostrar um alerta de erro se o servidor falhar ao deletar', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const usuario = userEvent.setup();
    api.get.mockResolvedValueOnce({ data: produtosMock });
        api.delete.mockRejectedValueOnce(new Error('Erro interno'));
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <ThemeProvider>
        <BrowserRouter>
          <Produtos />
        </BrowserRouter>
      </ThemeProvider>
    );

    await waitFor(() => expect(screen.getByText('Teclado Mecânico')).toBeInTheDocument());

    const botaoApagarTeclado = screen.getByRole('button', { name: 'Excluir Teclado Mecânico' });
    await usuario.click(botaoApagarTeclado);

    // Assert
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Ocorreu um erro ao tentar excluir o produto. Tente novamente.');
      expect(screen.getByText('Teclado Mecânico')).toBeInTheDocument();
    });
  });

});