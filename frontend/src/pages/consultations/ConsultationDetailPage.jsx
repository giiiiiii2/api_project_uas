"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiMessageCircle,
  FiFileText,
  FiUser,
  FiCalendar,
  FiClock,
  FiSend,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getConsultationById } from "../../services/consultationService";
import { getChatMessages, sendChatMessage } from "../../services/chatService";

const ConsultationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConsultation();
  }, [id]);

  useEffect(() => {
    if (activeTab === "chat") {
      fetchChatMessages();
      const interval = setInterval(fetchChatMessages, 10000); // Poll for new messages every 10 seconds
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConsultation = async () => {
    try {
      setLoading(true);
      const response = await getConsultationById(id);
      setConsultation(response);
    } catch (error) {
      console.error("Error fetching consultation:", error);
      toast.error("Gagal memuat detail konsultasi");
      navigate("/consultations");
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async () => {
    try {
      const messages = await getChatMessages(id);
      setChatMessages(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSendingMessage(true);
      const message = await sendChatMessage(id, newMessage);
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Gagal mengirim pesan");
    } finally {
      setSendingMessage(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Hari ini, ${formatTime(date)}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Kemarin, ${formatTime(date)}`;
    } else {
      return `${formatDate(date)}, ${formatTime(date)}`;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return "Terjadwal";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

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
          title="Detail Konsultasi"
          description={`Dokter: ${consultation.doctor_name || "Dokter"}`}
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "details"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FiFileText className="inline-block mr-2 h-5 w-5" />
            Detail Konsultasi
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "chat"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FiMessageCircle className="inline-block mr-2 h-5 w-5" />
            Chat dengan Dokter
          </button>
        </nav>
      </div>

      {activeTab === "details" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Konsultasi
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Status
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        consultation.status
                      )}`}
                    >
                      {getStatusText(consultation.status)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      ID Konsultasi
                    </h3>
                    <p className="mt-1 text-gray-900">#{consultation.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      <FiCalendar className="inline-block mr-1 h-4 w-4" />{" "}
                      Tanggal Konsultasi
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {formatDate(consultation.consultation_date)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      <FiClock className="inline-block mr-1 h-4 w-4" /> Waktu
                      Konsultasi
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {consultation.consultation_time}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Alasan Konsultasi
                  </h3>
                  <p className="mt-1 text-gray-900 whitespace-pre-line">
                    {consultation.reason || "Tidak ada alasan yang dicatat"}
                  </p>
                </div>

                {consultation.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Catatan Dokter
                    </h3>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-line">
                      {consultation.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Dokter
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <FiUser className="h-10 w-10" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nama</h3>
                  <p className="mt-1 text-gray-900 font-medium">
                    {consultation.doctor_name || "Dokter"}
                  </p>
                </div>

                {consultation.doctor_id && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Spesialisasi
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {consultation.specialization || "Umum"}
                    </p>
                  </div>
                )}

                <div>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="btn btn-primary w-full"
                    disabled={consultation.status !== "scheduled"}
                  >
                    <FiMessageCircle className="mr-2 -ml-1 h-5 w-5" />
                    Chat dengan Dokter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Chat dengan {consultation.doctor_name || "Dokter"}
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FiMessageCircle className="h-12 w-12 mb-2" />
                <p>Belum ada pesan. Mulai percakapan dengan dokter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${
                      msg.sender_type === "patient"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                        msg.sender_type === "patient"
                          ? "bg-primary-100 text-primary-800"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="text-sm">{msg.message}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatMessageTime(msg.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ketik pesan..."
              className="form-input flex-1"
              disabled={consultation.status !== "scheduled" || sendingMessage}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                consultation.status !== "scheduled" ||
                !newMessage.trim() ||
                sendingMessage
              }
            >
              {sendingMessage ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <FiSend className="h-5 w-5" />
              )}
            </button>
          </form>

          {consultation.status !== "scheduled" && (
            <div className="mt-2 text-sm text-gray-500 text-center">
              Chat hanya tersedia untuk konsultasi yang berstatus "Terjadwal"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultationDetailPage;