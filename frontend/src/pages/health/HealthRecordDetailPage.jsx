"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { FiArrowLeft, FiEdit2, FiTrash2 } from "react-icons/fi"
import { toast } from "react-toastify"
import PageHeader from "../../components/common/PageHeader"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import ConfirmDialog from "../../components/common/ConfirmDialog"
import { getHealthRecordById, deleteHealthRecord } from "../../services/healthRecordService"

const HealthRecordDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchHealthRecord()
  }, [id])

  const fetchHealthRecord = async () => {
    try {
      setLoading(true)
      const data = await getHealthRecordById(id)
      setRecord(data)
    } catch (error) {
      console.error("Error fetching health record:", error)
      toast.error("Gagal memuat detail riwayat kesehatan")
      navigate("/health-records")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteHealthRecord(id)
      toast.success("Riwayat kesehatan berhasil dihapus")
      navigate("/health-records")
    } catch (error) {
      console.error("Error deleting health record:", error)
      toast.error("Gagal menghapus riwayat kesehatan")
    } finally {
      setShowDeleteConfirm(false)
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

  if (loading) {
    return <LoadingSpinner className="py-12" />
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to="/health-records" className="mr-4 text-gray-500 hover:text-gray-700">
          <FiArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader
          title="Detail Riwayat Kesehatan"
          description={`Tanggal: ${formatDate(record.record_date)}`}
          action={
            <div className="flex space-x-2">
              <Link to={`/health-records/edit/${record.id}`} className="btn btn-outline flex items-center">
                <FiEdit2 className="mr-2 -ml-1 h-5 w-5" />
                Edit
              </Link>
              <button
                onClick={handleDeleteClick}
                className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 flex items-center"
              >
                <FiTrash2 className="mr-2 -ml-1 h-5 w-5" />
                Hapus
              </button>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Umum</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tanggal Pencatatan</h3>
              <p className="mt-1 text-gray-900">{formatDate(record.record_date)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Gejala</h3>
              <p className="mt-1 text-gray-900 whitespace-pre-line">
                {record.symptoms || "Tidak ada gejala yang dicatat"}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Diagnosis & Pengobatan</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Diagnosis</h3>
              <p className="mt-1 text-gray-900 whitespace-pre-line">
                {record.diagnosis || "Tidak ada diagnosis yang dicatat"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pengobatan</h3>
              <p className="mt-1 text-gray-900 whitespace-pre-line">
                {record.treatment || "Tidak ada pengobatan yang dicatat"}
              </p>
            </div>
          </div>
        </div>

        <div className="card md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Catatan Tambahan</h2>
          <p className="text-gray-900 whitespace-pre-line">{record.notes || "Tidak ada catatan tambahan"}</p>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Riwayat Kesehatan"
        message="Apakah Anda yakin ingin menghapus riwayat kesehatan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}

export default HealthRecordDetailPage
