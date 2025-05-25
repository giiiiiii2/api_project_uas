"use client"

import { NavLink } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { FiX, FiHome, FiFileText, FiClock, FiCalendar, FiMapPin, FiUser, FiLogOut } from "react-icons/fi"

const Sidebar = ({ open, onClose }) => {
  const { logout } = useAuth()

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome className="h-5 w-5" /> },
    { name: "Riwayat Kesehatan", path: "/health-records", icon: <FiFileText className="h-5 w-5" /> },
    { name: "Pengingat Obat", path: "/medication-reminders", icon: <FiClock className="h-5 w-5" /> },
    { name: "Konsultasi Dokter", path: "/consultations", icon: <FiCalendar className="h-5 w-5" /> },
    { name: "Rumah Sakit Terdekat", path: "/hospitals", icon: <FiMapPin className="h-5 w-5" /> },
    { name: "Profil", path: "/profile", icon: <FiUser className="h-5 w-5" /> },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${open ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>

        <div className="fixed inset-y-0 left-0 flex flex-col max-w-xs w-full bg-white shadow-xl">
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <div className="text-xl font-semibold text-primary-600">MediTrack</div>
            <button
              type="button"
              className="rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={onClose}
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive ? "bg-primary-50 text-primary-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                  onClick={onClose}
                >
                  <div className="mr-4 flex-shrink-0 text-gray-500">{item.icon}</div>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50 w-full"
            >
              <FiLogOut className="mr-4 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-primary-50 text-primary-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <div className="mr-3 flex-shrink-0 text-gray-500">{item.icon}</div>
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 w-full"
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar