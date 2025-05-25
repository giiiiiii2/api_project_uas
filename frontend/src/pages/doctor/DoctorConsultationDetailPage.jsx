"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiCheck, FiX, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import {
  getDoctorConsultations,
  updateConsultationStatus,
} from "../../services/consultationService";

const DoctorConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await getDoctorConsultations();
      setConsultations(data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast.error("Gagal memuat jadwal konsultasi");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (consultation, status) => {
    setSelectedConsultation(consultation);
    setNewStatus(status);
    setShowStatusConfirm(true);
  };

  const handleStatusConfirm = async () => {
    try {
      await updateConsultationStatus(selectedConsultation.id, {
        status: newStatus,
      });

      // Update local state
      setConsultations(
        consultations.map((c) =>
          c.id === selectedConsultation.id ? { ...c, status: newStatus } : c
        )
      );

      toast.success(
        `Status konsultasi berhasil diubah menjadi ${getStatusText(newStatus)}`
      );
    } catch (error) {
      console.error("Error updating consultation status:", error);
      toast.error("Gagal mengubah status konsultasi");
    } finally {
      setShowStatusConfirm(false);
      setSelectedConsultation(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return "Terjadwal";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const filteredConsultations =
    filter === "all"
      ? consultations
      : consultations.filter((c) => c.status === filter);

  if (loading) {
    return <LoadingSpinner className="py-12" />;
  }

  return (
    <div>
      <PageHeader
        title="Jadwal Konsultasi"
        description="Kelola jadwal konsultasi dengan pasien"
      />

      {/* Filter */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "all"
                ? "bg-primary-100 text-primary-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter("scheduled")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "scheduled"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Terjadwal
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Selesai
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Dibatalkan
          </button>
        </div>
      </div>

      {filteredConsultations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-card">
          <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Tidak ada jadwal konsultasi
          </h3>
          <p className="mt-1 text-gray-500">
            {filter === "all"
              ? "Belum ada jadwal konsultasi yang dibuat."
              : `Tidak ada konsultasi dengan status "${getStatusText(
                  filter
                )}".`}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow-card sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pasien
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal & Waktu
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Alasan
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConsultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {consultation.patient_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(consultation.consultation_date)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {consultation.consultation_time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {consultation.reason || "Tidak ada alasan"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        consultation.status
                      )}`}
                    >
                      {getStatusText(consultation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/doctor/consultations/${consultation.id}`}
                        className="text-primary-600 hover:text-primary-900"
                        title="Lihat Detail"
                      >
                        <FiEye className="h-5 w-5" />
                      </Link>

                      {consultation.status === "scheduled" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(consultation, "completed")
                            }
                            className="text-green-600 hover:text-green-900"
                            title="Tandai Selesai"
                          >
                            <FiCheck className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() =>
                              handleStatusChange(consultation, "cancelled")
                            }
                            className="text-red-600 hover:text-red-900"
                            title="Batalkan"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        onConfirm={handleStatusConfirm}
        title={`Ubah Status Konsultasi`}
        message={`Apakah Anda yakin ingin mengubah status konsultasi dengan ${
          selectedConsultation?.patient_name || "pasien"
        } menjadi "${getStatusText(newStatus)}"?`}
        confirmText="Ya, Ubah"
        cancelText="Batal"
        type={newStatus === "cancelled" ? "danger" : "warning"}
      />
    </div>
  );
};

export default DoctorConsultationsPage;