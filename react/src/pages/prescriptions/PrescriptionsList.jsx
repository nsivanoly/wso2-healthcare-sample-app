import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  Medication,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { prescriptionsAPI, patientsAPI, doctorsAPI } from '../../services/apiServices';

export default function PrescriptionsList() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch prescriptions, patients, and doctors in parallel
      const [prescriptionsResponse, patientsResponse, doctorsResponse] = await Promise.all([
        prescriptionsAPI.getAll().catch(() => ({ data: [] })),
        patientsAPI.getAll().catch(() => ({ data: [] })),
        doctorsAPI.getAll().catch(() => ({ data: [] }))
      ]);
      
      // Handle different response structures
      let prescriptionsData = [];
      if (Array.isArray(prescriptionsResponse)) {
        prescriptionsData = prescriptionsResponse;
      } else if (prescriptionsResponse.data && Array.isArray(prescriptionsResponse.data)) {
        prescriptionsData = prescriptionsResponse.data;
      }
      
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
      
      setPrescriptions(prescriptionsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load prescriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || `Patient ID: ${patientId}`;
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor?.name || `Doctor ID: ${doctorId}`;
  };

  const handleDeleteClick = (prescription) => {
    setPrescriptionToDelete(prescription);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!prescriptionToDelete) return;
    
    try {
      await prescriptionsAPI.delete(prescriptionToDelete.id);
      toast.success('Prescription deleted successfully');
      fetchData(); // Refresh the data
      setDeleteDialogOpen(false);
      setPrescriptionToDelete(null);
    } catch (error) {
      console.error('Error deleting prescription:', error);
      toast.error('Failed to delete prescription');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPrescriptionToDelete(null);
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    getPatientName(prescription.patientId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDoctorName(prescription.doctorId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medication?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.dosage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.instructions?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPrescriptions = filteredPrescriptions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const getMedicationChipColor = (medication) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];
    const index = medication?.length % colors.length || 0;
    return colors[index];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Prescriptions
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/prescriptions/new')}
        >
          Add Prescription
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search prescriptions by patient, doctor, medication, or dosage..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Medication</TableCell>
                <TableCell>Dosage</TableCell>
                <TableCell>Date Issued</TableCell>
                <TableCell>Instructions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPrescriptions.map((prescription) => (
                <TableRow key={prescription.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {getPatientName(prescription.patientId)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getDoctorName(prescription.doctorId)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Medication sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                      <Chip 
                        label={prescription.medication || 'Not specified'} 
                        size="small" 
                        color={getMedicationChipColor(prescription.medication)}
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {prescription.dosage || 'Not specified'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(prescription.dateIssued)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      noWrap 
                      title={prescription.instructions}
                      sx={{ maxWidth: 200 }}
                    >
                      {prescription.instructions || 'No instructions'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/prescriptions/${prescription.id}`)}
                      title="View Details"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/prescriptions/${prescription.id}/edit`)}
                      title="Edit Prescription"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(prescription)}
                      title="Delete Prescription"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedPrescriptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      {filteredPrescriptions.length === 0 ? 'No prescriptions found matching your search.' : 'No prescriptions available.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPrescriptions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this prescription? This action cannot be undone.
          </Typography>
          {prescriptionToDelete && (
            <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
              <Typography variant="body2">
                <strong>Patient:</strong> {getPatientName(prescriptionToDelete.patientId)}
              </Typography>
              <Typography variant="body2">
                <strong>Doctor:</strong> {getDoctorName(prescriptionToDelete.doctorId)}
              </Typography>
              <Typography variant="body2">
                <strong>Medication:</strong> {prescriptionToDelete.medication}
              </Typography>
              <Typography variant="body2">
                <strong>Dosage:</strong> {prescriptionToDelete.dosage}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}