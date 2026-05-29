import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {Login} from './pages/Login';
import { CadastroUsuario } from './pages/CadastroUsuario';
import {Produtos} from './pages/Produtos';
import {CadastroProduto} from './pages/CadastroProduto';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
function LayoutConfigurado() {
  const { temaClaro } = useTheme();
  
  return (
    <div className={`app-container ${temaClaro ? 'tema-claro' : ''}`}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
        <Route path="/editar-produto/:id" element={<CadastroProduto />} />
        <Route path="/novo-produto" element={<CadastroProduto />} />
        <Route path="/produtos" element={<Produtos />} />
      </Routes>
    </div>
  );
}
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <LayoutConfigurado />
      </BrowserRouter>
    </ThemeProvider>
  );
}