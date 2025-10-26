// Seed script to generate realistic booking data for analytics dashboard
// This creates bookings across multiple months with varying patterns

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const Booking = require('../models/booking.model');
const User = require('../models/user.model');
const TheatreHallMovieMapping = require('../models/theatre-hall-movie-mapping');

/**
 * Generate random booking data
 */
function generateBookings(shows, users, config = {}) {
  const {
    monthsBack = 6,
    bookingsPerShow = { min: 3, max: 15 },
  } = config;

  const bookings = [];
  const now = new Date();
  
  // Payment gateways
  const gateways = ['CASHFREE', 'STRIPE', 'RAZORPAY'];

  // Generate bookings for each show
  shows.forEach(show => {
    // Random number of bookings for this show
    const numBookings = Math.floor(
      Math.random() * (bookingsPerShow.max - bookingsPerShow.min + 1) + bookingsPerShow.min
    );

    // Create a date for this show (within the last N months)
    const showDate = new Date(show.showDate);
    
    for (let i = 0; i < numBookings; i++) {
      // Random user
      const user = users[Math.floor(Math.random() * users.length)];
      
      // Random seat number (1-50)
      const seatNumber = Math.floor(Math.random() * 50) + 1;
      
      // Random payment gateway
      const gateway = gateways[Math.floor(Math.random() * gateways.length)];
      
      // Generate payment ID
      const paymentId = `${gateway}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Booking timestamp - random time before show date
      const bookingDate = new Date(showDate);
      bookingDate.setDate(bookingDate.getDate() - Math.floor(Math.random() * 7)); // 0-7 days before show
      bookingDate.setHours(Math.floor(Math.random() * 24));
      bookingDate.setMinutes(Math.floor(Math.random() * 60));

      bookings.push({
        showId: show._id,
        seatNumber,
        paymentId,
        gateway,
        userId: user._id,
        createdAt: bookingDate,
        updatedAt: bookingDate,
      });
    }
  });

  return bookings;
}

/**
 * Generate historical bookings across multiple months
 */
function generateHistoricalBookings(shows, users, monthsBack = 6) {
  const bookings = [];
  const now = new Date();
  const gateways = ['CASHFREE', 'STRIPE', 'RAZORPAY'];

  // Create bookings for each month
  for (let monthOffset = 0; monthOffset < monthsBack; monthOffset++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 1);
    
    // Filter shows for this month
    const monthShows = shows.filter(show => {
      const showDate = new Date(show.showDate);
      return showDate >= monthDate && showDate < nextMonthDate;
    });

    // Generate varying number of bookings per month (growth pattern)
    const baseBookingsPerShow = 5 + monthOffset; // Older months have fewer bookings
    
    monthShows.forEach(show => {
      const numBookings = Math.floor(Math.random() * baseBookingsPerShow) + 2;
      const showDate = new Date(show.showDate);

      // Generate unique seat numbers for this show
      const usedSeats = new Set();
      
      for (let i = 0; i < numBookings; i++) {
        let seatNumber;
        do {
          seatNumber = Math.floor(Math.random() * 50) + 1;
        } while (usedSeats.has(seatNumber));
        usedSeats.add(seatNumber);

        const user = users[Math.floor(Math.random() * users.length)];
        const gateway = gateways[Math.floor(Math.random() * gateways.length)];
        const paymentId = `${gateway}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Random booking time within the month
        const bookingDate = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth(),
          Math.floor(Math.random() * 28) + 1,
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 60)
        );

        bookings.push({
          showId: show._id,
          seatNumber,
          paymentId,
          gateway,
          userId: user._id,
          createdAt: bookingDate,
          updatedAt: bookingDate,
        });
      }
    });
  }

  return bookings;
}

/**
 * Main seeding function for bookings
 */
