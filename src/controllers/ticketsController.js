const pool = require('../db')

const getAllTickets = (req, res) => {
  const { status, priority } = req.query

  let query = `
  SELECT 
    tickets.id,
    tickets.title,
    tickets.status,
    tickets.priority,
    tickets.user_id,
    users.name AS user_name,
    users.email AS user_email
  FROM tickets
  LEFT JOIN users ON tickets.user_id = users.id
`

let values = []

  if (status) {
    query += ' WHERE status = $1'
    values.push(status)
  }

  if (priority) {
    query += status
      ? ' AND priority = $2'
      : ' WHERE priority = $1'

    values.push(priority)
  }

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).send('Database error')
    } else {
      res.json(result.rows)
    }
  })
}

const getTicketById = (req, res) => {
  const ticketId = req.params.id

  pool.query(
    'SELECT * FROM tickets WHERE id = $1',
    [ticketId],
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

const createTicket = (req, res) => {
  const { title, status, priority, user_id } = req.body

  if (!title || !status || !priority || !user_id) {
    return res.status(400).json({
      error: 'All fields are required'
    })
  }

  const validStatuses = ['open', 'in_progress', 'closed']
  const validPriorities = ['low', 'medium', 'high']

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status'
    })
  }

  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      error: 'Invalid priority'
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
        'INSERT INTO tickets (title, status, priority, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, status, priority, user_id],
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

const updateTicket = (req, res) => {
  const ticketId = req.params.id
  const { title, status, priority } = req.body

    if (!title || !status || !priority) {
    return res.status(400).json({
      error: 'All fields are required'
    })
  }

  const validStatuses = ['open', 'in_progress', 'closed']
  const validPriorities = ['low', 'medium', 'high']

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status'
    })
  }

  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      error: 'Invalid priority'
    })
  }

  pool.query(
    'UPDATE tickets SET title = $1, status = $2, priority = $3 WHERE id = $4 RETURNING *',
    [title, status, priority, ticketId],
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

const deleteTicket = (req, res) => {
  const ticketId = req.params.id

  pool.query(
    'DELETE FROM tickets WHERE id = $1 RETURNING *',
    [ticketId],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Database error')
      } else {
        res.json({
          message: 'Ticket deleted',
          deletedTicket: result.rows[0]
        })
      }
    }
  )
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
}