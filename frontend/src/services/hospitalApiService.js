import api from "./api";

// Fungsi untuk mendapatkan daftar provinsi
export const getProvinces = async () => {
  try {
    const response = await api.get("/hospitals/get-provinces");

    // Transform data to match frontend expectations
    return {
      provinces: response.data.provinces.map((province) => ({
        code: province.id,
        name: province.name,
      })),
    };
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

// Fungsi untuk mendapatkan daftar kota berdasarkan provinsi
export const getCities = async (provinceId) => {
  try {
    const response = await api.get("/hospitals/get-cities", {
      params: { provinceid: provinceId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

// Fungsi untuk mencari rumah sakit berdasarkan filter
export const searchHospitals = async (filters) => {
  try {
    const { jenis, propinsi, kabkota } = filters;

    const response = await api.get("/hospitals/get-hospitals", {
      params: {
        type: jenis,
        provinceid: propinsi,
        cityid: kabkota || "",
      },
    });

    // Transform data to match frontend expectations
    const transformedData = response.data.hospitals.map((hospital) => {
      // For type 2 (non-COVID), transform available_beds to beds format
      if (jenis === 2) {
        return {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          beds: hospital.available_beds.map((bed) => ({
            ward: bed.room_name,
            class: bed.bed_class,
            available: bed.available,
            lastUpdated: new Date().toLocaleString(), // API doesn't provide this, using current time
          })),
        };
      }
      // For type 1 (COVID), create a simpler structure
      else {
        return {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          beds: [
            {
              ward: "COVID-19",
              class: "-",
              available: hospital.bed_availability,
              lastUpdated: new Date().toLocaleString(),
            },
          ],
        };
      }
    });

    return {
      success: true,
      data: transformedData,
    };
  } catch (error) {
    console.error("Error searching hospitals:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

// Fungsi untuk mendapatkan detail rumah sakit
export const getHospitalDetails = async (hospitalId) => {
  try {
    // Fetch bed details
    const bedResponse = await api.get("/hospitals/get-bed-detail", {
      params: {
        hospitalid: hospitalId,
        type: 2, // Default to non-COVID
      },
    });

    // Fetch hospital map data
    const mapResponse = await api.get("/hospitals/get-hospital-map", {
      params: {
        hospitalid: hospitalId,
      },
    });

    // Combine and transform data
    const hospitalData = bedResponse.data.data;
    const mapData = mapResponse.data.data;

    // Transform bed details to match frontend expectations
    const transformedBeds = hospitalData.bedDetail.map((bed) => ({
      ward: bed.stats.title,
      class: "-", // API doesn't provide this
      available: bed.stats.bed_empty,
      lastUpdated: bed.time,
    }));

    return {
      success: true,
      data: {
        id: hospitalId,
        name: hospitalData.name,
        address: hospitalData.address,
        phone: hospitalData.phone,
        email: null, // API doesn't provide this
        website: null, // API doesn't provide this
        coordinates: {
          lat: mapData.lat,
          lng: mapData.long,
        },
        gmapsUrl: mapData.gmaps,
        beds: transformedBeds,
      },
    };
  } catch (error) {
    console.error("Error fetching hospital details:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

// Fungsi untuk menambahkan rumah sakit ke favorit
export const addFavoriteHospital = async (hospitalData) => {
  try {
    const response = await api.post("/hospitals/favorites", hospitalData);
    return response.data;
  } catch (error) {
    console.error("Error adding hospital to favorites:", error);
    throw error;
  }
};
