import React, { useState, useEffect } from 'react';
import { Button, Typography, Spin, Empty, Card, Tag, Modal, Select, message, Input, Collapse, Tabs } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CarOutlined, 
  HomeOutlined, 
  EditOutlined, 
  MedicineBoxOutlined
} from '@ant-design/icons';
import { getPendingMedicationDeliveries, updateMedicationDeliveryStatus } from '../../../services/apiServices';
import { getAccessToken } from '../../../services/handleStorageApi';
import './PendingMedications.css';
import TodayMedications from './TodayMedications';
import { formatDateTime } from '../../../utils';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const PendingMedications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateModal, setUpdateModal] = useState({ visible: false, medication: null, loading: false });
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Status mapping
  const statusMap = {
    0: { color: '#fa8c16', icon: <ClockCircleOutlined />, text: 'Đang chờ' },
    1: { color: '#52c41a', icon: <CheckCircleOutlined />, text: 'Đã xác nhận' },
    2: { color: '#f5222d', icon: <CarOutlined />, text: 'Từ chối' },
    3: { color: '#722ed1', icon: <HomeOutlined />, text: 'Đã giao' }
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const token = getAccessToken();
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
    
    fetchData();
  }, []);

  // Filter medications based on search term
  const filteredMedications = medications.filter(med =>
    med.studentName?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .includes(searchTerm.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''))
  );

  // Modal handlers
  const handleUpdateStatus = async () => {
    if (!updateModal.medication) return;
    
    setUpdateModal(prev => ({ ...prev, loading: true }));
    try {
      await updateMedicationDeliveryStatus(
        updateModal.medication.id,
        selectedStatus
      );
      message.success('Cập nhật trạng thái thành công!');
      
      // Refresh data and close modal
      setUpdateModal({ visible: false, medication: null, loading: false });
      const token = getAccessToken();
      if (token) {
        const res = await getPendingMedicationDeliveries();
        setMedications(Array.isArray(res.data?.data) ? res.data.data : []);
      }
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
      setUpdateModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Render medication card
  const renderMedicationCard = ({ id, studentName, notes, deliveredAt, status, medications: meds }) => {
    const currentStatus = statusMap[status] || statusMap[0];
    
    return (
      <Card
        key={id}
        className="medication-card"
        style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        bodyStyle={{ padding: 20, background: "#fff" }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#2c3e50' }}>
              {studentName}
            </div>
            <div style={{ color: '#666', marginBottom: 4 }}><strong>Mã đơn:</strong> {id.slice(0, 8)}...</div>
            <div style={{ color: '#666', marginBottom: 4 }}><strong>Thời gian giao:</strong> {formatDateTime(deliveredAt)}</div>
            <div style={{ color: '#666', marginBottom: 8 }}><strong>Ghi chú:</strong> {notes || 'Không có'}</div>
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
              onClick={() => setUpdateModal({ visible: true, medication: { id, studentName, status }, loading: false })}
              style={{ borderRadius: 6, background: '#722ed1', borderColor: '#722ed1' }}
            >
              Cập nhật
            </Button>
          </div>
        </div>

        {meds && meds.length > 0 ? (
          <div className="medications-container" style={{ marginTop: 16 }}>
            <Collapse bordered={false} className="medications-collapse" expandIconPosition="end">
              {meds.map((med, idx) => (
                <Panel 
                  key={med.id || `med-${idx}`}
                  header={<div className="medication-panel-header">
                    <MedicineBoxOutlined /> <span className="medication-name">{med.medicationName}</span>
                  </div>}
                >
                  <div className="medication-details">
                    <div><Text strong>Số lượng tổng:</Text> {med.totalQuantity}</div>
                    <div><Text strong>Đã sử dụng:</Text> {med.quantityUsed}</div>
                    <div><Text strong>Còn lại:</Text> {med.quantityRemaining}</div>
                    <div><Text strong>Hướng dẫn sử dụng:</Text> {med.dosageInstruction || '-'}</div>
                    
                    {med.dailySchedule?.length > 0 && (
                      <div className="daily-schedules">
                        <div className="schedule-divider">Lịch uống thuốc</div>
                        {med.dailySchedule.map((schedule, idx) => (
                          <div key={schedule.id || idx} className="schedule-display-item">
                            <strong>Thời gian:</strong> {schedule.time} | 
                            <strong> Liều lượng:</strong> {schedule.dosage} | 
                            <strong> Ghi chú:</strong> {schedule.note || '-'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

  return (
    <div className="pending-medications">
      <Card className="pending-medications-container">
        <div className="page-header">
          <Title level={3}>Quản Lý Đơn Thuốc</Title>
          <Text type="secondary">Theo dõi và cập nhật trạng thái các đơn thuốc từ phụ huynh</Text>
        </div>
        
        <Tabs defaultActiveKey="all" className="medications-tabs">
          <TabPane tab="Tất cả đơn thuốc" key="all">
            <Input
              placeholder="Tìm kiếm tên học sinh..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ marginBottom: 20, maxWidth: 350 }}
              allowClear
            />
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>
            ) : filteredMedications.length === 0 ? (
              <Empty description="Không có đơn thuốc nào." />
            ) : (
              <div className="medications-container">
                {filteredMedications.map(renderMedicationCard)}
              </div>
            )}
          </TabPane>
          
          <TabPane tab="Thuốc cần dùng hôm nay" key="today">
            <TodayMedications />
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal cập nhật trạng thái đơn thuốc */}
      <Modal
        title="Cập nhật trạng thái đơn thuốc"
        open={updateModal.visible}
        onOk={handleUpdateStatus}
        onCancel={() => setUpdateModal({ visible: false, medication: null, loading: false })}
        confirmLoading={updateModal.loading}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#722ed1', borderColor: '#722ed1' } }}
      >
        {updateModal.medication && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>Học sinh:</strong> {updateModal.medication.studentName}
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
                <Option value={0}>Đang chờ</Option>
                <Option value={1}>Đã xác nhận</Option>
                <Option value={2}>Từ chối</Option>
                <Option value={3}>Đã giao</Option>
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingMedications; 