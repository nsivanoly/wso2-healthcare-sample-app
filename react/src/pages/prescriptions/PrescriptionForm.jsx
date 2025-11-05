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
  Autocomplete,
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
  Medication, 
  Person, 
  LocalHospital, 
  Schedule,
  Description,
  Badge,
  DateRange,
  LocalPharmacy,
  Timer,
  Info,
  Cancel,
  CheckCircle
} from '@mui/icons-material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { prescriptionsAPI, patientsAPI, doctorsAPI } from '../../services/apiServices';

// Validation schema
const schema = yup.object({
  patientId: yup.string().required('Patient is required'),
  doctorId: yup.string().required('Doctor is required'),
  medication: yup.string().required('Medication is required'),
  dosage: yup.string().required('Dosage is required'),
  instructions: yup.string().required('Instructions are required'),
  dateIssued: yup.string().required('Date issued is required'),
});

const commonMedications = [
  'Acetaminophen (Tylenol)',
  'Ibuprofen (Advil, Motrin)',
  'Aspirin',
  'Lisinopril',
  'Metformin',
  'Amlodipine',
  'Omeprazole',
  'Simvastatin',
  'Levothyroxine',
  'Azithromycin',
  'Amoxicillin',
  'Prednisone',
  'Albuterol',
  'Gabapentin',
  'Hydrochlorothiazide',
  'Other'
];

const commonDosages = [
  '5mg once daily',
  '10mg once daily',
  '25mg twice daily',
  '50mg twice daily',
  '100mg three times daily',
  '250mg twice daily',
  '500mg twice daily',
  '1000mg once daily',
  'As needed',
  'Other'
];

