import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  Divider,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Security,
  VerifiedUser,
  LocalHospital,
  GitHub,
  LinkedIn,
  Twitter,
} from '@mui/icons-material';
import Logo from '../common/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Box py={4}>
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <Box mb={2}>
                <Logo size="medium" />
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                A comprehensive healthcare management solution designed to streamline 
                patient care, appointments, and medical records with security and efficiency.
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip 
                  icon={<Security />} 
                  label="HIPAA Compliant" 
                  size="small" 
                  color="success" 
                  variant="outlined" 
                />
                <Chip 
                  icon={<VerifiedUser />} 
                  label="Secure" 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Links
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Link href="/" color="text.secondary" underline="hover">
                  Dashboard
                </Link>
                <Link href="/patients" color="text.secondary" underline="hover">
                  Patients
                </Link>
                <Link href="/doctors" color="text.secondary" underline="hover">
                  Doctors
                </Link>
                <Link href="/appointments" color="text.secondary" underline="hover">
                  Appointments
                </Link>
                <Link href="/prescriptions" color="text.secondary" underline="hover">
                  Prescriptions
                </Link>
              </Box>
            </Grid>

            {/* Support */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Support
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Link href="#" color="text.secondary" underline="hover">
                  Help Center
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Documentation
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Training
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  System Status
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Contact Support
                </Link>
              </Box>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contact Information
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    +1 (555) 123-4567
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    support@healthcare-system.com
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    123 Healthcare Ave, Medical District
                  </Typography>
                </Box>
              </Box>
              
              <Box mt={2}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  Follow Us
                </Typography>
                <Box display="flex" gap={1}>
                  <IconButton size="small" color="primary">
                    <GitHub fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <LinkedIn fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <Twitter fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Bottom Bar */}
        <Box py={2}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                © {currentYear} HealthCare Management System. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} gap={2} mt={{ xs: 1, md: 0 }}>
                <Link href="#" variant="body2" color="text.secondary" underline="hover">
                  Privacy Policy
                </Link>
                <Link href="#" variant="body2" color="text.secondary" underline="hover">
                  Terms of Service
                </Link>
                <Link href="#" variant="body2" color="text.secondary" underline="hover">
                  Compliance
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;