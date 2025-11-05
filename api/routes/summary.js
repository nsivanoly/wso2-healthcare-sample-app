/**
 * @swagger
 * /summary:
 *   get:
 *     summary: Get healthcare system statistics
 *     tags: [summary]
 *     responses:
 *       200:
 *         description: System statistics and summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPatients:
 *                   type: integer
 *                   description: Total number of patients
 *                 totalDoctors:
 *                   type: integer
 *                   description: Total number of doctors
 *                 totalAppointments:
 *                   type: integer
 *                   description: Total number of appointments
 *                 totalPrescriptions:
 *                   type: integer
 *                   description: Total number of prescriptions
 *                 appointmentsByStatus:
 *                   type: object
 *                   description: Appointments grouped by status
 *                 doctorsBySpecialty:
 *                   type: object
 *                   description: Doctors grouped by specialty
 *                 averagePatientAge:
 *                   type: integer
 *                   description: Average age of patients
 */

const express = require('express');
const { getStats } = require('../data/sampleData');

const router = express.Router();

router.get('/', (req, res) => {
  const stats = getStats();
  res.json({
    ...stats,
    timestamp: new Date().toISOString(),
    systemStatus: 'operational'
  });
});

module.exports = router;