import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
} from '@mui/material';
import { 
  ArrowBack, 
  Save, 
  Person, 
  ContactPhone, 
  MedicalServices, 
  Badge,
  Cake,
  Wc,
  History,
  Cancel
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { patientsAPI } from '../../services/apiServices';

// Validation schema based on Swagger specs
const schema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number()
    .required('Age is required')
    .min(0, 'Age must be 0 or greater')
    .integer('Age must be a whole number'),
  gender: yup.string().required('Gender is required'),
  medicalHistory: yup.string().required('Medical history is required'),
  contactInfo: yup.string().required('Contact info is required'),
});

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Basic Information', 'Medical Details', 'Contact Information'];

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
      age: '',
      gender: '',
      medicalHistory: '',
      contactInfo: '',
    },
  });

  useEffect(() => {
    if (isEdit) {
      fetchPatient();
    }
  }, [id, isEdit]);

  const fetchPatient = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const response = await patientsAPI.getById(id);
      
      let patientData = null;
      if (response.data) {
        patientData = response.data;
      } else if (response.id) {
        patientData = response;
      }
      
      if (patientData) {
        reset({
          name: patientData.name || '',
          age: patientData.age || '',
          gender: patientData.gender || '',
          medicalHistory: patientData.medicalHistory || '',
          contactInfo: patientData.contactInfo || '',
        });
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      setError('Failed to load patient data. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const patientData = {
        name: data.name,
        age: parseInt(data.age),
        gender: data.gender,
        medicalHistory: data.medicalHistory,
        contactInfo: data.contactInfo,
      };

      if (isEdit) {
        await patientsAPI.update(id, patientData);
        toast.success('Patient updated successfully');
      } else {
        await patientsAPI.create(patientData);
        toast.success('Patient created successfully');
      }
      
      navigate('/patients');
    } catch (error) {
      console.error('Error saving patient:', error);
      setError(error.message || 'Failed to save patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const watchedValues = watch();
  const isFormValid = watchedValues.name && watchedValues.age && watchedValues.gender;

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
              title="Basic Information"
              subheader="Essential patient details"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Full Name"
                        placeholder="Enter patient's full name"
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

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="age"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Age"
                        type="number"
                        placeholder="Enter age"
                        error={!!errors.age}
                        helperText={errors.age?.message}
                        InputProps={{
                          startAdornment: <Cake sx={{ mr: 1, color: 'action.active' }} />,
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

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.gender}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          {...field}
                          label="Gender"
                          startAdornment={<Wc sx={{ mr: 1, color: 'action.active' }} />}
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                        {errors.gender && (
                          <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                            {errors.gender.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <Chip 
                      icon={<Person />} 
                      label={isFormValid ? "Basic info complete" : "Fill basic information"} 
                      color={isFormValid ? "success" : "default"}
                      variant={isFormValid ? "filled" : "outlined"}
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
              title="Medical Details"
              subheader="Patient's medical history and health information"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="medicalHistory"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Medical History"
                        placeholder="Enter detailed medical history, conditions, allergies, etc."
                        multiline
                        rows={4}
                        error={!!errors.medicalHistory}
                        helperText={errors.medicalHistory?.message || "Include any chronic conditions, allergies, previous surgeries, medications, etc."}
                        InputProps={{
                          startAdornment: (
                            <History sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'secondary.main',
                            },
                          },
                        }}
                      />
                    )}
                  />
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
              subheader="How to reach the patient"
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
                        placeholder="Phone number, email, or primary contact method"
                        error={!!errors.contactInfo}
                        helperText={errors.contactInfo?.message || "Primary contact method (phone, email, etc.)"}
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
          onClick={() => navigate('/patients')}
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
            {isEdit ? 'Edit Patient' : 'Add New Patient'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEdit ? 'Update patient information' : 'Create a new patient record'}
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
                onClick={() => navigate('/patients')}
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
                    isEdit ? 'Update Patient' : 'Create Patient'
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