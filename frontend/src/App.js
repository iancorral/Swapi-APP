import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Registro from './pages/Registro';
import Verificar from './pages/Verificar';
import Login from './pages/Login';
import CrearPublicacion from './pages/CrearPublicacion';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Registro />} />
      <Route path="/verificar" element={<Verificar />} />
      <Route path="/login" element={<Login />} />
      <Route path="/crear-publicacion" element={<CrearPublicacion />} />
    </Routes>
  );
}

export default App;
