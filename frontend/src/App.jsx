"use client";

import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import DoctorLayout from "./layouts/DoctorLayout";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

// Patient Pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import HealthRecordsPage from "./pages/health/HealthRecordsPage";
import HealthRecordDetailPage from "./pages/health/HealthRecordDetailPage";
import AddHealthRecordPage from "./pages/health/AddHealthRecordPage";
import MedicationRemindersPage from "./pages/medications/MedicationRemindersPage";
import AddMedicationReminderPage from "./pages/medications/AddMedicationReminderPage";
import ConsultationsPage from "./pages/consultations/ConsultationsPage";
import AddConsultationPage from "./pages/consultations/AddConsultationPage";
import HospitalsPage from "./pages/hospitals/HospitalsPage";

// Doctor Pages
import DoctorDashboardPage from "./pages/doctor/DoctorDashboardPage";
import DoctorProfilePage from "./pages/doctor/DoctorProfilePage";
import DoctorConsultationsPage from "./pages/doctor/DoctorConsultationsPage";
import DoctorConsultationDetailPage from "./pages/doctor/DoctorConsultationDetailPage";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (user.role === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

function App() {
  const { checkAuthStatus, user } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Redirect to appropriate dashboard based on role
  const DashboardRedirect = () => {
    if (user?.role === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Dashboard Redirect */}
      <Route
        path="/dashboard-redirect"
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        }
      />

      {/* Patient Routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="patient">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Health Records */}
        <Route path="/health-records" element={<HealthRecordsPage />} />
        <Route path="/health-records/add" element={<AddHealthRecordPage />} />
        <Route
          path="/health-records/:id"
          element={<HealthRecordDetailPage />}
        />

        {/* Medication Reminders */}
        <Route
          path="/medication-reminders"
          element={<MedicationRemindersPage />}
        />
        <Route
          path="/medication-reminders/add"
          element={<AddMedicationReminderPage />}
        />

        {/* Consultations */}
        <Route path="/consultations" element={<ConsultationsPage />} />
        <Route path="/consultations/add" element={<AddConsultationPage />} />

        {/* Hospitals */}
        <Route path="/hospitals" element={<HospitalsPage />} />
      </Route>

      {/* Doctor Routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
        <Route path="/doctor/profile" element={<DoctorProfilePage />} />
        <Route
          path="/doctor/consultations"
          element={<DoctorConsultationsPage />}
        />
        <Route
          path="/doctor/consultations/:id"
          element={<DoctorConsultationDetailPage />}
        />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;