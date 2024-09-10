import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { useGetAllMovies } from "../../hooks/movie.hooks";
import {fetchMovie} from '../../store/slices/movieSlice';

const Explore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleNavigation = () => {
    navigate("/movies")
  }
  const { data: movies } = useGetAllMovies();
  console.log(movies);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden btn-circle swap swap-rotate"
        >
          <input type="checkbox" />

          {/* hamburger icon */}
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          {/* close icon */}
          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </label>
        {/* Page content here */}
        <div className="flex flex-col w-full items-center gap-10 p-10">
          {movies && <div className="grid grid-cols-4 gap-3 w-full">
            {movies.map((movie) => (
              <div key={movie._id} className="card image-full h-64 shadow-xl">
              <figure>
                <img
                  src={movie.imageURL}
                  alt="Shoes"
                  />
                  
              </figure>
              <div className="card-body">
                <h2 className="card-title">{movie.title}</h2>
                <p className="overflow-y-auto h-24">{movie.description}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary" onClick={() => {
                  dispatch(fetchMovie(movie._id));
                  handleNavigation();
                }}>View Now</button>
                </div>
              </div>
            </div>
            ))}
          
          </div>}
          {(!movies || !movies.length) && (
            <p className="text-4xl text-se">Loading movies...</p>  // Or display a message if no movies found
          )}
          <div className="join ">
            <button className="join-item btn">«</button>
            <button className="join-item btn">Page 22</button>
            <button className="join-item btn">»</button>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <h1 className="text-lg underline">Filter</h1>
          <li>
            <label className="label cursor-pointer">
              <span className="label-text">Remember me</span>
              <input
                type="checkbox"
                defaultChecked
                className="checkbox checkbox-primary rounded-full"
              />
            </label>
          </li>
          <li>
            <label className="label cursor-pointer">
              <span className="label-text">Remember me</span>
              <input
                type="checkbox"
                defaultChecked
                className="checkbox checkbox-primary rounded-full"
              />
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Explore;
