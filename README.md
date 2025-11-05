# Healthcare Management System

A comprehensive full-stack healthcare management application built with **React.js** frontend and **Node.js/Express** backend. This demo application provides complete CRUD functionality for managing patients, doctors, appointments, and prescriptions in a healthcare setting.

## 🏥 Overview

This healthcare management system is designed to streamline medical practice operations by providing an intuitive interface for healthcare professionals to manage patient records, schedule appointments, maintain doctor profiles, and track prescriptions.

## ✨ Key Features

### 🎯 Core Modules
- **Patients Management** - Complete patient registration, medical history, and contact information
- **Doctors Management** - Doctor profiles with specializations, license tracking, and availability
- **Appointments Scheduling** - Calendar-based appointment booking with status tracking
- **Prescriptions Management** - Medication tracking with dosage, instructions, and issue dates

### 📊 Dashboard & Analytics
- Real-time system statistics and metrics
- Patient demographics visualization
- Appointment status distribution charts
- Quick access to common actions

### 🔐 Authentication & Security
- Configurable authentication providers (WSO2 IS, Asgardeo, or no-auth mode)
- Protected routes and role-based access
- Secure API endpoints with CORS support

### 🎨 Modern UI/UX
- Material-UI design system
- Responsive layout with sidebar navigation
- Dark/Light theme support
- Form validation with real-time feedback
- Toast notifications for user actions

## 🏗️ Architecture

```
Healthcare Management System
├── Frontend (React.js + Vite)
│   ├── Port: 3030
│   ├── Material-UI Components
│   ├── React Router Navigation
│   └── Axios API Integration
└── Backend (Node.js + Express)
    ├── Port: 3010
    ├── RESTful API Endpoints
    ├── Swagger Documentation
    └── In-Memory Data Storage
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/nsivanoly/wso2-healthcare-sample-app.git
cd wso2-healthcare-sample-app
```

### 2. Start the Backend API
```bash
cd api
npm install
npm start
```
The API server will start on `http://localhost:3010`

### 3. Start the Frontend Application
```bash
cd ../react
npm install
npm run dev
```
The React app will start on `http://localhost:3030`

### 4. Access the Application
- **Frontend**: http://localhost:3030
- **API Documentation**: http://localhost:3010/api-docs
- **API Health Check**: http://localhost:3010

## 📁 Project Structure

```
├── api/                          # Backend API Server
│   ├── index.js                  # Express server setup
│   ├── package.json              # Backend dependencies
│   ├── data/
│   │   └── sampleData.js         # In-memory data store
│   └── routes/                   # API route handlers
│       ├── patients.js           # Patient CRUD operations
│       ├── doctors.js            # Doctor CRUD operations
│       ├── appointments.js       # Appointment management
│       ├── prescriptions.js      # Prescription tracking
│       └── summary.js            # Dashboard statistics
│
├── react/                        # Frontend React Application
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── src/
│   │   ├── App.jsx               # Main application component
│   │   ├── components/           # Reusable UI components
│   │   │   ├── layout/
│   │   │   │   └── Layout.jsx    # Main layout with sidebar
│   │   │   └── common/           # Common components
│   │   ├── pages/                # Feature-specific pages
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── patients/         # Patient management
│   │   │   ├── doctors/          # Doctor management
│   │   │   ├── appointments/     # Appointment scheduling
│   │   │   └── prescriptions/    # Prescription management
│   │   ├── services/             # API service layer
│   │   ├── contexts/             # React contexts (Auth, Theme)
│   │   └── utils/                # Utility functions
│   └── public/                   # Static assets
```

## 📊 API Endpoints

### Patients
- `GET /patients` - List all patients
- `GET /patients/:id` - Get patient details
- `POST /patients` - Create new patient
- `PUT /patients/:id` - Update patient
- `DELETE /patients/:id` - Remove patient

### Doctors
- `GET /doctors` - List all doctors
- `GET /doctors/:id` - Get doctor details
- `POST /doctors` - Add new doctor
- `PUT /doctors/:id` - Update doctor
- `DELETE /doctors/:id` - Remove doctor

### Appointments
- `GET /appointments` - List all appointments
- `GET /appointments/:id` - Get appointment details
- `POST /appointments` - Schedule new appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment

### Prescriptions
- `GET /prescriptions` - List all prescriptions
- `GET /prescriptions/:id` - Get prescription details
- `POST /prescriptions` - Create new prescription
- `PUT /prescriptions/:id` - Update prescription
- `DELETE /prescriptions/:id` - Remove prescription

### Statistics
- `GET /summary` - Get dashboard statistics

## 🛠️ Technology Stack

### Frontend
- **React.js 19** - UI framework
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **React Hook Form** - Form management
- **Yup** - Form validation
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Swagger** - API documentation
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development server

## 🔧 Configuration

### Authentication
The application supports multiple authentication providers configured in `react/src/config.js`:

```javascript
const AUTH_BY = "NO_AUTH"; // Options: WSO2_IS, ASGARDEO, NO_AUTH
```

### Port Configuration
- Backend API: `3010` (configurable via `PORT` environment variable)
- Frontend: `3030` (configured in `vite.config.js`)

### Environment Variables
```bash
# Backend (.env)
PORT=3010

# Frontend
VITE_API_BASE_URL=http://localhost:3010
```

## 📱 Features in Detail

### Dashboard
- System overview with key metrics
- Patient demographics charts
- Appointment status distribution
- Quick action buttons for common tasks

### Patient Management
- Comprehensive patient registration
- Medical history tracking
- Emergency contact management
- Search and pagination

### Doctor Management
- Doctor profile management
- Specialization categorization
- License number tracking
- Experience and availability

### Appointment Scheduling
- Multi-step appointment booking
- Patient and doctor selection
- Date/time picker integration
- Status tracking (Scheduled, Completed, Cancelled)

### Prescription Management
- Multi-step prescription creation
- Medication and dosage tracking
- Instruction management
- Patient-doctor association

## 🧪 Sample Data

The application comes with pre-loaded sample data including:
- **15 Patients** with diverse medical histories
- **10 Doctors** across various specializations
- **20 Appointments** with different statuses
- **20 Prescriptions** with various medications

## 📚 API Documentation

Interactive Swagger documentation is available at:
- **Local**: http://localhost:3010/api-docs
- **JSON Spec**: http://localhost:3010/swagger.json

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the individual package.json files for details.

## 🏥 WSO2 Healthcare Integration

This application serves as a demonstration of healthcare management capabilities and can be extended to integrate with WSO2's healthcare solutions for enterprise-grade deployments.

## 🛡️ Security Considerations

- Input validation on all API endpoints
- Configurable authentication providers
- CORS configuration for secure cross-origin requests
- Form validation on the frontend
- Protected routes requiring authentication

## 🔄 Development Workflow

### Backend Development
```bash
cd api
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development
```bash
cd react
npm run dev  # Start Vite dev server with HMR
```

### Production Build
```bash
# Backend
cd api
npm start

# Frontend
cd react
npm run build
npm run preview
```

## 📈 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] File upload for medical documents
- [ ] Integration with medical devices
- [ ] Multi-language support
- [ ] Mobile responsive enhancements
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Data backup and recovery

---

**Built with ❤️ for the healthcare community**