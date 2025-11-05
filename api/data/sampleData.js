// Centralized sample data for Healthcare Demo API

let patients = [
  { id: 1, name: 'John Doe', age: 30, gender: 'male', medicalHistory: 'None', contactInfo: 'john.doe@email.com' },
  { id: 2, name: 'Jane Smith', age: 25, gender: 'female', medicalHistory: 'Asthma', contactInfo: 'jane.smith@email.com' },
  { id: 3, name: 'Michael Johnson', age: 45, gender: 'male', medicalHistory: 'Diabetes Type 2, Hypertension', contactInfo: 'michael.johnson@email.com' },
  { id: 4, name: 'Emily Davis', age: 32, gender: 'female', medicalHistory: 'Allergies (peanuts)', contactInfo: 'emily.davis@email.com' },
  { id: 5, name: 'Robert Brown', age: 58, gender: 'male', medicalHistory: 'Heart disease, High cholesterol', contactInfo: 'robert.brown@email.com' },
  { id: 6, name: 'Sarah Wilson', age: 28, gender: 'female', medicalHistory: 'Migraine', contactInfo: 'sarah.wilson@email.com' },
  { id: 7, name: 'David Miller', age: 67, gender: 'male', medicalHistory: 'Arthritis, Osteoporosis', contactInfo: 'david.miller@email.com' },
  { id: 8, name: 'Lisa Anderson', age: 41, gender: 'female', medicalHistory: 'Depression, Anxiety', contactInfo: 'lisa.anderson@email.com' },
  { id: 9, name: 'James Taylor', age: 35, gender: 'male', medicalHistory: 'None', contactInfo: 'james.taylor@email.com' },
  { id: 10, name: 'Maria Garcia', age: 52, gender: 'female', medicalHistory: 'Thyroid disorder', contactInfo: 'maria.garcia@email.com' },
  { id: 11, name: 'Christopher Lee', age: 29, gender: 'male', medicalHistory: 'Asthma', contactInfo: 'christopher.lee@email.com' },
  { id: 12, name: 'Amanda White', age: 39, gender: 'female', medicalHistory: 'Pregnancy (32 weeks)', contactInfo: 'amanda.white@email.com' },
  { id: 13, name: 'Kevin Martinez', age: 44, gender: 'male', medicalHistory: 'Back injury', contactInfo: 'kevin.martinez@email.com' },
  { id: 14, name: 'Jennifer Clark', age: 33, gender: 'female', medicalHistory: 'PCOS', contactInfo: 'jennifer.clark@email.com' },
  { id: 15, name: 'Mark Rodriguez', age: 61, gender: 'male', medicalHistory: 'Prostate enlargement', contactInfo: 'mark.rodriguez@email.com' }
];

let doctors = [
  { id: 1, name: 'Dr. Alice Johnson', specialty: 'Cardiology', contactInfo: 'alice.johnson@hospital.com' },
  { id: 2, name: 'Dr. Bob Wilson', specialty: 'Dermatology', contactInfo: 'bob.wilson@hospital.com' },
  { id: 3, name: 'Dr. Carol Martinez', specialty: 'Endocrinology', contactInfo: 'carol.martinez@hospital.com' },
  { id: 4, name: 'Dr. David Chen', specialty: 'Neurology', contactInfo: 'david.chen@hospital.com' },
  { id: 5, name: 'Dr. Emma Thompson', specialty: 'Pediatrics', contactInfo: 'emma.thompson@hospital.com' },
  { id: 6, name: 'Dr. Frank Miller', specialty: 'Orthopedics', contactInfo: 'frank.miller@hospital.com' },
  { id: 7, name: 'Dr. Grace Lee', specialty: 'Psychiatry', contactInfo: 'grace.lee@hospital.com' },
  { id: 8, name: 'Dr. Henry Davis', specialty: 'Internal Medicine', contactInfo: 'henry.davis@hospital.com' },
  { id: 9, name: 'Dr. Isabel Garcia', specialty: 'Obstetrics & Gynecology', contactInfo: 'isabel.garcia@hospital.com' },
  { id: 10, name: 'Dr. Jack Robinson', specialty: 'Urology', contactInfo: 'jack.robinson@hospital.com' }
];

