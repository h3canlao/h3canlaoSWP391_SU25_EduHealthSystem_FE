import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Empty, Avatar, Tag, Divider, DatePicker, Button, Collapse } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DownOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { getMedicationUsageRecordsByDate } from '../../../../services/apiServices';
import './TodayMedication.css';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const TodayMedication = () => {
  const [loading, setLoading] = useState(false);
  const [medicationRecords, setMedicationRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Load data
  const fetchMedicationRecords = () => {
    setLoading(true);
    // Format date as YYYY-MM-DD
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    
    getMedicationUsageRecordsByDate(formattedDate)
      .then(res => {
        const records = res.data?.data || [];
        setMedicationRecords(records);
      })
      .catch(error => {
        console.error("Error loading data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Load initial data when component mounts
  useEffect(() => {
    fetchMedicationRecords();
  }, []);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Format date and time
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="medication-container">
      <div className="medication-header">
        <Title level={2} style={{ margin: 0 }}>
          <MedicineBoxOutlined /> Lịch Sử Dùng Thuốc
        </Title>
      </div>

      <div className="date-selector">
        <DatePicker 
          value={selectedDate} 
          onChange={handleDateChange} 
          format="YYYY-MM-DD" 
          style={{ marginRight: 16 }}
          placeholder="Chọn ngày"
        />
        <Button type="primary" onClick={fetchMedicationRecords}>
          Tìm Kiếm
        </Button>
      </div>

      <div className="medication-content">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : medicationRecords.length === 0 ? (
          <Empty description="Không tìm thấy lịch sử dùng thuốc cho ngày này" />
        ) : (
          <div className="medication-list">
            {medicationRecords.map(record => (
              <Card
                key={record.id}
                className="medication-record-card"
                style={{ marginBottom: 16, borderRadius: 8 }}
              >
                <div className="medication-card-header">
                  <div className="student-info">
                    <Avatar 
                      src="https://images.icon-icons.com/3310/PNG/512/student_man_avatar_user_toga_school_university_icon_209264.png"
                      style={{ marginRight: 12 }} 
                      size="large" 
                    />
                    <div>
                      <Text strong className="student-name">
                        {record.studentName} - {record.medicationName}
                      </Text>
                    </div>
                  </div>

                  <div>
                    {record.isTaken ? (
                      <Tag color="success" icon={<CheckCircleOutlined />} className="status-tag">
                        Đã Dùng Thuốc
                      </Tag>
                    ) : (
                      <Tag color="error" icon={<CloseCircleOutlined />} className="status-tag">
                        Chưa Dùng
                      </Tag>
                    )}
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <Collapse 
                  ghost
                  expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
                >
                  <Panel header="Xem Chi Tiết" key="1">
                    <div className="medication-details">
                      <div className="detail-section">
                        <Text strong className="detail-label">Hướng Dẫn Liều Dùng:</Text>
                        <Text className="detail-value">{record.dosageInstruction || 'Không có hướng dẫn'}</Text>
                      </div>

                      <div className="detail-section">
                        <Text strong className="detail-label">Số Lượng:</Text>
                        <Text className="detail-value">Đã Dùng: {record.quantityUsed} / Tổng: {record.totalQuantity} / Còn Lại: {record.quantityRemaining}</Text>
                      </div>

                      <div className="detail-section">
                        <Text strong className="detail-label">Ngày:</Text>
                        <Text className="detail-value">{formatDate(record.usedAt)}</Text>
                      </div>

                      <div className="detail-section">
                        <Text strong className="detail-label">Giờ:</Text>
                        <Text className="detail-value">{formatTime(record.usedAt)}</Text>
                      </div>

                      {record.note && (
                        <div className="detail-section">
                          <Text strong className="detail-label">Ghi Chú:</Text>
                          <Text className="detail-value">{record.note}</Text>
                        </div>
                      )}
                    </div>
                  </Panel>
                </Collapse>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayMedication; 