import React, { useState, useEffect } from 'react';
import { Button, Typography, Spin, Empty, Card, Tag, List, Input } from 'antd';
import { PlusOutlined, CheckCircleOutlined, CarOutlined, HomeOutlined, DesktopOutlined } from '@ant-design/icons';
import { getAllParentMedicationDelivery, getStudentsByParentId } from '../../../services/apiServices';
import { getUserInfo } from '../../../services/handleStorageApi';
import ModalMedication from './ModalMedication';
import './SendMedication.css';

const { Title } = Typography;

const SendMedication = () => {
  const [medications, setMedications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const userInfo = getUserInfo();
  const parentId = userInfo?.accessToken ? 
    JSON.parse(atob(userInfo.accessToken.split('.')[1]))?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] : 
    null;

  const fetchStudents = async () => {
    if (!parentId) return;
    setStudentLoading(true);
    try {
      const res = await getStudentsByParentId(parentId);
      setStudents(res.data.data || []);
    } catch {
      setStudents([]);
    } finally {
      setStudentLoading(false);
    }
  };

  const fetchMedications = async () => {
    setLoading(true);
    try {
      const res = await getAllParentMedicationDelivery(parentId);
      setMedications(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchMedications();
  }, [parentId]);

  const handleModalClose = (shouldReload = false) => {
    setShowModal(false);
    if (shouldReload) fetchMedications();
  };

  const statusColors = ['#1890ff', '#52c41a', '#faad14', '#f5222d'];

  const statusMap = {
    Ordered: { color: statusColors[0], icon: <DesktopOutlined />, text: 'Đã gửi', step: 0 },
    Confirmed: { color: statusColors[1], icon: <CheckCircleOutlined />, text: 'Đã xác nhận', step: 1 },
    'In Transit': { color: statusColors[2], icon: <CarOutlined />, text: 'Từ chối', step: 2 },
    Delivered: { color: statusColors[3], icon: <HomeOutlined />, text: 'Đã giao', step: 3 },
  };

  const statusList = ['Ordered', 'Confirmed', 'Delivered'];

  const filteredMedications = medications
    .slice().reverse()
    .filter(med =>
      med.medicationName?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
        .includes(searchTerm.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''))
    );

  const renderMedicationCard = (med) => (
    <Card
      key={med.medicationName}
      className="medication-list-card"
      style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      bodyStyle={{ padding: 24, background: '#fafdff' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <div className="medication-student-name">
            {med.medicationName || med.studentName || med.studentFullName || med.studentCode || med.studentId || ''}
          </div>
          <div style={{ margin: '8px 0 0 0', color: '#555' }}>
            <b>Số lượng giao:</b> {med.quantityDelivered}
          </div>
          <div style={{ color: '#555' }}>
            <b>Thời gian giao:</b> {med.deliveredAt ? new Date(med.deliveredAt).toLocaleString() : ''}
          </div>
          <div style={{ color: '#555' }}>
            <b>Ghi chú:</b> {med.notes || '-'}
          </div>
        </div>
        <div style={{ minWidth: 140, textAlign: 'right' }}>
          <Tag
            icon={statusMap[med.status]?.icon}
            color={statusMap[med.status]?.color}
            style={{ fontSize: 16, padding: '6px 16px', borderRadius: 8, marginBottom: 8 }}
          >
            {med.status === 'In Transit' ? 'Từ chối' : (statusMap[med.status]?.text || med.status)}
          </Tag>
        </div>
      </div>
      <div
        style={{
          marginTop: 32,
          background: '#f8fafc',
          borderRadius: 16,
          padding: '32px 0 24px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 140,
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: 700, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {statusList.map((status, idx) => {
              const activeStep = statusMap[med.status]?.step || 0;
              const isActive = idx <= activeStep && med.status !== 'In Transit';
              return (
                <React.Fragment key={status}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 90,
                    minWidth: 90,
                    maxWidth: 90,
                  }}>
                    <div style={{
                      background: '#fff',
                      border: `3px solid ${isActive ? statusMap[status].color : '#e0e0e0'}`,
                      borderRadius: '50%',
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 32,
                      color: isActive ? statusMap[status].color : '#d9d9d9',
                      boxShadow: isActive ? `0 0 8px ${statusMap[status].color}` : 'none',
                      transition: 'all 0.3s',
                    }}>{statusMap[status].icon}</div>
                    <div style={{
                      textAlign: 'center',
                      fontSize: 16,
                      fontWeight: 600,
                      color: isActive ? statusMap[status].color : '#bfbfbf',
                      marginTop: 8,
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>{statusMap[status].text}</div>
                  </div>
                  {idx < statusList.length - 1 && (
                    <span style={{
                      display: 'inline-block',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: idx < activeStep ? statusMap[statusList[idx + 1]].color : '#e0e0e0',
                      margin: '0 18px',
                      alignSelf: 'flex-start',
                      marginTop: 24,
                    }}></span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );

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
        <Input
          placeholder="Tìm kiếm tên thuốc..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ marginBottom: 20, maxWidth: 350 }}
          allowClear
        />
        {loading || studentLoading ? (
          <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
        ) : filteredMedications.length === 0 ? (
          <Empty description="Không có đơn thuốc." />
        ) : (
          <div className="medication-list-scroll" style={{ maxHeight: 'calc(93vh - 120px)', overflowY: 'auto', paddingRight: 8 }}>
            <List
              dataSource={filteredMedications}
              renderItem={renderMedicationCard}
              className="medication-list"
            />
          </div>
        )}
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