/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - name
 *         - specialty
 *         - contactInfo
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated doctor ID
 *         name:
 *           type: string
 *           description: Doctor's full name
 *           example: "Dr. Alice Johnson"
 *         specialty:
 *           type: string
 *           description: Doctor's medical specialty
 *           example: "Cardiology"
 *         contactInfo:
 *           type: string
 *           description: Doctor's contact information
 *           example: "alice.johnson@hospital.com"
 * 
 * /doctors:
 *   get:
 *     summary: List all doctors
 *     tags: [doctors]
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *   post:
 *     summary: Create a doctor
 *     tags: [doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - specialty
 *               - contactInfo
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dr. Sarah Williams"
 *               specialty:
 *                 type: string
 *                 example: "Dermatology"
 *               contactInfo:
 *                 type: string
 *                 example: "sarah.williams@hospital.com"
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Validation error
 *
 * /doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags: [doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Doctor ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Doctor found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Doctor not found
 *   put:
 *     summary: Update doctor by ID
 *     tags: [doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Doctor ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - specialty
 *               - contactInfo
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dr. Alice Johnson"
 *               specialty:
 *                 type: string
 *                 example: "Cardiology"
 *               contactInfo:
 *                 type: string
 *                 example: "alice.johnson@hospital.com"
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Doctor not found
 *   patch:
 *     summary: Partially update doctor by ID
 *     tags: [doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Doctor ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dr. Alice Johnson"
 *               specialty:
 *                 type: string
 *                 example: "Interventional Cardiology"
 *               contactInfo:
 *                 type: string
 *                 example: "alice.johnson@hospital.com"
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Doctor not found
 *   delete:
 *     summary: Delete doctor by ID
 *     tags: [doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Doctor ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Doctor not found
 */
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { getDoctors, setDoctors } = require('../data/sampleData');

const router = express.Router();

const validators = [
  body('name').notEmpty(),
  body('specialty').notEmpty(),
  body('contactInfo').notEmpty()
];

router.get('/', (req, res) => {
  res.json(getDoctors());
});

router.get('/:id', [param('id').isInt({ min: 1 })], (req, res) => {
  const doctors = getDoctors();
  const item = doctors.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Doctor not found' });
  res.json(item);
});

router.post('/', validators, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const doctors = getDoctors();
  const newId = doctors.length ? Math.max(...doctors.map(i => i.id)) + 1 : 1;
  const newItem = { id: newId, ...req.body };
  doctors.push(newItem);
  setDoctors(doctors);
  res.status(201).json(newItem);
});

router.put('/:id', validators, (req, res) => {
  const doctors = getDoctors();
  const idx = doctors.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Doctor not found' });
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  doctors[idx] = { id: doctors[idx].id, ...req.body };
  setDoctors(doctors);
  res.json(doctors[idx]);
});

router.patch('/:id', (req, res) => {
  const doctors = getDoctors();
  const idx = doctors.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Doctor not found' });
  doctors[idx] = { ...doctors[idx], ...req.body };
  setDoctors(doctors);
  res.json(doctors[idx]);
});

router.delete('/:id', [param('id').isInt({ min: 1 })], (req, res) => {
  const doctors = getDoctors();
  const idx = doctors.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Doctor not found' });
  const deleted = doctors.splice(idx, 1);
  setDoctors(doctors);
  res.json(deleted[0]);
});

module.exports = router;
