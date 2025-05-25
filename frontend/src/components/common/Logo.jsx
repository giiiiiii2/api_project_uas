import { FiActivity } from "react-icons/fi"

const Logo = ({ className = "h-8 w-auto" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <FiActivity className="text-primary-600 h-full w-auto" />
      <span className="ml-2 text-xl font-bold text-primary-600">MediTrack</span>
    </div>
  )
}

export default Logo
