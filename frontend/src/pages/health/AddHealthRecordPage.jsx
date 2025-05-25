"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { FiArrowLeft, FiSave } from "react-icons/fi"
import { toast } from "react-toastify"
import PageHeader from "../../components/common/PageHeader"
import { createHealthRecord } from "../../services/healthRecordService"

const HealthRecordSchema = Yup.object().shape({
  record_date: Yup.date().required("Tanggal wajib diisi").max(new Date(), "Tanggal tidak boleh lebih dari hari ini"),
  symptoms: Yup.string(),
  diagnosis: Yup.string(),
  treatment: Yup.string(),
  notes: Yup.string(),
})

const AddHealthRecordPage = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true)
      await createHealthRecord(values)
      toast.success("Riwayat kesehatan berhasil ditambahkan")
      navigate("/health-records")
    } catch (error) {
      console.error("Error adding health record:", error)
      toast.error("Gagal menambahkan riwayat kesehatan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to="/health-records" className="mr-4 text-gray-500 hover:text-gray-700">
          <FiArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader title="Tambah Riwayat Kesehatan" description="Catat riwayat kesehatan baru" />
      </div>

      <div className="card">
        <Formik
          initialValues={{
            record_date: today,
            symptoms: "",
            diagnosis: "",
            treatment: "",
            notes: "",
          }}
          validationSchema={HealthRecordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="record_date" className="form-label">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <Field
                  id="record_date"
                  name="record_date"
                  type="date"
                  max={today}
                  className={`form-input ${errors.record_date && touched.record_date ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="record_date" component="div" className="form-error" />
              </div>

              <div>
                <label htmlFor="symptoms" className="form-label">
                  Gejala
                </label>
                <Field
                  as="textarea"
                  id="symptoms"
                  name="symptoms"
                  rows={3}
                  placeholder="Deskripsikan gejala yang Anda alami"
                  className={`form-input ${errors.symptoms && touched.symptoms ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="symptoms" component="div" className="form-error" />
              </div>

              <div>
                <label htmlFor="diagnosis" className="form-label">
                  Diagnosis
                </label>
                <Field
                  as="textarea"
                  id="diagnosis"
                  name="diagnosis"
                  rows={3}
                  placeholder="Diagnosis dari dokter (jika ada)"
                  className={`form-input ${errors.diagnosis && touched.diagnosis ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="diagnosis" component="div" className="form-error" />
              </div>

              <div>
                <label htmlFor="treatment" className="form-label">
                  Pengobatan
                </label>
                <Field
                  as="textarea"
                  id="treatment"
                  name="treatment"
                  rows={3}
                  placeholder="Pengobatan yang diberikan atau dilakukan"
                  className={`form-input ${errors.treatment && touched.treatment ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="treatment" component="div" className="form-error" />
              </div>

              <div>
                <label htmlFor="notes" className="form-label">
                  Catatan Tambahan
                </label>
                <Field
                  as="textarea"
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Catatan tambahan lainnya"
                  className={`form-input ${errors.notes && touched.notes ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="notes" component="div" className="form-error" />
              </div>

              <div className="flex justify-end">
                <Link to="/health-records" className="btn btn-outline mr-2">
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

export default AddHealthRecordPage
