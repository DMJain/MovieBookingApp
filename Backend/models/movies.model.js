const { Schema, model } = require('mongoose')

const moviesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    language: {
      type: String,
    },
    genre: {
      type: [String], // Array of genres: Action, Comedy, Drama, etc.
      default: [],
    },
    categories: {
      type: [String], // Array of categories: 2D, 3D, IMAX, 4DX, etc.
      default: [],
    },
    adultRating: {
      type: String,
      enum: ['U', 'UA', 'A', 'S', 'U/A 7+', 'U/A 13+', 'U/A 16+'], // U: Universal, UA: Universal Adult, A: Adult, S: Restricted
      default: 'U',
    },
    imageURL: {
      type: String,
    },
    durationInMinutes: {
      type: Number,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    criticRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
)

const Movie = model('movie', moviesSchema)

module.exports = Movie