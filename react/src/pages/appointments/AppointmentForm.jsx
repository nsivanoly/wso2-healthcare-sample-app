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
} from '@mui/material';
import { 
  ArrowBack, 
  Save, 
  Event, 
  Person, 
  LocalHospital, 
  AccessTime,
  Description,
  Badge,
  Schedule,
  CalendarMonth,
  WatchLater,
  Cancel,
  CheckCircle
} from '@mui/icons-material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { appointmentsAPI, patientsAPI, doctorsAPI } from '../../services/apiServices';

// Validation schema
const schema = yup.object({
  patientId: yup.string().required('Patient is required'),
  doctorId: yup.string().required('Doctor is required'),
  date: yup.string().required('Appointment date is required'),
  time: yup.string().required('Appointment time is required'),
  reason: yup.string().required('Reason for visit is required'),
  status: yup.string().required('Status is required'),
});

const statusOptions = [
  'scheduled',
  'completed',
  'cancelled',
  'in-progress',
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

export default function AppointmentForm() {
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

  const steps = ['Select Patient & Doctor', 'Schedule Time', 'Appointment Details'];

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
      date: '',
      time: '',
      reason: '',
      status: 'scheduled',
    },
  });

  useEffect(() => {
    fetchInitialData();
    if (isEdit) {
      fetchAppointment();
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

  const fetchAppointment = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const response = await appointmentsAPI.getById(id);
      
      let appointmentData = null;
      if (response.data) {
        appointmentData = response.data;
      } else if (response.id) {
        appointmentData = response;
      }
      
      if (appointmentData) {
        reset({
          patientId: appointmentData.patientId?.toString() || '',
          doctorId: appointmentData.doctorId?.toString() || '',
          date: appointmentData.date || '',
          time: appointmentData.time || '',
          reason: appointmentData.reason || '',
          status: appointmentData.status || 'scheduled',
        });
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError('Failed to load appointment data. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const appointmentData = {
        patientId: parseInt(data.patientId),
        doctorId: parseInt(data.doctorId),
        date: data.date,
        time: data.time,
        reason: data.reason,
        status: data.status,
      };

      if (isEdit) {
        await appointmentsAPI.update(id, appointmentData);
        toast.success('Appointment updated successfully');
      } else {
        await appointmentsAPI.create(appointmentData);
        toast.success('Appointment scheduled successfully');
      }
      
      navigate('/appointments');
    } catch (error) {
      console.error('Error saving appointment:', error);
      setError(error.message || 'Failed to save appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const watchedValues = watch();
  const isStep1Complete = watchedValues.patientId && watchedValues.doctorId;
  const isStep2Complete = watchedValues.date && watchedValues.time;
  const isStep3Complete = watchedValues.reason && watchedValues.status;

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
              subheader="Choose who the appointment is for and with"
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
                            label="Doctor"
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
                  <Schedule />
                </Avatar>
              }
              title="Schedule Time"
              subheader="Choose the date and time for the appointment"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Appointment Date"
                        type="date"
                        error={!!errors.date}
                        helperText={errors.date?.message}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: new Date().toISOString().split('T')[0],
                        }}
                        InputProps={{
                          startAdornment: <CalendarMonth sx={{ mr: 1, color: 'action.active' }} />,
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

                <Grid item xs={12} md={6}>
                  <Controller
                    name="time"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.time}>
                        <InputLabel>Appointment Time</InputLabel>
                        <Select
                          {...field}
                          label="Appointment Time"
                          startAdornment={<WatchLater sx={{ mr: 1, color: 'action.active' }} />}
                        >
                          {timeSlots.map((time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.time && (
                          <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                            {errors.time.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                    <Chip 
                      icon={<AccessTime />} 
                      label={isStep2Complete ? "Date and time scheduled" : "Select date and time"} 
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
              title="Appointment Details"
              subheader="Add reason for visit and set appointment status"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Reason for Visit"
                        placeholder="Describe the purpose of this appointment (e.g., Annual checkup, Follow-up, Consultation)"
                        multiline
                        rows={3}
                        error={!!errors.reason}
                        helperText={errors.reason?.message || "Provide details about the purpose of this appointment"}
                        InputProps={{
                          startAdornment: (
                            <Description sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />
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
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.status}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          {...field}
                          label="Status"
                          startAdornment={<Badge sx={{ mr: 1, color: 'action.active' }} />}
                        >
                          {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.status && (
                          <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                            {errors.status.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <Chip 
                      icon={<Event />} 
                      label={isStep3Complete ? "Appointment details complete" : "Add appointment details"} 
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
          onClick={() => navigate('/appointments')}
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
            {isEdit ? 'Edit Appointment' : 'Schedule New Appointment'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEdit ? 'Update appointment information' : 'Create a new patient appointment'}
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
                onClick={() => navigate('/appointments')}
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
                    isEdit ? 'Update Appointment' : 'Schedule Appointment'
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