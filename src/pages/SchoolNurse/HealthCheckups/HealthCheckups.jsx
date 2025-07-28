import React, { useState, useEffect } from 'react';
import { getCheckupSchedules } from '../../../services/apiServices';
import { toast } from 'react-toastify';
import { FaCalendar, FaUser, FaClock, FaStethoscope, FaEye, FaCheck } from 'react-icons/fa';
import CheckupRecordModal from './CheckupRecordModal';
import './HealthCheckups.css';

const HealthCheckups = () => {
  const [checkupSchedules, setCheckupSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCheckupSchedules();
  }, []);

  const fetchCheckupSchedules = async () => {
    try {
      setLoading(true);
      const response = await getCheckupSchedules();
      if (response.data.isSuccess) {
        setCheckupSchedules(response.data.data);
      } else {
        toast.error('Không thể tải danh sách lịch khám');
      }
    } catch (error) {
      console.error('Error fetching checkup schedules:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách lịch khám');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSchedule(null);
  };

  const handleRecordCreated = () => {
    fetchCheckupSchedules(); // Refresh the list
    handleModalClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (hasRecord) => {
    return hasRecord ? (
      <span className="status-badge completed">Đã khám</span>
    ) : (
      <span className="status-badge pending">Chưa khám</span>
    );
  };

  // Chia danh sách thành đã khám và chưa khám
  const pendingSchedules = checkupSchedules.filter(schedule => !schedule.hasRecord);
  const completedSchedules = checkupSchedules.filter(schedule => schedule.hasRecord);

  if (loading) {
    return (
      <div className="health-checkups-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải danh sách lịch khám...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="health-checkups-container">
      <div className="health-checkups-header">
        <div className="header-content">
          <h1>
            <FaStethoscope className="header-icon" />
            Danh Sách Lịch Khám Sức Khỏe
          </h1>
          <p>Quản lý và theo dõi các lịch khám sức khỏe của học sinh</p>
        </div>
      </div>

      <div className="health-checkups-content">
        {/* Pending Records */}
        <h2 className="section-title">Danh sách chưa khám</h2>
        {pendingSchedules.length === 0 ? (
          <div className="empty-state">
            <FaStethoscope className="empty-icon" />
            <h3>Chưa có lịch khám nào</h3>
            <p>Hiện tại chưa có lịch khám sức khỏe nào được tạo.</p>
          </div>
        ) : (
          <div className="schedules-grid">
            {pendingSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="schedule-card pending"
                onClick={() => handleScheduleClick(schedule)}
              >
                <div className="card-header">
                  <div className="campaign-info">
                    <h3>{schedule.campaignName}</h3>
                    <span className="campaign-id">ID: {schedule.campaignId.slice(0, 8)}...</span>
                  </div>
                  {getStatusBadge(schedule.hasRecord)}
                </div>

                <div className="card-body">
                  <div className="student-info">
                    <div className="info-row">
                      <FaUser className="info-icon" />
                      <div className="info-content">
                        <span className="label">Học sinh:</span>
                        <span className="value">{schedule.studentName}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <FaUser className="info-icon" />
                      <div className="info-content">
                        <span className="label">Mã học sinh:</span>
                        <span className="value">{schedule.studentCode}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <FaUser className="info-icon" />
                      <div className="info-content">
                        <span className="label">Lớp:</span>
                        <span className="value">{schedule.grade}{schedule.section}</span>
                      </div>
                    </div>
                  </div>

                  <div className="schedule-info">
                    <div className="info-row">
                      <FaCalendar className="info-icon" />
                      <div className="info-content">
                        <span className="label">Ngày khám:</span>
                        <span className="value">{formatDate(schedule.scheduledAt)}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <FaClock className="info-icon" />
                      <div className="info-content">
                        <span className="label">Giờ khám:</span>
                        <span className="value">{formatTime(schedule.scheduledAt)}</span>
                      </div>
                    </div>
                  </div>

                  {schedule.specialNotes && (
                    <div className="notes-section">
                      <span className="label">Ghi chú:</span>
                      <p className="notes-text">{schedule.specialNotes}</p>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button className="view-details-btn">
                    <FaEye />
                    Tạo hồ sơ khám
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Records - Always shown */}
        <h2 className="section-title">Danh sách đã khám</h2>
        {completedSchedules.length === 0 ? (
          <div className="empty-state">
            <FaCheck className="empty-icon" />
            <h3>Chưa có hồ sơ khám nào</h3>
            <p>Hiện tại chưa có hồ sơ khám sức khỏe nào được hoàn thành.</p>
          </div>
        ) : (
          <div className="schedules-grid">
            {completedSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="schedule-card completed"
                onClick={() => handleScheduleClick(schedule)}
              >
                <div className="card-header">
                  <div className="campaign-info">
                    <h3>{schedule.campaignName}</h3>
                    <span className="campaign-id">ID: {schedule.campaignId.slice(0, 8)}...</span>
                  </div>
                  {getStatusBadge(schedule.hasRecord)}
                </div>

                <div className="card-body">
                  <div className="student-info">
                    <div className="info-row">
                      <FaUser className="info-icon" />
                      <div className="info-content">
                        <span className="label">Học sinh:</span>
                        <span className="value">{schedule.studentName}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <FaUser className="info-icon" />
                      <div className="info-content">
                        <span className="label">Mã học sinh:</span>
                        <span className="value">{schedule.studentCode}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <FaUser className="info-icon" />
                      <div className="info-content">
                        <span className="label">Lớp:</span>
                        <span className="value">{schedule.grade}{schedule.section}</span>
                      </div>
                    </div>
                  </div>

                  <div className="schedule-info">
                    <div className="info-row">
                      <FaCalendar className="info-icon" />
                      <div className="info-content">
                        <span className="label">Ngày khám:</span>
                        <span className="value">{formatDate(schedule.scheduledAt)}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <FaClock className="info-icon" />
                      <div className="info-content">
                        <span className="label">Giờ khám:</span>
                        <span className="value">{formatTime(schedule.scheduledAt)}</span>
                      </div>
                    </div>
                  </div>

                  {schedule.specialNotes && (
                    <div className="notes-section">
                      <span className="label">Ghi chú:</span>
                      <p className="notes-text">{schedule.specialNotes}</p>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button className="view-details-btn completed">
                    <FaEye />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedSchedule && (
        <CheckupRecordModal
          schedule={selectedSchedule}
          onClose={handleModalClose}
          onRecordCreated={handleRecordCreated}
        />
      )}
    </div>
  );
};

export default HealthCheckups; 