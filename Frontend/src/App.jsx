import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Routes, Route } from "react-router-dom";

import Homepage from "./pages/homepage";
import SigninPage from "./pages/sign-in";
import SignupPage from "./pages/sign-up";
import DashboardPage from "./pages/dashboard";
import Explore from "./pages/explore";
import MoviesPage from "./pages/movies";
import BookShowPage from "./pages/bookShow";
import BookSeatPage from "./pages/bookSeat";

import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


function App() {
  return ( 
    <div>

      <Navbar />
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/sign-in" element={<SigninPage />} />
      <Route path="/sign-up" element={<SignupPage />} />  
      <Route path="/bookShow" element={<BookShowPage />} />
      <Route path="/bookShow/bookseat" element={<BookSeatPage />} /> 
    </Routes>
    <Footer />

    </div>
  );
}

export default App;
