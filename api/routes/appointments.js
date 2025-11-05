/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - patientId
 *         - doctorId
 *         - date
 *         - time
 *         - reason
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated appointment ID
 *         patientId:
 *           type: integer
 *           description: ID of the patient
 *           example: 1
 *         doctorId:
 *           type: integer
 *           description: ID of the doctor
 *           example: 3
 *         date:
 *           type: string
 *           format: date
 *           description: Appointment date
 *           example: "2025-09-25"
 *         time:
 *           type: string
 *           description: Appointment time
 *           example: "14:30"
 *         reason:
 *           type: string
 *           description: Reason for the appointment
 *           example: "Annual checkup"
 *         status:
 *           type: string
 *           enum: [scheduled, completed, cancelled]
 *           description: Appointment status
 *           example: "scheduled"
 * 
 * /appointments:
 *   get:
 *     summary: List all appointments
 *     tags: [appointments]
 *     responses:
 *       200:
 *         description: List of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *   post:
 *     summary: Create an appointment
 *     tags: [appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - doctorId
 *               - date
 *               - time
 *               - reason
 *               - status
 *             properties:
 *               patientId:
 *                 type: integer
 *                 example: 1
 *               doctorId:
 *                 type: integer
 *                 example: 3
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-25"
 *               time:
 *                 type: string
 *                 example: "14:30"
 *               reason:
 *                 type: string
 *                 example: "Follow-up consultation"
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 example: "scheduled"
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation error
 *
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Appointment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *   put:
 *     summary: Update appointment by ID
 *     tags: [appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - doctorId
 *               - date
 *               - time
 *               - reason
 *               - status
 *             properties:
 *               patientId:
 *                 type: integer
 *                 example: 1
 *               doctorId:
 *                 type: integer
 *                 example: 3
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-25"
 *               time:
 *                 type: string
 *                 example: "15:00"
 *               reason:
 *                 type: string
 *                 example: "Rescheduled checkup"
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 example: "scheduled"
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Appointment not found
 *   patch:
 *     summary: Partially update appointment by ID
 *     tags: [appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: integer
 *                 example: 1
 *               doctorId:
 *                 type: integer
 *                 example: 3
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-25"
 *               time:
 *                 type: string
 *                 example: "15:00"
 *               reason:
 *                 type: string
 *                 example: "Follow-up consultation"
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *   delete:
 *     summary: Delete appointment by ID
 *     tags: [appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 */
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { getAppointments, setAppointments } = require('../data/sampleData');

const router = express.Router();

const validators = [
  body('patientId').isInt({ min: 1 }),
  body('doctorId').isInt({ min: 1 }),
  body('date').notEmpty(),
  body('time').notEmpty(),
  body('reason').notEmpty(),
  body('status').notEmpty()
];

router.get('/', (req, res) => {
  res.json(getAppointments());
});

router.get('/:id', [param('id').isInt({ min: 1 })], (req, res) => {
  const appointments = getAppointments();
  const item = appointments.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Appointment not found' });
  res.json(item);
});

router.post('/', validators, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const appointments = getAppointments();
  const newId = appointments.length ? Math.max(...appointments.map(i => i.id)) + 1 : 1;
  const newItem = { id: newId, ...req.body };
  appointments.push(newItem);
  setAppointments(appointments);
  res.status(201).json(newItem);
});

router.put('/:id', validators, (req, res) => {
  const appointments = getAppointments();
  const idx = appointments.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Appointment not found' });
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  appointments[idx] = { id: appointments[idx].id, ...req.body };
  setAppointments(appointments);
  res.json(appointments[idx]);
});

router.patch('/:id', (req, res) => {
  const appointments = getAppointments();
  const idx = appointments.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Appointment not found' });
  appointments[idx] = { ...appointments[idx], ...req.body };
  setAppointments(appointments);
  res.json(appointments[idx]);
});

router.delete('/:id', [param('id').isInt({ min: 1 })], (req, res) => {
  const appointments = getAppointments();
  const idx = appointments.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Appointment not found' });
  const deleted = appointments.splice(idx, 1);
  setAppointments(appointments);
  res.json(deleted[0]);
});

module.exports = router;
