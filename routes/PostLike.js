const express = require('express')
const route = express.Router()
const likeController = require('../controller/PostLike')
const authenticate = require('../middleware/passport')

// route.get('/', authenticate, likeController.likeOrNot)
route.get('/:id', authenticate, likeController.getLike)
route.post('/', authenticate, likeController.pressLike)
route.delete('/:id', authenticate, likeController.unLike)

module.exports = route