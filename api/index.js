const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route imports
const patientsRouter = require('./routes/patients');
const doctorsRouter = require('./routes/doctors');
const appointmentsRouter = require('./routes/appointments');
const prescriptionsRouter = require('./routes/prescriptions');
const summaryRouter = require('./routes/summary');

// Mount routes
app.use('/patients', patientsRouter);
app.use('/doctors', doctorsRouter);
app.use('/appointments', appointmentsRouter);
app.use('/prescriptions', prescriptionsRouter);
app.use('/summary', summaryRouter);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Healthcare Demo API',
      version: '1.0.0',
      description: 'API for managing patients, doctors, appointments, and prescriptions.'
    },
  servers: [{ url: 'http://localhost:3010' }]
  },
  apis: ['./routes/*.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3010;

// Beautiful Home Page for Healthcare Demo
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Healthcare Demo API</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
      <style>
        html, body {
          height: 100%;
        }
        body {
          font-family: 'Roboto', Arial, sans-serif;
          background: linear-gradient(120deg, #e0f7fa 0%, #f8bbd0 100%);
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          max-width: 600px;
          width: 100%;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 32px;
          text-align: center;
        }
        h1 {
          color: #1976d2;
          margin-bottom: 8px;
        }
        .subtitle {
          color: #7b1fa2;
          margin-bottom: 24px;
        }
        .icon-row {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-bottom: 24px;
        }
        .icon {
          font-size: 48px;
        }
        .links {
          margin-top: 24px;
        }
        .links a {
          display: inline-block;
          margin: 0 12px;
          padding: 12px 24px;
          background: #1976d2;
          color: #fff;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          transition: background 0.2s;
        }
        .links a:hover {
          background: #1565c0;
        }
        .api-list {
          margin-top: 32px;
          text-align: left;
        }
        .api-list h2 {
          color: #388e3c;
        }
        .api-list ul {
          list-style: none;
          padding: 0;
        }
        .api-list li {
          margin-bottom: 8px;
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Healthcare Demo API</h1>
        <div class="subtitle">Empowering digital health solutions</div>
        <div class="icon-row">
          <span class="icon" title="Patients">🧑‍⚕️</span>
          <span class="icon" title="Doctors">👩‍⚕️</span>
          <span class="icon" title="Appointments">📅</span>
          <span class="icon" title="Prescriptions">💊</span>
        </div>
        <div class="links">
          <a href="/api-docs" target="_blank">API Docs (Swagger)</a>
          <a href="/swagger.json" target="_blank">Swagger JSON</a>
          <a href="/summary" target="_blank">System Summary</a>
        </div>
        <div class="api-list">
          <h2>Available Endpoints</h2>
          <ul>
            <li><strong>Patients:</strong> <code>/patients</code></li>
            <li><strong>Doctors:</strong> <code>/doctors</code></li>
            <li><strong>Appointments:</strong> <code>/appointments</code></li>
            <li><strong>Prescriptions:</strong> <code>/prescriptions</code></li>
            <li><strong>Summary:</strong> <code>/summary</code></li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Export Swagger JSON
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.listen(PORT, () => {
  console.log(`Healthcare Demo API running on port ${PORT}`);
});
