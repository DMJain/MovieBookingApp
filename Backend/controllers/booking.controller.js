const {
  bookingCreationValidationSchema,
  verifyPaymentValidationSchema,
} = require('../lib/validators/booking.validator')
const Show = require('../models/theatre-hall-movie-mapping')
const User = require('../models/user.model')
const Hall = require('../models/theatre-halls.model')
const Booking = require('../models/booking.model')
const axios = require('axios');
const { hash, createId } = require('../utils/hash')

ClientId = process.env.CASHFREE_CLIENT_ID;
ClientSecret = process.env.CASHFREE_CLIENT_SECRET;

async function handleCreateBooking(req, res) {

  if(!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const user = await User.findById(req.user._id).select({
    firstname: true,
    lastname: true,
    email: true,
    role: true,
  })

  const order_expiry_time = new Date(Date.now() + 5.8 * 60 * 60 * 1000).toISOString().replace(/\.\d+Z/, "+05:30");
  console.log(order_expiry_time);
  console.log(typeof order_expiry_time);
  
  const orderId = await createId();

  const validationResult = await bookingCreationValidationSchema.safeParseAsync(
    req.body
  )

  if (validationResult.error)
    return res.status(400).json({ error: validationResult.error })
  
  const { seatNumber, showId } = validationResult.data

  const show = await Show.findById(showId)

  if (!show) return res.status(400).json({ error: 'Invalid Show' })

  const hall = await Hall.findById(show.theatreHallId)

  if (!hall) return res.status(400).json({ error: 'Invalid Hall' });

  try {
        
    let request = {
        method: 'POST',
        url: "https://sandbox.cashfree.com/pg/orders",
        headers: {
            accept: 'application/json',
            'x-api-version': '2023-08-01',
            'content-type': 'application/json',
            'x-client-id': ClientId,
            'x-client-secret': ClientSecret,
            
        },
        data:{
            "customer_details": {
                "customer_id": user._id,
                "customer_phone": "9999999999",
                "customer_email": user.email,
                "customer_name": `${user.firstname} ${user.lastname}`,
            },
            "order_id": orderId,
            "order_amount": show.price,
            "order_currency": "INR",
            "order_expiry_time": order_expiry_time,
        }
        
    };

    axios.request(request).then((response) => {
        console.log("/payment response",response.data);
        res.json(response.data);
    }).catch(error => {
        console.error("payment error",error.response.data.message);
    })
  } catch (error) {
      console.log(error);
  }

}

async function verifyPayment(req, res) {
  const validationResult = await verifyPaymentValidationSchema.safeParseAsync(
    req.body
  )

  if (validationResult.error)
    return res.status(400).json({ error: validationResult.error })

  const { showId, orderId, seatNumber } = validationResult.data

  try {    
    let request = {
        method: 'GET',
        url: `https://sandbox.cashfree.com/pg/orders/${orderId}`,
        headers: {
            accept: 'application/json',
            'x-api-version': '2023-08-01',
            'x-client-id': ClientId,
            'x-client-secret': ClientSecret,
            
        },
    };
    
    axios.request(request).then((response) => {
        console.log("/verify response",response.data);
        res.json(response.data);
    }).catch(error => {
        console.error("payment error",error.response.data.message);
    })


} catch (error) {
    console.log(error);
}
}

module.exports = { handleCreateBooking, verifyPayment }
