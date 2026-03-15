import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthProvider, AuthContext } from './components/context/AuthContext';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Background from './components/common/Background';

// Auth Components
import AdminLogin from './components/Auth/AdminLogin';
import Login from './components/Auth/Login';
import DoctorLogin from './components/Auth/DoctorLogin';
import Signup from './components/Auth/Signup';

import AdminDashboard from './components/Admin/AdminDashboard';
import AllocateResources from './components/Admin/AllocateResources';
import ManageStaff from './components/Admin/ManageStaff';
import ManageAvailability from './components/Admin/ManageAvailability';
import ViewAppointments from './components/Admin/ViewAppointments';
import ManageDoctors from './components/Admin/ManageDoctors';
import AdminLayout from './components/Admin/AdminLayout';
import AdminLabCenter from './components/Admin/AdminLabCenter';
import AdminEnquiries from './components/Admin/AdminEnquiries';
import AdminFinance from './components/Admin/AdminFinance';
import AdminFeedbackCenter from './components/Admin/AdminFeedbackCenter';
import AdminBroadcast from './components/Admin/AdminBroadcast';
import AdminDepartmentManager from './components/Admin/AdminDepartmentManager';
// Doctor Components
import DoctorDashboard from './components/Doctors/DoctorDashboard';
import ConsultationRoom from './components/Doctors/ConsultationRoom';
import DoctorFeedback from './components/Doctors/DoctorFeedback';
import ScheduleConsultation from './components/Doctors/ScheduleConsultation';
import DoctorsSection from './components/Doctors/DoctorsSection';

// Patient Components
import UserProfile from './components/Patient/UserProfile';
import BookAppointment from './components/Patient/BookAppointment';
import Payment from './components/Patient/Payment';
import ViewBooking from './components/Patient/ViewBooking';
import MyPrescriptions from './components/Patient/MyPrescriptions';
import MedicalRecords from './components/Patient/MedicalRecords';

// Pages
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';

// Protected Route using AuthContext
// Protected Route using AuthContext (Debug Mode)
const ProtectedRoute = ({ element }) => {
  const { user } = useContext(AuthContext);

  console.log("🔐 ProtectedRoute Check:");
  console.log("User:", user);

  if (!user) {
    console.warn("🚫 Access Denied — No user found. Redirecting to /login");
    return <Navigate to="/login" />;
  }

  console.log("✅ Access Granted for role:", user.role);
  return element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          {/* Optional Background */}
          {/* <Background /> */}

          <Header />

          <main className="app-main-content">
            <Routes>
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/home" />} />

              {/* Public Routes */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/doctor/login" element={<DoctorLogin />} />
              <Route path="/doctors" element={<DoctorsSection />} />

              {/* Admin Routes wrapped in AdminLayout */}
              <Route path="/admin" element={<ProtectedRoute element={<AdminLayout />} />}>
                <Route
                  path="dashboard"
                  element={<AdminDashboard />}
                />
                <Route
                  path="allocate-resources"
                  element={<AllocateResources />}
                />
                <Route
                  path="manage-staff"
                  element={<ManageStaff />}
                />
                <Route path="manage-availability" element={<ManageAvailability />} />
                <Route path="lab-center" element={<AdminLabCenter />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="finance" element={<AdminFinance />} />
                <Route path="feedback" element={<AdminFeedbackCenter />} />
                <Route path="broadcast" element={<AdminBroadcast />} />
                <Route path="departments" element={<AdminDepartmentManager />} />
                <Route
                  path="view-appointments"
                  element={<ViewAppointments />}
                />
                <Route
                  path="manage-doctors" 
                  element={<ManageDoctors />} 
                />
              </Route>

              {/* Doctor Routes */}
              <Route
                path="/doctor/dashboard"
                element={<ProtectedRoute element={<DoctorDashboard />} />}
              />
              <Route
                path="/doctor/consultation-room"
                element={<ProtectedRoute element={<ConsultationRoom />} />}
              />
              <Route
                path="/doctor/feedback"
                element={<ProtectedRoute element={<DoctorFeedback />} />}
              />
              <Route
                path="/doctor/schedule-consultation"
                element={<ProtectedRoute element={<ScheduleConsultation />} />}
              />

              {/* Patient Routes */}
              <Route
                path="/user-profile"
                element={<ProtectedRoute element={<UserProfile />} />}
              />
              <Route
                path="/book-appointment"
                element={<ProtectedRoute element={<BookAppointment />} />}
              />
              <Route
                path="/payment"
                element={<ProtectedRoute element={<Payment />} />}
              />
              <Route
                path="/view-booking"
                element={<ProtectedRoute element={<ViewBooking />} />}
              />
              <Route
                path="/my-prescriptions"
                element={<ProtectedRoute element={<MyPrescriptions />} />}
              />
              <Route
                path="/medical-records"
                element={<ProtectedRoute element={<MedicalRecords />} />}
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
