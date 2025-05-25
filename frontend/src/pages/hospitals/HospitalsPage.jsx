"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiClock, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  getProvinces,
  getCities,
  searchHospitals,
} from "../../services/hospitalApiService";

const HospitalSearchPage = () => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchParams, setSearchParams] = useState({
    jenis: 2, // Default to non-COVID beds (jenis=2)
    propinsi: "", // Empty by default
    kabkota: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const data = await getProvinces();
        setProvinces(data.provinces);

        // Set default province if available
        if (data.provinces.length > 0) {
          setSearchParams((prev) => ({
            ...prev,
            propinsi: data.provinces[0].code,
          }));
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        toast.error("Gagal memuat daftar provinsi");
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!searchParams.propinsi) {
        setCities([]);
        return;
      }

      try {
        setLoadingCities(true);
        const response = await getCities(searchParams.propinsi);
        setCities(response.cities || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Gagal memuat daftar kota");
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [searchParams.propinsi]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await searchHospitals(searchParams);
      if (result.success) {
        setSearchResults(result.data);
      } else {
        console.error("Error searching hospitals:", result.message);
        toast.error("Gagal mencari rumah sakit: " + result.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching hospitals:", error);
      toast.error("Gagal mencari rumah sakit");
      setSearchResults([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  if (loadingProvinces) {
    return <LoadingSpinner className="py-12" />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link
          to="/dashboard"
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <FiArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader
          title="Cari Rumah Sakit"
          description="Cari informasi ketersediaan tempat tidur di rumah sakit"
        />
      </div>

      <div className="card mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="jenis" className="form-label">
                Pilih Tempat Tidur
              </label>
              <select
                id="jenis"
                name="jenis"
                value={searchParams.jenis}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="1">Covid 19</option>
                <option value="2">Non Covid 19</option>
              </select>
            </div>

            <div>
              <label htmlFor="propinsi" className="form-label">
                Propinsi
              </label>
              <select
                id="propinsi"
                name="propinsi"
                value={searchParams.propinsi}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">-- Pilih Propinsi --</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="kabkota" className="form-label">
                Kab/Kota
              </label>
              <select
                id="kabkota"
                name="kabkota"
                value={searchParams.kabkota}
                onChange={handleInputChange}
                className="form-input"
                disabled={loadingCities}
              >
                <option value="">-- Semua --</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <FiSearch className="mr-2" />
              )}
              Cari
            </button>
          </div>
        </form>
      </div>

      {hasSearched && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {searchResults.length > 0
              ? `Ditemukan ${searchResults.length} Rumah Sakit`
              : "Tidak ada rumah sakit yang ditemukan"}
          </h2>

          {Array.isArray(searchResults) &&
            searchResults.map((hospital) => (
              <div key={hospital.id} className="card mb-4">
                <h3 className="text-lg font-bold text-primary-700 mb-2">
                  {hospital.name}
                </h3>
                <p className="flex items-start mb-4">
                  <FiMapPin className="mr-2 mt-1 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700">{hospital.address}</span>
                </p>

                <h4 className="font-medium text-gray-800 mb-2">
                  Ketersediaan Tempat Tidur:
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ruangan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kelas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tersedia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Update Terakhir
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {hospital.beds.map((bed, index) => (
                        <tr
                          key={index}
                          className={bed.available > 0 ? "bg-green-50" : ""}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {bed.ward}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {bed.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                bed.available > 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {bed.available} bed kosong
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <FiClock className="mr-1" />
                              {bed.lastUpdated}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/hospitals/${hospital.id}`}
                    className="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default HospitalSearchPage;
