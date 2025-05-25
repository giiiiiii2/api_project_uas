"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import DoctorNavbar from "../components/navigation/DoctorNavbar"
import DoctorSidebar from "../components/navigation/DoctorSidebar"
import Footer from "../components/navigation/Footer"

const DoctorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DoctorNavbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1">
        <DoctorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default DoctorLayout