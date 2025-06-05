const Filter = require('bad-words-es');
const filter = new Filter();

function validarContenido(texto) {
  if (filter.isProfane(texto)) {
    throw new Error("El contenido incluye lenguaje ofensivo.");
  }
}

module.exports = { validarContenido };