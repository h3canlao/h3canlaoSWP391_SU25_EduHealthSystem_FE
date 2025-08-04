import React, { useEffect, useState } from 'react';
import { getStudentsByParentId, getCheckupRecordsByStudentId } from '../../../../services/apiServices';
import { getUserInfo } from '../../../../services/handleStorageApi';
import { Card, Avatar, Spin, Empty, Tag } from 'antd';
import { UserOutlined, CalendarOutlined, ColumnHeightOutlined, 
         DashboardOutlined, EyeOutlined, SoundOutlined, 
         HeartOutlined, MessageOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import './ParentCheckupRecords.css';

// Bảng trạng thái
const statusMap = {
  0: { color: 'warning', text: 'Cần tái khám' },
  1: { color: 'success', text: 'Hoàn thành' },
  2: { color: 'warning', text: 'Cần tái khám' },
  3: { color: 'error', text: 'Chuyển viện' },
};

// Mức độ thị lực và thính lực
const levelMap = ['Bình thường', 'Nhẹ', 'Trung bình', 'Nặng'];

const ParentCheckupRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tải dữ liệu
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        // Lấy ID phụ huynh
        const userInfo = getUserInfo();
        const userId = JSON.parse(atob(userInfo.accessToken.split('.')[1]))?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        
        // Lấy danh sách học sinh
        const studentsRes = await getStudentsByParentId(userId);
        const students = studentsRes.data?.data || [];
        
        // Sử dụng Promise.all để tải song song các bản ghi khám của học sinh
        const studentRecords = await Promise.all(
          students.map(async (student) => {
            try {
              const res = await getCheckupRecordsByStudentId(student.id);
              const checkupRecords = res.data?.data || [];
              return { student, records: checkupRecords };
            } catch {
              return { student, records: [] };
            }
          })
        );
        
        setRecords(studentRecords);
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Định dạng ngày giờ
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };
  
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  // Hiển thị giao diện
  return (
    <div className="parent-checkup-records-container">
      <div className="header-section">
        <h1><MedicineBoxOutlined /> Hồ sơ khám sức khỏe</h1>
      </div>

      {/* Trạng thái tải hoặc rỗng */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <p>Đang tải...</p>
        </div>
      ) : records.length === 0 ? (
        <Empty description="Không có hồ sơ khám sức khỏe" />
      ) : (
        // Hiển thị danh sách học sinh
        <div className="students-container">
          {records.map(({ student, records }) => (
            <div key={student.id} className="student-section">
              {/* Hiển thị học sinh */}
              <div className="student-info">
                <Avatar 
                  size={48}
                  icon={<UserOutlined />}
                  src={student.image || "https://images.icon-icons.com/3310/PNG/512/student_man_avatar_user_toga_school_university_icon_209264.png"}
                  onError={(e) => {
                    e.target.src = "https://images.icon-icons.com/3310/PNG/512/student_man_avatar_user_toga_school_university_icon_209264.png";
                  }}
                />
                <div className="student-name">
                  <div className="name">{student.fullName || `${student.firstName} ${student.lastName}`}</div>
                  <div className="info"> Mã HS: {student.studentCode} | Lớp: {student.grade}{student.section}</div>
                </div>
              </div>

              {/* Danh sách bản ghi khám */}
              {records.length === 0 ? (
                <Empty description="Chưa có hồ sơ khám" />
              ) : (
                <div className="records-container">
                  {records.map(record => (
                    <Card 
                      key={record.id} 
                      className="checkup-record-card"
                    >
                      {/* Thông tin khám */}
                      <div className="record-info-row">
                        <div className="record-info-item">
                          <CalendarOutlined className="record-icon" />
                          <span className="record-label">Ngày khám:</span>
                          <span className="record-value">
                            {formatDate(record.examinedAt)} {formatTime(record.examinedAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="record-info-row">
                        <div className="record-info-item">
                          <ColumnHeightOutlined className="record-icon" />
                          <span className="record-label">Chiều cao:</span>
                          <span className="record-value">{record.heightCm} cm</span>
                        </div>
                        
                        <div className="record-info-item">
                          <DashboardOutlined className="record-icon" />
                          <span className="record-label">Cân nặng:</span>
                          <span className="record-value">{record.weightKg} kg</span>
                        </div>
                      </div>
                      
                      <div className="record-info-row">
                        <div className="record-info-item">
                          <EyeOutlined className="record-icon" />
                          <span className="record-label">Thị lực:</span>
                          <span className="record-value">
                            {levelMap[record.visionLeft] || record.visionLeft}/{levelMap[record.visionRight] || record.visionRight}
                          </span>
                        </div>
                        
                        <div className="record-info-item">
                          <SoundOutlined className="record-icon" />
                          <span className="record-label">Thính lực:</span>
                          <span className="record-value">{levelMap[record.hearing] || record.hearing}</span>
                        </div>
                      </div>
                      
                      <div className="record-info-row">
                        <div className="record-info-item">
                          <HeartOutlined className="record-icon" />
                          <span className="record-label">Huyết áp:</span>
                          <span className="record-value">{record.bloodPressureDiastolic || '-'}</span>
                        </div>
                      </div>
                      
                      <div className="record-info-row">
                        <div className="record-info-item">
                          <MessageOutlined className="record-icon" />
                          <span className="record-label">Ghi chú:</span>
                          <span className="record-value">{record.remarks || '-'}</span>
                        </div>
                      </div>
                      
                      <div className="record-info-row">
                        <div className="record-info-item">
                          <span className="record-label">Trạng thái:</span>
                          <Tag color={statusMap[record.status]?.color || 'default'} className="status-tag">
                            {statusMap[record.status]?.text || 'Không xác định'}
                          </Tag>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentCheckupRecords; 