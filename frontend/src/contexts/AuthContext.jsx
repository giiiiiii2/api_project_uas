"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get("/users/me");
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/users/register", userData);

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      setUser(user);
      setIsAuthenticated(true);

      toast.success("Registrasi berhasil!");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat registrasi";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.post("/users/login", credentials);

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      setUser(user);
      setIsAuthenticated(true);

      toast.success("Login berhasil!");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Email atau password salah";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logout berhasil!");
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await api.put(`/users/${user.id}`, userData);

      setUser(response.data.data);
      toast.success("Profil berhasil diperbarui!");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Terjadi kesalahan saat memperbarui profil";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      setLoading(true);
      await api.put("/users/me/password", passwordData);

      toast.success("Password berhasil diperbarui!");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Terjadi kesalahan saat memperbarui password";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is a doctor
  const isDoctor = () => {
    return user?.role === "doctor";
  };

  // Check if user is a patient
  const isPatient = () => {
    return user?.role === "patient";
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    checkAuthStatus,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    isDoctor,
    isPatient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
