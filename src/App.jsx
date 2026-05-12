import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {Login} from './pages/Login';
import {Produtos} from './pages/Produtos';
import {CadastroProduto} from './pages/CadastroProduto';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/novo-produto" element={<CadastroProduto />} />
      </Routes>
    </BrowserRouter>
  );
}