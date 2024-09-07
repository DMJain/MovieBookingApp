const MoviesPage = () => {
  return (
    <div>
      <div className="p-10">
        <div className="hero bg-base-200 min-h-400 rounded-lg mb-10">
          <div className="hero-content flex-col lg:flex-row">
            <img
              src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
              className="rounded-lg shadow-2xl w-full lg:w-1/2"
            />
            <div>
              <h1 className="text-5xl font-bold">Spider-Man Home Comming</h1>
              <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
              <button className="btn btn-primary rounded-full">
                Get Started
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