async function seedBookings() {
  try {
    console.log('🎟️  Starting booking data seeding for analytics...\n');

    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking-app';
    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB\n');

    // Get all users (only regular users, not admins)
    const users = await User.find({ role: 'user' });
    console.log(`📊 Found ${users.length} users`);

    if (users.length === 0) {
      console.error('❌ No users found. Please run seed-all.js first to create users.');
      process.exit(1);
    }

    // Get all shows
    const shows = await TheatreHallMovieMapping.find({});
    console.log(`📊 Found ${shows.length} shows`);

    if (shows.length === 0) {
      console.error('❌ No shows found. Please run seed-all.js first to create shows.');
      process.exit(1);
    }

    // Clear existing bookings
    console.log('\n🗑️  Clearing existing bookings...');
    await Booking.deleteMany({});
    console.log('✅ Existing bookings cleared\n');

    // Generate historical bookings (last 6 months)
    console.log('📅 Generating historical bookings (6 months)...');
    const historicalBookings = generateHistoricalBookings(shows, users, 6);
    console.log(`   Generated ${historicalBookings.length} historical bookings`);

    // Insert bookings in batches
    console.log('💾 Inserting bookings into database...');
    const batchSize = 1000;
    let inserted = 0;

    for (let i = 0; i < historicalBookings.length; i += batchSize) {
      const batch = historicalBookings.slice(i, i + batchSize);
      try {
        await Booking.insertMany(batch, { ordered: false });
        inserted += batch.length;
      } catch (error) {
        // Handle duplicate key errors (unique constraint on showId + seatNumber)
        if (error.code === 11000) {
          const successfulInserts = error.result?.nInserted || 0;
          inserted += successfulInserts;
          console.log(`   ⚠️  Batch ${Math.floor(i / batchSize) + 1}: ${successfulInserts} inserted, ${batch.length - successfulInserts} duplicates skipped`);
        } else {
          throw error;
        }
      }
      
      if ((i + batchSize) % 5000 === 0) {
        console.log(`   Progress: ${Math.min(i + batchSize, historicalBookings.length)}/${historicalBookings.length}`);
      }
    }

    console.log(`✅ Inserted ${inserted} bookings\n`);

    // Calculate statistics
    console.log('📊 Calculating booking statistics...\n');

    const totalBookings = await Booking.countDocuments();
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthBookings = await Booking.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    // Calculate revenue
    const revenueAgg = await Booking.aggregate([
      {
        $lookup: {
          from: 'theatrehallmoviemappings',
          localField: 'showId',
          foreignField: '_id',
          as: 'show'
        }
      },
      { $unwind: '$show' },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$show.price' }
        }
      }
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Get top 5 movies by bookings
    const topMovies = await Booking.aggregate([
      {
        $lookup: {
          from: 'theatrehallmoviemappings',
          localField: 'showId',
          foreignField: '_id',
          as: 'show'
        }
      },
      { $unwind: '$show' },
      {
        $group: {
          _id: '$show.movieId',
          bookings: { $sum: 1 },
          revenue: { $sum: '$show.price' }
        }
      },
      {
        $lookup: {
          from: 'movies',
          localField: '_id',
          foreignField: '_id',
          as: 'movie'
        }
      },
      { $unwind: '$movie' },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $project: {
          title: '$movie.title',
          bookings: 1,
          revenue: 1
        }
      }
    ]);

    // Monthly breakdown
    const monthlyStats = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Display summary
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║         BOOKING SEED SUMMARY                   ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║ Total Bookings:           ${String(totalBookings).padStart(8)}         ║`);
    console.log(`║ Last Month Bookings:      ${String(lastMonthBookings).padStart(8)}         ║`);
    console.log(`║ Total Revenue:        ₹${String(totalRevenue.toLocaleString('en-IN')).padStart(12)}     ║`);
    console.log(`║ Unique Shows Booked:      ${String((await Booking.distinct('showId')).length).padStart(8)}         ║`);
    console.log(`║ Unique Users:             ${String((await Booking.distinct('userId')).length).padStart(8)}         ║`);
    console.log('╚════════════════════════════════════════════════╝');

    console.log('\n📅 Monthly Breakdown:');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monthlyStats.slice(-6).forEach(stat => {
      const monthName = monthNames[stat._id.month - 1];
      const year = stat._id.year;
      console.log(`   ${monthName} ${year}: ${stat.count} bookings`);
    });

    console.log('\n🎬 Top 5 Movies by Bookings:');
    topMovies.forEach((movie, index) => {
      console.log(`   ${index + 1}. ${movie.title}: ${movie.bookings} bookings, ₹${movie.revenue.toLocaleString('en-IN')}`);
    });

    // Gateway distribution
    const gatewayStats = await Booking.aggregate([
      {
        $group: {
          _id: '$gateway',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n💳 Payment Gateway Distribution:');
    gatewayStats.forEach(gateway => {
      const percentage = ((gateway.count / totalBookings) * 100).toFixed(1);
      console.log(`   ${gateway._id}: ${gateway.count} (${percentage}%)`);
    });

    console.log('\n✅ Booking data seeded successfully for analytics dashboard!');
    console.log('🎉 You can now view rich analytics on the admin dashboard.\n');

  } catch (error) {
    console.error('\n❌ Error seeding bookings:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
if (require.main === module) {
  seedBookings();
}

module.exports = { generateBookings, generateHistoricalBookings, seedBookings };
