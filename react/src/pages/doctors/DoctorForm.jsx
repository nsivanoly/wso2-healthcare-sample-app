import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { 
  ArrowBack, 
  Save, 
  LocalHospital, 
  ContactPhone, 
  MedicalServices, 
  Badge,
  Person,
  School,
  Cancel,
  Verified
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { doctorsAPI } from '../../services/apiServices';

// Validation schema based on Swagger specs
const schema = yup.object({
  name: yup.string().required('Name is required'),
  specialty: yup.string().required('Specialty is required'),
  contactInfo: yup.string().required('Contact info is required'),
});

const specialties = [
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Family Medicine',
  'Gastroenterology',
  'General Surgery',
  'Internal Medicine',
  'Neurology',
  'Obstetrics and Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Urology',
  'Other'
];

export default function DoctorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Personal Information', 'Professional Details', 'Contact Information'];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      specialty: '',
      contactInfo: '',
    },
  });

  useEffect(() => {
    if (isEdit) {
      fetchDoctor();
    }
  }, [id, isEdit]);

  const fetchDoctor = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const response = await doctorsAPI.getById(id);
      
      let doctorData = null;
      if (response.data) {
        doctorData = response.data;
      } else if (response.id) {
        doctorData = response;
      }
      
      if (doctorData) {
        reset({
          name: doctorData.name || '',
          specialty: doctorData.specialty || '',
          contactInfo: doctorData.contactInfo || '',
        });
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      setError('Failed to load doctor data. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const doctorData = {
        name: data.name,
        specialty: data.specialty,
        contactInfo: data.contactInfo,
      };

      if (isEdit) {
        await doctorsAPI.update(id, doctorData);
        toast.success('Doctor updated successfully');
      } else {
        await doctorsAPI.create(doctorData);
        toast.success('Doctor created successfully');
      }
      
      navigate('/doctors');
    } catch (error) {
      console.error('Error saving doctor:', error);
      setError(error.message || 'Failed to save doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const watchedValues = watch();
  const isBasicComplete = watchedValues.name;
  const isProfessionalComplete = watchedValues.specialty;
  const isContactComplete = watchedValues.contactInfo;

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
              }
              title="Personal Information"
              subheader="Doctor's personal details"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Doctor's Full Name"
                        placeholder="Enter doctor's full name (e.g., Dr. John Smith)"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        InputProps={{
                          startAdornment: <Badge sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                    <Chip 
                      icon={<Person />} 
                      label={isBasicComplete ? "Personal info complete" : "Enter doctor's name"} 
                      color={isBasicComplete ? "success" : "default"}
                      variant={isBasicComplete ? "filled" : "outlined"}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <MedicalServices />
                </Avatar>
              }
              title="Professional Details"
              subheader="Medical specialty and professional information"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="specialty"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.specialty}>
                        <InputLabel>Medical Specialty</InputLabel>
                        <Select
                          {...field}
                          label="Medical Specialty"
                          startAdornment={<School sx={{ mr: 1, color: 'action.active' }} />}
                        >
                          {specialties.map((specialty) => (
                            <MenuItem key={specialty} value={specialty}>
                              {specialty}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.specialty && (
                          <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                            {errors.specialty.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                    <Chip 
                      icon={<Verified />} 
                      label={isProfessionalComplete ? "Professional details complete" : "Select medical specialty"} 
                      color={isProfessionalComplete ? "success" : "default"}
                      variant={isProfessionalComplete ? "filled" : "outlined"}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <ContactPhone />
                </Avatar>
              }
              title="Contact Information"
              subheader="How to reach the doctor"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="contactInfo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Contact Information"
                        placeholder="Phone number, email, or pager (e.g., +1-555-123-4567, doctor@hospital.com)"
                        error={!!errors.contactInfo}
                        helperText={errors.contactInfo?.message || "Primary contact method for appointments and consultations"}
                        InputProps={{
                          startAdornment: <ContactPhone sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'success.main',
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                    <Chip 
                      icon={<ContactPhone />} 
                      label={isContactComplete ? "Contact info complete" : "Add contact information"} 
                      color={isContactComplete ? "success" : "default"}
                      variant={isContactComplete ? "filled" : "outlined"}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      default:
        return 'Unknown step';
    }
  };

  if (fetchLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton
          onClick={() => navigate('/doctors')}
          sx={{ 
            mr: 2,
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' }
          }}
        >
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {isEdit ? 'Edit Doctor' : 'Add New Doctor'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEdit ? 'Update doctor information' : 'Register a new medical professional'}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Progress Stepper */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default', boxShadow: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {getStepContent(activeStep)}

        {/* Navigation Buttons */}
        <Paper sx={{ p: 3, bgcolor: 'background.paper', boxShadow: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(activeStep - 1)}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
            </Box>
            
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => navigate('/doctors')}
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
              
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(activeStep + 1)}
                  sx={{ minWidth: 120 }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={isSubmitting}
                  sx={{ 
                    minWidth: 120,
                    bgcolor: 'success.main',
                    '&:hover': { bgcolor: 'success.dark' }
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    isEdit ? 'Update Doctor' : 'Register Doctor'
                  )}
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </form>
    </Box>
  );
}