import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../styles/layout.css';

const ADD_ANUNCIO = gql`
  mutation AddAnuncio($titulo: String!, $descripcion: String!, $precio: Float, $id_usuario: Int!, $id_categoria: Int!) {
    addAnuncio(titulo: $titulo, descripcion: $descripcion, precio: $precio, id_usuario: $id_usuario, id_categoria: $id_categoria) {
      id_anuncio
      titulo
    }
  }
`;

const GET_CATEGORIAS = gql`
  query {
    categorias {
      id_categoria
      nombre
    }
  }
`;

function CrearPublicacion() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [id_categoria, setCategoria] = useState('');
  const { loading, error, data } = useQuery(GET_CATEGORIAS);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let id_usuario = null;

  try {
    const decoded = jwtDecode(token);
    id_usuario = decoded.id_usuario;
  } catch (err) {
    console.error('Token inválido:', err.message);
  }

  const [addAnuncio] = useMutation(ADD_ANUNCIO, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id_usuario) {
      alert('No autorizado. Inicia sesión para crear una publicación.');
      return;
    }

    try {
      const { data } = await addAnuncio({
        variables: {
          titulo,
          descripcion,
          precio: parseFloat(precio),
          id_usuario,
          id_categoria: parseInt(id_categoria),
        },
      });
      alert(`¡Anuncio creado! ID: ${data.addAnuncio.id_anuncio}`);
      navigate('/anuncios', { state: { nuevo: true } });
    } catch (err) {
      alert(err.message);
    }
  };

  if (!token || !id_usuario) {
    return <p className="no-autorizado">No autorizado. Inicia sesión para crear una publicación.</p>;
  }

  return (
    <div className="page-container">
      <div className="form-box">
        <h2>Crear Publicación</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows={4} />
          <input placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} />
          {loading ? (
            <p>Cargando categorías...</p>
          ) : error ? (
            <p>Error al cargar categorías</p>
          ) : (
            <select value={id_categoria} onChange={(e) => setCategoria(e.target.value)} required>
              <option value="">Selecciona una categoría</option>
              {data.categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
              ))}
            </select>
          )}
          <button type="submit">Publicar</button>
        </form>
      </div>
    </div>
  );
}

export default CrearPublicacion;