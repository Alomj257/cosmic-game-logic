import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loader from "./utils/Loader";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./utils/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import DatabasePage from "./pages/admin/DatabasePage";
import ReadPage from "./pages/admin/ReadPage";

const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const ConfirmOtp = lazy(() => import("./components/auth/ConfirmOtp"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserDashboard = lazy(() => import("./pages/user/UserDashboard"));
const WritePage = lazy(() => import("./pages/admin/WritePage"));


const App = () => {
  return (
    <Router> {/* Router should wrap everything */}
      <AuthProvider> {/* AuthProvider is now inside Router */}
        <Toaster />
        <Navbar />
          <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/confirm-otp" element={<ConfirmOtp />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

            <Route
              path="/write"
              element={
                <ProtectedRoute>
                  <WritePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/database"
              element={
                <ProtectedRoute>
                  <DatabasePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/read"
              element={
                <ProtectedRoute>
                  <ReadPage />
                </ProtectedRoute>
              }
            />

          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
