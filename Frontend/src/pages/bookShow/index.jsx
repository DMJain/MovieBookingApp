import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BookShowPage = () => {
  const navigate = useNavigate();
  const movie = useSelector((state) => state.movie);

  const handleNavigation = () => {
    navigate("/bookShow/bookseat")
  }
  return (
    <div className="mt-5 p-3">
      {/* Movie Header */}
      <div className="bg-base-200 p-3 mb-3 rounded-xl">
        <div className="">
          <h1 className="text-5xl">{movie.title}</h1>
        </div>
        <div className="flex gap-2 pt-4 pb-2">
            <div className="badge badge-primary badge-outline">primary</div>
            <div className="badge badge-primary badge-outline">primary</div>
        </div>
      </div>
      <div className="flex justify-between mb-5">
        <div>
          <div className="join">
            <button className="join-item btn">«</button>
            <button className="join-item btn">Page 22</button>
            <button className="join-item btn">»</button>
          </div>
        </div>
        <div className="flex">
          <select className="select rounded-full">
            <option disabled selected>Price Range</option>
            <option>Homer</option>
            <option>Marge</option>
            <option>Bart</option>
            <option>Lisa</option>
            <option>Maggie</option>
          </select>
          <select className="select rounded-full">
            <option disabled selected>Show Timing</option>
            <option>Homer</option>
            <option>Marge</option>
            <option>Bart</option>
            <option>Lisa</option>
            <option>Maggie</option>
          </select>
          <label className="input input-bordered flex items-center gap-2 rounded-full">
          <input
            type="text"
            className="grow rounded-full"
            placeholder="Search Cinema"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        </div>
      </div>
      {/* theater & show */}
      <div>
        <div>
            {/* Theater Card with SHow */}

                <div className="bordered border-2 shadow-sm bg-base-100 flex">
                    <div className="border-r-2 border-base-300 h-48 w-2/12 flex flex-col justify-center p-8">
                        <h2 className="text-3xl">Theater Name</h2>
                        <p>Location</p>
                    </div>
                    <div className="p-5 grid grid-cols-12 gap-4 w-full">
                        <button className="btn btn-outline btn-info max-w-fit" onClick={handleNavigation}>Timming</button>
                        <button className="btn btn-outline btn-info max-w-fit">Timming</button>
                        <button className="btn btn-outline btn-info max-w-fit">Timming</button>
                        <button className="btn btn-outline btn-info max-w-fit">Timming</button>
                        <button className="btn btn-outline btn-info max-w-fit">Timming</button>
                        <button className="btn btn-outline btn-info max-w-fit">Timming</button>
                        <button className="btn btn-outline btn-info max-w-fit">Timming</button>
                        <button className="btn btn-outline btn-info max-w-fit">Timming</button>
                        <button className="btn btn-outline btn-info max-w-fit">Timming</button>
                        <button className="btn btn-outline btn-info max-w-fit">Timming</button>
                        <button className="btn btn-outline btn-info max-w-fit">Timming</button>
                        <button className="btn btn-outline btn-info max-w-fit">Timming</button>
                        <button className="btn btn-outline btn-info max-w-fit">Timming</button>
                    </div>
                </div>
                

        </div>
      </div>
    </div>
  );
};

export default BookShowPage;
