import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CadastroProduto } from './CadastroProduto';
import api from '../services/api';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// 1. O MOCK: Criamos o dublê para o nosso Axios e não mandamos dados reais pra internet
vi.mock('../services/api');

describe('Tela de Cadastro de Produto', () => {
  it('deve preencher o formulário e chamar a API de salvamento', async () => {
    // Instanciamos o robô que vai digitar na tela
    const usuario = userEvent.setup();

    // 2. ARRANGE (Preparar): Desenha a tela (envolvida no BrowserRouter por causa das Rotas)
    render(
      <BrowserRouter>
        <CadastroProduto />
      </BrowserRouter>
    );

    // 3. ACT (Agir): O robô procura os campos na tela e digita neles
    await usuario.type(screen.getByPlaceholderText('Nome do Produto'), 'Notebook Gamer');
    await usuario.type(screen.getByPlaceholderText('Código'), 'NTB123');
    await usuario.type(screen.getByPlaceholderText('Valor (R$)'), '5000');
    await usuario.type(screen.getByPlaceholderText('URL da Imagem'), '../images/test.jpg');

    // O robô clica no botão "Salvar"
    await usuario.click(screen.getByText('Salvar'));

    // 4. ASSERT (Garantir): Verificamos se o botão realmente tentou acionar o Axios (o nosso Dublê) 
    // com os exatos dados que o robô digitou.
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('v1/produtos/', {
        nome: 'Notebook Gamer',
        codigo: 'NTB123',
        valor: 5000 // Repare que ele testou até se o valor foi convertido para número!
      });
    });
  });
});