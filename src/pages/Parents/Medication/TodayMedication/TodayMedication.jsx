import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Empty, Avatar, Tag, Divider, DatePicker, Button, Collapse, List } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DownOutlined, MedicineBoxOutlined, ClockCircleOutlined, CarOutlined, HomeOutlined, DesktopOutlined } from '@ant-design/icons';
import { getMedicationUsageRecordsByDate } from '../../../../services/apiServices';
import './TodayMedication.css';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Panel } = Collapse;

// Mapping trạng thái đơn thuốc
const STATUS_MAP = {
  0: { color: '#8c8c8c', icon: <ClockCircleOutlined />, text: 'Đang chờ' },
  1: { color: '#1890ff', icon: <DesktopOutlined />, text: 'Đã gửi' },
  2: { color: '#52c41a', icon: <CheckCircleOutlined />, text: 'Đã xác nhận' },
  3: { color: '#ff0000', icon: <CarOutlined />, text: 'Từ chối' },
  4: { color: '#f5222d', icon: <HomeOutlined />, text: 'Đã giao' },
};

const TodayMedication = () => {
  const [loading, setLoading] = useState(false);
  const [usageRecords, setUsageRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Load data
  const fetchMedicationRecords = () => {
    setLoading(true);
    // Format date as YYYY-MM-DD
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    
    getMedicationUsageRecordsByDate(formattedDate)
      .then(res => {
        // API returns nested data, extract usage records
        const deliveries = res.data?.data || [];
        // Group by delivery
        const groupedDeliveries = deliveries.map(delivery => {
          const usageRecords = [];
          
          delivery.medications?.map(med => {
            if (med.usageRecords && med.usageRecords.length > 0) {
              med.usageRecords.map(record => {
                usageRecords.push({
                  ...record,
                  deliveryStatus: delivery.status,
                  deliveryNotes: delivery.notes
                });
              });
            }
          });
          
          return {
            id: delivery.id,
            studentName: delivery.studentName,
            status: delivery.status,
            notes: delivery.notes,
            deliveredAt: delivery.deliveredAt,
            usageRecords
          };
        }).filter(delivery => delivery.usageRecords.length > 0);
        
        setUsageRecords(groupedDeliveries);
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
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="medication-outer-container">
      <div className="medication-inner-container">
        <div className="medication-header-row">
          <Title level={2} className="medication-title">
            <MedicineBoxOutlined /> Lịch Sử Dùng Thuốc
          </Title>
          <div className="date-selector">
            <DatePicker 
              value={selectedDate} 
              onChange={handleDateChange} 
              format="YYYY-MM-DD" 
              style={{ marginRight: 16 }}
              placeholder="Chọn ngày"
            />
            <Button type="primary" onClick={fetchMedicationRecords} style={{ borderRadius: 8, fontWeight: 600 }}>
              Tìm Kiếm
            </Button>
          </div>
        </div>

        {/* Hiển thị danh sách thuốc */}
        {loading ? (
          <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
        ) : usageRecords.length === 0 ? (
          <Empty description="Không tìm thấy lịch sử dùng thuốc cho ngày này" />
        ) : (
          <div className="medication-list-scroll" style={{ maxHeight: 'calc(93vh - 120px)', overflowY: 'auto', paddingRight: 8 }}>
            <List
              dataSource={usageRecords}
              renderItem={(delivery) => {
                const statusInfo = STATUS_MAP[delivery.status] || STATUS_MAP[0];
                
                return (
                  <Card
                    key={delivery.id}
                    className="medication-list-card"
                    style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                    bodyStyle={{ padding: 24, background: '#fafdff' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div className="medication-student-info">
                        <div className="medication-student-name">
                          <Avatar 
                            src="https://images.icon-icons.com/3310/PNG/512/student_man_avatar_user_toga_school_university_icon_209264.png"
                            style={{ marginRight: 12 }} 
                            size="large" 
                          />
                          {delivery.studentName}
                        </div>
                        <div style={{ color: '#555', marginTop: 8 }}>
                          <Text strong>Thời gian gửi:</Text> {formatDateTime(delivery.deliveredAt)}
                        </div>
                        {delivery.notes && (
                          <div style={{ color: '#555' }}>
                            <Text strong>Ghi chú:</Text> {delivery.notes}
                          </div>
                        )}
                      </div>
                      <div style={{ minWidth: 140, textAlign: 'right' }}>
                        <Tag
                          icon={statusInfo.icon}
                          color={statusInfo.color}
                          style={{ fontSize: 16, padding: '6px 16px', borderRadius: 8 }}
                        >
                          {statusInfo.text}
                        </Tag>
                      </div>
                    </div>

                    {/* Chi tiết thuốc */}
                    <div style={{ marginTop: 16 }}>
                      <Collapse bordered={false} expandIconPosition="end" className="medications-collapse">
                        <Panel 
                          key="details"
                          header={
                            <div className="medication-panel-header">
                              <MedicineBoxOutlined /> <span className="medication-name">Lịch sử dùng thuốc</span>
                            </div>
                          }
                        >
                          {delivery.usageRecords.map((record) => (
                            <div key={record.id} style={{ marginBottom: 16, padding: 12, background: '#f9f9f9', borderRadius: 8 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <Text strong>{record.medicationName}</Text>
                                {record.isTaken ? (
                                  <Tag color="success" icon={<CheckCircleOutlined />}>Đã dùng</Tag>
                                ) : (
                                  <Tag color="error" icon={<CloseCircleOutlined />}>Chưa dùng</Tag>
                                )}
                              </div>
                              
                              <div style={{ marginBottom: 8 }}>
                                <Text strong>Thời gian dùng:</Text> {formatDateTime(record.usedAt)}
                              </div>
                              
                              <div style={{ marginBottom: 8 }}>
                                <Text strong>Số lượng:</Text> Đã dùng: {record.quantityUsed} / Tổng: {record.totalQuantity} / Còn lại: {record.quantityRemaining}
                              </div>
                              
                              {record.dosageInstruction && (
                                <div style={{ marginBottom: 8 }}>
                                  <Text strong>Hướng dẫn sử dụng:</Text> {record.dosageInstruction}
                                </div>
                              )}
                              
                              {record.note && (
                                <div>
                                  <Text strong>Ghi chú:</Text> {record.note}
                                </div>
                              )}
                            </div>
                          ))}
                        </Panel>
                      </Collapse>
                    </div>
                  </Card>
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayMedication; 