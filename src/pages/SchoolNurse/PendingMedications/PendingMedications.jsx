import React, { useState, useEffect } from 'react';
import { Button, Typography, Spin, Empty, Card, Tag, Modal, Select, message, Input } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CarOutlined, HomeOutlined, EditOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getPendingMedicationDeliveries, updateMedicationDeliveryStatus } from '../../../services/apiServices';
import { getAccessToken } from '../../../services/handleStorageApi';
import './PendingMedications.css';

const { Title, Text } = Typography;
const { Option } = Select;

const PendingMedications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateModal, setUpdateModal] = useState({ visible: false, medication: null, loading: false });
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const token = getAccessToken();

  // Lấy danh sách đơn thuốc pending
  const fetchPendingMedications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getPendingMedicationDeliveries();
      setMedications(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      message.error('Không thể tải danh sách đơn thuốc');
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingMedications();
  }, [token]);

  // Lọc danh sách đơn thuốc theo searchTerm
  const filteredMedications = medications.filter(med =>
    med.medicationName?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .includes(searchTerm.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''))
  );

  // Xử lý cập nhật trạng thái
  const handleUpdateStatus = async () => {
    if (!updateModal.medication) return;
    
    setUpdateModal(prev => ({ ...prev, loading: true }));
    try {
      await updateMedicationDeliveryStatus(
        updateModal.medication.parentMedicationDeliveryId,
        selectedStatus
      );
      message.success('Cập nhật trạng thái thành công!');
      setUpdateModal({ visible: false, medication: null, loading: false });
      fetchPendingMedications(); // Reload danh sách
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    } finally {
      setUpdateModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Mở modal cập nhật
  const openUpdateModal = (medication) => {
    setUpdateModal({ visible: true, medication, loading: false });
    setSelectedStatus(0);
  };

  // Đóng modal
  const closeUpdateModal = () => {
    setUpdateModal({ visible: false, medication: null, loading: false });
    setSelectedStatus(0);
  };

  // Map trạng thái
  const statusMap = {
    Pending: { color: '#fa8c16', icon: <ClockCircleOutlined />, text: 'Pending' },
    Confirmed: { color: '#52c41a', icon: <CheckCircleOutlined />, text: 'Confirmed' },
    Rejected: { color: '#f5222d', icon: <CloseCircleOutlined />, text: 'Rejected' },
    Delivered: { color: '#722ed1', icon: <HomeOutlined />, text: 'Delivered' }
  };

  // Render card đơn thuốc
  const renderMedicationCard = (med) => {
    const currentStatus = statusMap[med.status] || statusMap['Pending'];
    
    return (
      <Card
        key={med.parentMedicationDeliveryId}
        className="medication-card"
        style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        bodyStyle={{ padding: 20 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#2c3e50' }}>
              {med.medicationName}
            </div>
            <div style={{ color: '#666', marginBottom: 4 }}>
              <strong>Mã đơn:</strong> {med.parentMedicationDeliveryId.slice(0, 8)}...
            </div>
            <div style={{ color: '#666', marginBottom: 4 }}>
              <strong>Số lượng:</strong> {med.quantityDelivered}
            </div>
            <div style={{ color: '#666', marginBottom: 4 }}>
              <strong>Thời gian giao:</strong> {new Date(med.deliveredAt).toLocaleString()}
            </div>
            <div style={{ color: '#666', marginBottom: 8 }}>
              <strong>Ghi chú:</strong> {med.notes || 'Không có'}
            </div>
          </div>
          
          <div style={{ textAlign: 'right', marginLeft: 16 }}>
            <Tag
              icon={currentStatus.icon}
              color={currentStatus.color}
              style={{ fontSize: 14, padding: '4px 12px', borderRadius: 6, marginBottom: 12 }}
            >
              {currentStatus.text}
            </Tag>
            <br />
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => openUpdateModal(med)}
              style={{ borderRadius: 6, background: '#722ed1', borderColor: '#722ed1' }}
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="pending-medications">
      <div className="page-header">
        <Title level={3}>Quản Lý Đơn Thuốc Đang Chờ</Title>
        <Text type="secondary">Theo dõi và cập nhật trạng thái các đơn thuốc từ phụ huynh</Text>
      </div>
      <Input
        placeholder="Tìm kiếm tên thuốc..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20, maxWidth: 350 }}
        allowClear
      />
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : filteredMedications.length === 0 ? (
        <Card>
          <Empty description="Không có đơn thuốc nào đang chờ xử lý." />
        </Card>
      ) : (
        <div className="medications-container">
          {filteredMedications.map(renderMedicationCard)}
        </div>
      )}

      {/* Modal cập nhật trạng thái */}
      <Modal
        title="Cập nhật trạng thái đơn thuốc"
        open={updateModal.visible}
        onOk={handleUpdateStatus}
        onCancel={closeUpdateModal}
        confirmLoading={updateModal.loading}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#722ed1', borderColor: '#722ed1' } }}
      >
        {updateModal.medication && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>Tên thuốc:</strong> {updateModal.medication.medicationName}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Trạng thái hiện tại:</strong>
              <Tag
                icon={statusMap[updateModal.medication.status]?.icon}
                color={statusMap[updateModal.medication.status]?.color}
                style={{ marginLeft: 8 }}
              >
                {statusMap[updateModal.medication.status]?.text}
              </Tag>
            </div>
            <div>
              <strong>Trạng thái mới:</strong>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Chọn trạng thái mới"
              >
                <Option value={0}>Pending</Option>
                <Option value={1}>Confirmed</Option>
                <Option value={2}>Rejected</Option>
                <Option value={3}>Delivered</Option>
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingMedications; 