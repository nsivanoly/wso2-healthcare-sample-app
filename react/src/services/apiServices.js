import api from './api';

// Patients API - Based on Swagger specs
export const patientsAPI = {
  // Get all patients
  getAll: () => api.get('/patients'),
  
  // Get patient by ID
  getById: (id) => api.get(`/patients/${id}`),
  
  // Create new patient
  // Required fields: name, age, gender, medicalHistory, contactInfo
  create: (patientData) => api.post('/patients', patientData),
  
  // Update patient (PUT - full update)
  update: (id, patientData) => api.put(`/patients/${id}`, patientData),
  
  // Partial update patient (PATCH)
  patch: (id, patientData) => api.patch(`/patients/${id}`, patientData),
  
  // Delete patient
  delete: (id) => api.delete(`/patients/${id}`),
};

// Doctors API - Based on Swagger specs
export const doctorsAPI = {
  // Get all doctors
  getAll: () => api.get('/doctors'),
  
  // Get doctor by ID
  getById: (id) => api.get(`/doctors/${id}`),
  
  // Create new doctor
  // Required fields: name, specialty, contactInfo
  create: (doctorData) => api.post('/doctors', doctorData),
  
  // Update doctor (PUT - full update)
  update: (id, doctorData) => api.put(`/doctors/${id}`, doctorData),
  
  // Partial update doctor (PATCH)
  patch: (id, doctorData) => api.patch(`/doctors/${id}`, doctorData),
  
  // Delete doctor
  delete: (id) => api.delete(`/doctors/${id}`),
};

// Appointments API - Based on Swagger specs
export const appointmentsAPI = {
  // Get all appointments
  getAll: () => api.get('/appointments'),
  
  // Get appointment by ID
  getById: (id) => api.get(`/appointments/${id}`),
  
  // Create new appointment
  // Required fields: patientId, doctorId, date, time, reason, status
  create: (appointmentData) => api.post('/appointments', appointmentData),
  
  // Update appointment (PUT - full update)
  update: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  
  // Partial update appointment (PATCH)
  patch: (id, appointmentData) => api.patch(`/appointments/${id}`, appointmentData),
  
  // Delete appointment
  delete: (id) => api.delete(`/appointments/${id}`),
};

// Prescriptions API - Based on Swagger specs
export const prescriptionsAPI = {
  // Get all prescriptions
  getAll: () => api.get('/prescriptions'),
  
  // Get prescription by ID
  getById: (id) => api.get(`/prescriptions/${id}`),
  
  // Create new prescription
  // Required fields: patientId, doctorId, medication, dosage, instructions, dateIssued
  create: (prescriptionData) => api.post('/prescriptions', prescriptionData),
  
  // Update prescription (PUT - full update)
  update: (id, prescriptionData) => api.put(`/prescriptions/${id}`, prescriptionData),
  
  // Partial update prescription (PATCH)
  patch: (id, prescriptionData) => api.patch(`/prescriptions/${id}`, prescriptionData),
  
  // Delete prescription
  delete: (id) => api.delete(`/prescriptions/${id}`),
};

// Summary/Statistics API - Based on Swagger specs
export const summaryAPI = {
  // Get healthcare system statistics
  getSummary: () => api.get('/summary'),
};