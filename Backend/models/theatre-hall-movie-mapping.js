const { Schema, model } = require('mongoose')

const theatreHallMovieMappingSchema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'movie',
    },
    theatreHallId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'theatreHall',
    },
    showDate: {
      type: String,
      required: true,
    },
    startTimestamp: {
      type: String,
      required: true,
    },
    endTimestamp: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

theatreHallMovieMappingSchema.index(
  { movieId: 1, theatreHallId: 1, startTimestamp: 1, endTimestamp: 1 },
  { unique: true }
)

const TheatreHallMovieMapping = model(
  'theatreHallMovieMapping',
  theatreHallMovieMappingSchema
)

module.exports = TheatreHallMovieMapping
