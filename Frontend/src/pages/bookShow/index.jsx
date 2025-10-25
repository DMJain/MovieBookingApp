import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { apiInstance } from '../../api';
import { useEffect, useState } from 'react';
import { setShowDetails} from '../../store/slices/hallSlice';
import { useGetTheatreReviews, useCreateTheatreReview } from '../../hooks/review.hooks';


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
  const location = useSelector((state) => state.location)
  const [isLoading, setIsLoading] = useState(false);

  const [theaterDatas, setTheaterDatas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedTheatreId, setSelectedTheatreId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    review: '',
    categories: {
      seating: 0,
      soundQuality: 0,
      screenQuality: 0,
      cleanliness: 0,
      foodAndBeverages: 0,
    }
  });

  const { data: theatreReviews } = useGetTheatreReviews(selectedTheatreId);
  const createTheatreReview = useCreateTheatreReview();

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
        const { data } = await apiInstance.get(`/api/${location.location}/shows/${movie._id}`);
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
  }, [selectedDate, location]);
  
  const today = new Date();
  const minDate = today.toISOString().slice(0, 10);
  const maxDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  console.log('theaterDatas', theaterDatas);
  console.log('theaterDatas type',typeof theaterDatas);

  const handleNavigation = (showId,seatNumber,price, showTiming, showDate, theatreName) => {
    dispatch(setShowDetails({ showId, price, seatNumber, showDate , showTiming, theatreName}));
    navigate(`/bookShow/${showId}/bookseat`);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const openReviewModal = (theatreId) => {
    setSelectedTheatreId(theatreId);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      alert("Please select an overall rating");
      return;
    }
    try {
      await createTheatreReview.mutateAsync({
        theatreId: selectedTheatreId,
        rating: reviewForm.rating,
        review: reviewForm.review,
        categories: reviewForm.categories,
      });
      setShowReviewModal(false);
      setReviewForm({
        rating: 0,
        review: '',
        categories: {
          seating: 0,
          soundQuality: 0,
          screenQuality: 0,
          cleanliness: 0,
          foodAndBeverages: 0,
        }
      });
      alert("Review submitted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  const StarRating = ({ rating, onRate, readonly = false, size = "text-2xl" }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRate && onRate(star)}
            className={`${size} ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
            disabled={readonly}
          >
            {star <= rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
            <div key={theaterData.theatreId} className="bordered border-2 shadow-lg bg-base-100 rounded-xl mb-4">
              <div className="flex">
                <div className="border-r-2 border-base-300 h-48 w-1/5 flex flex-col justify-center items-center p-8">
                  <h2 className="text-3xl mb-2">{theaterData.theatreName}</h2>
                  <div className="tooltip text-sm" data-tip={theaterData.location}>
                    <button className="">&#9432;</button>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline mt-2"
                    onClick={() => openReviewModal(theaterData.theatreId)}
                  >
                    View Reviews
                  </button>
                </div>
                <div className="p-5 grid grid-cols-12 gap-4 w-full">
                  {theaterData.shows.map((show) => (
                    <button key={show._id} className="btn btn-outline btn-info max-w-fit" onClick={() => (handleNavigation(show._id, show.seatNumber, show.price, show.startTime, selectedDate, theaterData.theatreName))}>
                      {show.startTime}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))) : (<h1 className='text-4xl'>No Shows Available</h1>)}

        </div>
      </div>)}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-2xl mb-4">Theatre Reviews</h3>
            
            {/* Display Reviews */}
            <div className="mb-6">
              {theatreReviews && theatreReviews.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {theatreReviews.map((review) => (
                    <div key={review._id} className="card bg-base-200">
                      <div className="card-body p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">
                              {review.userId.firstname} {review.userId.lastname}
                              {review.isVerifiedBooking && (
                                <span className="badge badge-success badge-sm ml-2">Verified</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                          </div>
                          <StarRating rating={review.rating} readonly={true} size="text-lg" />
                        </div>
                        {review.review && <p className="text-sm mb-2">{review.review}</p>}
                        
                        {/* Category Ratings */}
                        {review.categories && (
                          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                            {review.categories.seating > 0 && (
                              <div className="flex justify-between">
                                <span>Seating:</span>
                                <span>{'⭐'.repeat(review.categories.seating)}</span>
                              </div>
                            )}
                            {review.categories.soundQuality > 0 && (
                              <div className="flex justify-between">
                                <span>Sound:</span>
                                <span>{'⭐'.repeat(review.categories.soundQuality)}</span>
                              </div>
                            )}
                            {review.categories.screenQuality > 0 && (
                              <div className="flex justify-between">
                                <span>Screen:</span>
                                <span>{'⭐'.repeat(review.categories.screenQuality)}</span>
                              </div>
                            )}
                            {review.categories.cleanliness > 0 && (
                              <div className="flex justify-between">
                                <span>Cleanliness:</span>
                                <span>{'⭐'.repeat(review.categories.cleanliness)}</span>
                              </div>
                            )}
                            {review.categories.foodAndBeverages > 0 && (
                              <div className="flex justify-between">
                                <span>F&B:</span>
                                <span>{'⭐'.repeat(review.categories.foodAndBeverages)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-4">No reviews yet. Be the first to review!</p>
              )}
            </div>

            {/* Review Form */}
            <div className="divider">Write a Review</div>
            <form onSubmit={handleSubmitReview}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Overall Rating</span>
                </label>
                <StarRating 
                  rating={reviewForm.rating} 
                  onRate={(rating) => setReviewForm({...reviewForm, rating})} 
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Your Review</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-20"
                  placeholder="Share your experience..."
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                  maxLength={1000}
                ></textarea>
              </div>

              <div className="divider text-sm">Rate Categories (Optional)</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm">Seating</span>
                  </label>
                  <StarRating 
                    rating={reviewForm.categories.seating} 
                    onRate={(rating) => setReviewForm({
                      ...reviewForm, 
                      categories: {...reviewForm.categories, seating: rating}
                    })}
                    size="text-lg"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm">Sound Quality</span>
                  </label>
                  <StarRating 
                    rating={reviewForm.categories.soundQuality} 
                    onRate={(rating) => setReviewForm({
                      ...reviewForm, 
                      categories: {...reviewForm.categories, soundQuality: rating}
                    })}
                    size="text-lg"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm">Screen Quality</span>
                  </label>
                  <StarRating 
                    rating={reviewForm.categories.screenQuality} 
                    onRate={(rating) => setReviewForm({
                      ...reviewForm, 
                      categories: {...reviewForm.categories, screenQuality: rating}
                    })}
                    size="text-lg"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm">Cleanliness</span>
                  </label>
                  <StarRating 
                    rating={reviewForm.categories.cleanliness} 
                    onRate={(rating) => setReviewForm({
                      ...reviewForm, 
                      categories: {...reviewForm.categories, cleanliness: rating}
                    })}
                    size="text-lg"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm">Food & Beverages</span>
                  </label>
                  <StarRating 
                    rating={reviewForm.categories.foodAndBeverages} 
                    onRate={(rating) => setReviewForm({
                      ...reviewForm, 
                      categories: {...reviewForm.categories, foodAndBeverages: rating}
                    })}
                    size="text-lg"
                  />
                </div>
              </div>

              <div className="modal-action">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={createTheatreReview.isPending}
                >
                  {createTheatreReview.isPending ? "Submitting..." : "Submit Review"}
                </button>
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewForm({
                      rating: 0,
                      review: '',
                      categories: {
                        seating: 0,
                        soundQuality: 0,
                        screenQuality: 0,
                        cleanliness: 0,
                        foodAndBeverages: 0,
                      }
                    });
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default BookShowPage;
