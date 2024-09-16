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
import UserDashboard from "./pages/dashboard/user-dashboard";

import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CheckOutPage from "./pages/checkoutPage";
import OnSuccess from "./pages/checkoutPage/conversionPage/OnSuccess";


function App() {
  return ( 
    <div>

      <Navbar />
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/movies/:id" element={<MoviesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/sign-in" element={<SigninPage />} />
      <Route path="/sign-up" element={<SignupPage />} />  
      <Route path="/:location/movies/:movieId/bookShow" element={<BookShowPage />} />
      <Route path="/bookShow/:bookShowId/bookseat" element={<BookSeatPage />} /> 
      <Route path="/userDashboard" element={<UserDashboard/>} />
      <Route path="/bookShow/:bookShowId/bookseat/checkout" element={<CheckOutPage /> } />
      <Route path="success" element={<OnSuccess />} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
    <Footer />

    </div>
  );
}

export default App;