let appointments = [
  { id: 1, patientId: 1, doctorId: 8, date: '2025-09-20', time: '10:00', reason: 'Annual checkup', status: 'scheduled' },
  { id: 2, patientId: 2, doctorId: 2, date: '2025-09-21', time: '14:30', reason: 'Skin consultation', status: 'scheduled' },
  { id: 3, patientId: 3, doctorId: 3, date: '2025-09-22', time: '09:15', reason: 'Diabetes follow-up', status: 'scheduled' },
  { id: 4, patientId: 4, doctorId: 8, date: '2025-09-23', time: '11:00', reason: 'Allergy test results', status: 'scheduled' },
  { id: 5, patientId: 5, doctorId: 1, date: '2025-09-24', time: '13:45', reason: 'Cardiac evaluation', status: 'scheduled' },
  { id: 6, patientId: 6, doctorId: 4, date: '2025-09-25', time: '16:00', reason: 'Migraine consultation', status: 'scheduled' },
  { id: 7, patientId: 7, doctorId: 6, date: '2025-09-26', time: '08:30', reason: 'Joint pain assessment', status: 'scheduled' },
  { id: 8, patientId: 8, doctorId: 7, date: '2025-09-27', time: '15:15', reason: 'Mental health check', status: 'scheduled' },
  { id: 9, patientId: 9, doctorId: 8, date: '2025-09-28', time: '10:45', reason: 'Physical exam', status: 'scheduled' },
  { id: 10, patientId: 10, doctorId: 3, date: '2025-09-29', time: '12:30', reason: 'Thyroid monitoring', status: 'scheduled' },
  { id: 11, patientId: 11, doctorId: 8, date: '2025-09-18', time: '09:00', reason: 'Asthma review', status: 'completed' },
  { id: 12, patientId: 12, doctorId: 9, date: '2025-09-19', time: '14:00', reason: 'Prenatal checkup', status: 'completed' },
  { id: 13, patientId: 13, doctorId: 6, date: '2025-09-17', time: '11:30', reason: 'Back injury follow-up', status: 'completed' },
  { id: 14, patientId: 14, doctorId: 9, date: '2025-09-16', time: '16:45', reason: 'PCOS consultation', status: 'completed' },
  { id: 15, patientId: 15, doctorId: 10, date: '2025-09-15', time: '13:00', reason: 'Prostate examination', status: 'completed' },
  { id: 16, patientId: 3, doctorId: 1, date: '2025-10-01', time: '10:00', reason: 'Cardiac screening', status: 'scheduled' },
  { id: 17, patientId: 5, doctorId: 8, date: '2025-10-02', time: '15:30', reason: 'Blood pressure check', status: 'scheduled' },
  { id: 18, patientId: 1, doctorId: 2, date: '2025-09-14', time: '12:00', reason: 'Skin check', status: 'cancelled' },
  { id: 19, patientId: 7, doctorId: 7, date: '2025-09-13', time: '09:45', reason: 'Counseling session', status: 'cancelled' },
  { id: 20, patientId: 12, doctorId: 9, date: '2025-10-05', time: '11:15', reason: 'Prenatal scan', status: 'scheduled' }
];

