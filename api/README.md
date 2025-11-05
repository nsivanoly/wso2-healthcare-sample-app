# Healthcare Demo API

A Node.js + Express API for a Healthcare Demo Application.

## Features
- In-memory storage for Patients, Doctors, Appointments, Prescriptions
- CRUD endpoints for each entity
- Input validation and error handling
- Swagger/OpenAPI documentation at `/api-docs`
- CORS enabled for frontend access
- Runs on port 5000 by default

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Access Swagger docs at [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## Endpoints

Each entity (`patients`, `doctors`, `appointments`, `prescriptions`) supports:
- `GET /entity` — List all
- `GET /entity/:id` — Get by ID
- `POST /entity` — Create
- `PUT /entity/:id` — Update full record
- `PATCH /entity/:id` — Partial update
- `DELETE /entity/:id` — Delete record

## Sample Data
Pre-loaded sample data is available for all entities on server start.

## License
MIT
