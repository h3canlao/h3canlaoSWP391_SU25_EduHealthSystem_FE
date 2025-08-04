import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Empty, Avatar, Tag, Divider } from 'antd';
import { UserOutlined, MedicineBoxOutlined, CheckCircleOutlined, CloseCircleOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getMedicationUsageRecordsByStudentId, getStudentsByParentId } from '../../../../services/apiServices';
import { getUserInfo } from '../../../../services/handleStorageApi';
import './TodayMedication.css';

const { Title, Text } = Typography;

const TodayMedication = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [medicationRecords, setMedicationRecords] = useState([]);

  // Get parent ID from token
  const parentId = getUserInfo()?.accessToken 
    ? JSON.parse(atob(getUserInfo().accessToken.split('.')[1]))?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
    : null;

  // Load data
  useEffect(() => {
    if (!parentId) {
      setLoading(false);
      return;
    }

    // Get student list for parent
    getStudentsByParentId(parentId)
      .then(res => {
        const studentsList = res.data?.data || [];
        setStudents(studentsList);

        // If students exist, get medication records for each
        if (studentsList.length > 0) {
          return Promise.all(
            studentsList.map(student => 
              getMedicationUsageRecordsByStudentId(student.id)
                .then(response => {
                  // Add student info to each record
                  const records = response.data?.data || [];
                  return records.map(record => ({
                    ...record,
                    studentName: student.firstName && student.lastName 
                      ? `${student.firstName} ${student.lastName}`
                      : student.fullName || 'Unknown',
                    studentCode: student.studentCode,
                    grade: student.grade,
                    section: student.section
                  }));
                })
                .catch(() => [])
            )
          );
        }
        return [];
      })
      .then(results => {
        // Combine all records into one array
        const allRecords = results ? results.flat() : [];
        setMedicationRecords(allRecords);
      })
      .catch(error => {
        console.error("Error loading data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [parentId]);

  // Format date and time
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US');
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
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
          <MedicineBoxOutlined /> Medication History
        </Title>
      </div>

      <div className="medication-content">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : medicationRecords.length === 0 ? (
          <Empty description="Không có lịch sử thuốc đã dùng" />
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
                      icon={<UserOutlined />} 
                      style={{ marginRight: 12 }} 
                      size="large" 
                    />
                    <div>
                      <Text strong className="student-name">{record.studentName}</Text>
                      <div className="student-details">
                        <Text type="secondary">Student ID: {record.studentCode}</Text>
                        <Text type="secondary"> | Class: {record.grade}{record.section}</Text>
                      </div>
                    </div>
                  </div>

                  <div>
                    {record.isTaken ? (
                      <Tag color="success" icon={<CheckCircleOutlined />} className="status-tag">
                        Medication Taken
                      </Tag>
                    ) : (
                      <Tag color="error" icon={<CloseCircleOutlined />} className="status-tag">
                        Not Taken
                      </Tag>
                    )}
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div className="medication-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <MedicineBoxOutlined className="detail-icon" />
                      <Text strong>Medication Name:</Text>
                      <Text>{record.medicationName}</Text>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <CalendarOutlined className="detail-icon" />
                      <Text strong>Date:</Text>
                      <Text>{formatDate(record.usedAt)}</Text>
                    </div>

                    <div className="detail-item">
                      <ClockCircleOutlined className="detail-icon" />
                      <Text strong>Time:</Text>
                      <Text>{formatTime(record.usedAt)}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayMedication; 