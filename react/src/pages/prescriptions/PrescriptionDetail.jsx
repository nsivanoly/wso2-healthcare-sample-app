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
  Medication,
  Person,
  LocalHospital,
  Schedule,
  Description,
  Badge,
  Delete,
  DateRange,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { prescriptionsAPI, patientsAPI, doctorsAPI } from '../../services/apiServices';

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

export default function PrescriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPrescription();
    }
  }, [id]);

  const fetchPrescription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch prescription details
      const prescriptionResponse = await prescriptionsAPI.getById(id);
      
      let prescriptionData = null;
      if (prescriptionResponse.data) {
        prescriptionData = prescriptionResponse.data;
      } else if (prescriptionResponse.id) {
        prescriptionData = prescriptionResponse;
      }
      
      if (!prescriptionData) {
        throw new Error('Prescription not found');
      }
      
      setPrescription(prescriptionData);
      
      // Fetch related patient and doctor data
      try {
        if (prescriptionData.patientId) {
          const patientResponse = await patientsAPI.getById(prescriptionData.patientId);
          setPatient(patientResponse.data || patientResponse);
        }
      } catch (err) {
        console.warn('Could not fetch patient details:', err);
      }
      
      try {
        if (prescriptionData.doctorId) {
          const doctorResponse = await doctorsAPI.getById(prescriptionData.doctorId);
          setDoctor(doctorResponse.data || doctorResponse);
        }
      } catch (err) {
        console.warn('Could not fetch doctor details:', err);
      }
      
    } catch (error) {
      console.error('Error fetching prescription:', error);
      setError('Failed to load prescription details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/prescriptions/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this prescription? This action cannot be undone.')) {
      try {
        await prescriptionsAPI.delete(id);
        toast.success('Prescription deleted successfully');
        navigate('/prescriptions');
      } catch (error) {
        console.error('Error deleting prescription:', error);
        toast.error('Failed to delete prescription');
      }
    }
  };

  const getMedicationChipColor = (medication) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];
    const index = medication?.length % colors.length || 0;
    return colors[index];
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
          <IconButton onClick={() => navigate('/prescriptions')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Prescription Details
          </Typography>
        </Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!prescription) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/prescriptions')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Prescription Details
          </Typography>
        </Box>
        <Alert severity="warning">Prescription not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/prescriptions')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Prescription Details
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

      {/* Prescription Overview */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Medication sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h2" gutterBottom>
              {prescription.medication || 'Not specified'}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Chip 
                label={prescription.dosage || 'Not specified'} 
                color={getMedicationChipColor(prescription.medication)}
                size="large"
              />
              <Typography variant="h6" color="text.secondary">
                Issued: {formatDate(prescription.dateIssued)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Prescription ID: {prescription.id}
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
                Patient ID: {prescription.patientId}
              </Typography>
            )}
          </InfoCard>
        </Grid>

        {/* Doctor Information */}
        <Grid item xs={12} md={6}>
          <InfoCard 
            title="Prescribing Doctor" 
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
                Doctor ID: {prescription.doctorId}
              </Typography>
            )}
          </InfoCard>
        </Grid>

        {/* Medication Details */}
        <Grid item xs={12} md={6}>
          <InfoCard 
            title="Medication Details" 
            icon={<Medication color="primary" />}
          >
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Medication
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {prescription.medication || 'Not specified'}
              </Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Dosage
              </Typography>
              <Typography variant="body1">
                {prescription.dosage || 'Not specified'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Date Issued
              </Typography>
              <Typography variant="body1">
                {formatDate(prescription.dateIssued)}
              </Typography>
            </Box>
          </InfoCard>
        </Grid>

        {/* Instructions */}
        <Grid item xs={12} md={6}>
          <InfoCard 
            title="Instructions" 
            icon={<Description color="primary" />}
          >
            <Typography variant="body1">
              {prescription.instructions || 'No specific instructions provided'}
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
                  Prescription ID
                </Typography>
                <Typography variant="body1">
                  {prescription.id}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Patient
                </Typography>
                <Typography variant="body1">
                  {patient?.name || `ID: ${prescription.patientId}`}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Doctor
                </Typography>
                <Typography variant="body1">
                  {doctor?.name || `ID: ${prescription.doctorId}`}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Date Issued
                </Typography>
                <Typography variant="body1">
                  {formatDate(prescription.dateIssued)}
                </Typography>
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>
      </Grid>
    </Box>
  );
}