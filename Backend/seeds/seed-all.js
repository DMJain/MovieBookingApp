// Master seed script to populate all data
// Run this script to seed the entire database with all necessary data

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

// Import models
const Theatre = require('../models/theatre.model');
const TheatreHall = require('../models/theatre-halls.model');
const Movie = require('../models/movies.model');
const Person = require('../models/person.model');
const MovieRoleMapping = require('../models/movie-role-mapping.model');
const User = require('../models/user.model');
const TheatreReview = require('../models/theatre-review.model');
const CriticReview = require('../models/critic-review.model');
const MovieReview = require('../models/movie-review.model');
const TheatreHallMovieMapping = require('../models/theatre-hall-movie-mapping');

// Import seed data
const theatreSeedData = require('./theatre.seed');
const theatreHallSeedData = require('./theatre-hall.seed');
const movieSeedData = require('./movie.seed');
const personSeedData = require('./person.seed');
const movieRoleMappingSeedData = require('./movie-role-mapping.seed');
const userSeedData = require('./user.seed');

// Import seed functions
const { generateTheatreReviews } = require('./theatre-review.seed');
const { generateCriticReviews } = require('./critic-review.seed');
const { generateMovieReviews } = require('./movie-review.seed');
const { seedTheatreHallMovieMappings } = require('./theatre-hall-movie-mapping.seed');

/**
 * Main seeding function
 */
