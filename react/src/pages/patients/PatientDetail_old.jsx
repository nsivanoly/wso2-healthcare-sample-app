import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Phone,
  Email,
  Cake,
  Person,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { patientsAPI } from '../../services/apiServices';

const InfoRow = ({ icon: Icon, label, value }) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Icon sx={{ mr: 2, color: 'text.secondary' }} />
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || 'Not provided'}</Typography>
    </Box>
  </Box>
);

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientsAPI.getById(id);
      setPatient(response.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
      setError('Failed to load patient details.');
    } finally {
      setLoading(false);
    }
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/patients')}>
          Back to Patients
        </Button>
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box>
        <Alert severity="info" sx={{ mb: 2 }}>
          Patient not found.
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/patients')}>
          Back to Patients
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/patients')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Patient Details
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/patients/${id}/edit`)}
        >
          Edit Patient
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {patient.firstName} {patient.lastName}
            </Typography>
            
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <InfoRow
                  icon={Person}
                  label="Full Name"
                  value={`${patient.firstName || ''} ${patient.lastName || ''}`.trim()}
                />
                <InfoRow
                  icon={Email}
                  label="Email"
                  value={patient.email}
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={patient.phone}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <InfoRow
                  icon={Cake}
                  label="Date of Birth"
                  value={patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : null}
                />
                <Box display="flex" alignItems="center" mb={2}>
                  <Person sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gender
                    </Typography>
                    <Chip 
                      label={patient.gender || 'Not specified'} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {patient.emergencyContact && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Emergency Contact
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={Person}
                      label="Contact Name"
                      value={patient.emergencyContact.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={Phone}
                      label="Contact Phone"
                      value={patient.emergencyContact.phone}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Patient Information
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Patient ID: {patient.id}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Created: {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'Unknown'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Updated: {patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString() : 'Unknown'}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate(`/appointments/new?patientId=${patient.id}`)}
                >
                  Schedule Appointment
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate(`/prescriptions/new?patientId=${patient.id}`)}
                >
                  Create Prescription
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate(`/prescriptions?patientId=${patient.id}`)}
                >
                  View Prescriptions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}