"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useAuth } from "../../contexts/AuthContext"
import PageHeader from "../../components/common/PageHeader"
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiLock } from "react-icons/fi"

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required("Nama wajib diisi"),
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  phone: Yup.string(),
  address: Yup.string(),
  date_of_birth: Yup.date().nullable(),
  gender: Yup.string().oneOf(["male", "female", "other"], "Pilih jenis kelamin yang valid"),
})

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Password saat ini wajib diisi"),
  newPassword: Yup.string().min(6, "Password minimal 6 karakter").required("Password baru wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
})

const ProfilePage = () => {
  const { user, updateProfile, updatePassword } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Tambahkan fungsi untuk memformat tanggal dengan benar
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    // Pastikan format tanggal sesuai dengan format input date (YYYY-MM-DD)
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  const handleProfileSubmit = async (values) => {
    setIsSubmitting(true)

    try {
      await updateProfile(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true)

    try {
      const result = await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })

      if (result.success) {
        resetForm()
        setIsChangingPassword(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title="Profil Saya" description="Kelola informasi profil Anda" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Profil</h2>

            <Formik
              initialValues={{
                name: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
                address: user?.address || "",
                date_of_birth: formatDateForInput(user?.date_of_birth) || "",
                gender: user?.gender || "",
              }}
              validationSchema={ProfileSchema}
              onSubmit={handleProfileSubmit}
              enableReinitialize
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="form-label">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          className={`form-input pl-10 ${errors.name && touched.name ? "border-red-500" : ""}`}
                        />
                      </div>
                      <ErrorMessage name="name" component="div" className="form-error" />
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          className={`form-input pl-10 ${errors.email && touched.email ? "border-red-500" : ""}`}
                        />
                      </div>
                      <ErrorMessage name="email" component="div" className="form-error" />
                    </div>

                    <div>
                      <label htmlFor="phone" className="form-label">
                        Nomor Telepon
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="phone"
                          name="phone"
                          type="text"
                          className={`form-input pl-10 ${errors.phone && touched.phone ? "border-red-500" : ""}`}
                        />
                      </div>
                      <ErrorMessage name="phone" component="div" className="form-error" />
                    </div>

                    <div>
                      <label htmlFor="date_of_birth" className="form-label">
                        Tanggal Lahir
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiCalendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="date_of_birth"
                          name="date_of_birth"
                          type="date"
                          className={`form-input pl-10 ${
                            errors.date_of_birth && touched.date_of_birth ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      <ErrorMessage name="date_of_birth" component="div" className="form-error" />
                    </div>

                    <div>
                      <label htmlFor="gender" className="form-label">
                        Jenis Kelamin
                      </label>
                      <Field
                        as="select"
                        id="gender"
                        name="gender"
                        className={`form-input ${errors.gender && touched.gender ? "border-red-500" : ""}`}
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                        <option value="other">Lainnya</option>
                      </Field>
                      <ErrorMessage name="gender" component="div" className="form-error" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="form-label">
                      Alamat
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                        <FiMapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        as="textarea"
                        id="address"
                        name="address"
                        rows={3}
                        className={`form-input pl-10 ${errors.address && touched.address ? "border-red-500" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="address" component="div" className="form-error" />
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                      {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Password Change */}
        <div className="md:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Keamanan</h2>

            {!isChangingPassword ? (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Ubah password Anda secara berkala untuk menjaga keamanan akun.
                </p>
                <button type="button" onClick={() => setIsChangingPassword(true)} className="btn btn-outline w-full">
                  Ubah Password
                </button>
              </div>
            ) : (
              <Formik
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={PasswordSchema}
                onSubmit={handlePasswordSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="form-label">
                        Password Saat Ini
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          className={`form-input pl-10 ${
                            errors.currentPassword && touched.currentPassword ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      <ErrorMessage name="currentPassword" component="div" className="form-error" />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="form-label">
                        Password Baru
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          className={`form-input pl-10 ${
                            errors.newPassword && touched.newPassword ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      <ErrorMessage name="newPassword" component="div" className="form-error" />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="form-label">
                        Konfirmasi Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          className={`form-input pl-10 ${
                            errors.confirmPassword && touched.confirmPassword ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="form-error" />
                    </div>

                    <div className="flex justify-between">
                      <button type="button" onClick={() => setIsChangingPassword(false)} className="btn btn-outline">
                        Batal
                      </button>
                      <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                        {isSubmitting ? "Menyimpan..." : "Simpan Password"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage