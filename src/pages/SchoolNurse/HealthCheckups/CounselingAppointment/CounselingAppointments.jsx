import React, { useEffect, useState } from 'react';
import { getCounselingAppointmentsByStaffId } from '../../../../services/apiServices';
import { toast } from 'react-toastify';
import { FaComments, FaUser, FaCalendar, FaClock, FaUserMd, FaStickyNote } from 'react-icons/fa';
import AddNoteCounselingModal from './AddNoteCounselingModal';
import '../CreateCheckup/HealthCheckups.css';

// Lấy ID người dùng từ token
const getUserId = () => {
  try {
    const token = localStorage.getItem('accessToken');
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || '';
  } catch {
    return '';
  }
};

const CounselingAppointments = () => {
  // State quản lý
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const nurseId = getUserId();

  // Tải dữ liệu lịch tư vấn
  useEffect(() => {
    if (!nurseId) {
      toast.error('Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại');
      setLoading(false);
      return;
    }

    // Lấy danh sách lịch tư vấn
    getCounselingAppointmentsByStaffId(nurseId)
      .then(res => {
        if (res.data?.isSuccess) {
          setAppointments(res.data.data || []);
        } else {
          toast.error('Không thể tải danh sách lịch tư vấn');
        }
      })
      .catch(() => toast.error('Có lỗi xảy ra khi tải lịch tư vấn'))
      .finally(() => setLoading(false));
  }, [nurseId]);

  // Định dạng ngày tháng
  const formatDate = date => new Date(date).toLocaleDateString('vi-VN');
  const formatTime = date => new Date(date).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'});

  // Xử lý khi click vào card
  const handleCardClick = appointment => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // Xử lý khi đóng modal
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  // Xử lý khi thêm ghi chú thành công
  const handleNoteAdded = () => {
    // Lấy lại danh sách và đóng modal
    getCounselingAppointmentsByStaffId(nurseId)
      .then(res => {
        if (res.data?.isSuccess) {
          setAppointments(res.data.data || []);
        }
      })
      .catch(() => {})
      .finally(() => handleModalClose());
  };

  return (
    <div className="health-checkups-container">
      {/* Phần tiêu đề */}
      <div className="health-checkups-header">
        <div className="header-content">
          <h1><FaComments className="header-icon" />Lịch Tư Vấn</h1>
          <p>Quản lý và ghi chú các lịch tư vấn của bạn</p>
        </div>
      </div>

      {/* Hiển thị danh sách lịch tư vấn */}
      <div className="health-checkups-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải lịch tư vấn...</p>
          </div>
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
                {/* Header card */}
                <div className="card-header" style={{background:'#ffb347'}}>
                  <div className="campaign-info">
                    <h3><FaUserMd style={{marginRight:4}}/>Bạn</h3>
                    <span className="campaign-id">ID: {app.id?.slice(0,8)}...</span>
                  </div>
                  <span className="status-badge pending">
                    {app.status === 0 ? 'Chưa tư vấn' : 'Đã tư vấn'}
                  </span>
                </div>

                {/* Nội dung card */}
                <div className="card-body">
                  {/* Thông tin học sinh */}
                  <div className="student-info">
                    <div className="info-row">
                      <FaUser className="info-icon" />
                      <div className="info-content">
                        <span className="label">Học sinh:</span>
                        <span className="value">{app.studentName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin lịch hẹn */}
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

                  {/* Mục đích tư vấn */}
                  <div className="notes-section">
                    <span className="label">Mục đích:</span>
                    <p className="notes-text">{app.purpose}</p>
                  </div>
                </div>

                {/* Footer card */}
                <div className="card-footer">
                  <button className="view-details-btn">
                    <FaStickyNote/> Ghi chú
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal ghi chú */}
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