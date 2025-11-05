import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Event,
  Person,
  LocalHospital,
  AccessTime,
  Description,
  Badge,
  Delete,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appointmentsAPI, patientsAPI, doctorsAPI } from '../../services/apiServices';

const InfoCard = ({ title, icon, children }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch appointment details
      const appointmentResponse = await appointmentsAPI.getById(id);
      
      let appointmentData = null;
      if (appointmentResponse.data) {
        appointmentData = appointmentResponse.data;
      } else if (appointmentResponse.id) {
        appointmentData = appointmentResponse;
      }
      
      if (!appointmentData) {
        throw new Error('Appointment not found');
      }
      
      setAppointment(appointmentData);
      
      // Fetch related patient and doctor data
      try {
        if (appointmentData.patientId) {
          const patientResponse = await patientsAPI.getById(appointmentData.patientId);
          setPatient(patientResponse.data || patientResponse);
        }
      } catch (err) {
        console.warn('Could not fetch patient details:', err);
      }
      
      try {
        if (appointmentData.doctorId) {
          const doctorResponse = await doctorsAPI.getById(appointmentData.doctorId);
          setDoctor(doctorResponse.data || doctorResponse);
        }
      } catch (err) {
        console.warn('Could not fetch doctor details:', err);
      }
      
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError('Failed to load appointment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/appointments/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      try {
        await appointmentsAPI.delete(id);
        toast.success('Appointment deleted successfully');
        navigate('/appointments');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        toast.error('Failed to delete appointment');
      }
    }
  };

  const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'in-progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/appointments')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Appointment Details
          </Typography>
        </Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!appointment) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/appointments')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Appointment Details
          </Typography>
        </Box>
        <Alert severity="warning">Appointment not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/appointments')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Appointment Details
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Appointment Overview */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Event sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {formatDate(appointment.date)}
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip 
                label={appointment.status || 'scheduled'} 
                color={getStatusChipColor(appointment.status)}
                size="large"
              />
              <Typography variant="h6" color="text.secondary">
                {formatTime(appointment.time)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Appointment ID: {appointment.id}
        </Typography>
      </Paper>

      {/* Detailed Information Cards */}
      <Grid container spacing={3}>
        {/* Patient Information */}
        <Grid item xs={12} md={6}>
          <InfoCard 
            title="Patient Information" 
            icon={<Person color="primary" />}
          >
            {patient ? (
              <>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Patient Name
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {patient.name}
                  </Typography>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Age
                  </Typography>
                  <Typography variant="body1">
                    {patient.age} years old
                  </Typography>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Gender
                  </Typography>
                  <Typography variant="body1">
                    {patient.gender}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Contact
                  </Typography>
                  <Typography variant="body1">
                    {patient.contactInfo}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Patient ID: {appointment.patientId}
              </Typography>
            )}
          </InfoCard>
        </Grid>

        {/* Doctor Information */}
        <Grid item xs={12} md={6}>
          <InfoCard 
            title="Doctor Information" 
            icon={<LocalHospital color="primary" />}
          >
            {doctor ? (
              <>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Doctor Name
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {doctor.name}
                  </Typography>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Specialty
                  </Typography>
                  <Typography variant="body1">
                    {doctor.specialty || 'Not specified'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Contact
                  </Typography>
                  <Typography variant="body1">
                    {doctor.contactInfo || 'Not available'}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Doctor ID: {appointment.doctorId}
              </Typography>
            )}
          </InfoCard>
        </Grid>

        {/* Appointment Details */}
        <Grid item xs={12} md={6}>
          <InfoCard 
            title="Appointment Details" 
            icon={<AccessTime color="primary" />}
          >
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Date
              </Typography>
              <Typography variant="body1">
                {formatDate(appointment.date)}
              </Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Time
              </Typography>
              <Typography variant="body1">
                {formatTime(appointment.time)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Chip 
                label={appointment.status || 'scheduled'} 
                color={getStatusChipColor(appointment.status)}
                size="medium"
              />
            </Box>
          </InfoCard>
        </Grid>

        {/* Reason for Visit */}
        <Grid item xs={12} md={6}>
          <InfoCard 
            title="Reason for Visit" 
            icon={<Description color="primary" />}
          >
            <Typography variant="body1">
              {appointment.reason || 'No reason specified'}
            </Typography>
          </InfoCard>
        </Grid>

        {/* Summary Information */}
        <Grid item xs={12}>
          <InfoCard 
            title="Summary" 
            icon={<Badge color="primary" />}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Appointment ID
                </Typography>
                <Typography variant="body1">
                  {appointment.id}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Patient
                </Typography>
                <Typography variant="body1">
                  {patient?.name || `ID: ${appointment.patientId}`}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Doctor
                </Typography>
                <Typography variant="body1">
                  {doctor?.name || `ID: ${appointment.doctorId}`}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Date & Time
                </Typography>
                <Typography variant="body1">
                  {formatDate(appointment.date)}
                  <br />
                  {formatTime(appointment.time)}
                </Typography>
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>
      </Grid>
    </Box>
  );
}