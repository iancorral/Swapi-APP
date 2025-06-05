import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio'; // <--- 👈 IMPORTANTE
import Registro from './pages/Registro';
import Verificar from './pages/Verificar';
import Login from './pages/Login';
import CrearPublicacion from './pages/CrearPublicacion';
import Anuncios from './pages/Anuncios';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} /> {/* 👈 Cambia esto */}
      <Route path="/registro" element={<Registro />} />
      <Route path="/verificar" element={<Verificar />} />
      <Route path="/login" element={<Login />} />
      <Route path="/anuncios" element={<Anuncios />} />
      <Route path="/crear-publicacion" element={<CrearPublicacion />} />
    </Routes>
  );
}

export default App;

