# SupportFlow API

SupportFlow API is a backend support ticket system built with Node.js, Express, and PostgreSQL.

It allows users to create support tickets, assign ticket ownership, add comments, filter tickets, and retrieve relational data from multiple tables.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- pg
- dotenv
- Thunder Client for API testing

## Features

- Ticket CRUD
- PostgreSQL database connection
- Input validation
- Ticket filtering by status and priority
- Users table
- Ticket ownership with user_id
- Comments system
- Multi-table JOIN queries
- Modular routes and controllers

## Current API Routes

### Tickets

GET `/api/tickets`

GET `/api/tickets/:id`

POST `/api/tickets`

PUT `/api/tickets/:id`

DELETE `/api/tickets/:id`

### Comments

GET `/api/tickets/:id/comments`

POST `/api/tickets/:id/comments`

## Example Create Ticket Request

POST `/api/tickets`

```json
{
  "title": "Database issue",
  "status": "open",
  "priority": "high",
  "user_id": 1
}