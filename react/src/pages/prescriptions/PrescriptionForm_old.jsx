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
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
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
  frequency: yup.string().required('Frequency is required'),
  duration: yup.string().required('Duration is required'),
  instructions: yup.string(),
  datePrescribed: yup.date().required('Date prescribed is required'),
});

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
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      datePrescribed: new Date().toISOString().split('T')[0], // Today's date
    },
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    if (isEdit) {
      fetchPrescription();
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

  const fetchPrescription = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const response = await prescriptionsAPI.getById(id);
      const prescription = response.data;
      
      // Format date for input
      const formattedDate = prescription.datePrescribed 
        ? new Date(prescription.datePrescribed).toISOString().split('T')[0] 
        : '';
      
      reset({
        patientId: prescription.patientId?.toString() || '',
        doctorId: prescription.doctorId?.toString() || '',
        medication: prescription.medication || '',
        dosage: prescription.dosage || '',
        frequency: prescription.frequency || '',
        duration: prescription.duration || '',
        instructions: prescription.instructions || '',
        datePrescribed: formattedDate,
      });
    } catch (error) {
      console.error('Error fetching prescription:', error);
      setError('Failed to load prescription details.');
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const prescriptionData = {
        patientId: parseInt(data.patientId),
        doctorId: parseInt(data.doctorId),
        medication: data.medication,
        dosage: data.dosage,
        frequency: data.frequency,
        duration: data.duration,
        instructions: data.instructions,
        datePrescribed: data.datePrescribed,
      };

      if (isEdit) {
        await prescriptionsAPI.update(id, prescriptionData);
        toast.success('Prescription updated successfully');
      } else {
        await prescriptionsAPI.create(prescriptionData);
        toast.success('Prescription created successfully');
      }
      
      // If we came from a patient-specific page, go back there
      const patientId = searchParams.get('patientId');
      if (patientId) {
        navigate(`/prescriptions?patientId=${patientId}`);
      } else {
        navigate('/prescriptions');
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error(isEdit ? 'Failed to update prescription' : 'Failed to create prescription');
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
          onClick={() => {
            const patientId = searchParams.get('patientId');
            if (patientId) {
              navigate(`/prescriptions?patientId=${patientId}`);
            } else {
              navigate('/prescriptions');
            }
          }}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          {isEdit ? 'Edit Prescription' : 'Add New Prescription'}
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
                name="medication"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Medication"
                    error={!!errors.medication}
                    helperText={errors.medication?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="dosage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Dosage"
                    placeholder="e.g., 500mg, 1 tablet"
                    error={!!errors.dosage}
                    helperText={errors.dosage?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Frequency"
                    placeholder="e.g., 3 times daily, twice a day"
                    error={!!errors.frequency}
                    helperText={errors.frequency?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Duration"
                    placeholder="e.g., 7 days, 2 weeks"
                    error={!!errors.duration}
                    helperText={errors.duration?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="datePrescribed"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Date Prescribed"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.datePrescribed}
                    helperText={errors.datePrescribed?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="instructions"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Instructions (Optional)"
                    multiline
                    rows={3}
                    placeholder="Special instructions for taking the medication..."
                    error={!!errors.instructions}
                    helperText={errors.instructions?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const patientId = searchParams.get('patientId');
                    if (patientId) {
                      navigate(`/prescriptions?patientId=${patientId}`);
                    } else {
                      navigate('/prescriptions');
                    }
                  }}
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
                  {isEdit ? 'Update Prescription' : 'Create Prescription'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}