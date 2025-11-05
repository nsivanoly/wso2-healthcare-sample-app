import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeModeProvider, useThemeMode } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
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

// Create MUI theme with healthcare color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Medical green
      light: '#60AD5E',
      dark: '#1B5E20',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1976D2', // Professional blue
      light: '#42A5F5',
      dark: '#1565C0',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#ED6C02',
      light: '#FF9800',
      dark: '#E65100',
    },
    info: {
      main: '#0288D1',
      light: '#03DAC6',
      dark: '#01579B',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #2E7D32, #1976D2)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1B5E20, #1565C0)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#2E7D32',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2E7D32',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            {/* Patients routes */}
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/patients/:id/edit" element={<PatientForm />} />
            
            {/* Doctors routes */}
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/doctors/new" element={<DoctorForm />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/doctors/:id/edit" element={<DoctorForm />} />
            
            {/* Appointments routes */}
            <Route path="/appointments" element={<AppointmentsList />} />
            <Route path="/appointments/new" element={<AppointmentForm />} />
            <Route path="/appointments/:id" element={<AppointmentDetail />} />
            <Route path="/appointments/:id/edit" element={<AppointmentForm />} />
            
            {/* Prescriptions routes */}
            <Route path="/prescriptions" element={<PrescriptionsList />} />
            <Route path="/prescriptions/new" element={<PrescriptionForm />} />
            <Route path="/prescriptions/:id" element={<PrescriptionDetail />} />
            <Route path="/prescriptions/:id/edit" element={<PrescriptionForm />} />
          </Routes>
        </Layout>
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
}

export default App;
