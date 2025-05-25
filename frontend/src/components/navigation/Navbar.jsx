"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { FiMenu, FiBell, FiUser } from "react-icons/fi"
import Logo from "../common/Logo"

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 md:hidden"
              onClick={onMenuClick}
            >
              <FiMenu className="h-6 w-6" />
            </button>

            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard">
                <Logo className="h-8 w-auto" />
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <FiBell className="h-6 w-6" />
              </button>
            </div>

            <div className="ml-3 relative">
              <div className="flex items-center">
                <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                      <FiUser className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-700">{user?.name}</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar