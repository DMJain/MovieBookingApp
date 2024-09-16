import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { apiInstance } from '../../api';
import { useEffect, useState } from 'react';
import { setShowDetails} from '../../store/slices/hallSlice';


const filterData = (shows, selectedDate) => {
  console.log('shows', shows);
  const returnedData = {};
  shows.forEach((show) => {
    if (show.showDate === selectedDate) {
      const theaterId = show.theatreHallId.theatreId._id;

      if (!returnedData[theaterId]) {
        returnedData[theaterId] = {
          theatreName: show.theatreHallId.theatreId.name,
          theatreId: show.theatreHallId.theatreId._id,
          location: `${show.theatreHallId.theatreId.name}, ${show.theatreHallId.theatreId.plot}, ${show.theatreHallId.theatreId.street}, ${show.theatreHallId.theatreId.city}, ${show.theatreHallId.theatreId.state}, ${show.theatreHallId.theatreId.country}, ${show.theatreHallId.theatreId.pinCode} `,
          shows: [],
        };
      }

      returnedData[theaterId].shows.push({
        _id: show._id,
        price: show.price,
        seatNumber: show.theatreHallId.seatingCapacity,
        startTime: show.startTimestamp,
        endTime: show.endTimestamp,
      });
    }
  });

  console.log('returnedData', returnedData);
  console.log('returnedData type', typeof returnedData);
  return returnedData;
};

const BookShowPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const movie = useSelector((state) => state.movie);
  const [isLoading, setIsLoading] = useState(false);

  const [theaterDatas, setTheaterDatas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    setIsLoading(true);
    const fetchShows = async () => {
      try {
        console.log('movie', movie._id);
        if (movie._id === null) {
          setIsLoading(false);
          navigate('/explore');
          return;
        }
        const { data } = await apiInstance.get(`/api/shows/${movie._id}`);
        // Process data using filterData
        const processedData = filterData(data.data, selectedDate);

        // Convert the object to an array for mapping in JSX
        const theaterDataArray = Object.values(processedData); // Get an array of theater objects
        setTheaterDatas(theaterDataArray); // Set the state with the array

        setIsLoading(false);
        console.log('isLoading', isLoading);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchShows();
  }, [selectedDate]);
  
  const today = new Date();
  const minDate = today.toISOString().slice(0, 10);
  const maxDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  console.log('theaterDatas', theaterDatas);
  console.log('theaterDatas type',typeof theaterDatas);

  const handleNavigation = (showId,seatNumber,price, showTiming, showDate, theatreName) => {
    dispatch(setShowDetails({ showId, price, seatNumber, showDate , showTiming, theatreName}));
    navigate('/bookShow/bookseat');
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="mt-5 p-3 flex justify-center items-center">
      <div className='w-4/5'>
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
          <div className="">
            <input type="date" defaultValue={selectedDate} className='p-3 rounded-full border-base-300 text-base-300 bg-base-100 border grow' onChange={handleDateChange} min={minDate}
        max={maxDate}></input>
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
      {isLoading ? (<h1 className='text-4xl'>LOADING</h1>) : (
      <div className=''>
        <div>
          {theaterDatas.length > 0 ? (
            console.log('theaterDatas', typeof theaterDatas),
            theaterDatas.map((theaterData) => (
            <div key={theaterData.theatreId} className="bordered border-2 shadow-lg bg-base-100 flex rounded-xl mb-2">
              <div className="border-r-2 border-base-300 h-48 w-1/5 flex justify-center items-center p-8">
                <h2 className="text-3xl">{theaterData.theatreName}</h2>  {/* Access theatre name from theaterData */}
                <div className="tooltip text-sm" data-tip={theaterData.location}>
                  <button className="">&#9432;</button>
                </div>
              </div>
              <div className="p-5 grid grid-cols-12 gap-4 w-full">
                {theaterData.shows.map((show) => (
                  <button key={show._id} className="btn btn-outline btn-info max-w-fit" onClick={() => (handleNavigation(show._id, show.seatNumber, show.price, show.startTime, selectedDate, theaterData.theatreName))}>
                    {show.startTime}  {/* Display show timings if available */}
                  </button>
                ))}
              </div>
            </div>
          ))) : (<h1 className='text-4xl'>No Shows Available</h1>)}

        </div>
      </div>)}
      </div>
    </div>
  );
};

export default BookShowPage;
