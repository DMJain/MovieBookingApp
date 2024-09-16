import { useSelector } from 'react-redux';
import { useState, useRef } from 'react';


import {load} from '@cashfreepayments/cashfree-js';
import { apiInstance } from "../../api";


const CheckOutPage = () => {

    let cashfree;

  let insitialzeSDK = async function () {

    cashfree = await load({
      mode: "sandbox",
    })
  }

  insitialzeSDK()
  

    const movie = useSelector((state) => state.movie);
    const hall = useSelector((state) => state.hall);
    const booking = useSelector((state) => state.booking);
    const [orderId, setOrderId] = useState("")
    const orderIdRef = useRef("");

    const getSessionId = async () => {
        try {
          let res = await apiInstance.post(`/booking/create`, {
            showId: hall.showId,
            seatNumber: booking.selectedSeats,
          });
          
          if(res.data && res.data.payment_session_id){
    
            console.log("/payment response",res.data)
            setOrderId(res.data.order_id)
            orderIdRef.current =res.data.order_id
            return res.data.payment_session_id
          }
    
    
        } catch (error) {
          console.log(error)
        }
      }
    
      const verifyPayment = async (orderIdRef) => {
        try {
          
          let res = await apiInstance.post(`/booking/verify-payment`, {
            showId : hall.showId,
            orderId: orderIdRef,
            seatNumber: booking.selectedSeats,
          })
    
          if(res && res.data){
            console.log("payment verified",res.data)
            alert("payment verified")
          }
    
        } catch (error) {
          console.log(error)
        }
      }
    
      const handlePayment = async (e) => {
        e.preventDefault()
        try {
    
          let sessionId = await getSessionId()
          let checkoutOptions = {
            paymentSessionId : sessionId,
            redirectTarget:"_modal",
          }
    
          cashfree.checkout(checkoutOptions).then((res) => {
            console.log("payment initialized")
            verifyPayment(orderIdRef.current)
          })
    
        } catch (error) {
          console.log(error)
        }
    
      }

    return (
        <div className='flex justify-center items-center p-4'>
            <div className='w-1/2 border border-blue-500 flex flex-col gap-4 p-3'>
                <div>
                    <div className='border rounded-md border-base-300 flex p-10 gap-5'>
                        <div className='w-6/12 flex justify-center items-center'>
                            <div className='h-96 w-56 border border-red-600 rounded-md'>
                                <img src={movie.imageURL} alt="" />
                            </div>
                        </div>
                        <div className='flex flex-col gap-5 w-full'>
                            <div>
                                <h1 className='text-6xl'>MOVIE TITLE</h1>
                            </div>
                            <div className='flex gap-2'>
                                <div className='badge badge-primary badge-outline'>hindi</div>
                                <div className='badge badge-primary badge-outline'>180 min</div>
                            </div>
                            <div>
                                <div>
                                    <h1 className='text-3xl'>Theater Name</h1>
                                </div>
                            </div>
                            <div className='flex w-full'>
                                <div className='w-6/12'>
                                    <h1 className='text-3xl'>Date: </h1>
                                </div>
                                <div className='w-6/12'>
                                    <h1 className='text-3xl'>Time:</h1>
                                </div>

                            </div>
                            <div>
                                seatNumbers
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className=''>
                        <div>
                            <h1 className='text-3xl'>Booking Summary</h1>
                        </div>
                        <div className='flex items-center flex-col p-3'>
                            <div className='w-1/2'>
                                <div className='flex justify-between'>
                                    <div className="text-xl font-medium">
                                        Ticket Price 2:
                                    </div>
                                    <div>
                                        200.00 INR
                                    </div>
                                </div>
                                <div>
                                    <details className="collapse rounded-none">
                                        <summary >
                                            <div className='flex justify-between'>
                                                <div className="text-xl font-medium">
                                                    Convenience fees …
                                                </div>
                                                <div>
                                                    60.00 INR
                                                </div>
                                            </div>
                                        </summary>
                                            <div className="collapse-content">
                                                 <div className='flex justify-between'>
                                                    <div>
                                                        price
                                                    </div>
                                                    <div>
                                                        30.00 INR
                                                    </div>
                                                 </div>
                                            </div>
                                    </details>
                                </div>
                                <div className='flex justify-end w-full'>
                                    <div>
                                        <button className='btn btn-primary' onClick={(e) => handlePayment(e)}>Pay</button>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckOutPage;
