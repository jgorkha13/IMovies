const Movie = require('../models/Movie');
const Show = require('../models/Show');

// @desc    Get all movies with optional filters
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  try {
    const { search, genre, language } = req.query;
    let query = { isActive: true };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (genre && genre !== 'All') {
      query.genre = { $in: [genre] };
    }

    if (language && language !== 'All') {
      query.language = language;
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching movies' });
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching movie details' });
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private/Admin
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

    const movie = new Movie({
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
    });

    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create movie' });
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    if (req.body.genre && !Array.isArray(req.body.genre)) {
      req.body.genre = req.body.genre.split(',').map((g) => g.trim());
    }
    if (req.body.cast && !Array.isArray(req.body.cast)) {
      req.body.cast = req.body.cast.split(',').map((c) => c.trim());
    }

    Object.assign(movie, req.body);
    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to update movie' });
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Soft delete or hard delete
    await Movie.findByIdAndDelete(req.params.id);
    // Delete associated shows as well
    await Show.deleteMany({ movie: req.params.id });

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
