const express = require('express')
const movieController = require('../controllers/movie.controller')
const theatreController = require('../controllers/theatre.controller')

const router = express.Router()

router.get('/movies', movieController.getAllMovies)
router.get('/movies/:id', movieController.getMovieById)
router.get('/:city/shows/:movieId', theatreController.listShowsByMovieIdAndCity) // Todo: Make this public route
router.get('/shows/:movieId', theatreController.listShowsByMovieId)

module.exports = router
