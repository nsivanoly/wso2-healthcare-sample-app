import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider as AsgardeoAuthProvider, useAuthContext } from "@asgardeo/auth-react";

import { ThemeModeProvider, useThemeMode } from './contexts/ThemeContext';
import { HealthcareAuthProvider, useAuth } from './contexts/HealthcareAuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientsList from './pages/patients/PatientsList';
import PatientDetail from './pages/patients/PatientDetail';
import PatientForm from './pages/patients/PatientForm';
import DoctorsList from './pages/doctors/DoctorsList';
import DoctorDetail from './pages/doctors/DoctorDetail';
import DoctorForm from './pages/doctors/DoctorForm';
import AppointmentsList from './pages/appointments/AppointmentsList';
import AppointmentDetail from './pages/appointments/AppointmentDetail';
import AppointmentForm from './pages/appointments/AppointmentForm';
import PrescriptionsList from './pages/prescriptions/PrescriptionsList';
import PrescriptionDetail from './pages/prescriptions/PrescriptionDetail';
import PrescriptionForm from './pages/prescriptions/PrescriptionForm';
import { AppConfig } from './config';

// App content component that uses the theme
const AppContent = () => {
  const { theme } = useThemeMode();
  const { error } = useAuthContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes - all wrapped in Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Patients routes */}
          <Route path="/patients" element={
            <ProtectedRoute>
              <Layout>
                <PatientsList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patients/new" element={
            <ProtectedRoute>
              <Layout>
                <PatientForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patients/:id" element={
            <ProtectedRoute>
              <Layout>
                <PatientDetail />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patients/:id/edit" element={
            <ProtectedRoute>
              <Layout>
                <PatientForm />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Doctors routes */}
          <Route path="/doctors" element={
            <ProtectedRoute>
              <Layout>
                <DoctorsList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/doctors/new" element={
            <ProtectedRoute>
              <Layout>
                <DoctorForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/doctors/:id" element={
            <ProtectedRoute>
              <Layout>
                <DoctorDetail />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/doctors/:id/edit" element={
            <ProtectedRoute>
              <Layout>
                <DoctorForm />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Appointments routes */}
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Layout>
                <AppointmentsList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/appointments/new" element={
            <ProtectedRoute>
              <Layout>
                <AppointmentForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/appointments/:id" element={
            <ProtectedRoute>
              <Layout>
                <AppointmentDetail />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/appointments/:id/edit" element={
            <ProtectedRoute>
              <Layout>
                <AppointmentForm />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Prescriptions routes */}
          <Route path="/prescriptions" element={
            <ProtectedRoute>
              <Layout>
                <PrescriptionsList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/prescriptions/new" element={
            <ProtectedRoute>
              <Layout>
                <PrescriptionForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/prescriptions/:id" element={
            <ProtectedRoute>
              <Layout>
                <PrescriptionDetail />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/prescriptions/:id/edit" element={
            <ProtectedRoute>
              <Layout>
                <PrescriptionForm />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AsgardeoAuthProvider config={AppConfig.AuthConfig}>
      <HealthcareAuthProvider>
        <ThemeModeProvider>
          <AppContent />
        </ThemeModeProvider>
      </HealthcareAuthProvider>
    </AsgardeoAuthProvider>
  );
}

export default App;