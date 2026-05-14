const express = require('express')
const pool = require('./db')

const ticketsRoutes = require('./routes/tickets')
const commentsRoutes = require('./routes/comments')

const app = express()

app.use(express.json())

app.use('/api/tickets', ticketsRoutes)
app.use('/api/tickets', commentsRoutes)

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('SupportFlow API is running')
})

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error(err)
  } else {
    console.log(result.rows)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})