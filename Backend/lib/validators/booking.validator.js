const { z } = require('zod')

const bookingCreationValidationSchema = z.object({
  showId: z.string(),
  seatNumber: z.array(z.number().min(1)),
  totalPrice: z.string(),
})

const verifyPaymentValidationSchema = z.object({
  showId: z.string(),
  orderId: z.string(),
  seatNumber: z.array(z.number()),
})

const createBookingValidationSchema = z.object({
  showId: z.string(), 
  seatNumber:  z.array(z.number()),
  paymentId: z.string(),
})

module.exports = {
  bookingCreationValidationSchema,
  verifyPaymentValidationSchema,
  createBookingValidationSchema,
}
