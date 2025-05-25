import { Link } from "react-router-dom"
import { FiPlus } from "react-icons/fi"

const EmptyState = ({
  title = "Tidak ada data",
  description = "Belum ada data yang tersedia.",
  icon: Icon,
  actionLink,
  actionText = "Tambah Baru",
}) => {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-xl shadow-card">
      {Icon && (
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      {actionLink && (
        <div className="mt-6">
          <Link
            to={actionLink}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            {actionText}
          </Link>
        </div>
      )}
    </div>
  )
}

export default EmptyState

