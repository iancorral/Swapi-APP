import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ADD_ANUNCIO = gql`
  mutation AddAnuncio(
    $titulo: String!
    $descripcion: String!
    $precio: Float
    $id_usuario: Int!
    $id_categoria: Int!
  ) {
    addAnuncio(
      titulo: $titulo
      descripcion: $descripcion
      precio: $precio
      id_usuario: $id_usuario
      id_categoria: $id_categoria
    ) {
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
    return <p style={{ textAlign: 'center', marginTop: '100px' }}>No autorizado. Inicia sesión para crear una publicación.</p>;
  }

  return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>Crear Publicación</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          style={inputStyle}
        />
        {loading ? (
          <p>Cargando categorías...</p>
        ) : error ? (
          <p>Error al cargar categorías</p>
        ) : (
          <select value={id_categoria} onChange={(e) => setCategoria(e.target.value)} required style={inputStyle}>
            <option value="">Selecciona una categoría</option>
            {data.categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        )}
        <button type="submit" style={buttonStyle}>Publicar</button>
      </form>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  marginBottom: '15px',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#5996bd',
  color: 'white',
  fontSize: '16px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default CrearPublicacion;
