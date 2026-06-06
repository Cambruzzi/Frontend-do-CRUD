# 📦 Dashboard de Gestão de Produtos

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Testing-Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)
![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)

Uma aplicação Front-end moderna e responsiva para gestão e cadastro de produtos (CRUD completo), construída com React e Vite. Este projeto foca em **Experiência do Usuário (UX)**, **Performance** e **Cobertura de Testes Automatizados**.

---

## 🔗 Integração com o Back-end
Este projeto é a interface de usuário (Client-side) que consome uma API RESTful construída em **Django REST Framework**.
👉 **[Acesse o repositório do Back-end aqui]([https://github.com/Cambruzzi/CRUD])** para ver a arquitetura da API, modelos de dados e documentação dos endpoints.

---

## ✨ Principais Funcionalidades & Diferenciais Técnicos

Além do tradicional CRUD, este projeto implementa padrões avançados de mercado:

* **🔐 Autenticação Protegida:** Rotas privadas e controle de acesso integrado com a API.
* **🌓 Theme Toggle:** Suporte nativo para transição fluida entre Dark Mode e Light Mode.
* **🛡️ Resiliência de Estado (F5 Fallback):** Uso estratégico do `sessionStorage` para evitar perda de dados e chamadas redundantes à API durante a edição de produtos caso o usuário atualize a página.
* **⚡ Atualizações Otimistas (Optimistic UI):** Exclusões de itens refletem instantaneamente na interface usando filtros de estado, melhorando a percepção de velocidade do sistema sem aguardar o *refetch* do servidor.
* **🖼️ Upload de Mídia com Preview:** Suporte a envio de imagens via `FormData` com pré-visualização instantânea utilizando a API nativa `URL.createObjectURL`.

---

## 🛠️ Tecnologias Utilizadas

* **Core:** React 18, Vite
* **Roteamento:** React Router Dom v6 (com passagem de estado via `useLocation`)
* **Requisições HTTP:** Axios
* **Testes:** Vitest + React Testing Library + user-event
* **Estilização:** CSS3 puro com variáveis CSS para controle de temas.

---

## ⚙️ Como executar o projeto localmente

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina. O back-end em Django também deve estar rodando localmente (por padrão na porta `8000`).

### 2. Passos para instalação
Clone o repositório e acesse a pasta do projeto:
```bash
git clone [https://github.com/Cambruzzi/Frontend-do-CRUD](https://github.com/Cambruzzi/Frontend-do-CRUD)
cd Frontend-do-CRUD
```
Instale as dependências:
```bash
npm install
```

### 3. Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto baseado no .env.example (se houver) e configure a URL da sua API:
```Snippet de código
VITE_API_URL=http://localhost:8000
```
(Nota: No código atual, a URL está configurada diretamente nos serviços, pronta para uso local com o Django).

### 4. Rodando a aplicação
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
Acesse http://localhost:5173 no seu navegador.


### 🧪 Testes Automatizados
A aplicação possui uma suíte robusta de testes unitários e de integração escritos em Vitest, seguindo o padrão AAA (Arrange, Act, Assert).

Os testes cobrem regras de negócio do Front-end, validação de inputs, simulação de temporizadores assíncronos (vi.useFakeTimers), dublês de API HTTP com FormData e mocks dinâmicos de rotas.

Para rodar os testes:
```bash
npm run test
```