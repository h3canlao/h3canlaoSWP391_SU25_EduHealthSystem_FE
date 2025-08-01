import React, { useState, useEffect, useMemo } from 'react';
import { Button, Typography, Spin, Empty, Card, Tag, List } from 'antd';
import { PlusOutlined, CheckCircleOutlined, CarOutlined, HomeOutlined, DesktopOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getAllParentMedicationDelivery, getStudentsByParentId } from '../../../services/apiServices';
import { getUserInfo } from '../../../services/handleStorageApi';
import ModalMedication from './ModalMedication';
import './SendMedication.css';

const { Title } = Typography;

// Status definitions
const STATUS_COLORS = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#f5222d',
  default: '#8c8c8c',
};

const STATUS_MAP = {
  Pending: { color: STATUS_COLORS.default, icon: <ClockCircleOutlined />, text: 'Đang chờ' },
  Ordered: { color: STATUS_COLORS.primary, icon: <DesktopOutlined />, text: 'Đã gửi' },
  Confirmed: { color: STATUS_COLORS.success, icon: <CheckCircleOutlined />, text: 'Đã xác nhận' },
  'In Transit': { color: STATUS_COLORS.warning, icon: <CarOutlined />, text: 'Từ chối' },
  Delivered: { color: STATUS_COLORS.danger, icon: <HomeOutlined />, text: 'Đã giao' },
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
      const res = await getAllParentMedicationDelivery(parentId);
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

  // Medication card component
  const MedicationCard = ({ medication }) => {
    const { medicationName, quantityDelivered, deliveredAt, notes, status } = medication;
    const statusText = status === 'In Transit' ? 'Từ chối' : (STATUS_MAP[status]?.text || status);
    
    return (
      <Card
        className="medication-list-card"
        style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        bodyStyle={{ padding: 24, background: '#fafdff' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div className="medication-student-name">
              {medicationName || ''}</div>
            <div style={{ margin: '8px 0 0 0', color: '#555' }}>
              <b>Số lượng giao:</b> {quantityDelivered}
            </div>
            <div style={{ color: '#555' }}>
              <b>Thời gian giao:</b> {deliveredAt ? new Date(deliveredAt).toLocaleString() : ''}
            </div>
            <div style={{ color: '#555' }}>
              <b>Ghi chú:</b> {notes || '-'}
            </div>
          </div>
          <div style={{ minWidth: 140, textAlign: 'right' }}>
            <Tag
              icon={STATUS_MAP[status]?.icon}
              color={STATUS_MAP[status]?.color}
              style={{ fontSize: 16, padding: '6px 16px', borderRadius: 8, marginBottom: 8 }}
            >
              {statusText}
            </Tag>
          </div>
        </div>
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
          renderItem={(medication) => (
            <MedicationCard key={medication.id} medication={medication} />
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