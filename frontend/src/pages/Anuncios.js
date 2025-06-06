import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';


const GET_ANUNCIOS = gql`
  query {
    anuncios {
      id_anuncio
      titulo
      descripcion
      precio
    }
  }
`;

function Anuncios() {
  const { loading, error, data, refetch } = useQuery(GET_ANUNCIOS);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.nuevo) {
      refetch();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, refetch]);

  if (loading) return <p>Cargando anuncios...</p>;
  if (error) return <p>Error al cargar anuncios.</p>;

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <h2>Lista de Anuncios</h2>

      {/* Mensaje de éxito si venimos de crear */}
      {location.state?.nuevo && (
        <div style={{
          backgroundColor: '#dff0d8',
          color: '#3c763d',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
          border: '1px solid #d6e9c6'
        }}>
          ¡Anuncio creado exitosamente!
        </div>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.anuncios.map(anuncio => (
          <li key={anuncio.id_anuncio} style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>{anuncio.titulo}</h3>
            <p>{anuncio.descripcion}</p>
            <strong>Precio: ${anuncio.precio?.toFixed(2) || 'INFORMACIÓN'}</strong>
          </li>
        ))}
      </ul>

      {/* Botón para crear publicación */}
      <button
        onClick={() => navigate('/crear-publicacion')}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#5996bd',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
        title="Crear anuncio"
      >
        +
      </button>
    </div>
  );
}

export default Anuncios;