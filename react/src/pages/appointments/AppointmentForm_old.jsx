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
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
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
  appointmentDate: yup.date().required('Appointment date is required'),
  appointmentTime: yup.string().required('Appointment time is required'),
  reason: yup.string().required('Reason for visit is required'),
  status: yup.string().required('Status is required'),
  notes: yup.string(),
});

const statusOptions = [
  'Scheduled',
  'Completed',
  'Cancelled',
  'No-show',
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
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      patientId: searchParams.get('patientId') || '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      reason: '',
      status: 'Scheduled',
      notes: '',
    },
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    if (isEdit) {
      fetchAppointment();
    }
  }, [id, isEdit]);

  const fetchPatients = async () => {
    try {
      const response = await patientsAPI.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setPatientsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorsAPI.getAll();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const fetchAppointment = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const response = await appointmentsAPI.getById(id);
      const appointment = response.data;
      
      // Format date and time for input
      const appointmentDateTime = new Date(appointment.appointmentDate);
      const formattedDate = appointmentDateTime.toISOString().split('T')[0];
      const formattedTime = appointmentDateTime.toTimeString().split(' ')[0].slice(0, 5);
      
      reset({
        patientId: appointment.patientId?.toString() || '',
        doctorId: appointment.doctorId?.toString() || '',
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        reason: appointment.reason || '',
        status: appointment.status || 'Scheduled',
        notes: appointment.notes || '',
      });
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError('Failed to load appointment details.');
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Combine date and time
      const appointmentDateTime = new Date(`${data.appointmentDate}T${data.appointmentTime}`);
      
      const appointmentData = {
        patientId: parseInt(data.patientId),
        doctorId: parseInt(data.doctorId),
        appointmentDate: appointmentDateTime.toISOString(),
        reason: data.reason,
        status: data.status,
        notes: data.notes,
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
      toast.error(isEdit ? 'Failed to update appointment' : 'Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading || patientsLoading || doctorsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/appointments')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          {isEdit ? 'Edit Appointment' : 'Schedule New Appointment'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="patientId"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Autocomplete
                    {...field}
                    options={patients}
                    getOptionLabel={(option) => 
                      typeof option === 'object' 
                        ? `${option.firstName} ${option.lastName}` 
                        : patients.find(p => p.id.toString() === value?.toString())
                          ? `${patients.find(p => p.id.toString() === value?.toString()).firstName} ${patients.find(p => p.id.toString() === value?.toString()).lastName}`
                          : ''
                    }
                    value={patients.find(p => p.id.toString() === value?.toString()) || null}
                    onChange={(_, newValue) => onChange(newValue?.id?.toString() || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Patient"
                        error={!!errors.patientId}
                        helperText={errors.patientId?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="doctorId"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Autocomplete
                    {...field}
                    options={doctors}
                    getOptionLabel={(option) => 
                      typeof option === 'object' 
                        ? `Dr. ${option.firstName} ${option.lastName} - ${option.specialization}` 
                        : doctors.find(d => d.id.toString() === value?.toString())
                          ? `Dr. ${doctors.find(d => d.id.toString() === value?.toString()).firstName} ${doctors.find(d => d.id.toString() === value?.toString()).lastName}`
                          : ''
                    }
                    value={doctors.find(d => d.id.toString() === value?.toString()) || null}
                    onChange={(_, newValue) => onChange(newValue?.id?.toString() || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Doctor"
                        error={!!errors.doctorId}
                        helperText={errors.doctorId?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="appointmentDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Appointment Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.appointmentDate}
                    helperText={errors.appointmentDate?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="appointmentTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Appointment Time"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.appointmentTime}
                    helperText={errors.appointmentTime?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Reason for Visit"
                    error={!!errors.reason}
                    helperText={errors.reason?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Status">
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.status && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                    {errors.status.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Notes (Optional)"
                    multiline
                    rows={3}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/appointments')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  disabled={isSubmitting}
                >
                  {isEdit ? 'Update Appointment' : 'Schedule Appointment'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}