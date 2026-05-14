const pool = require('../db')

const getCommentsByTicket = (req, res) => {
  const ticketId = req.params.id

  pool.query(
    `
    SELECT
      comments.id,
      comments.message,
      comments.created_at,
      users.name AS user_name
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.ticket_id = $1
    `,
    [ticketId],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Database error')
      } else {
        res.json(result.rows)
      }
    }
  )
}

const createComment = (req, res) => {
  const ticketId = req.params.id
  const { user_id, message } = req.body

  if (!user_id || !message) {
    return res.status(400).json({
      error: 'user_id and message are required'
    })
  }

  pool.query(
    'SELECT * FROM users WHERE id = $1',
    [user_id],
    (userErr, userResult) => {
      if (userErr) {
        console.error(userErr)
        return res.status(500).send('Database error')
      }

      if (userResult.rows.length === 0) {
        return res.status(400).json({
          error: 'User does not exist'
        })
      }

      pool.query(
        'SELECT * FROM tickets WHERE id = $1',
        [ticketId],
        (ticketErr, ticketResult) => {
          if (ticketErr) {
            console.error(ticketErr)
            return res.status(500).send('Database error')
          }

          if (ticketResult.rows.length === 0) {
            return res.status(400).json({
              error: 'Ticket does not exist'
            })
          }

          pool.query(
            `
            INSERT INTO comments (ticket_id, user_id, message)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [ticketId, user_id, message],
            (err, result) => {
              if (err) {
                console.error(err)
                res.status(500).send('Database error')
              } else {
                res.json(result.rows[0])
              }
            }
          )
        }
      )
    }
  )
}

module.exports = {
  getCommentsByTicket,
  createComment
}