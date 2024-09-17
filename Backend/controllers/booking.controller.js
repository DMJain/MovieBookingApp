const {
    bookingCreationValidationSchema,
    verifyPaymentValidationSchema,
    createBookingValidationSchema,
} = require('../lib/validators/booking.validator');
const Show = require('../models/theatre-hall-movie-mapping');
const User = require('../models/user.model');
const Hall = require('../models/theatre-halls.model');
const Booking = require('../models/booking.model');
const axios = require('axios');
const { hash, createId } = require('../utils/hash');
const { type } = require('os');
// const {Cashfree} = require('cashfree-pg');
// import { Cashfree } from "cashfree-pg"; 

ClientId = process.env.CASHFREE_CLIENT_ID;
ClientSecret = process.env.CASHFREE_CLIENT_SECRET;

// Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
// Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
// Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

async function handleCreateBooking(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(req.user._id).select({
        firstname: true,
        lastname: true,
        email: true,
        role: true,
    });

    const order_expiry_time = new Date(Date.now() + 5.8 * 60 * 60 * 1000)
        .toISOString()
        .replace(/\.\d+Z/, '+05:30');

    const orderId = await createId();

    const validationResult =
        await bookingCreationValidationSchema.safeParseAsync(req.body);

    if (validationResult.error)
        return res.status(400).json({ error: validationResult.error });

    const { seatNumbers, showId, totalPrice } = validationResult.data;
    console.log('totalPrice', totalPrice);
    console.log(typeof totalPrice);

    const show = await Show.findById(showId);

    if (!show) return res.status(400).json({ error: 'Invalid Show' });

    const hall = await Hall.findById(show.theatreHallId);

    if (!hall) return res.status(400).json({ error: 'Invalid Hall' });

    try {
        let request = {
            method: 'POST',
            url: 'https://sandbox.cashfree.com/pg/orders',
            headers: {
            accept: 'application/json',
            'x-api-version': '2023-08-01',
            'content-type': 'application/json',
            'x-client-id': ClientId,
            'x-client-secret': ClientSecret,
            },
            data: {
            customer_details: {
                customer_id: user._id,
                customer_phone: '9999999999',
                customer_email: user.email,
                customer_name: `${user.firstname} ${user.lastname}`,
            },
            order_id: orderId,
            order_amount: Number(totalPrice),
            order_currency: 'INR',
            order_expiry_time: order_expiry_time,
            },
        };

        axios
            .request(request)
            .then((response) => {
                console.log('/payment response', response.data);
                res.json(response.data);
            })
            .catch((error) => {
                console.error('payment error', error.response.data.message);
            });
    } catch (error) {
        console.log(error);
    }

    // var requestPayment = {
    //     "order_amount": Number(totalPrice),
    //     "order_currency": "INR",
    //     "order_id": orderId,
    //     "customer_details": {
    //         "customer_id": user._id,
    //         "customer_phone": "8474090589",
    //         "customer_name": `${user.firstname} ${user.lastname}`,
    //         "customer_email": user.email
    //     },
    //     "order_meta": {
    //         "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/popupCheckout?order_id={order_id}",
    //         "payment_methods": "cc,dc,upi"
    //     },
    //     "order_expiry_time": order_expiry_time
    // };

    // Cashfree.PGCreateOrder("2023-08-01", requestPayment).then((response) => {
    //     console.log('Order created successfully:',response.data);
    //     res.json(response.data)
    // }).catch((error) => {
    //     console.error('Error:', error.response.data.message);
    //     res.status(400).json('Error', error)
    // });


}

async function verifyPayment(req, res) {
    const validationResult = await verifyPaymentValidationSchema.safeParseAsync(
        req.body
    );

    if (validationResult.error)
        return res.status(400).json({ error: validationResult.error });

    

    const { showId, orderId, seatNumber } = validationResult.data;

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

        axios
            .request(request)
            .then((response) => {
                console.log('/verify response', response.data);
                res.json(response.data);
            })
            .catch((error) => {
                console.error('payment error', error.response.data.message);
            });
    } catch (error) {
        console.log(error);
    }
}

async function createBooking(req, res) {
    const validateResult = await createBookingValidationSchema.safeParseAsync(req.body);
    if (validateResult.error) return res.status(400).json({ error: validateResult.error });
    const {showId, seatNumber, paymentId} = validateResult.data;

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = req.user._id;

    try {
        seatNumber.forEach(async (seat) => {
        await Booking.create({showId, seatNumber: seat, paymentId, gateway : 'CASHFREE', userId});
        })
        res.status(201).json({message: 'Booking created successfully'});
    } catch{
        res.status(500).json({error: 'Internal server error'});
    }
    
}

async function getShowBooking(req, res) {
    const showId = req.body.showId;
    const bookings = await Booking.find({showId: showId});
    res.status(200).json(bookings);
}

module.exports = { handleCreateBooking, verifyPayment, createBooking , getShowBooking};
