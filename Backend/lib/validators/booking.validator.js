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

module.exports = {
  bookingCreationValidationSchema,
  verifyPaymentValidationSchema,
}
