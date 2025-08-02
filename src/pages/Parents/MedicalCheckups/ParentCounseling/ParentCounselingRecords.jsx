import React, { useEffect, useState } from 'react';
import { getStudentsByParentId, getCounselingAppointmentsByStudentId } from '../../../../services/apiServices';
import { getUserInfo } from '../../../../services/handleStorageApi';
import { Card, Avatar, Spin, Empty, Tag } from 'antd';
import { FaUser, FaComments, FaUserMd, FaCalendar, FaClock, FaStickyNote, FaClipboardCheck, FaCheckCircle } from 'react-icons/fa';
import './ParentCounselingRecords.css';

const statusMap = {
  0: { color: 'default', text: 'Chờ xác nhận' },
  1: { color: 'processing', text: 'Đã xác nhận' },
  2: { color: 'success', text: 'Hoàn thành' },
  3: { color: 'error', text: 'Đã hủy' },
};

const ParentCounselingRecords = () => {
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
          const res = await getCounselingAppointmentsByStudentId(student.id);
          if (Array.isArray(res.data.data) && res.data.data.length > 0) {
            allRecords.push({ student, records: res.data.data });
          }
        } catch (err) {
          // Nếu lỗi 400 (chưa có record) thì bỏ qua
          if (!(err && err.response && err.response.status === 400)) {
            console.error('Error fetching counseling records:', err);
          }
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

  return (
    <div className="parent-counseling-records-container">
      <div className="header-section">
        <h1><FaComments className="header-icon" />Theo dõi lịch tư vấn sức khỏe</h1>
        <p>Xem chi tiết các lịch tư vấn sức khỏe của học sinh</p>
      </div>
      {loading ? (
        <div className="loading-container"><Spin size="large" /><p>Đang tải lịch tư vấn...</p></div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <Empty description="Chưa có lịch tư vấn nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <div className="records-list">
          {records.map(({ student, records }) => {
            console.log('Student image (counseling):', student.image); // Debug log
            return (
              <div className="student-record-group" key={student.id}>
                <div className="student-info">
                  <Avatar 
                    size={56} 
                    src={student.image || "https://images.icon-icons.com/3310/PNG/512/student_man_avatar_user_toga_school_university_icon_209264.png"} 
                    className="student-avatar"
                    onError={(e) => {
                      console.log('Avatar load error for student (counseling):', student.id, 'image:', student.image);
                      e.target.src = "https://images.icon-icons.com/3310/PNG/512/student_man_avatar_user_toga_school_university_icon_209264.png";
                    }}
                  />
                  <div>
                    <div className="student-name"><FaUser className="student-icon" />{student.fullName || (student.firstName + ' ' + student.lastName)}</div>
                    <div className="student-meta">Mã HS: {student.studentCode} | Lớp: {student.grade}{student.section}</div>
                  </div>
                </div>
                <div className="student-records">
                  {records.map(record => (
                    <Card key={record.id} className="record-card" hoverable>
                      <div className="record-details">
                        <div className="detail-row"><FaCalendar className="detail-icon" /><span className="label">Ngày hẹn:</span><span className="value">{formatDate(record.appointmentDate)} {formatTime(record.appointmentDate)}</span></div>
                        <div className="detail-row"><FaClock className="detail-icon" /><span className="label">Thời lượng:</span><span className="value">{record.duration} phút</span></div>
                        <div className="detail-row"><FaUserMd className="detail-icon" /><span className="label">Trạng thái:</span><span className="value"><Tag color={statusMap[record.status]?.color || 'default'}>{statusMap[record.status]?.text || 'Không xác định'}</Tag></span></div>
                        <div className="detail-row"><FaStickyNote className="detail-icon" /><span className="label">Mục đích:</span><span className="value">{record.purpose || '-'}</span></div>
                        <div className="detail-row"><FaClipboardCheck className="detail-icon" /><span className="label">Ghi chú:</span><span className="value">{record.notes || '-'}</span></div>
                        <div className="detail-row"><FaCheckCircle className="detail-icon" /><span className="label">Khuyến nghị:</span><span className="value">{record.recommendations || '-'}</span></div>
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

export default ParentCounselingRecords; 