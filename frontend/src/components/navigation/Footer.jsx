const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">&copy; {currentYear} MediTrack. All rights reserved.</div>
          <div className="mt-2 md:mt-0 text-sm text-gray-500">Aplikasi Pengelola Riwayat Kesehatan</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer