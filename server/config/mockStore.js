// In-Memory store for out-of-the-box local development when MongoDB is not installed
const bcrypt = require('bcryptjs');

class MockStore {
  constructor() {
    this.users = [];
    this.movies = [];
    this.theaters = [];
    this.shows = [];
    this.bookings = [];
    this.init();
  }

  async init() {
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);
    const userPasswordHash = await bcrypt.hash('user123', salt);

    this.users = [
      {
        _id: 'user_admin_001',
        name: 'System Administrator',
        email: 'admin@imovies.com',
        password: adminPasswordHash,
        role: 'admin',
        phone: '+1 555-0199',
        createdAt: new Date(),
      },
      {
        _id: 'user_demo_002',
        name: 'Alex Johnson',
        email: 'user@imovies.com',
        password: userPasswordHash,
        role: 'user',
        phone: '+1 555-0142',
        createdAt: new Date(),
      },
    ];

    this.theaters = [
      {
        _id: 'theater_pvr_001',
        name: 'PVR Superplex IMAX',
        city: 'Metropolis Central',
        location: 'Level 4, Orion Crystal Mall, Downtown',
        screens: [
          { name: 'IMAX Laser 3D', totalSeats: 80 },
          { name: 'Gold Class Audi 2', totalSeats: 80 },
        ],
      },
      {
        _id: 'theater_cinepolis_002',
        name: 'Cinepolis Dolby Atmos Cinema',
        city: 'Metropolis West',
        location: 'Westgate Grand Promenade, Sector 18',
        screens: [
          { name: 'Dolby Screen 1', totalSeats: 80 },
          { name: 'Screen 2 Luxe', totalSeats: 80 },
        ],
      },
      {
        _id: 'theater_inox_003',
        name: 'INOX Megaplex & Dine',
        city: 'Metropolis North',
        location: 'North Square Hub, Airport Road',
        screens: [
          { name: 'Audi 1 4DX', totalSeats: 80 },
          { name: 'Audi 3 Classic', totalSeats: 80 },
        ],
      },
    ];

    this.movies = [
      {
        _id: 'movie_dune_001',
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
        genre: ['Action', 'Sci-Fi', 'Adventure'],
        language: 'English',
        duration: 166,
        releaseDate: new Date('2024-03-01'),
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
        rating: 8.8,
        certificate: 'PG-13',
        director: 'Denis Villeneuve',
        cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
        isActive: true,
      },
      {
        _id: 'movie_oppenheimer_002',
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring both scientific triumph and profound moral consequences.',
        genre: ['Drama', 'Biography', 'History'],
        language: 'English',
        duration: 180,
        releaseDate: new Date('2023-07-21'),
        posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
        rating: 8.9,
        certificate: 'R',
        director: 'Christopher Nolan',
        cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
        isActive: true,
      },
      {
        _id: 'movie_interstellar_003',
        title: 'Interstellar: 10th Anniversary IMAX',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        genre: ['Sci-Fi', 'Adventure', 'Drama'],
        language: 'English',
        duration: 169,
        releaseDate: new Date('2014-11-07'),
        posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        rating: 8.7,
        certificate: 'PG-13',
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
        isActive: true,
      },
      {
        _id: 'movie_spiderman_004',
        title: 'Spider-Man: Beyond the Spider-Verse',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
        genre: ['Animation', 'Action', 'Adventure'],
        language: 'English',
        duration: 140,
        releaseDate: new Date('2024-06-15'),
        posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
        rating: 8.7,
        certificate: 'PG',
        director: 'Joaquim Dos Santos',
        cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
        isActive: true,
      },
      {
        _id: 'movie_inception_005',
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        language: 'English',
        duration: 148,
        releaseDate: new Date('2010-07-16'),
        posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        rating: 8.8,
        certificate: 'PG-13',
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
        isActive: true,
      },
      {
        _id: 'movie_deadpool_006',
        title: 'Deadpool & Wolverine',
        description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy.',
        genre: ['Action', 'Comedy', 'Sci-Fi'],
        language: 'English',
        duration: 127,
        releaseDate: new Date('2024-07-26'),
        posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
        rating: 8.2,
        certificate: 'R',
        director: 'Shawn Levy',
        cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin'],
        isActive: true,
      },
    ];

    // Generate shows for next 5 days
    const showTimes = ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM'];
    const today = new Date();

    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const showDate = new Date(today);
      showDate.setDate(today.getDate() + dayOffset);
      const dateString = showDate.toISOString().split('T')[0];

      this.movies.forEach((movie, mIdx) => {
        this.theaters.forEach((theater, tIdx) => {
          const slot1 = showTimes[(mIdx + tIdx + dayOffset) % showTimes.length];
          const slot2 = showTimes[(mIdx + tIdx + dayOffset + 2) % showTimes.length];

          const showId1 = `show_${movie._id}_${theater._id}_${dateString}_1`;
          const showId2 = `show_${movie._id}_${theater._id}_${dateString}_2`;

          this.shows.push({
            _id: showId1,
            movie: movie._id,
            theater: theater._id,
            screenName: theater.screens[0].name,
            date: dateString,
            time: slot1,
            ticketPrice: 280,
            vipPrice: 480,
            totalSeats: 80,
            bookedSeats: dayOffset === 0 ? ['C4', 'C5', 'D6', 'D7'] : ['B2', 'B3'],
          });

          this.shows.push({
            _id: showId2,
            movie: movie._id,
            theater: theater._id,
            screenName: theater.screens[1] ? theater.screens[1].name : theater.screens[0].name,
            date: dateString,
            time: slot2,
            ticketPrice: 320,
            vipPrice: 520,
            totalSeats: 80,
            bookedSeats: ['A1', 'A2', 'E5'],
          });
        });
      });
    }

    // Initial demo booking
    this.bookings.push({
      _id: 'booking_sample_001',
      bookingId: 'IMOV-202684',
      user: 'user_demo_002',
      show: this.shows[0]._id,
      seats: ['C4', 'C5'],
      totalAmount: 590,
      convenienceFee: 30,
      status: 'confirmed',
      paymentDetails: {
        method: 'Apple Pay / UPI',
        transactionId: 'TXN-904128912-DEMO',
        status: 'Completed',
      },
      createdAt: new Date(),
    });
  }
}

const mockStore = new MockStore();
module.exports = mockStore;
