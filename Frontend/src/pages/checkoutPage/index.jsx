import { useSelector } from 'react-redux';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { load } from '@cashfreepayments/cashfree-js';
import { apiInstance } from '../../api';
import { useEffect } from 'react';

const CheckOutPage = () => {
  const movie = useSelector((state) => state.movie);
  const hall = useSelector((state) => state.hall);
  const booking = useSelector((state) => state.booking);
  const [convenienceFees, setConvenienceFees] = useState(0);
  const navigate = useNavigate();

  let cashfree;
  const insitialzeSDK = async function () {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      cashfree = await load({
        mode: 'sandbox',
      });
    };
    insitialzeSDK();

  useEffect(() => {
    if (booking.selectedSeats.length === 0) {
      navigate('/explore');
    }
    if (movie._id === null) {
      navigate('/explore');
    }
    if (hall.showId === null) {
      navigate('/explore');
    }

    

    setConvenienceFees(30);
  }, []);

  const [orderId, setOrderId] = useState('');
  const orderIdRef = useRef('');

  const getSessionId = async () => {
    try {
        const totalPrice = Number.parseFloat(booking.totalPrice) +
                       Number.parseFloat(convenienceFees) +
                       Number.parseFloat(convenienceFees * 0.18);
    const formattedTotalPrice = totalPrice.toFixed(2);
      let res = await apiInstance.post(`/booking/create`, {
        showId: hall.showId,
        seatNumber: booking.selectedSeats,
        totalPrice: formattedTotalPrice,
      });

      if (res.data && res.data.payment_session_id) {
        console.log('/payment response', res.data);
        setOrderId(res.data.order_id);
        orderIdRef.current = res.data.order_id;
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPayment = async (orderIdRef) => {
    try {
      let res = await apiInstance.post(`/booking/verify-payment`, {
        showId: hall.showId,
        orderId: orderIdRef,
        seatNumber: booking.selectedSeats,
      });

      if (res && res.data) {
        console.log('payment verified', res.data);
        navigate('/success');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      let sessionId = await getSessionId();
      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: '_modal',
      };

      cashfree.checkout(checkoutOptions).then((res) => {
        console.log('payment initialized');
        verifyPayment(orderIdRef.current);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-1/2 flex flex-col gap-4 p-3">
        <div>
          <div className="border rounded-xl border-secondary shadow-lg flex gap-5">
            <div className="w-6/12 flex justify-center items-center bg-primary p-5 rounded-xl">
              <div className="h-80 w-56 rounded-xl">
                <img src={movie.imageURL} alt="" className='object-fill w-full h-full rounded-xl' />
              </div>
            </div>
            <div className="flex flex-col gap-5 w-full p-5">
              <div>
                <h1 className="text-6xl">{movie.title}</h1>
              </div>
              <div className="flex gap-2">
                <div className="badge badge-primary badge-outline">{movie.language}</div>
                <div className="badge badge-primary badge-outline">{movie.durationInMinutes} min</div>
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
        <div className="divider divider-accent"></div>
        <div>
          <div className="">
            <div>
              <h1 className="text-3xl">Booking Summary</h1>
            </div>
            <div className="flex items-center flex-col p-3">
              <div className="w-1/2 flex flex-col gap-1">
                <div className="flex justify-between">
                  <div className="text-xl font-medium">
                    Ticket Price for {booking.selectedSeats.length}:
                  </div>
                  <div>{Number.parseFloat(booking.totalPrice).toFixed(2)} INR</div>
                </div>
                <div>
                  <details className="collapse rounded-none">
                    <summary>
                      <div className="flex justify-between">
                        <div className="text-xl font-medium hover:cursor-pointer">
                          Convenience fees …
                        </div>
                        <div>{ Number.parseFloat(convenienceFees + (convenienceFees * 0.18)).toFixed(2)} INR</div>
                      </div>
                    </summary>
                    <div className="collapse-content text-slate-500">
                      <div className="flex justify-between">
                        <div>Base Fee :</div>
                        <div>{Number.parseFloat(convenienceFees).toFixed(2)} INR</div>
                      </div>
                      <div className="flex justify-between">
                        <div>cGST <span className='text-xs'>@9%</span> :</div>
                        <div>{Number.parseFloat(convenienceFees * 0.09).toFixed(2)} INR</div>
                      </div>
                      <div className="flex justify-between">
                        <div>sGST <span className='text-xs'>@9%</span> :</div>
                        <div>{Number.parseFloat(convenienceFees * 0.09).toFixed(2)} INR</div>
                      </div>
                    </div>
                  </details>
                </div>
                <div className="flex justify-between mt-2 border-t-2 border-base-200">
                  <div className="text-xl font-medium">
                    TOTAL : 
                  </div>
                  <div>{Number.parseFloat(booking.totalPrice + (convenienceFees + (convenienceFees * 0.18))).toFixed(2)} INR</div>
                </div>
                <div className="flex justify-center w-full">
                  <div>
                    <button
                      className="btn btn-primary w-28 text-xl "
                      onClick={(e) => handlePayment(e)}
                    >
                      Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
