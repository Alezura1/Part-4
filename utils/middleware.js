const logger = require('./logger')
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } 
  else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }
   else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({error: 'token expired'})
  }

  logger.error(error.message)

  next(error)
}

const tokenExtractor  = (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  }

  next()
}

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'Missing or invalid token' })
  } else {
    req.user = await User.findById(decodedToken.id)
  }

  next()
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}