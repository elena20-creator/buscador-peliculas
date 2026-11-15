import './style.css'

const apiKey = import.meta.env.VITE_TMDB_API_KEY
const apiUrl = 'https://api.themoviedb.org/3'
const imageUrl = 'https://image.tmdb.org/t/p/w300'

const searchInput = document.getElementById('inputBuscar')
const searchButton = document.getElementById('btnBuscar')
const popularButton = document.getElementById('btnPopulares')
const messageText = document.getElementById('mensaje')
const resultsBox = document.getElementById('resultados')

// Traer datos de la API
async function fetchMovies(endpoint) {
  const response = await fetch(`${apiUrl}${endpoint}&api_key=${apiKey}&language=es-MX`)

  if (!response.ok) {
    throw new Error('No se pudo conectar')
  }

  const data = await response.json()
  return data.results
}

// Crear las tarjetas
function renderMovies(list) {
  const cards = list.map((film) => {
    let year = 'Sin fecha'
    if (film.release_date) {
      year = film.release_date.substring(0, 4)
    }

    let image = 'https://placehold.co/300x450?text=Sin+imagen'
    if (film.poster_path) {
      image = imageUrl + film.poster_path
    }

    return `
      <div class="tarjeta">
        <img src="${image}" alt="${film.title}" />
        <h3>${film.title}</h3>
        <p class="anio">${year}</p>
        <p class="sinopsis">${film.overview || 'Sin sinopsis disponible.'}</p>
      </div>
    `
  })

  resultsBox.innerHTML = cards.join('')
}

// Cargar una lista y manejar errores
async function loadMovies(endpoint) {
  messageText.textContent = 'Buscando...'
  resultsBox.innerHTML = ''

  try {
    const movies = await fetchMovies(endpoint)

    if (movies.length === 0) {
      messageText.textContent = 'Película no encontrada'
    } else {
      messageText.textContent = ''
      renderMovies(movies)
    }
  } catch (error) {
    messageText.textContent = 'Error de conexión, revisa tu internet.'
  }
}

searchButton.addEventListener('click', () => {
  const title = searchInput.value.trim()

  if (title === '') {
    messageText.textContent = 'Primero escribe una película.'
  } else {
    loadMovies(`/search/movie?query=${encodeURIComponent(title)}`)
  }
})

popularButton.addEventListener('click', () => {
  loadMovies('/movie/popular?page=1')
})
