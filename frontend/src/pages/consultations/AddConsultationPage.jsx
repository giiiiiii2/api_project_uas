"use client";

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { toast } from "react-toastify";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { createConsultation } from "../../services/consultationService";
import { getAllDoctors } from "../../services/consultationService";

const ConsultationSchema = Yup.object().shape({
  doctor_id: Yup.number().nullable(),
  consultation_date: Yup.date()
    .required("Tanggal konsultasi wajib diisi")
    .min(new Date(), "Tanggal konsultasi tidak boleh di masa lalu"),
  consultation_time: Yup.string()
    .required("Waktu konsultasi wajib diisi")
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Format waktu tidak valid (HH:MM)"
    ),
  reason: Yup.string(),
  notes: Yup.string(),
});

const AddConsultationPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getAllDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Gagal memuat daftar dokter");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await createConsultation(values);
      toast.success("Jadwal konsultasi berhasil dibuat");
      navigate("/consultations");
    } catch (error) {
      console.error("Error creating consultation:", error);
      toast.error("Gagal membuat jadwal konsultasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return <LoadingSpinner className="py-12" />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link
          to="/consultations"
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <FiArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader
          title="Buat Jadwal Konsultasi"
          description="Atur jadwal konsultasi dengan dokter"
        />
      </div>

      <div className="card">
        <Formik
          initialValues={{
            doctor_id: "",
            consultation_date: today,
            consultation_time: "09:00",
            reason: "",
            notes: "",
          }}
          validationSchema={ConsultationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="doctor_id" className="form-label">
                    Dokter
                  </label>
                  <Field
                    as="select"
                    id="doctor_id"
                    name="doctor_id"
                    className={`form-input ${
                      errors.doctor_id && touched.doctor_id
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">Pilih Dokter (Opsional)</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization || "Umum"}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="doctor_id"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div>
                  <label htmlFor="consultation_date" className="form-label">
                    Tanggal Konsultasi <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="consultation_date"
                    name="consultation_date"
                    type="date"
                    min={today}
                    className={`form-input ${
                      errors.consultation_date && touched.consultation_date
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="consultation_date"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div>
                  <label htmlFor="consultation_time" className="form-label">
                    Waktu Konsultasi <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="consultation_time"
                    name="consultation_time"
                    type="time"
                    className={`form-input ${
                      errors.consultation_time && touched.consultation_time
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="consultation_time"
                    component="div"
                    className="form-error"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reason" className="form-label">
                  Alasan Konsultasi
                </label>
                <Field
                  as="textarea"
                  id="reason"
                  name="reason"
                  rows={3}
                  placeholder="Deskripsikan alasan Anda berkonsultasi"
                  className={`form-input ${
                    errors.reason && touched.reason ? "border-red-500" : ""
                  }`}
                />
                <ErrorMessage
                  name="reason"
                  component="div"
                  className="form-error"
                />
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
                  placeholder="Catatan tambahan (opsional)"
                  className={`form-input ${
                    errors.notes && touched.notes ? "border-red-500" : ""
                  }`}
                />
                <ErrorMessage
                  name="notes"
                  component="div"
                  className="form-error"
                />
              </div>

              <div className="flex justify-end">
                <Link to="/consultations" className="btn btn-outline mr-2">
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary flex items-center"
                >
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
  );
};

export default AddConsultationPage;