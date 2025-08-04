import React, { useState, useEffect } from 'react';
import { Button, Typography, Spin, Empty, Card, Tag, List, Collapse, Space } from 'antd';
import { PlusOutlined, CheckCircleOutlined, CarOutlined, HomeOutlined, DesktopOutlined, ClockCircleOutlined, MedicineBoxOutlined, CalendarOutlined } from '@ant-design/icons';
import { getAllParentMedicationDelivery, getStudentsByParentId } from '../../../services/apiServices';
import { getUserInfo } from '../../../services/handleStorageApi';
import ModalMedication from './ModalMedication';
import './SendMedication.css';

const { Title, Text } = Typography;
const { Panel } = Collapse;

// Mapping trạng thái đơn thuốc
const STATUS_MAP = {
  0: { color: '#8c8c8c', icon: <ClockCircleOutlined />, text: 'Đang chờ' },
  1: { color: '#1890ff', icon: <DesktopOutlined />, text: 'Đã gửi' },
  2: { color: '#52c41a', icon: <CheckCircleOutlined />, text: 'Đã xác nhận' },
  3: { color: '#faad14', icon: <CarOutlined />, text: 'Từ chối' },
  4: { color: '#f5222d', icon: <HomeOutlined />, text: 'Đã giao' },
};

const SendMedication = () => {
  const [medications, setMedications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Lấy ID phụ huynh từ token
  const parentId = getUserInfo()?.accessToken 
    ? JSON.parse(atob(getUserInfo().accessToken.split('.')[1]))?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
    : null;

  // Tải dữ liệu ban đầu
  useEffect(() => {
    if (parentId) {
      Promise.all([
        getStudentsByParentId(parentId).then(res => res.data?.data || []),
        getAllParentMedicationDelivery().then(res => res.data?.data || [])
      ])
      .then(([studentsData, medicationsData]) => {
        setStudents(studentsData);
        setMedications(medicationsData);
      })
      .catch(error => {
        console.error("Error loading data:", error);
        setStudents([]);
        setMedications([]);
      })
      .finally(() => setLoading(false));
    }
  }, [parentId]);

  // Định dạng ngày giờ
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

  // Xử lý đóng modal và tải lại dữ liệu nếu cần
  const handleModalClose = (shouldReload) => {
    setShowModal(false);
    if (shouldReload) {
      setLoading(true);
      getAllParentMedicationDelivery()
        .then(res => setMedications(res.data?.data || []))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="medication-outer-container">
      <div className="medication-inner-container">
        <div className="medication-header-row">
          <Title level={2} className="medication-title">Đơn Gửi Thuốc</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setShowModal(true)}
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            Gửi thuốc
          </Button>
        </div>
        
        {/* Hiển thị danh sách đơn thuốc */}
        {loading ? (
          <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
        ) : medications.length === 0 ? (
          <Empty description="Không có đơn thuốc." />
        ) : (
          <div className="medication-list-scroll" style={{ maxHeight: 'calc(93vh - 120px)', overflowY: 'auto', paddingRight: 8 }}>
            <List
              dataSource={medications}
              renderItem={(delivery) => {
                const statusInfo = STATUS_MAP[delivery.status] || STATUS_MAP[0];
                
                return (
                  <Card
                    className="medication-list-card"
                    style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                    bodyStyle={{ padding: 24, background: '#fafdff' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="medication-student-name">{delivery.studentName || 'Không có tên'}</div>
                        <div style={{ color: '#555', marginTop: 8 }}>
                          <Text strong>Thời gian gửi:</Text> {formatDateTime(delivery.deliveredAt)}
                        </div>
                        <div style={{ color: '#555' }}>
                          <Text strong>Ghi chú:</Text> {delivery.notes || '-'}
                        </div>
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
                    {delivery.medications?.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <Collapse bordered={false} expandIconPosition="end" className="medications-collapse">
                          {delivery.medications.map((med, idx) => (
                            <Panel 
                              key={med.id || idx}
                 s            header={
                                <div className="medication-panel-header">
                                  <MedicineBoxOutlined /> <span className="medication-name">{med.medicationName}</span>
                                </div>
                              }
                            >
                              <div>
                                <div>
                                  <Text strong>Số lượng tổng:</Text>{med.totalQuantity} 
                                  <Text strong>Đã sử dụng:</Text>{med.quantityUsed} 
                                  <Text strong>Còn lại:</Text>{med.quantityRemaining}
                                </div>
                                <div>
                                  <Text strong>Hướng dẫn sử dụng:</Text> {med.dosageInstruction || '-'}
                                </div>
                                
                                {/* Lịch uống thuốc */}
                                {med.dailySchedule?.length > 0 && (
                                  <div style={{ marginTop: 12, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                                    <div style={{ marginBottom: 8 }}><Text strong>Lịch uống thuốc:</Text></div>
                                    {med.dailySchedule.map((schedule, idx) => (
                                      <div key={idx} style={{ padding: '4px 0' }}>
                                        <CalendarOutlined /> {schedule.time} - 
                                        Liều lượng: {schedule.dosage} 
                                        {schedule.note && ` - Ghi chú: ${schedule.note}`}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </Panel>
                          ))}
                        </Collapse>
                      </div>
                    )}
                  </Card>
                );
              }}
            />
          </div>
        )}
        
        {/* Modal gửi đơn thuốc */}
        <ModalMedication
          show={showModal}
          setShow={setShowModal}
          onClose={handleModalClose}
          students={students}
          parentId={parentId}
        />
      </div>
    </div>
  );
};

export default SendMedication;