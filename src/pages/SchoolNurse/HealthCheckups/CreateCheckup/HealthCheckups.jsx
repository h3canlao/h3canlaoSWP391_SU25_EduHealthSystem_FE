import React, { useState, useEffect, useMemo } from 'react';
import { getCheckupSchedules } from '../../../../services/apiServices';
import { toast } from 'react-toastify';
import { FaCalendar, FaUser, FaClock, FaStethoscope, FaEye, FaSearch } from 'react-icons/fa';
import CheckupRecordModal from './CheckupRecordModal';
import './HealthCheckups.css';

const HealthCheckups = () => {
  // State quản lý
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('student');

  // Tải danh sách lịch khám
  useEffect(() => {
    getCheckupSchedules()
      .then(res => {
        if (res.data?.isSuccess) {
          setSchedules(res.data.data || []);
      } else {
        toast.error('Không thể tải danh sách lịch khám');
      }
      })
      .catch(() => toast.error('Có lỗi xảy ra khi tải danh sách lịch khám'))
      .finally(() => setLoading(false));
  }, []);

  // Lọc danh sách theo tìm kiếm
  const filteredSchedules = useMemo(() => {
    if (!searchQuery.trim()) return schedules;

    const query = searchQuery.toLowerCase().trim();
    return schedules.filter(schedule => 
      searchType === 'student' 
        ? (schedule.studentName || '').toLowerCase().includes(query)
        : (schedule.campaignName || '').toLowerCase().includes(query)
    );
  }, [schedules, searchQuery, searchType]);

  // Định dạng ngày giờ
  const formatDate = date => new Date(date).toLocaleDateString('vi-VN');
  const formatTime = date => new Date(date).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'});

  // Xử lý click vào card lịch khám
  const handleCardClick = schedule => {
    setSelectedSchedule(schedule);
    setShowModal(true);
  };

  // Hiển thị loading
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
      {/* Phần tiêu đề */}
      <div className="health-checkups-header">
        <div className="header-content">
          <h1>
            <FaStethoscope className="header-icon" />
            Danh Sách Lịch Khám Sức Khỏe
          </h1>
          <p>Quản lý và theo dõi các lịch khám sức khỏe của học sinh</p>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={`Tìm kiếm theo ${searchType === 'student' ? 'tên học sinh' : 'tên chiến dịch'}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>
        <div className="search-type-toggle">
          <button
            className={`toggle-btn ${searchType === 'student' ? 'active' : ''}`}
            onClick={() => setSearchType('student')}
          >
            Tên học sinh
          </button>
          <button
            className={`toggle-btn ${searchType === 'campaign' ? 'active' : ''}`}
            onClick={() => setSearchType('campaign')}
          >
            Tên chiến dịch
          </button>
        </div>
      </div>

      {/* Hiển thị danh sách lịch khám */}
      <div className="health-checkups-content">
        {filteredSchedules.length === 0 ? (
          <div className="empty-state">
            <FaStethoscope className="empty-icon" />
            <h3>Không tìm thấy lịch khám nào</h3>
            <p>Không có lịch khám nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
          </div>
        ) : (
          <div className="schedules-grid">
            {filteredSchedules.map(schedule => (
              <div
                key={schedule.id}
                className={`schedule-card ${schedule.hasRecord ? 'completed' : 'pending'}`}
                onClick={() => handleCardClick(schedule)}
              >
                <div className="card-header">
                  <div className="campaign-info">
                    <h3>{schedule.campaignName}</h3>
                    <span className="campaign-id">ID: {schedule.campaignId?.slice(0, 8)}...</span>
                  </div>
                  <span className={`status-badge ${schedule.hasRecord ? 'completed' : 'pending'}`}>
                    {schedule.hasRecord ? 'Đã khám' : 'Chưa khám'}
                  </span>
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
                </div>

                <div className="card-footer">
                  <button className="view-details-btn">
                    <FaEye />
                    {schedule.hasRecord ? 'Xem chi tiết' : 'Tạo hồ sơ khám'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal tạo hồ sơ khám */}
      {showModal && (
        <CheckupRecordModal
          show={showModal}
          setShow={setShowModal}
          schedule={selectedSchedule}
        />
      )}
    </div>
  );
};

export default HealthCheckups; 