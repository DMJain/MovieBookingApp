import { useSelector } from 'react-redux';
import { useCreatreBooking } from '../../../hooks/booking.hooks';

const OnSuccess = () => {
    const movie = useSelector((state) => state.movie);
    const hall = useSelector((state) => state.hall);
    const booking = useSelector((state) => state.booking);

    const { mutateAsync: CreatreBookingAync } = useCreatreBooking();

  const createBooking = async () => {
    await CreatreBookingAync({
      showId: hall.showId,
      seatNumber: booking.selectedSeats,
      paymentId: booking.orderId,
    })
  }

    createBooking();

    return (
        <div className='flex justify-center items-center p-20'>
        <div className='w-7/12'>
          <div className="border rounded-xl border-success shadow-lg flex gap-5">
            <div className="w-6/12 flex justify-center items-center bg-success p-5 rounded-xl">
              <div className="h-80 w-56 rounded-xl">
                <img src={movie.imageURL} alt="" className='object-fill w-full h-full rounded-xl' />
              </div>
            </div>
            <div className="flex flex-col gap-5 w-full p-5">
              <div>
                <h1 className="text-6xl">{movie.title}</h1>
              </div>
              <div className="flex gap-2">
                <div className="badge badge-success badge-outline">{movie.language}</div>
                <div className="badge badge-success badge-outline">{movie.durationInMinutes} min</div>
              </div>
              <div>
                <div>
                  <h1 className="text-3xl">Theatre : {hall.theatreName}</h1>
                </div>
              </div>
              <div className="flex w-full">
                <div className="w-6/12">
                  <h1 className="text-3xl">Date: {hall.showDate}</h1>
                </div>
                <div className="w-6/12">
                  <h1 className="text-3xl">Time:{hall.showTiming}</h1>
                </div>
              </div>
              <div className='text-3xl'>Seat Number/s :
                <div className="flex gap-2">
                    {booking.selectedSeats.map((seat, index) => (
                        <div key={index} className="">{seat}</div>
                    ))}
                </div>    
              </div>
            </div>
          </div>
        </div>
        </div>
    )
};

export default OnSuccess;