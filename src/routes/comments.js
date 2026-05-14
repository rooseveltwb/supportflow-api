const express = require('express')

const router = express.Router()

const {
  getCommentsByTicket,
  createComment
} = require('../controllers/commentsController')

router.get('/:id/comments', getCommentsByTicket)

router.post('/:id/comments', createComment)

module.exports = router