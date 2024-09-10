import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiInstance } from '../../api';
import { useEffect, useState } from 'react';

const filterShowDates = (shows) => {
  const showDates = [];
  const dataSet = new Set();
  shows.forEach((show) => {
    const date = show.showDate;
    if (!dataSet.has(date)) {
      showDates.push(date);
      dataSet.add(date);
    }
  });
  return showDates;
}

const filterTheaterData = (shows) => {
  const theaterDatas = [];
  const dataSet = new Set();
  shows.forEach((show) => {
    const theaterData = {
      _id: show.theatreHallId.theatreId._id,
      name: show.theatreHallId.theatreId.name,
      location: show.theatreHallId.theatreId.city,
    };
    if (!dataSet.has(theaterData._id)) {
      theaterDatas.push(theaterData);
      dataSet.add(theaterData._id);
    }
  });
  return theaterDatas;
}

const BookShowPage = () => {
  const navigate = useNavigate();
  const movie = useSelector((state) => state.movie);
  const [isLoading, setIsLoading] = useState(false);

  const [shows, setShows] = useState([]);
  const [showDates, setShowDates] = useState([]);
  const [theaterDatas, setTheaterDatas] = useState([]);


  useEffect(() => {
    setIsLoading(true);
    const fetchShows = async () => {
      try {
        console.log('movie', movie);
        const { data } = await apiInstance.get(`/api/shows/${movie._id}`);
        console.log('data', data.data);
        setShows(data.data);
        setShowDates(filterShowDates(data.data));
        setTheaterDatas(filterTheaterData(data.data));
        setIsLoading(false);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchShows();
  }, []);

  console.log('shows', shows);
  console.log('showDates', showDates);
  console.log('theaterDatas', theaterDatas);

  const handleNavigation = () => {
    navigate('/bookShow/bookseat');
  };
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
            <option value="">Price Range</option>
            <option value="low">Low</option>
            <option value="high">High</option>
          </select>

          <select className="select rounded-full" defaultValue="morning">
            <option value="">Show Timing</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
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
      {isLoading ? (<h1 className='text-4xl'>LOADING</h1>) : (<div>
        <div>
          {/* Theater Card with SHow */}

          { theaterDatas && theaterDatas.length > 0 && theaterDatas.map((theaterData) => (
            <div key={theaterData._id}className="bordered border-2 shadow-sm bg-base-100 flex">
            <div className="border-r-2 border-base-300 h-48 w-2/12 flex flex-col justify-center p-8">
              <h2 className="text-3xl">{theaterData.name}</h2>
              <p>Location</p>
            </div>
            <div className="p-5 grid grid-cols-12 gap-4 w-full">
              <button
                className="btn btn-outline btn-info max-w-fit"
                onClick={handleNavigation}
              >
                Timming
              </button>
              <button className="btn btn-outline btn-info max-w-fit">
                Timming
              </button>
              <button className="btn btn-outline btn-info max-w-fit">
                Timming
              </button>
              <button className="btn btn-outline btn-info max-w-fit">
                Timming
              </button>
              <button className="btn btn-outline btn-info max-w-fit">
                Timming
              </button>
              <button className="btn btn-outline btn-info max-w-fit">
                Timming
              </button>
              <button className="btn btn-outline btn-info max-w-fit">
                Timming
              </button>
              <button className="btn btn-outline btn-info max-w-fit">
                Timming
              </button>
              <button className="btn btn-outline btn-info max-w-fit">
                Timming
              </button>
              <button className="btn btn-outline btn-info max-w-fit">
                Timming
              </button>
              <button className="btn btn-outline btn-info max-w-fit">
                Timming
              </button>
              <button className="btn btn-outline btn-info max-w-fit">
                Timming
              </button>
              <button className="btn btn-outline btn-info max-w-fit">
                Timming
              </button>
            </div>
          </div>))}
        </div>
      </div>)}
    </div>
  );
};

export default BookShowPage;
