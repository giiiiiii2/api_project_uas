"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FiPlus, FiClock, FiTrash2, FiEdit2 } from "react-icons/fi"
import { toast } from "react-toastify"
import PageHeader from "../../components/common/PageHeader"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import EmptyState from "../../components/common/EmptyState"
import ConfirmDialog from "../../components/common/ConfirmDialog"
import { getMedicationReminders, deleteMedicationReminder } from "../../services/medicationReminderService"

const MedicationRemindersPage = () => {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchMedicationReminders()
  }, [])

  const fetchMedicationReminders = async () => {
    try {
      setLoading(true)
      const data = await getMedicationReminders()
      setReminders(data)
    } catch (error) {
      console.error("Error fetching medication reminders:", error)
      toast.error("Gagal memuat pengingat obat")
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
      await deleteMedicationReminder(deleteId)
      setReminders(reminders.filter((reminder) => reminder.id !== deleteId))
      toast.success("Pengingat obat berhasil dihapus")
    } catch (error) {
      console.error("Error deleting medication reminder:", error)
      toast.error("Gagal menghapus pengingat obat")
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
        title="Pengingat Obat"
        description="Kelola jadwal minum obat Anda"
        action={
          <Link to="/medication-reminders/add" className="btn btn-primary">
            <FiPlus className="mr-2 -ml-1 h-5 w-5" />
            Tambah Pengingat
          </Link>
        }
      />

      {reminders.length === 0 ? (
        <EmptyState
          title="Belum ada pengingat obat"
          description="Tambahkan pengingat obat untuk membantu Anda mengingat jadwal minum obat."
          icon={FiClock}
          actionLink="/medication-reminders/add"
          actionText="Tambah Pengingat Obat"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="card">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{reminder.medication_name}</h3>
                <div className="flex space-x-2">
                  <Link
                    to={`/medication-reminders/edit/${reminder.id}`}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </Link>
                  <button onClick={() => handleDeleteClick(reminder.id)} className="text-red-600 hover:text-red-900">
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                {reminder.dosage && <p>Dosis: {reminder.dosage}</p>}
                <p>Frekuensi: {reminder.frequency}</p>
                <p>Mulai: {formatDate(reminder.start_date)}</p>
                {reminder.end_date && <p>Selesai: {formatDate(reminder.end_date)}</p>}
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700">Jadwal:</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {reminder.time_slots.map((time, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              {reminder.notes && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700">Catatan:</h4>
                  <p className="mt-1 text-sm text-gray-500">{reminder.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Pengingat Obat"
        message="Apakah Anda yakin ingin menghapus pengingat obat ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}

export default MedicationRemindersPage