"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FiPlus, FiCalendar, FiTrash2, FiEdit2 } from "react-icons/fi"
import { toast } from "react-toastify"
import PageHeader from "../../components/common/PageHeader"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import EmptyState from "../../components/common/EmptyState"
import ConfirmDialog from "../../components/common/ConfirmDialog"
import { getConsultations, deleteConsultation } from "../../services/consultationService"

const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    try {
      setLoading(true)
      const data = await getConsultations()
      setConsultations(data)
    } catch (error) {
      console.error("Error fetching consultations:", error)
      toast.error("Gagal memuat jadwal konsultasi")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteConsultation(deleteId)
      setConsultations(consultations.filter((consultation) => consultation.id !== deleteId))
      toast.success("Jadwal konsultasi berhasil dihapus")
    } catch (error) {
      console.error("Error deleting consultation:", error)
      toast.error("Gagal menghapus jadwal konsultasi")
    } finally {
      setShowDeleteConfirm(false)
      setDeleteId(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return "Terjadwal"
      case "completed":
        return "Selesai"
      case "cancelled":
        return "Dibatalkan"
      default:
        return status
    }
  }

  if (loading) {
    return <LoadingSpinner className="py-12" />
  }

  return (
    <div>
      <PageHeader
        title="Jadwal Konsultasi"
        description="Kelola jadwal konsultasi dengan dokter"
        action={
          <Link to="/consultations/add" className="btn btn-primary">
            <FiPlus className="mr-2 -ml-1 h-5 w-5" />
            Buat Jadwal
          </Link>
        }
      />

      {consultations.length === 0 ? (
        <EmptyState
          title="Belum ada jadwal konsultasi"
          description="Buat jadwal konsultasi dengan dokter untuk mendapatkan saran medis."
          icon={FiCalendar}
          actionLink="/consultations/add"
          actionText="Buat Jadwal Konsultasi"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{consultation.doctor_name || "Dokter"}</h3>
                  <p className="text-sm text-gray-500">{formatDate(consultation.consultation_date)}</p>
                  <p className="text-sm text-gray-500">Pukul: {consultation.consultation_time}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(consultation.status)}`}
                >
                  {getStatusText(consultation.status)}
                </span>
              </div>

              {consultation.reason && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700">Alasan:</h4>
                  <p className="mt-1 text-sm text-gray-500">{consultation.reason}</p>
                </div>
              )}

              {consultation.notes && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700">Catatan:</h4>
                  <p className="mt-1 text-sm text-gray-500">{consultation.notes}</p>
                </div>
              )}

              <div className="mt-4 flex justify-end space-x-2">
                <Link to={`/consultations/edit/${consultation.id}`} className="text-primary-600 hover:text-primary-900">
                  <FiEdit2 className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDeleteClick(consultation.id)}
                  className="text-red-600 hover:text-red-900"
                  disabled={consultation.status === "completed"}
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Jadwal Konsultasi"
        message="Apakah Anda yakin ingin menghapus jadwal konsultasi ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}

export default ConsultationsPage