import React, { useState, useEffect } from 'react';
import { getCheckupSchedules } from '../../../services/apiServices';
import { toast } from 'react-toastify';
import { FaCalendar, FaUser, FaClock, FaStethoscope, FaEye, FaSearch } from 'react-icons/fa';
import CheckupRecordModal from './CheckupRecordModal';
import './HealthCheckups.css';

const HealthCheckups = () => {
  const [checkupSchedules, setCheckupSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('student'); // 'student' or 'campaign'

  useEffect(() => {
    fetchCheckupSchedules();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [checkupSchedules, searchQuery, searchType]);

  const fetchCheckupSchedules = async () => {
    try {
      setLoading(true);
      const response = await getCheckupSchedules();
      if (response.data.isSuccess) {
        setCheckupSchedules(response.data.data);
        setFilteredSchedules(response.data.data);
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

  const filterSchedules = () => {
    if (!searchQuery.trim()) {
      setFilteredSchedules(checkupSchedules);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = checkupSchedules.filter((schedule) => {
      if (searchType === 'student') {
        return schedule.studentName.toLowerCase().includes(query);
      } else {
        return schedule.campaignName.toLowerCase().includes(query);
      }
    });

    setFilteredSchedules(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
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

      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={searchType === 'student' ? "Tìm kiếm theo tên học sinh..." : "Tìm kiếm theo tên chiến dịch..."}
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={handleClearSearch}>
              ×
            </button>
          )}
        </div>
        <div className="search-type-toggle">
          <button
            className={`toggle-btn ${searchType === 'student' ? 'active' : ''}`}
            onClick={() => handleSearchTypeChange('student')}
          >
            Tên học sinh
          </button>
          <button
            className={`toggle-btn ${searchType === 'campaign' ? 'active' : ''}`}
            onClick={() => handleSearchTypeChange('campaign')}
          >
            Tên chiến dịch
          </button>
        </div>
      </div>

      <div className="health-checkups-content">
        {filteredSchedules.length === 0 ? (
          <div className="empty-state">
            <FaStethoscope className="empty-icon" />
            <h3>Không tìm thấy lịch khám nào</h3>
            <p>Không có lịch khám nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
          </div>
        ) : (
          <div className="schedules-grid">
            {filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`schedule-card ${schedule.hasRecord ? 'completed' : 'pending'}`}
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
                    {schedule.hasRecord ? 'Xem chi tiết' : 'Tạo hồ sơ khám'}
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