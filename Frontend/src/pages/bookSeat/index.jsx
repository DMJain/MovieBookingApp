import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setBookingDetails} from '../../store/slices/bookingSlice';

const BookSeatPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const movie = useSelector((state) => state.movie);
  const hall = useSelector((state) => state.hall);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    if (movie._id === null) {
      navigate("/explore");
    }
  }, []);

  const handlePayment = async () => {
    dispatch(setBookingDetails({selectedSeats, totalPrice: hall.price * selectedSeats.length}));
    navigate(`/bookShow/${hall.showId}/bookseat/checkout`);
  }

  const handleSeletedSeats = (index) => {
    return () => {
      if (selectedSeats.includes(index)) {
        setSelectedSeats(selectedSeats.filter((seat) => seat !== index));
      } else {
        setSelectedSeats([...selectedSeats, index]);
      }
    };
  };
  return (
    <div className="p-3 flex flex-col items-center justify-center">
      <div className="w-7/12 flex flex-col gap-10">
        {/* Header */}
        <div className="bg-base-100 mb-5 flex justify-between p-3 gap-5 bordered shadow-md shadow-secondary rounded-lg">
          <div className="pr-4">
            <h1 className="text-4xl">{movie.title}</h1>
            <p>  {hall.showDate} : {hall.showTiming}</p>
          </div>
          <div>
            {selectedSeats.length > 0 ? (
              <div className="flex gap-3">
                <button className="btn   btn-success" onClick={() => handlePayment()}>
                  Checkout INR:{hall.price * selectedSeats.length}
                </button>
                <button
                  className="btn btn-outline btn-error"
                  onClick={() => setSelectedSeats([])}
                >
                  X
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Seats */}
        <div className="">
          <div>
            <div className="grid grid-cols-10 gap-2 w-full place-items-center">
              {/* Seat */}
              {[...Array(hall.seatNumber)].map((_, index) => (
                <div key={index}>
                  <button
                    className={`btn btn-outline ${
                      selectedSeats.includes(index + 1)
                        ? 'bg-success'
                        : 'hover:bg-success'
                    } btn-base-200 h-10 w-10`}
                    onClick={handleSeletedSeats(index + 1)}
                  ></button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-base-300 text-center mt-10">SCREEN</div>
        </div>
      </div>
    </div>
  );
};

export default BookSeatPage;