async function seedAll() {
  try {
    console.log('🌱 Starting complete database seeding process...\n');

    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking-app';
    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB\n');

    // ==========================================
    // 1. SEED THEATRES
    // ==========================================
    console.log('🎭 Step 1: Seeding Theatres...');
    await Theatre.deleteMany({});
    const theatres = await Theatre.insertMany(theatreSeedData);
    console.log(`✅ Seeded ${theatres.length} theatres\n`);

    // ==========================================
    // 2. SEED THEATRE HALLS
    // ==========================================
    console.log('🎬 Step 2: Seeding Theatre Halls...');
    await TheatreHall.deleteMany({});
    
    // Map theatre references to actual IDs
    const theatreMap = new Map(theatres.map(t => [t.name, t._id]));
    const hallsWithIds = theatreHallSeedData.map(hall => ({
      ...hall,
      theatreId: theatreMap.get(hall.theatreRef),
    }));
    
    const theatreHalls = await TheatreHall.insertMany(hallsWithIds);
    console.log(`✅ Seeded ${theatreHalls.length} theatre halls\n`);

    // ==========================================
    // 3. SEED MOVIES
    // ==========================================
    console.log('🎥 Step 3: Seeding Movies...');
    await Movie.deleteMany({});
    const movies = await Movie.insertMany(movieSeedData);
    console.log(`✅ Seeded ${movies.length} movies\n`);

    // ==========================================
    // 4. SEED PERSONS (Actors, Directors, etc.)
    // ==========================================
    console.log('👥 Step 4: Seeding Persons...');
    await Person.deleteMany({});
    const persons = await Person.insertMany(personSeedData);
    console.log(`✅ Seeded ${persons.length} persons\n`);

    // ==========================================
    // 5. SEED MOVIE-ROLE MAPPINGS
    // ==========================================
    console.log('🎬 Step 5: Seeding Movie-Role Mappings...');
    await MovieRoleMapping.deleteMany({});
    
    // Map movie and person references to actual IDs
    const movieMap = new Map(movies.map(m => [m.title, m._id]));
    const personMap = new Map(persons.map(p => [p.name, p._id]));
    
    const mappingsWithIds = movieRoleMappingSeedData.map(mapping => ({
      movieId: movieMap.get(mapping.movieRef),
      personId: personMap.get(mapping.personRef),
      role: mapping.role,
      characterName: mapping.characterName,
    }));
    
    const movieRoleMappings = await MovieRoleMapping.insertMany(mappingsWithIds);
    console.log(`✅ Seeded ${movieRoleMappings.length} movie-role mappings\n`);

    // ==========================================
    // 6. SEED USERS
    // ==========================================
    console.log('👤 Step 6: Seeding Users...');
    await User.deleteMany({});
    const users = await User.insertMany(userSeedData);
    console.log(`✅ Seeded ${users.length} users\n`);

    // ==========================================
    // 7. SEED REVIEWS
    // ==========================================
    console.log('⭐ Step 7: Seeding Reviews...');
    
    const theatreIds = theatres.map(t => t._id);
    const movieIds = movies.map(m => m._id);
    const userIds = users.filter(u => u.role === 'user').map(u => u._id);

    // Theatre Reviews
    console.log('   Generating theatre reviews...');
    await TheatreReview.deleteMany({});
    const theatreReviews = generateTheatreReviews(theatreIds, userIds);
    await TheatreReview.insertMany(theatreReviews);
    console.log(`   ✅ Seeded ${theatreReviews.length} theatre reviews`);

    // Critic Reviews
    console.log('   Generating critic reviews...');
    await CriticReview.deleteMany({});
    const criticReviews = generateCriticReviews(movieIds);
    await CriticReview.insertMany(criticReviews);
    console.log(`   ✅ Seeded ${criticReviews.length} critic reviews`);

    // Movie Reviews
    console.log('   Generating movie reviews...');
    await MovieReview.deleteMany({});
    const movieReviews = generateMovieReviews(movieIds, userIds);
    await MovieReview.insertMany(movieReviews);
    console.log(`   ✅ Seeded ${movieReviews.length} movie reviews\n`);

    // Update statistics
    console.log('📊 Updating statistics...');
    
    // Update theatre statistics
    for (const theatre of theatres) {
      const reviews = await TheatreReview.find({ theatreId: theatre._id });
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        await Theatre.findByIdAndUpdate(theatre._id, {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: reviews.length,
        });
      }
    }
    
    // Update movie statistics
    for (const movie of movies) {
      const userReviews = await MovieReview.find({ movieId: movie._id });
      const criticReviewsForMovie = await CriticReview.find({ movieId: movie._id });
      
      if (userReviews.length > 0) {
        const totalRating = userReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / userReviews.length;
        
        const updateData = {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: userReviews.length,
        };
        
        if (criticReviewsForMovie.length > 0) {
          const totalCriticRating = criticReviewsForMovie.reduce((sum, r) => sum + r.rating, 0);
          updateData.criticRating = Math.round((totalCriticRating / criticReviewsForMovie.length) * 10) / 10;
        }
        
        await Movie.findByIdAndUpdate(movie._id, updateData);
      }
    }
    console.log('✅ Statistics updated\n');

    // ==========================================
    // 8. SEED THEATRE-HALL-MOVIE MAPPINGS (Shows)
    // ==========================================
    console.log('🎟️  Step 8: Seeding Theatre-Hall-Movie Mappings (Shows)...');
    const mappingResult = await seedTheatreHallMovieMappings();
    console.log(`✅ Seeded ${mappingResult.inserted} show mappings\n`);

    // ==========================================
    // DISPLAY SUMMARY
    // ==========================================
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║         DATABASE SEEDING SUMMARY               ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║ Theatres:                 ${String(theatres.length).padStart(5)} 🎭      ║`);
    console.log(`║ Theatre Halls:            ${String(theatreHalls.length).padStart(5)} 🎬      ║`);
    console.log(`║ Movies:                   ${String(movies.length).padStart(5)} 🎥      ║`);
    console.log(`║ Persons:                  ${String(persons.length).padStart(5)} 👥      ║`);
    console.log(`║ Movie-Role Mappings:      ${String(movieRoleMappings.length).padStart(5)} 🎭      ║`);
    console.log(`║ Users:                    ${String(users.length).padStart(5)} 👤      ║`);
    console.log(`║ Theatre Reviews:          ${String(theatreReviews.length).padStart(5)} ⭐      ║`);
    console.log(`║ Critic Reviews:           ${String(criticReviews.length).padStart(5)} ⭐      ║`);
    console.log(`║ Movie Reviews:            ${String(movieReviews.length).padStart(5)} ⭐      ║`);
    console.log(`║ Show Mappings (7 days):   ${String(mappingResult.inserted).padStart(5)} 🎟️       ║`);
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║ TOTAL RECORDS:            ${String(
      theatres.length + 
      theatreHalls.length + 
      movies.length + 
      persons.length + 
      movieRoleMappings.length + 
      users.length + 
      theatreReviews.length + 
      criticReviews.length + 
      movieReviews.length + 
      mappingResult.inserted
    ).padStart(5)}            ║`);
    console.log('╚════════════════════════════════════════════════╝');

    console.log('\n🔍 Sample Verification:');
    console.log('\nTheatres with halls:');
    for (const theatre of theatres.slice(0, 3)) {
      const hallCount = await TheatreHall.countDocuments({ theatreId: theatre._id });
      const showCount = await TheatreHallMovieMapping.countDocuments({ 
        city: theatre.city 
      });
      console.log(`   ${theatre.name}: ${hallCount} halls, ${showCount} shows in ${theatre.city}`);
    }

    console.log('\nMovies with cast and shows:');
    for (const movie of movies.slice(0, 3)) {
      const castCount = await MovieRoleMapping.countDocuments({ movieId: movie._id });
      const showCount = await TheatreHallMovieMapping.countDocuments({ movieId: movie._id });
      console.log(`   ${movie.title}: ${castCount} cast members, ${showCount} shows`);
    }

    console.log('\n🎉 All data seeded successfully!');

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
seedAll();
