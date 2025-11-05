# Healthcare Demo Application - Frontend

A modern React.js frontend for the Healthcare Management System that provides a comprehensive dashboard for managing patients, doctors, appointments, and prescriptions.

## Features

### Dashboard
- Overview of system statistics (patients, doctors, appointments, prescriptions)
- Quick action buttons for common tasks
- System information display

### Patients Management
- **List View**: Paginated table with search functionality
- **Detail View**: Comprehensive patient information display
- **Add/Edit**: Form with validation for patient registration and updates
- **Delete**: Confirmation dialog for patient removal
- **Emergency Contact**: Support for emergency contact information

### Doctors Management
- **List View**: Paginated table with search by name, specialization, email
- **Add/Edit**: Form with specialization dropdown and experience tracking
- **Delete**: Confirmation dialog for doctor removal
- **License Tracking**: License number validation and storage

### Appointments Management
- **List View**: Appointments with patient/doctor information and status
- **Schedule**: Form with patient/doctor selection and date/time picking
- **Edit**: Update appointment details and status
- **Cancel**: Appointment cancellation with confirmation
- **Status Tracking**: Scheduled, Completed, Cancelled, No-show

### Prescriptions Management
- **List View**: Medications with dosage, frequency, and duration
- **Add/Edit**: Comprehensive prescription form with patient/doctor selection
- **Delete**: Prescription removal with confirmation
- **Patient Filter**: View prescriptions by specific patient
- **Medication Tracking**: Complete prescription details and instructions

## Technology Stack

- **React 18** - Frontend framework
- **Material-UI (MUI)** - Modern UI components and design system
- **React Router Dom** - Client-side routing
- **Axios** - HTTP client for API communication
- **React Hook Form** - Form handling and validation
- **Yup** - Schema validation
- **React Toastify** - Toast notifications
- **Vite** - Fast build tool and development server

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Layout.jsx          # Main layout with sidebar navigation
│   └── common/                 # Reusable components
├── pages/
│   ├── Dashboard.jsx           # Main dashboard with statistics
│   ├── patients/
│   │   ├── PatientsList.jsx    # Patient list with search/pagination
│   │   ├── PatientDetail.jsx   # Individual patient details
│   │   └── PatientForm.jsx     # Add/edit patient form
│   ├── doctors/
│   │   ├── DoctorsList.jsx     # Doctor list with search/pagination
│   │   └── DoctorForm.jsx      # Add/edit doctor form
│   ├── appointments/
│   │   ├── AppointmentsList.jsx # Appointments list with status
│   │   └── AppointmentForm.jsx # Schedule/edit appointment form
│   └── prescriptions/
│       ├── PrescriptionsList.jsx # Prescriptions list
│       └── PrescriptionForm.jsx # Add/edit prescription form
├── services/
│   ├── api.js                  # Axios configuration
│   └── apiServices.js          # API service functions for CRUD operations
└── utils/                      # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on http://localhost:3010

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd healthcare-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Ensure backend API is running on `http://localhost:3010`
   - Frontend will run on `http://localhost:3030`

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to a backend API with the following endpoints:

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions
- `GET /api/prescriptions/:id` - Get prescription by ID
- `GET /api/prescriptions/patient/:patientId` - Get prescriptions by patient
- `POST /api/prescriptions` - Create new prescription
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

## Features & Functionality

### Responsive Design
- Mobile-first approach with Material-UI breakpoints
- Collapsible sidebar navigation for mobile devices
- Responsive tables with horizontal scrolling on small screens

### Search & Pagination
- Real-time search across all list views
- Configurable pagination with 5, 10, or 25 items per page
- Search across multiple fields (name, email, phone, etc.)

### Form Validation
- Client-side validation using Yup schema
- Real-time validation feedback
- Required field indicators
- Email and phone format validation

### User Experience
- Toast notifications for success/error feedback
- Loading states for async operations
- Confirmation dialogs for destructive actions
- Breadcrumb navigation and back buttons

### Error Handling
- API error interception and display
- Graceful fallbacks for missing data
- Network error handling with user-friendly messages

## Configuration

### Backend API URL
Update the API base URL in `src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:3010/api', // Change this to your backend URL
  timeout: 10000,
});
```

### Development Port
The development server runs on port 3030 by default. To change this, modify `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3030, // Change this port
  },
});
```

## Contributing

1. Follow the existing code structure and naming conventions
2. Use Material-UI components for consistency
3. Implement proper error handling and loading states
4. Add validation to all forms
5. Test with the backend API before submitting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Healthcare Demo Application for educational purposes.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
