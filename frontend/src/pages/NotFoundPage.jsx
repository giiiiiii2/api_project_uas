import { Link } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Halaman Tidak Ditemukan</h2>
        <p className="mt-2 text-lg text-gray-600">Maaf, halaman yang Anda cari tidak ditemukan.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiArrowLeft className="mr-2 -ml-1 h-5 w-5" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage