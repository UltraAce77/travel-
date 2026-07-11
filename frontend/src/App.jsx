import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";

import PublicLayout from "./components/public/PublicLayout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import AuthPage from "./pages/AuthPage";

import UserDashboard from "./pages/user/Dashboard";
import UserTreks from "./pages/user/Treks";
import Deposit from "./pages/user/Deposit";
import Withdraw from "./pages/user/Withdraw";
import Wallet from "./pages/user/Wallet";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFunds from "./pages/admin/Funds";
import AdminTreks from "./pages/admin/Treks";
import AdminUsers from "./pages/admin/Users";
import AdminManagers from "./pages/admin/Managers";

import ManagerDashboard from "./pages/manager/Dashboard";

function homeFor(role) {
  if (role === "admin") return "/admin";
  if (role === "manager") return "/manager";
  return "/app";
}

export default function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Public marketing site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Auth */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={homeFor(role)} replace /> : <AuthPage />}
      />

      {/* User app */}
      <Route
        path="/app"
        element={
          <ProtectedRoute roles={["user"]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="treks" element={<UserTreks />} />
        <Route path="deposit" element={<Deposit />} />
        <Route path="withdraw" element={<Withdraw />} />
        <Route path="wallet" element={<Wallet />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="funds" element={<AdminFunds />} />
        <Route path="treks" element={<AdminTreks />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="managers" element={<AdminManagers />} />
      </Route>

      {/* Manager */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute roles={["manager", "admin"]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
