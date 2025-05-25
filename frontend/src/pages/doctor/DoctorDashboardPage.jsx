"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FiCalendar, FiUsers, FiClock, FiEdit } from "react-icons/fi"
import { useAuth } from "../../contexts/AuthContext"
import PageHeader from "../../components/common/PageHeader"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { getDoctorConsultations } from "../../services/consultationService"

const DoctorDashboardPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [consultations, setConsultations] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const consultationsData = await getDoctorConsultations()
        setConsultations(consultationsData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingSpinner className="py-12" />
  }

  // Group consultations by status
  const upcomingConsultations = consultations.filter((c) => c.status === "scheduled")
  const completedConsultations = consultations.filter((c) => c.status === "completed")
  const cancelledConsultations = consultations.filter((c) => c.status === "cancelled")

  return (
    <div>
      <PageHeader
        title={`Selamat datang, Dr. ${user?.name || "User"}!`}
        description="Kelola jadwal konsultasi dan pasien Anda"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
            <FiCalendar className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Jadwal Hari Ini</p>
            <h3 className="text-2xl font-semibold text-gray-900">
              {
                upcomingConsultations.filter((c) => {
                  const today = new Date().toISOString().split("T")[0]
                  return c.consultation_date === today
                }).length
              }
            </h3>
          </div>
        </div>

        <div className="card flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <FiUsers className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pasien</p>
            <h3 className="text-2xl font-semibold text-gray-900">
              {new Set(consultations.map((c) => c.user_id)).size}
            </h3>
          </div>
        </div>

        <div className="card flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <FiClock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Konsultasi Mendatang</p>
            <h3 className="text-2xl font-semibold text-gray-900">{upcomingConsultations.length}</h3>
          </div>
        </div>
      </div>

      {/* Upcoming Consultations */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Jadwal Konsultasi Mendatang</h2>
          <Link to="/doctor/consultations" className="text-sm text-primary-600 hover:text-primary-700">
            Lihat Semua
          </Link>
        </div>

        {upcomingConsultations.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <FiCalendar className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-gray-500">Tidak ada jadwal konsultasi mendatang</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingConsultations.slice(0, 5).map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{consultation.patient_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(consultation.consultation_date).toLocaleDateString("id-ID")}
                      </div>
                      <div className="text-sm text-gray-500">{consultation.consultation_time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {consultation.reason || "Tidak ada alasan"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/doctor/consultations/${consultation.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEdit className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Completed Consultations */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Konsultasi Selesai Terbaru</h2>
          <Link to="/doctor/consultations/completed" className="text-sm text-primary-600 hover:text-primary-700">
            Lihat Semua
          </Link>
        </div>

        {completedConsultations.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <FiCalendar className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-gray-500">Belum ada konsultasi yang selesai</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedConsultations.slice(0, 5).map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{consultation.patient_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(consultation.consultation_date).toLocaleDateString("id-ID")}
                      </div>
                      <div className="text-sm text-gray-500">{consultation.consultation_time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {consultation.notes || "Tidak ada catatan"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorDashboardPage