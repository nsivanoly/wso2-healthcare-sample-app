/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - gender
 *         - medicalHistory
 *         - contactInfo
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated patient ID
 *         name:
 *           type: string
 *           description: Patient's full name
 *           example: "John Doe"
 *         age:
 *           type: integer
 *           minimum: 0
 *           description: Patient's age
 *           example: 30
 *         gender:
 *           type: string
 *           description: Patient's gender
 *           example: "male"
 *         medicalHistory:
 *           type: string
 *           description: Patient's medical history
 *           example: "Diabetes Type 2, Hypertension"
 *         contactInfo:
 *           type: string
 *           description: Patient's contact information
 *           example: "john.doe@email.com"
 * 
 * /patients:
 *   get:
 *     summary: List all patients
 *     tags: [patients]
 *     responses:
 *       200:
 *         description: List of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *   post:
 *     summary: Create a patient
 *     tags: [patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - gender
 *               - medicalHistory
 *               - contactInfo
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Emily Davis"
 *               age:
 *                 type: integer
 *                 example: 32
 *               gender:
 *                 type: string
 *                 example: "female"
 *               medicalHistory:
 *                 type: string
 *                 example: "Allergies (peanuts)"
 *               contactInfo:
 *                 type: string
 *                 example: "emily.davis@email.com"
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Validation error
 *
 * /patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Patient found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 *   put:
 *     summary: Update patient by ID
 *     tags: [patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - gender
 *               - medicalHistory
 *               - contactInfo
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               age:
 *                 type: integer
 *                 example: 31
 *               gender:
 *                 type: string
 *                 example: "male"
 *               medicalHistory:
 *                 type: string
 *                 example: "None"
 *               contactInfo:
 *                 type: string
 *                 example: "john.doe@email.com"
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Patient not found
 *   patch:
 *     summary: Partially update patient by ID
 *     tags: [patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
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
 *                 example: "John Doe"
 *               age:
 *                 type: integer
 *                 example: 31
 *               gender:
 *                 type: string
 *                 example: "male"
 *               medicalHistory:
 *                 type: string
 *                 example: "Diabetes Type 2"
 *               contactInfo:
 *                 type: string
 *                 example: "john.doe@email.com"
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 *   delete:
 *     summary: Delete patient by ID
 *     tags: [patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 */
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { getPatients, setPatients } = require('../data/sampleData');

const router = express.Router();

const validators = [
  body('name').notEmpty(),
  body('age').isInt({ min: 0 }),
  body('gender').notEmpty(),
  body('medicalHistory').notEmpty(),
  body('contactInfo').notEmpty()
];

router.get('/', (req, res) => {
  res.json(getPatients());
});

router.get('/:id', [param('id').isInt({ min: 1 })], (req, res) => {
  const patients = getPatients();
  const item = patients.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Patient not found' });
  res.json(item);
});

router.post('/', validators, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const patients = getPatients();
  const newId = patients.length ? Math.max(...patients.map(i => i.id)) + 1 : 1;
  const newItem = { id: newId, ...req.body };
  patients.push(newItem);
  setPatients(patients);
  res.status(201).json(newItem);
});

router.put('/:id', validators, (req, res) => {
  const patients = getPatients();
  const idx = patients.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Patient not found' });
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  patients[idx] = { id: patients[idx].id, ...req.body };
  setPatients(patients);
  res.json(patients[idx]);
});

router.patch('/:id', (req, res) => {
  const patients = getPatients();
  const idx = patients.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Patient not found' });
  patients[idx] = { ...patients[idx], ...req.body };
  setPatients(patients);
  res.json(patients[idx]);
});

router.delete('/:id', [param('id').isInt({ min: 1 })], (req, res) => {
  const patients = getPatients();
  const idx = patients.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Patient not found' });
  const deleted = patients.splice(idx, 1);
  setPatients(patients);
  res.json(deleted[0]);
});

module.exports = router;
