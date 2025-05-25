import api from "./api";

// Get all medication reminders
export const getMedicationReminders = async () => {
  try {
    const response = await api.get("/medication-reminders");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get today's medication reminders
export const getTodayReminders = async () => {
  try {
    const response = await api.get("/medication-reminders/today");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get medication reminder by ID
export const getMedicationReminderById = async (id) => {
  try {
    const response = await api.get(`/medication-reminders/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Create medication reminder
export const createMedicationReminder = async (reminderData) => {
  try {
    const response = await api.post("/medication-reminders", reminderData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update medication reminder
export const updateMedicationReminder = async (id, reminderData) => {
  try {
    const response = await api.put(`/medication-reminders/${id}`, reminderData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete medication reminder
export const deleteMedicationReminder = async (id) => {
  try {
    const response = await api.delete(`/medication-reminders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
