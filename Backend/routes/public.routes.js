const express = require('express')
const movieController = require('../controllers/movie.controller')
const theatreController = require('../controllers/theatre.controller')

const router = express.Router()

router.get('/movies', movieController.getAllMovies)
router.get('/movies/:id', movieController.getMovieById)
router.get('/shows/:movieId', theatreController.listShowsByMovieId) // Todo: Make this public route

module.exports = router
