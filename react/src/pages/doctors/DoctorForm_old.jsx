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
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
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

export default function DoctorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
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
      const doctor = response.data;
      
      reset({
        name: doctor.name || '',
        specialty: doctor.specialty || '',
        contactInfo: doctor.contactInfo || '',
      });
    } catch (error) {
      console.error('Error fetching doctor:', error);
      setError('Failed to load doctor details.');
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Prepare doctor data according to Swagger specs
      const doctorData = {
        name: data.name,
        specialty: data.specialty,
        contactInfo: data.contactInfo,
      };

      if (isEdit) {
        await doctorsAPI.update(id, doctorData);
        toast.success('Doctor updated successfully!');
      } else {
        await doctorsAPI.create(doctorData);
        toast.success('Doctor created successfully!');
      }
      
      navigate('/doctors');
    } catch (error) {
      console.error('Error saving doctor:', error);
      const errorMessage = error.response?.data?.message || (isEdit ? 'Failed to update doctor' : 'Failed to create doctor');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/doctors')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          {isEdit ? 'Edit Doctor' : 'Add New Doctor'}
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
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Doctor Name"
                    placeholder="e.g., Dr. Sarah Williams"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="specialty"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Medical Specialty"
                    placeholder="e.g., Cardiology, Dermatology, Neurology"
                    error={!!errors.specialty}
                    helperText={errors.specialty?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="contactInfo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contact Information"
                    placeholder="Email, phone, or other contact details"
                    error={!!errors.contactInfo}
                    helperText={errors.contactInfo?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/doctors')}
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
                  {isEdit ? 'Update Doctor' : 'Create Doctor'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}