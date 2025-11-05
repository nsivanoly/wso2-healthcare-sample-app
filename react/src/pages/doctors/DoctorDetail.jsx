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
  Phone,
  Email,
  LocalHospital,
  Badge,
  Delete,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doctorsAPI } from '../../services/apiServices';

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

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchDoctor();
    }
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await doctorsAPI.getById(id);
      
      // Handle different response structures
      let doctorData = null;
      if (response.data) {
        doctorData = response.data;
      } else if (response.id) {
        doctorData = response;
      }
      
      if (!doctorData) {
        throw new Error('Doctor not found');
      }
      
      setDoctor(doctorData);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      setError('Failed to load doctor details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/doctors/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete doctor "${doctor.name}"? This action cannot be undone.`)) {
      try {
        await doctorsAPI.delete(id);
        toast.success('Doctor deleted successfully');
        navigate('/doctors');
      } catch (error) {
        console.error('Error deleting doctor:', error);
        toast.error('Failed to delete doctor');
      }
    }
  };

  const getSpecialtyChipColor = (specialty) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info'];
    const index = specialty?.length % colors.length || 0;
    return colors[index];
  };

  const formatContactInfo = (contactInfo) => {
    if (!contactInfo) return null;
    
    // Check if it's an email
    if (contactInfo.includes('@')) {
      return (
        <Box display="flex" alignItems="center" mb={1}>
          <Email sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            <a href={`mailto:${contactInfo}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {contactInfo}
            </a>
          </Typography>
        </Box>
      );
    }
    
    // Check if it's a phone number (contains digits and common phone separators)
    if (/[\d\-\(\)\+\s]/.test(contactInfo)) {
      return (
        <Box display="flex" alignItems="center" mb={1}>
          <Phone sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            <a href={`tel:${contactInfo}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {contactInfo}
            </a>
          </Typography>
        </Box>
      );
    }
    
    // Default display
    return (
      <Typography variant="body2" mb={1}>
        {contactInfo}
      </Typography>
    );
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
          <IconButton onClick={() => navigate('/doctors')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Doctor Details
          </Typography>
        </Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/doctors')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Doctor Details
          </Typography>
        </Box>
        <Alert severity="warning">Doctor not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/doctors')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Doctor Details
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

      {/* Doctor Name and Basic Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <LocalHospital sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h2" gutterBottom>
              {doctor.name}
            </Typography>
            <Chip 
              label={doctor.specialty || 'Not specified'} 
              color={getSpecialtyChipColor(doctor.specialty)}
              size="large"
            />
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Doctor ID: {doctor.id}
        </Typography>
      </Paper>

      {/* Detailed Information Cards */}
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <InfoCard 
            title="Basic Information" 
            icon={<Badge color="primary" />}
          >
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Full Name
              </Typography>
              <Typography variant="body1">
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
                Doctor ID
              </Typography>
              <Typography variant="body1">
                {doctor.id}
              </Typography>
            </Box>
          </InfoCard>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <InfoCard 
            title="Contact Information" 
            icon={<Phone color="primary" />}
          >
            {doctor.contactInfo ? (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Contact Details
                </Typography>
                {formatContactInfo(doctor.contactInfo)}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No contact information available
              </Typography>
            )}
          </InfoCard>
        </Grid>

        {/* Additional Information */}
        <Grid item xs={12}>
          <InfoCard 
            title="Professional Details" 
            icon={<LocalHospital color="primary" />}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Name
                </Typography>
                <Typography variant="body1">
                  {doctor.name}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Specialty
                </Typography>
                <Typography variant="body1">
                  {doctor.specialty || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Contact
                </Typography>
                <Typography variant="body1" noWrap>
                  {doctor.contactInfo || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  ID
                </Typography>
                <Typography variant="body1">
                  {doctor.id}
                </Typography>
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>
      </Grid>
    </Box>
  );
}