const { z } = require('zod')

const createTheatreValidationSchema = z.object({
  name: z.string().min(3).max(50),
  plot: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  lat: z.string().optional(),
  lon: z.string().optional(),
  pinCode: z.number(),
})

const createTheatreHallSchema = z.object({
  number: z.number().min(0),
  seatingCapacity: z.number().min(0),
  theatreId: z.string(),
})

const createTheatreHallMovieMappingSchema = z.object({
  movieId: z.string(),
  theatreHallId: z.string(),
  showDate: z.string(),
  startTimestamp: z.string(),
  endTimestamp: z.string(),
  price: z.number(),
})

module.exports = {
  createTheatreValidationSchema,
  createTheatreHallSchema,
  createTheatreHallMovieMappingSchema,
}

