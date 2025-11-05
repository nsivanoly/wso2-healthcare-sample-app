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
  Person,
  Email,
  MedicalServices,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { patientsAPI } from '../../services/apiServices';

const InfoCard = ({ title, children }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom color="primary">
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

const InfoRow = ({ icon: Icon, label, value, chip }) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Icon sx={{ mr: 2, color: 'text.secondary' }} />
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      {chip ? (
        <Chip label={value || 'Not specified'} size="small" color="primary" variant="outlined" />
      ) : (
        <Typography variant="body1">{value || 'Not provided'}</Typography>
      )}
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
        <Alert severity="warning" sx={{ mb: 2 }}>
          Patient not found.
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/patients')}>
          Back to Patients
        </Button>
      </Box>
    );
  }

  const getGenderChipColor = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male': return 'primary';
      case 'female': return 'secondary';
      case 'other': return 'default';
      default: return 'default';
    }
  };

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
        <Grid item xs={12} md={6}>
          <InfoCard title="Personal Information">
            <InfoRow
              icon={Person}
              label="Full Name"
              value={patient.name}
            />
            <InfoRow
              icon={Person}
              label="Age"
              value={`${patient.age} years old`}
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
                  color={getGenderChipColor(patient.gender)}
                  variant="outlined"
                />
              </Box>
            </Box>
            <InfoRow
              icon={Email}
              label="Contact Information"
              value={patient.contactInfo}
            />
          </InfoCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoCard title="Medical Information">
            <Box display="flex" alignItems="flex-start" mb={2}>
              <MedicalServices sx={{ mr: 2, color: 'text.secondary', mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Medical History
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {patient.medicalHistory || 'No medical history available'}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </InfoCard>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => navigate('/patients')}
        >
          Back to List
        </Button>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/patients/${id}/edit`)}
        >
          Edit Patient
        </Button>
      </Box>
    </Box>
  );
}