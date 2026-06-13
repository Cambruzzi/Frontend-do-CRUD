import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { CadastroUsuario } from '../pages/CadastroUsuario';
import { Produtos } from '../pages/Produtos';
import { CadastroProduto } from '../pages/CadastroProduto';

/**
 * Componente de Guard Route
 */
function RotaPrivada({ children }) {
  const token = localStorage.getItem('token');
  // O replace={true} impede que o usuário use o botão de "Voltar" do navegador para burlar o sistema.
  return token ? children : <Navigate to="/login" replace={true} />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<CadastroUsuario />} />
      <Route 
        path="/produtos" 
        element={
          <RotaPrivada>
            <Produtos />
          </RotaPrivada>
        } 
      />
      <Route 
        path="/novo-produto" 
        element={
          <RotaPrivada>
            <CadastroProduto />
          </RotaPrivada>
        } 
      />     
      <Route 
        path="/editar-produto/:id" 
        element={
          <RotaPrivada>
            <CadastroProduto />
          </RotaPrivada>
        } 
      />
      <Route path="*" element={<Navigate to="/login" replace={true} />} />
    </Routes>
  );
}