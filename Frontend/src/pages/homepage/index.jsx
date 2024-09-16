import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useGetLatest10Movies} from "../../hooks/movie.hooks";
import {fetchMovie} from '../../store/slices/movieSlice';

const Homepage = () => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   navigate("/sign-in");
  // }, [navigate]);
  const{data : movies} = useGetLatest10Movies();
  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const toExplorePage = () => {
    navigate("/explore");
  }

  const toMoviePage = (id) => {
    navigate(`/movies/${id}`);
  };

  return (
    <div className="flex flex-col">
      {/**carouserl */}
      <div className="carousel w-full bg-base-200 p-2  shadow-lg mb-5">
        <div id="slide1" className="carousel-item w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
            className="w-full rounded-box"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide4" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div>
      {/**movies */}
      <div className="flex flex-col mb-10">
        <div>
          <a className="btn text-4xl pl-3 btn-link no-underline" onClick={toExplorePage}>Movies</a>
        </div>
        <div className="flex gap-3 p-3">
          {movies?.map((movie) => (<div key={movie._id} className="card card-compact bg-base-100 w-96 shadow-lg">
            <figure>
              <img
                className="rounded-md h-60 object-cover"
                src={movie.imageURL}
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{movie.title}</h2>
              <p className="h-28 overflow-x-auto">{movie.description}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={() => {
                  dispatch(fetchMovie(movie._id));
                  toMoviePage(movie._id);
                }}>View</button>
              </div>
            </div>
          </div>))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
