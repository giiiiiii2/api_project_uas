import { Link } from "react-router-dom"
import { FiActivity, FiFileText, FiClock, FiCalendar, FiMapPin, FiArrowRight } from "react-icons/fi"
import Logo from "../components/common/Logo"

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Logo className="h-8 w-auto" />
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Kelola Kesehatan Anda dengan Lebih Mudah
              </h1>
              <p className="mt-4 text-lg text-primary-100">
                MediTrack membantu Anda mencatat riwayat kesehatan, mengatur jadwal minum obat, dan merencanakan
                konsultasi dengan dokter.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="btn bg-white text-primary-700 hover:bg-gray-100">
                  Mulai Sekarang
                </Link>
                <Link
                  to="/login"
                  className="btn bg-primary-700 text-white hover:bg-primary-800 border border-primary-500"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-300 rounded-full opacity-20 transform -rotate-6"></div>
                <div className="relative bg-white p-6 rounded-xl shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FiActivity className="h-6 w-6 text-primary-600" />
                      <span className="ml-2 font-semibold text-gray-800">Riwayat Kesehatan</span>
                    </div>
                    <span className="text-sm text-gray-500">Hari ini</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-800">Tekanan Darah</span>
                        <span className="text-primary-600 font-medium">120/80 mmHg</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-800">Gula Darah</span>
                        <span className="text-primary-600 font-medium">100 mg/dL</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-800">Berat Badan</span>
                        <span className="text-primary-600 font-medium">65 kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Fitur Utama</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              MediTrack menyediakan berbagai fitur untuk membantu Anda mengelola kesehatan dengan lebih efisien.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <FiFileText className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Riwayat Kesehatan</h3>
              <p className="mt-2 text-gray-600">
                Catat dan pantau riwayat kesehatan Anda, termasuk gejala, diagnosis, dan pengobatan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <FiClock className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Pengingat Obat</h3>
              <p className="mt-2 text-gray-600">
                Atur jadwal minum obat dan dapatkan pengingat agar tidak melewatkan dosis yang diperlukan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <FiCalendar className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Konsultasi Dokter</h3>
              <p className="mt-2 text-gray-600">
                Jadwalkan konsultasi dengan dokter dan dapatkan pengingat untuk kunjungan medis Anda.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <FiMapPin className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Rumah Sakit Terdekat</h3>
              <p className="mt-2 text-gray-600">
                Temukan rumah sakit terdekat berdasarkan lokasi Anda untuk mendapatkan layanan medis dengan cepat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Mulai Kelola Kesehatan Anda Sekarang</h2>
            <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
              Daftar gratis dan mulai menggunakan MediTrack untuk mengelola kesehatan Anda dengan lebih baik.
            </p>
            <div className="mt-8">
              <Link to="/register" className="btn bg-white text-primary-700 hover:bg-gray-100">
                Daftar Sekarang <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo className="h-8 w-auto text-white" />
              <p className="mt-4 text-gray-400">
                Aplikasi pengelola riwayat kesehatan yang membantu Anda mengelola kesehatan dengan lebih efisien.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Fitur</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Riwayat Kesehatan
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Pengingat Obat
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Konsultasi Dokter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Rumah Sakit Terdekat
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Tentang Kami</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Tim
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Kontak
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Syarat dan Ketentuan
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Hubungi Kami</h3>
              <p className="text-gray-400">
                Email: info@meditrack.com
                <br />
                Telepon: (123) 456-7890
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MediTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage