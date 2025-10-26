import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useGetLatest10Movies} from "../../hooks/movie.hooks";
import {fetchMovie} from '../../store/slices/movieSlice';

const Homepage = () => {
  const{data : movies} = useGetLatest10Movies();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toExplorePage = () => {
    navigate("/explore");
  }

  const toMoviePage = (id) => {
    dispatch(fetchMovie(id));
    navigate(`/movies/${id}`);
  };

  const scrollToSlide = (index) => {
    const element = document.getElementById(`slide${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="hero min-h-[60vh]" 
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=80)",
        }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Your Gateway to the Silver Screen</h1>
            <p className="mb-5">
              Discover the latest blockbusters, book your seats with ease, and enjoy an unforgettable cinema experience with CineVerse.
            </p>
            <button className="btn btn-primary" onClick={toExplorePage}>
              Explore Movies
            </button>
          </div>
        </div>
      </div>

      {/* Featured Movies Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-base-content">Featured Movies</h2>
          <button className="btn btn-ghost btn-sm" onClick={toExplorePage}>
            See More →
          </button>
        </div>

        {/* Movies Carousel */}
        <div className="relative group">
          <div className="carousel w-full space-x-4 rounded-box scroll-smooth">
            {movies?.slice(0, 6).map((movie, index) => (
              <div key={movie._id} id={`slide${index}`} className="carousel-item w-80 scroll-mt-0">
                <div className="card bg-base-100 image-full w-full shadow-xl">
                  <figure>
                    <img
                      src={movie.imageURL}
                      alt={movie.title} />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{movie.title}</h2>
                    <p className="line-clamp-2">{movie.description}</p>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary" onClick={() => toMoviePage(movie._id)}>Book Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows - Visible only on hover */}
          {movies && movies.length > 1 && (
            <>
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => scrollToSlide(0)} className="btn btn-circle pointer-events-auto">❮</button> 
                <button onClick={() => scrollToSlide(Math.min(5, (movies?.length || 1) - 1))} className="btn btn-circle pointer-events-auto">❯</button>
              </div>
            </>
          )}
        </div>

        {/* Empty State */}
        {(!movies || movies.length === 0) && (
          <div className="text-center py-12">
            <p className="text-base-content opacity-70">No movies available at the moment.</p>
          </div>
        )}
      </div>

      {/* Additional Info Section */}
      <div className="bg-base-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-2">Latest Releases</h3>
              <p className="text-base-content opacity-70">
                Stay updated with the newest movies hitting theaters
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">💺</div>
              <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
              <p className="text-base-content opacity-70">
                Book your favorite seats in just a few clicks
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-base-content opacity-70">
                Get the best deals on movie tickets
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
