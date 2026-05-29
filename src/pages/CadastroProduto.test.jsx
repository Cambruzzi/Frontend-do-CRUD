import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { CadastroProduto } from './CadastroProduto';
import api from '../services/api';

/**
 * Suíte de Testes: Cadastro e Edição de Produtos (CRUD)
 * Cobre cenários de criação, preenchimento dinâmico, fallback de F5 (sessionStorage)
 * e redirecionamento de segurança.
 */

// 1. INFRAESTRUTURA DE MOCKS DINÂMICOS
vi.mock('../services/api');

const mockNavigate = vi.fn();
let mockParams = {}; 
let mockLocationState = null; 

vi.mock('react-router-dom', async () => {
  const moduloReal = await vi.importActual('react-router-dom');
  return {
    ...moduloReal,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams, 
    useLocation: () => ({ state: mockLocationState }),
  };
});

describe('Tela de Cadastro/Edição de Produto', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear(); // Limpa o cofre do navegador antes de cada cenário
    mockParams = {};        // Reseta para o modo "Novo Produto" por padrão
    mockLocationState = null;
  });

  // --- CENÁRIO 1: MODO CRIAÇÃO (POST) ---
  it('deve cadastrar um novo produto com sucesso (POST)', async () => {
    // Arrange
    const usuario = userEvent.setup();
    api.post.mockResolvedValueOnce({ status: 201 });

    render(
      <ThemeProvider>
        <BrowserRouter>
          <CadastroProduto />
        </BrowserRouter>
      </ThemeProvider>
    );

    // Assert
    expect(screen.getByRole('heading', { name: 'Novo Produto' })).toBeInTheDocument();

    // Act
    await usuario.type(screen.getByPlaceholderText('Nome do Produto'), 'Teclado Mecânico');
    await usuario.type(screen.getByPlaceholderText('Código'), 'TEC-001');
    await usuario.type(screen.getByPlaceholderText('Valor (R$)'), '350.50');
    await usuario.click(screen.getByRole('button', { name: /salvar/i }));

    // Assert
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('v1/produtos/', {
        nome: 'Teclado Mecânico',
        codigo: 'TEC-001',
        valor: 350.50
      });
      expect(mockNavigate).toHaveBeenCalledWith('/produtos');
    });
  });

  // --- CENÁRIO 2: MODO EDIÇÃO VIA LISTA (PUT) ---
  it('deve preencher os dados da rota e atualizar o produto com sucesso (PUT)', async () => {
    // Arrange 
    const usuario = userEvent.setup();
    mockParams = { id: '99' };
    mockLocationState = {
      produtoNaMala: { nome: 'Mouse Gamer', codigo: 'MOU-001', valor: 150.00 }
    };
    
    api.put.mockResolvedValueOnce({ status: 200 });

    render(
      <ThemeProvider>
        <BrowserRouter>
          <CadastroProduto />
        </BrowserRouter>
      </ThemeProvider>
    );

    // Assert
    expect(screen.getByRole('heading', { name: 'Editar Produto' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mouse Gamer')).toBeInTheDocument();

    // Act
    const inputValor = screen.getByPlaceholderText('Valor (R$)');
    await usuario.clear(inputValor);
    await usuario.type(inputValor, '180.00');
    
    await usuario.click(screen.getByRole('button', { name: /salvar/i }));

    // Assert
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('v1/produtos/99/', {
        nome: 'Mouse Gamer', // Manteve o nome original
        codigo: 'MOU-001',   // Manteve o código original
        valor: 180.00        // Enviou o novo valor
      });
      expect(mockNavigate).toHaveBeenCalledWith('/produtos');
    });
  });

  // --- CENÁRIO 3: PROTEÇÃO CONTRA O "F5" (Fallback do sessionStorage) ---
  it('deve recuperar os dados do sessionStorage caso o usuário atualize a página', () => {
    // Arrange
    mockParams = { id: '42' }; 
    mockLocationState = null; // Rota vazia simulando o F5
    
    // Injetamos a cópia de segurança direto no cofre do navegador
    sessionStorage.setItem('produto_42', JSON.stringify({
      nome: 'Monitor UltraWide',
      codigo: 'MON-999',
      valor: 1200.00
    }));

    // Act
    render(
      <ThemeProvider>
        <BrowserRouter>
          <CadastroProduto />
        </BrowserRouter>
      </ThemeProvider>
    );

    // Assert
    expect(screen.getByDisplayValue('Monitor UltraWide')).toBeInTheDocument();
    expect(screen.getByDisplayValue('MON-999')).toBeInTheDocument();
  });

  // --- CENÁRIO 4: ACESSO INVÁLIDO (Redirecionamento) ---
  it('deve expulsar o usuário para a lista se não houver dados na rota nem no sessionStorage', () => {
    // Arrange
    mockParams = { id: '7' };
    mockLocationState = null; // Sem mala

    // Act
    render(
      <ThemeProvider>
        <BrowserRouter>
          <CadastroProduto />
        </BrowserRouter>
      </ThemeProvider>
    );

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/produtos', { replace: true });
  });

});