let prescriptions = [
  { id: 1, patientId: 1, doctorId: 8, medication: 'Aspirin', dosage: '100mg', instructions: 'Once daily with food', dateIssued: '2025-09-15' },
  { id: 2, patientId: 2, doctorId: 2, medication: 'Hydrocortisone cream', dosage: '1%', instructions: 'Apply twice daily to affected area', dateIssued: '2025-09-15' },
  { id: 3, patientId: 3, doctorId: 3, medication: 'Metformin', dosage: '500mg', instructions: 'Twice daily with meals', dateIssued: '2025-09-10' },
  { id: 4, patientId: 3, doctorId: 1, medication: 'Lisinopril', dosage: '10mg', instructions: 'Once daily in the morning', dateIssued: '2025-09-10' },
  { id: 5, patientId: 4, doctorId: 8, medication: 'EpiPen', dosage: '0.3mg', instructions: 'Use only in case of severe allergic reaction', dateIssued: '2025-09-12' },
  { id: 6, patientId: 5, doctorId: 1, medication: 'Atorvastatin', dosage: '20mg', instructions: 'Once daily at bedtime', dateIssued: '2025-09-08' },
  { id: 7, patientId: 5, doctorId: 1, medication: 'Carvedilol', dosage: '6.25mg', instructions: 'Twice daily', dateIssued: '2025-09-08' },
  { id: 8, patientId: 6, doctorId: 4, medication: 'Sumatriptan', dosage: '50mg', instructions: 'As needed for migraine, max 2 per day', dateIssued: '2025-09-14' },
  { id: 9, patientId: 7, doctorId: 6, medication: 'Ibuprofen', dosage: '400mg', instructions: 'Three times daily with food', dateIssued: '2025-09-11' },
  { id: 10, patientId: 7, doctorId: 6, medication: 'Calcium carbonate', dosage: '500mg', instructions: 'Twice daily with meals', dateIssued: '2025-09-11' },
  { id: 11, patientId: 8, doctorId: 7, medication: 'Sertraline', dosage: '50mg', instructions: 'Once daily in the morning', dateIssued: '2025-09-09' },
  { id: 12, patientId: 8, doctorId: 7, medication: 'Lorazepam', dosage: '0.5mg', instructions: 'As needed for anxiety, max 3 per day', dateIssued: '2025-09-09' },
  { id: 13, patientId: 10, doctorId: 3, medication: 'Levothyroxine', dosage: '75mcg', instructions: 'Once daily on empty stomach', dateIssued: '2025-09-13' },
  { id: 14, patientId: 11, doctorId: 8, medication: 'Albuterol inhaler', dosage: '90mcg', instructions: '2 puffs every 4-6 hours as needed', dateIssued: '2025-09-18' },
  { id: 15, patientId: 12, doctorId: 9, medication: 'Prenatal vitamins', dosage: '1 tablet', instructions: 'Once daily', dateIssued: '2025-09-19' },
  { id: 16, patientId: 13, doctorId: 6, medication: 'Naproxen', dosage: '220mg', instructions: 'Twice daily with food', dateIssued: '2025-09-17' },
  { id: 17, patientId: 14, doctorId: 9, medication: 'Metformin', dosage: '500mg', instructions: 'Twice daily with meals', dateIssued: '2025-09-16' },
  { id: 18, patientId: 15, doctorId: 10, medication: 'Tamsulosin', dosage: '0.4mg', instructions: 'Once daily 30 minutes after the same meal', dateIssued: '2025-09-15' },
  { id: 19, patientId: 6, doctorId: 4, medication: 'Propranolol', dosage: '40mg', instructions: 'Twice daily for migraine prevention', dateIssued: '2025-09-14' },
  { id: 20, patientId: 2, doctorId: 8, medication: 'Montelukast', dosage: '10mg', instructions: 'Once daily in the evening', dateIssued: '2025-09-20' }
];

// Export data and utility functions
module.exports = {
  // Data arrays
  patients,
  doctors,
  appointments,
  prescriptions,
  
  // Getter functions
  getPatients: () => patients,
  getDoctors: () => doctors,
  getAppointments: () => appointments,
  getPrescriptions: () => prescriptions,
  
  // Setter functions
  setPatients: (newPatients) => { patients = newPatients; },
  setDoctors: (newDoctors) => { doctors = newDoctors; },
  setAppointments: (newAppointments) => { appointments = newAppointments; },
  setPrescriptions: (newPrescriptions) => { prescriptions = newPrescriptions; },
  
  // Statistics functions
  getStats: () => ({
    totalPatients: patients.length,
    totalDoctors: doctors.length,
    totalAppointments: appointments.length,
    totalPrescriptions: prescriptions.length,
    appointmentsByStatus: appointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1;
      return acc;
    }, {}),
    doctorsBySpecialty: doctors.reduce((acc, doc) => {
      acc[doc.specialty] = (acc[doc.specialty] || 0) + 1;
      return acc;
    }, {}),
    averagePatientAge: patients.length > 0 ? 
      Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length) : 0
  })
};