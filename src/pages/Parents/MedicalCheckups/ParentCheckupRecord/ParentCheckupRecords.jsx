import React, { useEffect, useState } from 'react';
import { getStudentsByParentId, getCheckupRecordsByStudentId } from '../../../../services/apiServices';
import { getUserInfo } from '../../../../services/handleStorageApi';
import { Card, Avatar, Spin, Empty, Tag } from 'antd';
import { FaUser, FaFileMedical, FaNotesMedical, FaRuler, FaWeight, FaEye, FaVolumeUp, FaHeartbeat, FaCalendar, FaComments } from 'react-icons/fa';
import './ParentCheckupRecords.css';

const statusMap = {
  0: { color: 'default', text: 'Chờ khám' },
  1: { color: 'success', text: 'Hoàn thành' },
  2: { color: 'warning', text: 'Cần tái khám' },
  3: { color: 'error', text: 'Chuyển viện' },
};

const ParentCheckupRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const userInfo = getUserInfo();
      const userId = JSON.parse(atob(userInfo.accessToken.split('.')[1]))?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const studentsRes = await getStudentsByParentId(userId);
      const students = Array.isArray(studentsRes.data.data) ? studentsRes.data.data : [];
      const allRecords = [];
      for (const student of students) {
        try {
          const res = await getCheckupRecordsByStudentId(student.id);
          if (Array.isArray(res.data.data) && res.data.data.length > 0) {
            allRecords.push({ student, records: res.data.data });
            console.log('Lấy dữ liệu thành công cho học sinh:', student.fullName || student.firstName + ' ' + student.lastName);
          }
        } catch (err) {
          console.error('Lỗi lấy hồ sơ khám:', err.message || 'Lỗi không xác định');
        }
      }
      setRecords(allRecords);
    } catch (err) {
      console.error('Error fetching students or records:', err);
    } finally {
      setLoading(false);
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

  // Thêm hàm chuyển đổi enum
  const visionLevelMap = ['Bình thường', 'Nhẹ', 'Trung bình', 'Nặng'];
  const hearingLevelMap = ['Bình thường', 'Nhẹ', 'Trung bình', 'Nặng'];

  return (
    <div className="parent-checkup-records-container">
      <div className="header-section">
        <h1><FaFileMedical className="header-icon" />Theo dõi hồ sơ khám sức khỏe</h1>
        <p>Xem chi tiết các lần khám sức khỏe của học sinh</p>
      </div>
      {loading ? (
        <div className="loading-container"><Spin size="large" /><p>Đang tải hồ sơ khám...</p></div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <Empty description="Chưa có hồ sơ khám nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <div className="records-list">
          {records.map(({ student, records }) => {
            return (
              <div className="student-record-group" key={student.id}>
                <div className="student-info">
                  <Avatar 
                    size={56} 
                    src={student.image || "https://images.icon-icons.com/3310/PNG/512/student_man_avatar_user_toga_school_university_icon_209264.png"} 
                    className="student-avatar"
                    onError={(e) => {
                      console.log('Avatar load error for student:', student.id, 'image:', student.image);
                      e.target.src = "https://images.icon-icons.com/3310/PNG/512/student_man_avatar_user_toga_school_university_icon_209264.png";
                    }}
                  />
                  <div>
                    <div className="student-name"><FaUser className="student-icon" />{student.fullName || (student.firstName + ' ' + student.lastName)}</div>
                    <div className="student-meta">Mã HS: {student.studentCode} | Lớp: {student.grade}{student.section}</div>
                  </div>
                </div>
                <div className="student-records" style={{display: 'flex', flexDirection: 'row', gap: 20, overflowX: 'auto', flexWrap: 'nowrap'}}>
                  {records.map(record => (
                    <Card key={record.id} className="record-card" hoverable style={{minWidth: 320, maxWidth: 370, flex: '0 0 320px'}}>
                      <div className="record-details">
                        <div className="detail-row"><FaCalendar className="detail-icon" /><span className="label">Ngày khám:</span><span className="value">{formatDate(record.examinedAt)} {formatTime(record.examinedAt)}</span></div>
                        <div className="detail-row"><FaRuler className="detail-icon" /><span className="label">Chiều cao:</span><span className="value">{record.heightCm} cm</span></div>
                        <div className="detail-row"><FaWeight className="detail-icon" /><span className="label">Cân nặng:</span><span className="value">{record.weightKg} kg</span></div>
                        <div className="detail-row">
                          <FaEye className="detail-icon" />
                          <span className="label">Thị lực:</span>
                          <span className="value">
                            {visionLevelMap[record.visionLeft] ?? record.visionLeft}/{visionLevelMap[record.visionRight] ?? record.visionRight}
                          </span>
                        </div>
                        <div className="detail-row">
                          <FaVolumeUp className="detail-icon" />
                          <span className="label">Thính lực:</span>
                          <span className="value">{hearingLevelMap[record.hearing] ?? record.hearing}</span>
                        </div>
                        <div className="detail-row">
                          <FaHeartbeat className="detail-icon" />
                          <span className="label">Huyết áp:</span>
                          <span className="value">{record.bloodPressureDiastolic}</span>
                        </div>
                        <div className="detail-row"><FaComments className="detail-icon" /><span className="label">Ghi chú:</span><span className="value">{record.remarks || '-'}</span></div>
                        <div className="detail-row"><FaNotesMedical className="detail-icon" /><span className="label">Trạng thái:</span><span className="value"><Tag color={statusMap[record.status]?.color || 'default'}>{statusMap[record.status]?.text || 'Không xác định'}</Tag></span></div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ParentCheckupRecords; 