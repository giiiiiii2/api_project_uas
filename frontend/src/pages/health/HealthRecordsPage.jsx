"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FiPlus, FiFileText, FiTrash2, FiEye } from "react-icons/fi"
import { toast } from "react-toastify"
import PageHeader from "../../components/common/PageHeader"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import EmptyState from "../../components/common/EmptyState"
import ConfirmDialog from "../../components/common/ConfirmDialog"
import { getHealthRecords, deleteHealthRecord } from "../../services/healthRecordService"

const HealthRecordsPage = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchHealthRecords()
  }, [])

  const fetchHealthRecords = async () => {
    try {
      setLoading(true)
      const data = await getHealthRecords()
      setRecords(data)
    } catch (error) {
      console.error("Error fetching health records:", error)
      toast.error("Gagal memuat riwayat kesehatan")
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
      await deleteHealthRecord(deleteId)
      setRecords(records.filter((record) => record.id !== deleteId))
      toast.success("Riwayat kesehatan berhasil dihapus")
    } catch (error) {
      console.error("Error deleting health record:", error)
      toast.error("Gagal menghapus riwayat kesehatan")
    } finally {
      setShowDeleteConfirm(false)
      setDeleteId(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
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
      <PageHeader
        title="Riwayat Kesehatan"
        description="Kelola catatan riwayat kesehatan Anda"
        action={
          <Link to="/health-records/add" className="btn btn-primary">
            <FiPlus className="mr-2 -ml-1 h-5 w-5" />
            Tambah Riwayat
          </Link>
        }
      />

      {records.length === 0 ? (
        <EmptyState
          title="Belum ada riwayat kesehatan"
          description="Mulai catat riwayat kesehatan Anda untuk memantau kondisi kesehatan secara teratur."
          icon={FiFileText}
          actionLink="/health-records/add"
          actionText="Tambah Riwayat Kesehatan"
        />
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tanggal
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Gejala
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Diagnosis
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Pengobatan
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
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(record.record_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {record.symptoms ? (
                        <div className="max-w-xs truncate">{record.symptoms}</div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {record.diagnosis ? (
                        <div className="max-w-xs truncate">{record.diagnosis}</div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {record.treatment ? (
                        <div className="max-w-xs truncate">{record.treatment}</div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/health-records/${record.id}`} className="text-primary-600 hover:text-primary-900">
                          <FiEye className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(record.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

export default HealthRecordsPage