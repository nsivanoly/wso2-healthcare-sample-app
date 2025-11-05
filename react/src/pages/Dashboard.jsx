import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
} from '@mui/material';
import {
  People,
  LocalHospital,
  CalendarToday,
  Medication,
  TrendingUp,
  EventAvailable,
  PersonAdd,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { patientsAPI, doctorsAPI, appointmentsAPI, prescriptionsAPI } from '../services/apiServices';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const DashboardCard = ({ title, count, icon: Icon, color, actionText, onAction, loading }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ fontSize: 40, color, mr: 2 }} />
        <div>
          <Typography variant="h4" component="div">
            {loading ? <CircularProgress size={24} /> : count}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </div>
      </Box>
    </CardContent>
    <CardActions>
      <Button size="small" onClick={onAction}>
        {actionText}
      </Button>
    </CardActions>
  </Card>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    prescriptions: 0,
  });
  const [chartData, setChartData] = useState({
    patients: [],
    doctors: [],
    appointments: [],
    prescriptions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching dashboard data...');
        const [patientsRes, doctorsRes, appointmentsRes, prescriptionsRes] = await Promise.allSettled([
          patientsAPI.getAll(),
          doctorsAPI.getAll(),
          appointmentsAPI.getAll(),
          prescriptionsAPI.getAll(),
        ]);

        console.log('Dashboard responses:', { patientsRes, doctorsRes, appointmentsRes, prescriptionsRes });

        const getData = (result) => {
          if (result.status === 'fulfilled') {
            const data = result.value.data || result.value || [];
            return Array.isArray(data) ? data : [];
          }
          return [];
        };

        const patientsData = getData(patientsRes);
        const doctorsData = getData(doctorsRes);
        const appointmentsData = getData(appointmentsRes);
        const prescriptionsData = getData(prescriptionsRes);

        setStats({
          patients: patientsData.length,
          doctors: doctorsData.length,
          appointments: appointmentsData.length,
          prescriptions: prescriptionsData.length,
        });

        setChartData({
          patients: patientsData,
          doctors: doctorsData,
          appointments: appointmentsData,
          prescriptions: prescriptionsData,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please check if the backend server is running.');
        setStats({
          patients: 0,
          doctors: 0,
          appointments: 0,
          prescriptions: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data processing functions
  const getPatientsByGender = () => {
    const genderCounts = chartData.patients.reduce((acc, patient) => {
      const gender = patient.gender || 'Unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(genderCounts),
      datasets: [
        {
          data: Object.values(genderCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          borderWidth: 2,
        },
      ],
    };
  };

  const getDoctorsBySpecialty = () => {
    const specialtyCounts = chartData.doctors.reduce((acc, doctor) => {
      const specialty = doctor.specialty || doctor.specialization || 'General';
      acc[specialty] = (acc[specialty] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(specialtyCounts),
      datasets: [
        {
          label: 'Number of Doctors',
          data: Object.values(specialtyCounts),
          backgroundColor: '#2e7d32',
          borderColor: '#1b5e20',
          borderWidth: 1,
        },
      ],
    };
  };

  const getAppointmentsByStatus = () => {
    const statusCounts = chartData.appointments.reduce((acc, appointment) => {
      const status = appointment.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#9C27B0'],
          borderWidth: 2,
        },
      ],
    };
  };

  const getPatientsByAge = () => {
    const ageGroups = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0,
    };

    chartData.patients.forEach(patient => {
      const age = patient.age;
      if (age <= 18) ageGroups['0-18']++;
      else if (age <= 35) ageGroups['19-35']++;
      else if (age <= 50) ageGroups['36-50']++;
      else if (age <= 65) ageGroups['51-65']++;
      else ageGroups['65+']++;
    });

    return {
      labels: Object.keys(ageGroups),
      datasets: [
        {
          label: 'Number of Patients',
          data: Object.values(ageGroups),
          backgroundColor: '#1976d2',
          borderColor: '#0d47a1',
          borderWidth: 1,
        },
      ],
    };
  };

  const getRecentActivity = () => {
    const activities = [];
    
    // Add recent appointments
    chartData.appointments
      .filter(apt => apt.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
      .forEach(apt => {
        activities.push({
          type: 'appointment',
          text: `Appointment scheduled for ${apt.date}`,
          icon: CalendarToday,
          color: '#ed6c02',
        });
      });

    // Add recent prescriptions
    chartData.prescriptions
      .filter(presc => presc.dateIssued)
      .sort((a, b) => new Date(b.dateIssued) - new Date(a.dateIssued))
      .slice(0, 2)
      .forEach(presc => {
        activities.push({
          type: 'prescription',
          text: `Prescription issued: ${presc.medication}`,
          icon: Medication,
          color: '#9c27b0',
        });
      });

    return activities.slice(0, 5);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Healthcare Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to the Healthcare Management System. Here's a comprehensive overview of your data.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Patients"
            count={stats.patients}
            icon={People}
            color="#1976d2"
            actionText="View Patients"
            onAction={() => navigate('/patients')}
            loading={false}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Active Doctors"
            count={stats.doctors}
            icon={LocalHospital}
            color="#2e7d32"
            actionText="View Doctors"
            onAction={() => navigate('/doctors')}
            loading={false}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Appointments"
            count={stats.appointments}
            icon={CalendarToday}
            color="#ed6c02"
            actionText="View Appointments"
            onAction={() => navigate('/appointments')}
            loading={false}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Prescriptions"
            count={stats.prescriptions}
            icon={Medication}
            color="#9c27b0"
            actionText="View Prescriptions"
            onAction={() => navigate('/prescriptions')}
            loading={false}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Patient Demographics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Patient Demographics by Gender
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={getPatientsByGender()} options={pieOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Doctor Specialties */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Doctors by Specialty
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={getDoctorsBySpecialty()} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Patient Age Groups */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Patients by Age Group
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={getPatientsByAge()} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Appointment Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Appointment Status Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={getAppointmentsByStatus()} options={pieOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ mr: 1 }} />
              Recent Activity
            </Typography>
            <List>
              {getRecentActivity().map((activity, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <activity.icon sx={{ color: activity.color }} />
                  </ListItemIcon>
                  <ListItemText primary={activity.text} />
                </ListItem>
              ))}
              {getRecentActivity().length === 0 && (
                <ListItem>
                  <ListItemText primary="No recent activity" secondary="Activity will appear here as data is added" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => navigate('/patients/new')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Add New Patient
              </Button>
              <Button
                variant="contained"
                startIcon={<EventAvailable />}
                onClick={() => navigate('/appointments/new')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Schedule Appointment
              </Button>
              <Button
                variant="contained"
                startIcon={<Medication />}
                onClick={() => navigate('/prescriptions/new')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Create Prescription
              </Button>
              <Button
                variant="outlined"
                startIcon={<LocalHospital />}
                onClick={() => navigate('/doctors/new')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Add Doctor
              </Button>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              System Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip
                icon={<TrendingUp />}
                label={`${stats.patients} Patients Registered`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<LocalHospital />}
                label={`${stats.doctors} Doctors Available`}
                color="success"
                variant="outlined"
              />
              <Chip
                icon={<CalendarToday />}
                label={`${stats.appointments} Appointments Scheduled`}
                color="warning"
                variant="outlined"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}