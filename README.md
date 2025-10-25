# Movie Booking Application

A comprehensive movie booking platform with features for browsing movies, booking shows, and managing theatres.

## 🎬 Features

- **Movie Browsing**: Explore movies with detailed information, ratings, and reviews
- **Theatre Management**: Browse theatres across multiple cities with real-time show schedules
- **Show Scheduling**: Dynamic show schedules with intelligent time slot management
- **User Reviews**: Rate and review both movies and theatres
- **Critic Reviews**: Professional critic ratings for movies
- **Booking System**: Book seats for your favorite movies
- **User Management**: User authentication and role-based access (Admin/User)

## 🏗️ Project Structure

```
MovieBookingApp/
├── Backend/              # Node.js + Express backend
│   ├── models/          # MongoDB models
│   ├── controllers/     # API controllers
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── seeds/           # Database seeding scripts ⭐
│   └── middlewares/     # Authentication & validation
└── Frontend/            # React + Vite frontend
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── hooks/       # Custom React hooks
    │   └── store/       # State management
    └── public/
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- npm or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd MovieBookingApp
```

2. **Install Backend Dependencies**
```bash
cd Backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../Frontend
npm install
```

4. **Configure Environment Variables**
Create a `.env` file in the Backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/movie-booking-app
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

5. **Seed the Database** ⭐
```bash
cd Backend/seeds
node seed-all.js
```
This will populate your database with:
- 20 theatres across 4 cities
- 100+ theatre halls
- 20 movies with cast and crew
- User accounts (admin and regular users)
- Reviews (theatre, movie, and critic reviews)
- **3,885 show schedules** over the next 7 days!

For more details, see [Backend/seeds/README.md](Backend/seeds/README.md)

6. **Run the Application**

Backend:
```bash
cd Backend
npm start
```

Frontend:
```bash
cd Frontend
npm run dev
```

## 🎟️ Show Scheduling Features

The application includes an intelligent show scheduling system:

- **Dynamic Start Times**: Each theatre starts at different times (7:30 AM - 12:30 PM)
- **Smart Movie Selection**: Theatres prioritize movies based on ratings
- **No Overlaps**: Automated validation ensures no conflicting show times
- **Realistic Scheduling**: 20-minute cleanup time between shows
- **7-Day Schedule**: Shows generated for the next week
- **Optimized Capacity**: Theatres with more halls show all 20 movies

### Example Schedule
```
PVR INOX Forum Mall - Hall 1 (Oct 26, 2025)
├── 09:30 - 12:02 | The Dark Knight (₹260)
├── 12:22 - 14:44 | The Shawshank Redemption (₹260)
├── 15:04 - 17:54 | 3 Idiots (₹260)
├── 18:14 - 20:42 | Inception (₹260)
└── 21:02 - 23:51 | Interstellar (₹260)
```

## 🗃️ Database Models

- **Theatre**: Theatre locations with ratings
- **TheatreHall**: Individual halls within theatres
- **Movie**: Movie information with ratings and reviews
- **Person**: Actors, directors, and crew
- **MovieRoleMapping**: Cast and crew assignments
- **User**: User accounts with authentication
- **Reviews**: Theatre reviews, movie reviews, and critic reviews
- **TheatreHallMovieMapping**: Show schedules and bookings
- **Booking**: User booking records

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt for password hashing

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Redux Toolkit (State Management)

## 📊 API Endpoints

### Public Routes
- `GET /api/public/movies` - Get all movies
- `GET /api/public/theatres` - Get all theatres
- `GET /api/public/shows` - Get show schedules

### Auth Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Routes (Protected)
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking

### Admin Routes (Protected)
- `POST /api/admin/movies` - Add movie
- `PUT /api/admin/theatres/:id` - Update theatre
- `DELETE /api/admin/shows/:id` - Delete show

## 🧪 Testing the Seeds

To test the show scheduling logic:

```bash
cd Backend/seeds
node theatre-hall-movie-mapping.seed.js
```

This will display:
- Total shows generated
- Shows per day breakdown
- Shows per theatre breakdown
- Sample show mappings
- Overlap validation results

## 📈 Statistics

After seeding, you'll have:
- **20 Theatres** across 4 major cities
- **100+ Theatre Halls** with varying capacities
- **20 Movies** spanning multiple genres
- **100+ Cast & Crew Members**
- **500+ User Reviews**
- **100+ Critic Reviews**
- **3,885 Show Schedules** over 7 days

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Real theatre data from major chains in India
- Movie data inspired by popular films
- Intelligent scheduling algorithms for optimal show distribution