export default function PrescriptionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Select Patient & Doctor', 'Medication Details', 'Instructions & Date'];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      patientId: '',
      doctorId: '',
      medication: '',
      dosage: '',
      instructions: '',
      dateIssued: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    fetchInitialData();
    if (isEdit) {
      fetchPrescription();
    }
  }, [id, isEdit]);

  const fetchInitialData = async () => {
    try {
      const [patientsResponse, doctorsResponse] = await Promise.all([
        patientsAPI.getAll().catch(() => ({ data: [] })),
        doctorsAPI.getAll().catch(() => ({ data: [] }))
      ]);
      
      let patientsData = [];
      if (Array.isArray(patientsResponse)) {
        patientsData = patientsResponse;
      } else if (patientsResponse.data && Array.isArray(patientsResponse.data)) {
        patientsData = patientsResponse.data;
      }
      
      let doctorsData = [];
      if (Array.isArray(doctorsResponse)) {
        doctorsData = doctorsResponse;
      } else if (doctorsResponse.data && Array.isArray(doctorsResponse.data)) {
        doctorsData = doctorsResponse.data;
      }
      
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchPrescription = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const response = await prescriptionsAPI.getById(id);
      
      let prescriptionData = null;
      if (response.data) {
        prescriptionData = response.data;
      } else if (response.id) {
        prescriptionData = response;
      }
      
      if (prescriptionData) {
        reset({
          patientId: prescriptionData.patientId?.toString() || '',
          doctorId: prescriptionData.doctorId?.toString() || '',
          medication: prescriptionData.medication || '',
          dosage: prescriptionData.dosage || '',
          instructions: prescriptionData.instructions || '',
          dateIssued: prescriptionData.dateIssued ? prescriptionData.dateIssued.split('T')[0] : new Date().toISOString().split('T')[0],
        });
      }
    } catch (error) {
      console.error('Error fetching prescription:', error);
      setError('Failed to load prescription data. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const prescriptionData = {
        patientId: parseInt(data.patientId),
        doctorId: parseInt(data.doctorId),
        medication: data.medication,
        dosage: data.dosage,
        instructions: data.instructions,
        dateIssued: data.dateIssued,
      };

      if (isEdit) {
        await prescriptionsAPI.update(id, prescriptionData);
        toast.success('Prescription updated successfully');
      } else {
        await prescriptionsAPI.create(prescriptionData);
        toast.success('Prescription created successfully');
      }
      
      navigate('/prescriptions');
    } catch (error) {
      console.error('Error saving prescription:', error);
      setError(error.message || 'Failed to save prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const watchedValues = watch();
  const isStep1Complete = watchedValues.patientId && watchedValues.doctorId;
  const isStep2Complete = watchedValues.medication && watchedValues.dosage;
  const isStep3Complete = watchedValues.instructions && watchedValues.dateIssued;

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
              title="Select Patient & Doctor"
              subheader="Choose who the prescription is for and who is prescribing"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="patientId"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={patients}
                        getOptionLabel={(option) => option.name || ''}
                        value={patients.find(p => p.id?.toString() === field.value) || null}
                        onChange={(_, newValue) => field.onChange(newValue?.id?.toString() || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Patient"
                            placeholder="Select a patient"
                            error={!!errors.patientId}
                            helperText={errors.patientId?.message}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {option.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Age: {option.age}, Gender: {option.gender}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="doctorId"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={doctors}
                        getOptionLabel={(option) => option.name || ''}
                        value={doctors.find(d => d.id?.toString() === field.value) || null}
                        onChange={(_, newValue) => field.onChange(newValue?.id?.toString() || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Prescribing Doctor"
                            placeholder="Select a doctor"
                            error={!!errors.doctorId}
                            helperText={errors.doctorId?.message}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <LocalHospital sx={{ mr: 1, color: 'action.active' }} />,
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {option.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Specialty: {option.specialty}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                    <Chip 
                      icon={<CheckCircle />} 
                      label={isStep1Complete ? "Patient and doctor selected" : "Select patient and doctor"} 
                      color={isStep1Complete ? "success" : "default"}
                      variant={isStep1Complete ? "filled" : "outlined"}
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
                  <LocalPharmacy />
                </Avatar>
              }
              title="Medication Details"
              subheader="Specify the medication and dosage"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="medication"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={commonMedications}
                        freeSolo
                        value={field.value}
                        onChange={(_, newValue) => field.onChange(newValue || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Medication"
                            placeholder="Enter or select medication name"
                            error={!!errors.medication}
                            helperText={errors.medication?.message || "Type to search or enter custom medication"}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <Medication sx={{ mr: 1, color: 'action.active' }} />,
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
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="dosage"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={commonDosages}
                        freeSolo
                        value={field.value}
                        onChange={(_, newValue) => field.onChange(newValue || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Dosage"
                            placeholder="Enter or select dosage (e.g., 500mg twice daily)"
                            error={!!errors.dosage}
                            helperText={errors.dosage?.message || "Specify the strength and frequency"}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <Timer sx={{ mr: 1, color: 'action.active' }} />,
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
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                    <Chip 
                      icon={<LocalPharmacy />} 
                      label={isStep2Complete ? "Medication details complete" : "Enter medication and dosage"} 
                      color={isStep2Complete ? "success" : "default"}
                      variant={isStep2Complete ? "filled" : "outlined"}
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
                  <Description />
                </Avatar>
              }
              title="Instructions & Date"
              subheader="Add usage instructions and prescription date"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="instructions"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Instructions"
                        placeholder="Enter detailed instructions for the patient (e.g., Take with food, Avoid alcohol, etc.)"
                        multiline
                        rows={4}
                        error={!!errors.instructions}
                        helperText={errors.instructions?.message || "Provide clear instructions for proper medication use"}
                        InputProps={{
                          startAdornment: (
                            <Info sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />
                          ),
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

                <Grid item xs={12} md={6}>
                  <Controller
                    name="dateIssued"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Date Issued"
                        type="date"
                        error={!!errors.dateIssued}
                        helperText={errors.dateIssued?.message}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: <DateRange sx={{ mr: 1, color: 'action.active' }} />,
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

                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <Chip 
                      icon={<Schedule />} 
                      label={isStep3Complete ? "Prescription complete" : "Add instructions and date"} 
                      color={isStep3Complete ? "success" : "default"}
                      variant={isStep3Complete ? "filled" : "outlined"}
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
          onClick={() => navigate('/prescriptions')}
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
            {isEdit ? 'Edit Prescription' : 'Create New Prescription'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEdit ? 'Update prescription information' : 'Issue a new medication prescription'}
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
                onClick={() => navigate('/prescriptions')}
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
                    isEdit ? 'Update Prescription' : 'Issue Prescription'
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