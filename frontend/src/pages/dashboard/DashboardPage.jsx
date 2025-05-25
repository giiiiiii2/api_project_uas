"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FiPlus, FiFileText, FiClock, FiCalendar, FiActivity } from "react-icons/fi"
import { useAuth } from "../../contexts/AuthContext"
import PageHeader from "../../components/common/PageHeader"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { getTodayReminders } from "../../services/medicationReminderService"
import { getUpcomingConsultations } from "../../services/consultationService"
import { getHealthRecords } from "../../services/healthRecordService"

const DashboardPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [todayReminders, setTodayReminders] = useState([])
  const [upcomingConsultations, setUpcomingConsultations] = useState([])
  const [recentHealthRecords, setRecentHealthRecords] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch data in parallel
        const [remindersRes, consultationsRes, recordsRes] = await Promise.all([
          getTodayReminders(),
          getUpcomingConsultations(),
          getHealthRecords(),
        ])

        setTodayReminders(remindersRes)
        setUpcomingConsultations(consultationsRes)
        setRecentHealthRecords(recordsRes.slice(0, 3)) // Get only the 3 most recent records
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

  return (
    <div>
      <PageHeader
        title={`Selamat datang, ${user?.name || "User"}!`}
        description="Pantau kesehatan Anda dengan MediTrack"
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/health-records/add" className="card flex items-center p-4 hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
            <FiFileText className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Tambah Riwayat Kesehatan</h3>
            <p className="text-sm text-gray-500">Catat kondisi kesehatan Anda</p>
          </div>
        </Link>

        <Link to="/medication-reminders/add" className="card flex items-center p-4 hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
            <FiClock className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Tambah Pengingat Obat</h3>
            <p className="text-sm text-gray-500">Atur jadwal minum obat</p>
          </div>
        </Link>

        <Link to="/consultations/add" className="card flex items-center p-4 hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
            <FiCalendar className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Buat Jadwal Konsultasi</h3>
            <p className="text-sm text-gray-500">Atur jadwal konsultasi dengan dokter</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Medication Reminders */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pengingat Obat Hari Ini</h2>
            <Link to="/medication-reminders" className="text-sm text-primary-600 hover:text-primary-700">
              Lihat Semua
            </Link>
          </div>

          {todayReminders.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <FiClock className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-gray-500">Tidak ada pengingat obat untuk hari ini</p>
              <Link
                to="/medication-reminders/add"
                className="mt-3 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                <FiPlus className="mr-1" /> Tambah Pengingat
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todayReminders.map((reminder) => (
                <div key={reminder.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{reminder.medication_name}</h3>
                      <p className="text-sm text-gray-500">
                        {reminder.dosage} - {reminder.frequency}
                      </p>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Consultations */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Jadwal Konsultasi Mendatang</h2>
            <Link to="/consultations" className="text-sm text-primary-600 hover:text-primary-700">
              Lihat Semua
            </Link>
          </div>

          {upcomingConsultations.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <FiCalendar className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-gray-500">Tidak ada jadwal konsultasi mendatang</p>
              <Link
                to="/consultations/add"
                className="mt-3 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                <FiPlus className="mr-1" /> Buat Jadwal
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingConsultations.map((consultation) => (
                <div key={consultation.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{consultation.doctor_name || "Dokter"}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(consultation.consultation_date).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-500">{consultation.consultation_time}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {consultation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Health Records */}
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Kesehatan Terbaru</h2>
            <Link to="/health-records" className="text-sm text-primary-600 hover:text-primary-700">
              Lihat Semua
            </Link>
          </div>

          {recentHealthRecords.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <FiActivity className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-gray-500">Belum ada riwayat kesehatan</p>
              <Link
                to="/health-records/add"
                className="mt-3 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                <FiPlus className="mr-1" /> Tambah Riwayat
              </Link>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentHealthRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.record_date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{record.symptoms || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{record.diagnosis || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{record.treatment || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage