import React, { useState, useEffect, useMemo } from 'react';
import { Button, Typography, Spin, Empty, Card, Tag, List, Collapse, Row, Col, Divider } from 'antd';
import { PlusOutlined, CheckCircleOutlined, CarOutlined, HomeOutlined, DesktopOutlined, ClockCircleOutlined, MedicineBoxOutlined, CalendarOutlined } from '@ant-design/icons';
import { getAllParentMedicationDelivery, getStudentsByParentId } from '../../../services/apiServices';
import { getUserInfo } from '../../../services/handleStorageApi';
import ModalMedication from './ModalMedication';
import './SendMedication.css';

const { Title, Text } = Typography;
const { Panel } = Collapse;

// Status definitions
const STATUS_COLORS = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#f5222d',
  default: '#8c8c8c',
};

// Status mapping - value is from API (0: pending, 1: confirmed, etc.)
const STATUS_MAP = {
  0: { color: STATUS_COLORS.default, icon: <ClockCircleOutlined />, text: 'Đang chờ' },
  1: { color: STATUS_COLORS.primary, icon: <DesktopOutlined />, text: 'Đã gửi' },
  2: { color: STATUS_COLORS.success, icon: <CheckCircleOutlined />, text: 'Đã xác nhận' },
  3: { color: STATUS_COLORS.warning, icon: <CarOutlined />, text: 'Từ chối' },
  4: { color: STATUS_COLORS.danger, icon: <HomeOutlined />, text: 'Đã giao' },
};

const SendMedication = () => {
  const [medications, setMedications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Get parent ID from token
  const parentId = useMemo(() => {
    const userInfo = getUserInfo();
    try {
      return userInfo?.accessToken 
        ? JSON.parse(atob(userInfo.accessToken.split('.')[1]))?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
        : null;
    } catch {
      return null;
    }
  }, []);

  // Fetch students associated with parent
  const fetchStudents = async () => {
    if (!parentId) return;
    
    setStudentLoading(true);
    try {
      const res = await getStudentsByParentId(parentId);
      setStudents(res.data?.data || []);
    } catch (error) {
      setStudents([]);
    } finally {
      setStudentLoading(false);
    }
  };

  // Fetch medication deliveries
  const fetchMedications = async () => {
    setLoading(true);
    try {
      const res = await getAllParentMedicationDelivery();
      setMedications(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    if (parentId) {
      fetchStudents();
      fetchMedications();
    }
  }, [parentId]);

  // Handle modal close
  const handleModalClose = (shouldReload = false) => {
    setShowModal(false);
    if (shouldReload) fetchMedications();
  };

  // Format date and time for display
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format time only (for schedule display)
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  // Daily Schedule component
  const DailyScheduleItem = ({ schedule }) => (
    <div className="schedule-display-item">
      <Row gutter={[8, 8]} align="middle">
        <Col span={8}>
          <Text strong><CalendarOutlined /> Thời gian:</Text> {formatTime(schedule.time)}
        </Col>
        <Col span={7}>
          <Text strong>Liều lượng:</Text> {schedule.dosage}
        </Col>
        <Col span={9}>
          <Text strong>Ghi chú:</Text> {schedule.note || '-'}
        </Col>
      </Row>
    </div>
  );

  // Medication details component
  const MedicationDetails = ({ medication }) => (
    <div className="medication-details">
      <Row gutter={[16, 8]}>
        <Col span={12}>
          <Text strong>Số lượng tổng:</Text> {medication.totalQuantity}
        </Col>
        <Col span={12}>
          <Text strong>Đã sử dụng:</Text> {medication.quantityUsed}
        </Col>
      </Row>
      <Row gutter={[16, 8]}>
        <Col span={24}>
          <Text strong>Còn lại:</Text> {medication.quantityRemaining}
        </Col>
      </Row>
      <Row gutter={[16, 8]}>
        <Col span={24}>
          <Text strong>Hướng dẫn sử dụng:</Text> {medication.dosageInstruction || '-'}
        </Col>
      </Row>
      
      {medication.dailySchedule && medication.dailySchedule.length > 0 && (
        <>
          <Divider orientation="left" className="schedule-divider">Lịch uống thuốc</Divider>
          {medication.dailySchedule.map((schedule, idx) => (
            <DailyScheduleItem key={schedule.id || idx} schedule={schedule} />
          ))}
        </>
      )}
    </div>
  );

  // Medication card component
  const MedicationCard = ({ delivery }) => {
    const { studentName, notes, deliveredAt, status, medications } = delivery;
    const statusInfo = STATUS_MAP[status] || STATUS_MAP[0]; // Default to pending if status unknown
    
    return (
      <Card
        className="medication-list-card"
        style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        bodyStyle={{ padding: 24, background: '#fafdff' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div className="medication-student-name">
              {studentName || 'Không có tên'}
            </div>
            <div style={{ color: '#555', marginTop: 8 }}>
              <Text strong>Thời gian gửi:</Text> {formatDateTime(deliveredAt)}
            </div>
            <div style={{ color: '#555' }}>
              <Text strong>Ghi chú:</Text> {notes || '-'}
            </div>
          </div>
          <div style={{ minWidth: 140, textAlign: 'right' }}>
            <Tag
              icon={statusInfo.icon}
              color={statusInfo.color}
              style={{ fontSize: 16, padding: '6px 16px', borderRadius: 8, marginBottom: 8 }}
            >
              {statusInfo.text}
            </Tag>
          </div>
        </div>

        {medications && medications.length > 0 ? (
          <div className="medications-container" style={{ marginTop: 16 }}>
            <Collapse 
              bordered={false} 
              className="medications-collapse"
              expandIconPosition="end"
            >
              {medications.map((med, idx) => (
                <Panel 
                  key={med.id || `med-${idx}`}
                  header={
                    <div className="medication-panel-header">
                      <MedicineBoxOutlined /> <span className="medication-name">{med.medicationName}</span>
                    </div>
                  }
                >
                  <MedicationDetails medication={med} />
                </Panel>
              ))}
            </Collapse>
          </div>
        ) : (
          <div style={{ marginTop: 16, color: '#999', fontStyle: 'italic' }}>
            Không có thông tin thuốc
          </div>
        )}
      </Card>
    );
  };

  // Loading or empty state
  const renderContent = () => {
    if (loading || studentLoading) {
      return <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />;
    }
    
    if (medications.length === 0) {
      return <Empty description="Không có đơn thuốc." />;
    }
    
    return (
      <div className="medication-list-scroll" style={{ maxHeight: 'calc(93vh - 120px)', overflowY: 'auto', paddingRight: 8 }}>
        <List
          dataSource={medications}
          renderItem={(delivery) => (
            <MedicationCard key={delivery.id} delivery={delivery} />
          )}
          className="medication-list"
        />
      </div>
    );
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
        
        {renderContent()}
        
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