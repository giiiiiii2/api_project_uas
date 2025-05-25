"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import PageHeader from "../../components/common/PageHeader";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiLock,
  FiBriefcase,
  FiAward,
} from "react-icons/fi";

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required("Nama wajib diisi"),
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  phone: Yup.string(),
  address: Yup.string(),
  date_of_birth: Yup.date().nullable(),
  gender: Yup.string().oneOf(
    ["male", "female", "other"],
    "Pilih jenis kelamin yang valid"
  ),
  specialization: Yup.string(),
  practice_years: Yup.number().min(0, "Tahun pengalaman tidak valid"),
  doctor_license: Yup.string(),
  doctor_bio: Yup.string(),
  consultation_fee: Yup.number().min(0, "Biaya konsultasi tidak valid"),
  category: Yup.string(),
  available_days: Yup.string(),
  available_hours: Yup.string(),
});

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Password saat ini wajib diisi"),
  newPassword: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password baru wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});

const DoctorProfilePage = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [categories] = useState([
    "umum",
    "spesialis",
    "gigi",
    "anak",
    "kulit",
    "mata",
    "jantung",
    "saraf",
  ]);
  const [specializations] = useState([
    "Umum",
    "Kardiologi",
    "Dermatologi",
    "Pediatri",
    "Neurologi",
    "Ortopedi",
  ]);
  const [availableDays, setAvailableDays] = useState(
    user?.available_days ? user.available_days.split(",") : []
  );

  // Tambahkan fungsi untuk memformat tanggal dengan benar
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // Pastikan format tanggal sesuai dengan format input date (YYYY-MM-DD)
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleProfileSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      // Create a filtered version of the values object with only the basic user fields
      // that we know exist in the database
      const filteredValues = {
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        address: values.address || null,
        date_of_birth: values.date_of_birth || null,
        gender: values.gender || null,
      };

      // Only add doctor-specific fields if they already exist on the user object
      // This prevents sending fields that don't exist in the database
      if (user.specialization !== undefined)
        filteredValues.specialization = values.specialization;
      if (user.practice_years !== undefined)
        filteredValues.practice_years = values.practice_years;
      if (user.doctor_license !== undefined)
        filteredValues.doctor_license = values.doctor_license;
      if (user.doctor_bio !== undefined)
        filteredValues.doctor_bio = values.doctor_bio;
      if (user.consultation_fee !== undefined)
        filteredValues.consultation_fee = values.consultation_fee;
      if (user.category !== undefined)
        filteredValues.category = values.category;

      // Handle available_days separately
      if (
        user.available_days !== undefined &&
        Array.isArray(availableDays) &&
        availableDays.length > 0
      ) {
        filteredValues.available_days = availableDays.join(",");
      }

      if (user.available_hours !== undefined)
        filteredValues.available_hours = values.available_hours;

      await updateProfile(filteredValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);

    try {
      const result = await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (result.success) {
        resetForm();
        setIsChangingPassword(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDayToggle = (day) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  return (
    <div>
      <PageHeader
        title="Profil Dokter"
        description="Kelola informasi profil dokter Anda"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Profil
            </h2>

            <Formik
              initialValues={{
                name: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
                address: user?.address || "",
                date_of_birth: formatDateForInput(user?.date_of_birth) || "",
                gender: user?.gender || "",
                specialization: user?.specialization || "",
                practice_years: user?.practice_years || "",
                doctor_license: user?.doctor_license || "",
                doctor_bio: user?.doctor_bio || "",
                consultation_fee: user?.consultation_fee || "",
                category: user?.category || "",
                available_hours: user?.available_hours || "",
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
                          className={`form-input pl-10 ${
                            errors.name && touched.name ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="form-error"
                      />
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
                          className={`form-input pl-10 ${
                            errors.email && touched.email
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                      </div>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="form-error"
                      />
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
                          className={`form-input pl-10 ${
                            errors.phone && touched.phone
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                      </div>
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="form-error"
                      />
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
                            errors.date_of_birth && touched.date_of_birth
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                      </div>
                      <ErrorMessage
                        name="date_of_birth"
                        component="div"
                        className="form-error"
                      />
                    </div>

                    <div>
                      <label htmlFor="gender" className="form-label">
                        Jenis Kelamin
                      </label>
                      <Field
                        as="select"
                        id="gender"
                        name="gender"
                        className={`form-input ${
                          errors.gender && touched.gender
                            ? "border-red-500"
                            : ""
                        }`}
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                        <option value="other">Lainnya</option>
                      </Field>
                      <ErrorMessage
                        name="gender"
                        component="div"
                        className="form-error"
                      />
                    </div>

                    {user?.specialization !== undefined && (
                      <div>
                        <label htmlFor="specialization" className="form-label">
                          Spesialisasi
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiBriefcase className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            id="specialization"
                            name="specialization"
                            type="text"
                            className={`form-input pl-10 ${
                              errors.specialization && touched.specialization
                                ? "border-red-500"
                                : ""
                            }`}
                            placeholder="Contoh: Kardiologi, Umum, Anak"
                          />
                        </div>
                        <ErrorMessage
                          name="specialization"
                          component="div"
                          className="form-error"
                        />
                      </div>
                    )}

                    {user?.category !== undefined && (
                      <div>
                        <label htmlFor="category" className="form-label">
                          Kategori
                        </label>
                        <Field
                          as="select"
                          id="category"
                          name="category"
                          className={`form-input ${
                            errors.category && touched.category
                              ? "border-red-500"
                              : ""
                          }`}
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="form-error"
                        />
                      </div>
                    )}

                    {user?.practice_years !== undefined && (
                      <div>
                        <label htmlFor="practice_years" className="form-label">
                          Tahun Pengalaman
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiAward className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            id="practice_years"
                            name="practice_years"
                            type="number"
                            min="0"
                            className={`form-input pl-10 ${
                              errors.practice_years && touched.practice_years
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                        </div>
                        <ErrorMessage
                          name="practice_years"
                          component="div"
                          className="form-error"
                        />
                      </div>
                    )}

                    {user?.doctor_license !== undefined && (
                      <div>
                        <label htmlFor="doctor_license" className="form-label">
                          Nomor Lisensi/STR
                        </label>
                        <Field
                          id="doctor_license"
                          name="doctor_license"
                          type="text"
                          className={`form-input ${
                            errors.doctor_license && touched.doctor_license
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="doctor_license"
                          component="div"
                          className="form-error"
                        />
                      </div>
                    )}

                    {user?.consultation_fee !== undefined && (
                      <div>
                        <label
                          htmlFor="consultation_fee"
                          className="form-label"
                        >
                          Biaya Konsultasi (Rp)
                        </label>
                        <Field
                          id="consultation_fee"
                          name="consultation_fee"
                          type="number"
                          min="0"
                          className={`form-input ${
                            errors.consultation_fee && touched.consultation_fee
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="consultation_fee"
                          component="div"
                          className="form-error"
                        />
                      </div>
                    )}

                    {user?.available_hours !== undefined && (
                      <div>
                        <label htmlFor="available_hours" className="form-label">
                          Jam Praktik
                        </label>
                        <Field
                          id="available_hours"
                          name="available_hours"
                          type="text"
                          className={`form-input ${
                            errors.available_hours && touched.available_hours
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="Contoh: 09:00-17:00"
                        />
                        <ErrorMessage
                          name="available_hours"
                          component="div"
                          className="form-error"
                        />
                      </div>
                    )}
                  </div>

                  {user?.available_days !== undefined && (
                    <div>
                      <label className="form-label">Hari Praktik</label>
                      <div className="grid grid-cols-7 gap-2">
                        {[
                          "Senin",
                          "Selasa",
                          "Rabu",
                          "Kamis",
                          "Jumat",
                          "Sabtu",
                          "Minggu",
                        ].map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDayToggle(day)}
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              availableDays.includes(day)
                                ? "bg-primary-100 text-primary-800 border border-primary-300"
                                : "bg-gray-100 text-gray-800 border border-gray-300"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {user?.doctor_bio !== undefined && (
                    <div>
                      <label htmlFor="doctor_bio" className="form-label">
                        Biografi
                      </label>
                      <Field
                        as="textarea"
                        id="doctor_bio"
                        name="doctor_bio"
                        rows={4}
                        className={`form-input ${
                          errors.doctor_bio && touched.doctor_bio
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="Ceritakan tentang pengalaman dan keahlian Anda"
                      />
                      <ErrorMessage
                        name="doctor_bio"
                        component="div"
                        className="form-error"
                      />
                    </div>
                  )}

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
                        className={`form-input pl-10 ${
                          errors.address && touched.address
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                    </div>
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Keamanan
            </h2>

            {!isChangingPassword ? (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Ubah password Anda secara berkala untuk menjaga keamanan akun.
                </p>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(true)}
                  className="btn btn-outline w-full"
                >
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
                            errors.currentPassword && touched.currentPassword
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                      </div>
                      <ErrorMessage
                        name="currentPassword"
                        component="div"
                        className="form-error"
                      />
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
                            errors.newPassword && touched.newPassword
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                      </div>
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="form-error"
                      />
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
                            errors.confirmPassword && touched.confirmPassword
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="form-error"
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="btn btn-outline"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                      >
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
  );
};

export default DoctorProfilePage;