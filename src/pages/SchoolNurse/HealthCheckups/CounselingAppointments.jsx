import React, { useEffect, useState } from 'react';
import { getCounselingAppointmentsByStaffId } from '../../../services/apiServices';
import { toast } from 'react-toastify';
import { FaComments, FaUser, FaCalendar, FaClock, FaUserMd, FaStickyNote } from 'react-icons/fa';
import AddNoteCounselingModal from './AddNoteCounselingModal';
import './HealthCheckups.css';

// Hàm decode JWT để lấy nurseId từ accessToken
function getUserIdFromToken() {
  const token = localStorage.getItem('accessToken');
  if (!token) return '';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.userId || payload.sub || '';
  } catch {
    return '';
  }
}

const CounselingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const nurseId = getUserIdFromToken();

  useEffect(() => {
    if (nurseId) fetchAppointments(nurseId);
    else toast.error('Không tìm thấy nurseId trong token!');
    // eslint-disable-next-line
  }, [nurseId]);

  const fetchAppointments = async (nurseId) => {
    try {
      setLoading(true);
      const res = await getCounselingAppointmentsByStaffId(nurseId);
      if (res.data.isSuccess) setAppointments(res.data.data);
      else toast.error('Không thể tải lịch tư vấn');
    } catch (e) {
      toast.error('Có lỗi khi tải lịch tư vấn');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const handleNoteAdded = () => {
    fetchAppointments(nurseId);
    handleModalClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
  };
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="health-checkups-container">
      <div className="health-checkups-header">
        <div className="header-content">
          <h1><FaComments className="header-icon" />Lịch Tư Vấn</h1>
          <p>Quản lý và ghi chú các lịch tư vấn của bạn</p>
        </div>
      </div>
      <div className="health-checkups-content">
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div><p>Đang tải lịch tư vấn...</p></div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <FaComments className="empty-icon" />
            <h3>Chưa có lịch tư vấn nào</h3>
            <p>Hiện tại chưa có lịch tư vấn nào cho bạn.</p>
          </div>
        ) : (
          <div className="schedules-grid">
            {appointments.map(app => (
              <div key={app.id} className="schedule-card" onClick={() => handleCardClick(app)}>
                <div className="card-header" style={{background:'#ffb347'}}>
                  <div className="campaign-info">
                    <h3><FaUserMd style={{marginRight:4}}/>Bạn</h3>
                    <span className="campaign-id">ID: {app.id.slice(0,8)}...</span>
                  </div>
                  <span className="status-badge pending">{app.status === 0 ? 'Chưa tư vấn' : 'Đã tư vấn'}</span>
                </div>
                <div className="card-body">
                  <div className="student-info">
                    <div className="info-row">
                      <FaUser className="info-icon" />
                      <div className="info-content">
                        <span className="label">Học sinh:</span>
                        <span className="value">{app.studentId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="schedule-info">
                    <div className="info-row">
                      <FaCalendar className="info-icon" />
                      <div className="info-content">
                        <span className="label">Ngày hẹn:</span>
                        <span className="value">{formatDate(app.appointmentDate)}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <FaClock className="info-icon" />
                      <div className="info-content">
                        <span className="label">Giờ:</span>
                        <span className="value">{formatTime(app.appointmentDate)}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <FaClock className="info-icon" />
                      <div className="info-content">
                        <span className="label">Thời lượng:</span>
                        <span className="value">{app.duration} phút</span>
                      </div>
                    </div>
                  </div>
                  <div className="notes-section">
                    <span className="label">Mục đích:</span>
                    <p className="notes-text">{app.purpose}</p>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="view-details-btn"><FaStickyNote/>Ghi chú</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && selectedAppointment && (
        <AddNoteCounselingModal
          appointment={selectedAppointment}
          onClose={handleModalClose}
          onNoteAdded={handleNoteAdded}
        />
      )}
    </div>
  );
};

export default CounselingAppointments; 