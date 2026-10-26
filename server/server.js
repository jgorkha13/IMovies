const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB, getIsConnected } = require('./config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Connect to Database
connectDB().then(async (conn) => {
  if (conn) {
    try {
      const Movie = require('./models/Movie');
      const movieCount = await Movie.countDocuments();
      if (movieCount === 0) {
        console.log('[Server] Database is empty. Running initial seed data...');
        const seedDatabase = require('./seed/seedData');
        await seedDatabase();
      }
    } catch (seedErr) {
      console.warn('[Server] Auto-seed warning:', seedErr.message);
    }
  }
}).catch((err) => {
  console.warn('[Server] DB initialization warning:', err.message);
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/theaters', require('./routes/theaterRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Manual trigger for seeding if requested
app.post('/api/seed', async (req, res) => {
  try {
    if (getIsConnected()) {
      const seedDatabase = require('./seed/seedData');
      await seedDatabase();
      return res.json({ message: 'Database seeded successfully with sample movies, theaters, and shows' });
    }
    const mockStore = require('./config/mockStore');
    await mockStore.init();
    res.json({ message: 'Memory store reset & re-seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: getIsConnected() ? 'mongodb' : 'memory-store',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'IMovies API',
  });
});

// Production: Serve static assets from React client build
if (process.env.NODE_ENV === 'production' || process.env.SERVE_CLIENT === 'true') {
  const clientDistPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('IMovies API Server is running. In development, access the client at http://localhost:3000');
  });
}

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🍿 IMovies Server running on port ${PORT}`);
  console.log(`   API Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`   Client Dev URL: http://localhost:3000`);
  console.log(`====================================================`);
});
