import api from "./api";

// Get all health records
export const getHealthRecords = async () => {
  try {
    const response = await api.get("/health-records");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get health record by ID
export const getHealthRecordById = async (id) => {
  try {
    const response = await api.get(`/health-records/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Create health record
export const createHealthRecord = async (recordData) => {
  try {
    const response = await api.post("/health-records", recordData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update health record
export const updateHealthRecord = async (id, recordData) => {
  try {
    const response = await api.put(`/health-records/${id}`, recordData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete health record
export const deleteHealthRecord = async (id) => {
  try {
    const response = await api.delete(`/health-records/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
