import React, { useState, useEffect } from 'react';
import { getStudentsByParentId, getCheckupSchedulesByStudentId, consentCheckupSchedule } from '../../../services/apiServices';
import { getUserInfo } from '../../../services/handleStorageApi';
import { Card, Avatar, Tag, Spin, Empty, Modal, Input, Button, message } from 'antd';
import { FaUser, FaCalendar, FaStethoscope, FaInfoCircle, FaIdBadge, FaChalkboardTeacher, FaClock, FaFlag } from 'react-icons/fa';
import './ParentCheckupSchedules.css';

const { Meta } = Card;

const ParentCheckupSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consentModal, setConsentModal] = useState({ open: false, schedule: null });
  const [consentStatus, setConsentStatus] = useState(2);
  const [consentNote, setConsentNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCheckupSchedules();
  }, []);

  const fetchCheckupSchedules = async () => {
    try {
      setLoading(true);
      
      // Lấy thông tin user từ token
      const userInfo = getUserInfo();
      const userId = JSON.parse(atob(userInfo.accessToken.split('.')[1]))?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      
      // Lấy danh sách học sinh của parent
      const studentsResponse = await getStudentsByParentId(userId);
      const students = Array.isArray(studentsResponse.data.data) ? studentsResponse.data.data : [];
      
      // Lấy lịch khám cho tất cả học sinh
      const allSchedules = [];
      for (const student of students) {
        try {
          const scheduleResponse = await getCheckupSchedulesByStudentId(student.id);
          if (Array.isArray(scheduleResponse.data.data)) {
            allSchedules.push(...scheduleResponse.data.data);
          }
        } catch (error) {
          // Nếu lỗi là 400 (không có lịch), bỏ qua, không log
          if (!(error && error.response && error.response.status === 400)) {
            console.error(`Error fetching schedules for student ${student.id}:`, error);
          }
        }
      }
      
      setSchedules(allSchedules);
    } catch (error) {
      console.error('Error fetching checkup schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConsentStatusTag = (status) => {
    switch (status) {
      case 0:
        return <Tag color="default">Chưa xác nhận</Tag>;
      case 1:
        return <Tag color="success">Đã đồng ý</Tag>;
      case 2:
        return <Tag color="error">Đã từ chối</Tag>;
      case 3:
        return <Tag color="purple">Đã hoàn thành</Tag>;
      default:
        return <Tag color="default">Chưa xác nhận</Tag>;
    }
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

  // Gửi consent
  const handleConsent = async () => {
    if (!consentModal.schedule) return;
    setSubmitting(true);
    try {
      console.log('Gửi consent:', {
        scheduleId: consentModal.schedule.id,
        consentStatus,
        consentNote
      });
      await consentCheckupSchedule(
        consentModal.schedule.id,
        consentStatus,
        consentNote
      );
      message.success("Gửi xác nhận thành công!");
      setConsentModal({ open: false, schedule: null });
      setConsentNote("");
      fetchCheckupSchedules();
    } catch (err) {
      message.error("Gửi xác nhận thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="parent-checkup-schedules-container">
        <div className="loading-container">
          <Spin size="large" />
          <p>Đang tải danh sách lịch khám...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parent-checkup-schedules-container">
      <div className="header-section">
        <h1>
          <FaStethoscope className="header-icon" />
          Lịch Khám Sức Khỏe Của Các Con
        </h1>
        <p>Xem và quản lý lịch khám sức khỏe của tất cả học sinh</p>
      </div>

      {schedules.length === 0 ? (
        <div className="empty-state">
          <Empty 
            description="Chưa có lịch khám nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <div className="schedules-grid">
          {schedules.map((schedule) => (
            <Card 
              key={schedule.id} 
              className="schedule-card"
              hoverable
              onClick={() => setConsentModal({ open: true, schedule })}
            >
              <div className="card-flex">
                <Avatar 
                  size={64} 
                  src="https://static.vecteezy.com/system/resources/previews/012/941/843/non_2x/illustration-of-boy-avatar-student-s-character-face-vector.jpg"
                  className="student-avatar"
                />
                <div className="card-info">
                  <div className="student-name">
                    <FaUser className="student-icon" />
                    {schedule.studentName}
                  </div>
                  <div className="schedule-details">
                    <div className="detail-row">
                      <FaIdBadge className="detail-icon" />
                      <span className="label">Mã học sinh:</span>
                      <span className="value">{schedule.studentCode}</span>
                    </div>
                    <div className="detail-row">
                      <FaChalkboardTeacher className="detail-icon" />
                      <span className="label">Lớp:</span>
                      <span className="value">{schedule.grade}{schedule.section}</span>
                    </div>
                    <div className="detail-row">
                      <FaCalendar className="detail-icon" />
                      <span className="label">Ngày khám:</span>
                      <span className="value">{formatDate(schedule.scheduledAt)}</span>
                    </div>
                    <div className="detail-row">
                      <FaClock className="detail-icon" />
                      <span className="label">Giờ khám:</span>
                      <span className="value">{formatTime(schedule.scheduledAt)}</span>
                    </div>
                    <div className="detail-row">
                      <FaStethoscope className="detail-icon" />
                      <span className="label">Chiến dịch:</span>
                      <span className="value">{schedule.campaignName}</span>
                    </div>
                    {schedule.specialNotes && (
                      <div className="detail-row">
                        <FaInfoCircle className="detail-icon" />
                        <span className="label">Ghi chú:</span>
                        <span className="value">{schedule.specialNotes}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <FaFlag className="detail-icon" />
                      <span className="label">Trạng thái:</span>
                      <span className="value">{getConsentStatusTag(schedule.parentConsentStatus)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal
        open={consentModal.open}
        title={<span>Xác nhận lịch khám</span>}
        onCancel={() => setConsentModal({ open: false, schedule: null })}
        onOk={handleConsent}
        okText={consentStatus === 2 ? "Đồng ý" : "Từ chối"}
        confirmLoading={submitting}
        footer={[
          <Button key="cancel" onClick={() => setConsentModal({ open: false, schedule: null })}>Hủy</Button>,
          <Button key="accept" type="primary" loading={submitting} onClick={() => { setConsentStatus(1); handleConsent(); }}>Đồng ý</Button>,
          <Button key="reject" danger loading={submitting} onClick={() => { setConsentStatus(2); handleConsent(); }}>Từ chối</Button>,
        ]}
      >
        <div style={{ marginBottom: 12 }}>Bạn muốn đồng ý hay từ chối lịch khám này? (Có thể nhập ghi chú)</div>
        <Input.TextArea
          rows={3}
          value={consentNote}
          onChange={e => setConsentNote(e.target.value)}
          placeholder="Nhập ghi chú (nếu có)"
        />
      </Modal>
    </div>
  );
};

export default ParentCheckupSchedules; 