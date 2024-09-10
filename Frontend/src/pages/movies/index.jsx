import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MoviesPage = () => {

  const movie = useSelector((state) => state.movie);
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/bookShow")
  }

  return (
    <div>
      <div className="p-10">
        <div className="hero bg-base-200 min-h-400 rounded-lg mb-10">
          <div className="hero-content flex-col lg:flex-row">
            <img
              src={movie.imageURL}
              className="rounded-lg shadow-2xl size-2/5"
              />
            <div>
              <h1 className="text-5xl font-bold">{movie.title}</h1>
              <p className="py-6">
                {movie.description}
              </p>
              <button className="btn btn-primary rounded-full" onClick={handleNavigation}>
                Veiw Shows
              </button>
            </div>
          </div>
        </div>
        <div className="divider divider-primary"></div>
        <div>
          <div>
            <h1 className="text-2xl mb-5">Actors</h1>
          </div>

            <div className="flex gap-5 overflow-x-auto">
              <img
                className="mask mask-circle"
                src="https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp"
              />
              <img
                className="mask mask-circle"
                src="https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp"
              />
              <img
                className="mask mask-circle"
                src="https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp"
              />
              <img
                className="mask mask-circle"
                src="https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp"
              />
            </div>

        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
