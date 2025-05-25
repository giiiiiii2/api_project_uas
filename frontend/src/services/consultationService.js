import api from "./api";

// Get doctor by ID
export const getDoctorById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get doctor categories
export const getDoctorCategories = async () => {
  try {
    const response = await api.get("/users/doctors/categories");
    return (
      response.data.data || [
        "umum",
        "spesialis",
        "gigi",
        "anak",
        "kulit",
        "mata",
        "jantung",
        "saraf",
      ]
    ); // Fallback jika API belum siap
  } catch (error) {
    console.error("Error fetching doctor categories:", error);
    // Fallback jika API belum siap
    return [
      "umum",
      "spesialis",
      "gigi",
      "anak",
      "kulit",
      "mata",
      "jantung",
      "saraf",
    ];
  }
};

// Get doctor specializations
export const getDoctorSpecializations = async () => {
  try {
    const response = await api.get("/users/doctors/specializations");
    return (
      response.data.data || [
        "Umum",
        "Kardiologi",
        "Dermatologi",
        "Pediatri",
        "Neurologi",
        "Ortopedi",
      ]
    ); // Fallback jika API belum siap
  } catch (error) {
    console.error("Error fetching doctor specializations:", error);
    // Fallback jika API belum siap
    return [
      "Umum",
      "Kardiologi",
      "Dermatologi",
      "Pediatri",
      "Neurologi",
      "Ortopedi",
    ];
  }
};

// Filter doctors
export const filterDoctors = async (filters) => {
  try {
    const response = await api.get("/users/doctors/filter", {
      params: filters,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get doctor consultations
export const getDoctorConsultations = async () => {
  try {
    const response = await api.get("/consultations/doctor");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update consultation status
export const updateConsultationStatus = async (id, statusData) => {
  try {
    const response = await api.patch(`/consultations/${id}/status`, statusData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
// Get all consultations
export const getConsultations = async () => {
  try {
    const response = await api.get("/consultations");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get upcoming consultations
export const getUpcomingConsultations = async () => {
  try {
    const response = await api.get("/consultations/upcoming");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get consultation by ID
export const getConsultationById = async (id) => {
  try {
    const response = await api.get(`/consultations/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Create consultation
export const createConsultation = async (consultationData) => {
  try {
    const response = await api.post("/consultations", consultationData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update consultation
export const updateConsultation = async (id, consultationData) => {
  try {
    const response = await api.put(`/consultations/${id}`, consultationData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete consultation
export const deleteConsultation = async (id) => {
  try {
    const response = await api.delete(`/consultations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all doctors
export const getAllDoctors = async () => {
  try {
    const response = await api.get("/users/doctors");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
