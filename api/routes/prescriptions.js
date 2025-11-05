/**
 * @swagger
 * components:
 *   schemas:
 *     Prescription:
 *       type: object
 *       required:
 *         - patientId
 *         - doctorId
 *         - medication
 *         - dosage
 *         - instructions
 *         - dateIssued
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated prescription ID
 *         patientId:
 *           type: integer
 *           description: ID of the patient
 *           example: 1
 *         doctorId:
 *           type: integer
 *           description: ID of the prescribing doctor
 *           example: 3
 *         medication:
 *           type: string
 *           description: Name of the medication
 *           example: "Metformin"
 *         dosage:
 *           type: string
 *           description: Medication dosage
 *           example: "500mg"
 *         instructions:
 *           type: string
 *           description: Instructions for taking the medication
 *           example: "Twice daily with meals"
 *         dateIssued:
 *           type: string
 *           format: date
 *           description: Date the prescription was issued
 *           example: "2025-09-15"
 * 
 * /prescriptions:
 *   get:
 *     summary: List all prescriptions
 *     tags: [prescriptions]
 *     responses:
 *       200:
 *         description: List of prescriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prescription'
 *   post:
 *     summary: Create a prescription
 *     tags: [prescriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - doctorId
 *               - medication
 *               - dosage
 *               - instructions
 *               - dateIssued
 *             properties:
 *               patientId:
 *                 type: integer
 *                 example: 1
 *               doctorId:
 *                 type: integer
 *                 example: 3
 *               medication:
 *                 type: string
 *                 example: "Lisinopril"
 *               dosage:
 *                 type: string
 *                 example: "10mg"
 *               instructions:
 *                 type: string
 *                 example: "Once daily in the morning"
 *               dateIssued:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-16"
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescription'
 *       400:
 *         description: Validation error
 *
 * /prescriptions/{id}:
 *   get:
 *     summary: Get prescription by ID
 *     tags: [prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prescription ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Prescription found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescription'
 *       404:
 *         description: Prescription not found
 *   put:
 *     summary: Update prescription by ID
 *     tags: [prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prescription ID
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
 *               - medication
 *               - dosage
 *               - instructions
 *               - dateIssued
 *             properties:
 *               patientId:
 *                 type: integer
 *                 example: 1
 *               doctorId:
 *                 type: integer
 *                 example: 3
 *               medication:
 *                 type: string
 *                 example: "Metformin"
 *               dosage:
 *                 type: string
 *                 example: "1000mg"
 *               instructions:
 *                 type: string
 *                 example: "Twice daily with meals"
 *               dateIssued:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-16"
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescription'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Prescription not found
 *   patch:
 *     summary: Partially update prescription by ID
 *     tags: [prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prescription ID
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
 *               medication:
 *                 type: string
 *                 example: "Metformin"
 *               dosage:
 *                 type: string
 *                 example: "1000mg"
 *               instructions:
 *                 type: string
 *                 example: "Once daily with breakfast"
 *               dateIssued:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-16"
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescription'
 *       404:
 *         description: Prescription not found
 *   delete:
 *     summary: Delete prescription by ID
 *     tags: [prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prescription ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Prescription deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescription'
 *       404:
 *         description: Prescription not found
 */
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { getPrescriptions, setPrescriptions } = require('../data/sampleData');

const router = express.Router();

const validators = [
  body('patientId').isInt({ min: 1 }),
  body('doctorId').isInt({ min: 1 }),
  body('medication').notEmpty(),
  body('dosage').notEmpty(),
  body('instructions').notEmpty(),
  body('dateIssued').notEmpty()
];

router.get('/', (req, res) => {
  res.json(getPrescriptions());
});

router.get('/:id', [param('id').isInt({ min: 1 })], (req, res) => {
  const prescriptions = getPrescriptions();
  const item = prescriptions.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Prescription not found' });
  res.json(item);
});

router.post('/', validators, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const prescriptions = getPrescriptions();
  const newId = prescriptions.length ? Math.max(...prescriptions.map(i => i.id)) + 1 : 1;
  const newItem = { id: newId, ...req.body };
  prescriptions.push(newItem);
  setPrescriptions(prescriptions);
  res.status(201).json(newItem);
});

router.put('/:id', validators, (req, res) => {
  const prescriptions = getPrescriptions();
  const idx = prescriptions.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Prescription not found' });
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  prescriptions[idx] = { id: prescriptions[idx].id, ...req.body };
  setPrescriptions(prescriptions);
  res.json(prescriptions[idx]);
});

router.patch('/:id', (req, res) => {
  const prescriptions = getPrescriptions();
  const idx = prescriptions.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Prescription not found' });
  prescriptions[idx] = { ...prescriptions[idx], ...req.body };
  setPrescriptions(prescriptions);
  res.json(prescriptions[idx]);
});

router.delete('/:id', [param('id').isInt({ min: 1 })], (req, res) => {
  const prescriptions = getPrescriptions();
  const idx = prescriptions.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Prescription not found' });
  const deleted = prescriptions.splice(idx, 1);
  setPrescriptions(prescriptions);
  res.json(deleted[0]);
});

module.exports = router;
