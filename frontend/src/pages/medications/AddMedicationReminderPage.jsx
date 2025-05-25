"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik"
import * as Yup from "yup"
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from "react-icons/fi"
import { toast } from "react-toastify"
import PageHeader from "../../components/common/PageHeader"
import { createMedicationReminder } from "../../services/medicationReminderService"

const MedicationReminderSchema = Yup.object().shape({
  medication_name: Yup.string().required("Nama obat wajib diisi"),
  dosage: Yup.string(),
  frequency: Yup.string().required("Frekuensi wajib diisi"),
  start_date: Yup.date().required("Tanggal mulai wajib diisi"),
  end_date: Yup.date().nullable().min(Yup.ref("start_date"), "Tanggal selesai harus setelah tanggal mulai"),
  time_slots: Yup.array()
    .of(Yup.string().required("Waktu wajib diisi"))
    .min(1, "Minimal satu waktu harus diisi")
    .required("Waktu wajib diisi"),
  notes: Yup.string(),
})

const AddMedicationReminderPage = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true)
      await createMedicationReminder(values)
      toast.success("Pengingat obat berhasil ditambahkan")
      navigate("/medication-reminders")
    } catch (error) {
      console.error("Error adding medication reminder:", error)
      toast.error("Gagal menambahkan pengingat obat")
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to="/medication-reminders" className="mr-4 text-gray-500 hover:text-gray-700">
          <FiArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader title="Tambah Pengingat Obat" description="Atur jadwal minum obat baru" />
      </div>

      <div className="card">
        <Formik
          initialValues={{
            medication_name: "",
            dosage: "",
            frequency: "",
            start_date: today,
            end_date: "",
            time_slots: ["08:00"],
            notes: "",
          }}
          validationSchema={MedicationReminderSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="medication_name" className="form-label">
                    Nama Obat <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="medication_name"
                    name="medication_name"
                    type="text"
                    placeholder="Contoh: Paracetamol"
                    className={`form-input ${
                      errors.medication_name && touched.medication_name ? "border-red-500" : ""
                    }`}
                  />
                  <ErrorMessage name="medication_name" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="dosage" className="form-label">
                    Dosis
                  </label>
                  <Field
                    id="dosage"
                    name="dosage"
                    type="text"
                    placeholder="Contoh: 500mg"
                    className={`form-input ${errors.dosage && touched.dosage ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="dosage" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="frequency" className="form-label">
                    Frekuensi <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="frequency"
                    name="frequency"
                    type="text"
                    placeholder="Contoh: 3x sehari"
                    className={`form-input ${errors.frequency && touched.frequency ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="frequency" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="start_date" className="form-label">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="start_date"
                    name="start_date"
                    type="date"
                    min={today}
                    className={`form-input ${errors.start_date && touched.start_date ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="start_date" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="end_date" className="form-label">
                    Tanggal Selesai
                  </label>
                  <Field
                    id="end_date"
                    name="end_date"
                    type="date"
                    min={values.start_date}
                    className={`form-input ${errors.end_date && touched.end_date ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="end_date" component="div" className="form-error" />
                </div>
              </div>

              <div>
                <label className="form-label">
                  Waktu <span className="text-red-500">*</span>
                </label>
                <FieldArray name="time_slots">
                  {({ remove, push }) => (
                    <div className="space-y-2">
                      {values.time_slots.map((time, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Field
                            name={`time_slots.${index}`}
                            type="time"
                            className={`form-input ${
                              errors.time_slots?.[index] && touched.time_slots?.[index] ? "border-red-500" : ""
                            }`}
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push("")}
                        className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                      >
                        <FiPlus className="mr-1" /> Tambah Waktu
                      </button>
                      {typeof errors.time_slots === "string" && <div className="form-error">{errors.time_slots}</div>}
                    </div>
                  )}
                </FieldArray>
              </div>

              <div>
                <label htmlFor="notes" className="form-label">
                  Catatan
                </label>
                <Field
                  as="textarea"
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Catatan tambahan (opsional)"
                  className={`form-input ${errors.notes && touched.notes ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="notes" component="div" className="form-error" />
              </div>

              <div className="flex justify-end">
                <Link to="/medication-reminders" className="btn btn-outline mr-2">
                  Batal
                </Link>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary flex items-center">
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <FiSave className="mr-2 -ml-1 h-5 w-5" />
                  )}
                  Simpan
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddMedicationReminderPage