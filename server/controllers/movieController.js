const Movie = require('../models/Movie');
const Show = require('../models/Show');
const { getIsConnected } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Get all movies with optional filters
// @route   GET /api/movies
const getMovies = async (req, res) => {
  try {
    const { search, genre, language } = req.query;

    if (getIsConnected()) {
      let query = { isActive: true };
      if (search) query.title = { $regex: search, $options: 'i' };
      if (genre && genre !== 'All') query.genre = { $in: [genre] };
      if (language && language !== 'All') query.language = language;
      const movies = await Movie.find(query).sort({ releaseDate: -1 });
      return res.json(movies);
    }

    // Mock store
    let filtered = mockStore.movies.filter((m) => m.isActive);
    if (search) {
      filtered = filtered.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (genre && genre !== 'All') {
      filtered = filtered.filter((m) => m.genre && m.genre.includes(genre));
    }
    if (language && language !== 'All') {
      filtered = filtered.filter((m) => m.language === language);
    }
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching movies' });
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
const getMovieById = async (req, res) => {
  try {
    if (getIsConnected()) {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      return res.json(movie);
    }

    const movie = mockStore.movies.find((m) => m._id === req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching movie details' });
  }
};

// @desc    Create new movie
// @route   POST /api/movies
const createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      genre,
      language,
      duration,
      releaseDate,
      posterUrl,
      bannerUrl,
      trailerUrl,
      rating,
      certificate,
      director,
      cast,
    } = req.body;

    const movieData = {
      title,
      description,
      genre: Array.isArray(genre) ? genre : (genre || 'Action').split(',').map((g) => g.trim()),
      language: language || 'English',
      duration: Number(duration) || 120,
      releaseDate: releaseDate || Date.now(),
      posterUrl,
      bannerUrl: bannerUrl || posterUrl,
      trailerUrl: trailerUrl || '',
      rating: Number(rating) || 8.0,
      certificate: certificate || 'UA',
      director: director || '',
      cast: Array.isArray(cast) ? cast : (cast || '').split(',').map((c) => c.trim()),
      isActive: true,
    };

    if (getIsConnected()) {
      const movie = new Movie(movieData);
      const createdMovie = await movie.save();
      return res.status(201).json(createdMovie);
    }

    const createdMovie = { _id: `movie_${Date.now()}`, ...movieData };
    mockStore.movies.unshift(createdMovie);
    res.status(201).json(createdMovie);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create movie' });
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
const updateMovie = async (req, res) => {
  try {
    if (getIsConnected()) {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      Object.assign(movie, req.body);
      const updatedMovie = await movie.save();
      return res.json(updatedMovie);
    }

    const movie = mockStore.movies.find((m) => m._id === req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    Object.assign(movie, req.body);
    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to update movie' });
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
const deleteMovie = async (req, res) => {
  try {
    if (getIsConnected()) {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      await Movie.findByIdAndDelete(req.params.id);
      await Show.deleteMany({ movie: req.params.id });
      return res.json({ message: 'Movie and associated shows removed' });
    }

    const idx = mockStore.movies.findIndex((m) => m._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Movie not found' });
    mockStore.movies.splice(idx, 1);
    mockStore.shows = mockStore.shows.filter((s) => s.movie !== req.params.id);
    res.json({ message: 'Movie and associated shows removed' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete movie' });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
