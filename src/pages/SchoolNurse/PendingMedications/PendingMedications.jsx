import React, { useState, useEffect } from 'react';
import { Button, Typography, Spin, Empty, Card, Tag, Modal, Select, message, Collapse, Tabs } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CarOutlined, 
  HomeOutlined, 
  EditOutlined, 
  MedicineBoxOutlined
} from '@ant-design/icons';
import { getPendingMedicationDeliveries, updateMedicationDeliveryStatus } from '../../../services/apiServices';
import './PendingMedications.css';
import TodayMedications from './TodayMedications';
import { formatDateTime } from '../../../utils';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;

// Component quản lý đơn thuốc đang chờ xử lý
const PendingMedications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Bảng ánh xạ trạng thái
  const statusMap = {
    0: { color: '#fa8c16', icon: <ClockCircleOutlined />, text: 'Đang chờ' },
    1: { color: '#52c41a', icon: <CheckCircleOutlined />, text: 'Đã xác nhận' },
    2: { color: '#f5222d', icon: <CarOutlined />, text: 'Từ chối' },
    3: { color: '#722ed1', icon: <HomeOutlined />, text: 'Đã giao' }
  };

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    setLoading(true);
    getPendingMedicationDeliveries()
      .then(res => {
        setMedications(Array.isArray(res.data?.data) ? res.data.data : []);
      })
      .catch(() => {
        message.error('Không thể tải danh sách đơn thuốc');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Hiển thị modal cập nhật trạng thái
  const showModal = (medication) => {
    setSelectedMedication({
      id: medication.id,
      studentName: medication.studentName,
      status: medication.status
    });
    setSelectedStatus(medication.status);
    setModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setModalVisible(false);
  };

  // Xử lý cập nhật trạng thái đơn thuốc
  const handleUpdateStatus = async () => {
    if (!selectedMedication) return;
    
    setConfirmLoading(true);
    try {
      await updateMedicationDeliveryStatus(
        selectedMedication.id,
        selectedStatus
      );
      message.success('Cập nhật trạng thái thành công!');
      
      // Đóng modal và tải lại dữ liệu
      setModalVisible(false);
      
      // Tải lại dữ liệu
      const res = await getPendingMedicationDeliveries();
      setMedications(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="pending-medications">
      <Card className="pending-medications-container">
        <div className="page-header">
          <Title level={3}>Quản Lý Đơn Thuốc</Title>
          <Text type="secondary">Theo dõi và cập nhật trạng thái các đơn thuốc từ phụ huynh</Text>
        </div>
        
        <Tabs defaultActiveKey="all" className="medications-tabs">
          {/* Tab tất cả đơn thuốc */}
          <TabPane tab="Tất cả đơn thuốc" key="all">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>
            ) : medications.length === 0 ? (
              <Empty description="Không có đơn thuốc nào." />
            ) : (
              <div className="medications-container">
                {medications.map(medication => (
                  <Card
                    key={medication.id}
                    className="medication-card"
                    style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    bodyStyle={{ padding: 20, background: "#fff" }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#2c3e50' }}>
                          {medication.studentName}
                        </div>
                        <div style={{ color: '#666', marginBottom: 4 }}><strong>Mã đơn:</strong> {medication.id.slice(0, 8)}...</div>
                        <div style={{ color: '#666', marginBottom: 4 }}><strong>Thời gian giao:</strong> {formatDateTime(medication.deliveredAt)}</div>
                        <div style={{ color: '#666', marginBottom: 8 }}><strong>Ghi chú:</strong> {medication.notes || 'Không có'}</div>
                      </div>
                      
                      <div style={{ textAlign: 'right', marginLeft: 16 }}>
                        <Tag
                          icon={statusMap[medication.status]?.icon}
                          color={statusMap[medication.status]?.color}
                          style={{ fontSize: 14, padding: '4px 12px', borderRadius: 6, marginBottom: 12 }}
                        >
                          {statusMap[medication.status]?.text}
                        </Tag>
                        <br />
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          size="small"
                          onClick={() => showModal(medication)}
                          style={{ borderRadius: 6, background: '#722ed1', borderColor: '#722ed1' }}
                        >
                          {/* < Nút cập nhật /> */}
                          Cập nhật
                        </Button>
                      </div>
                    </div>

                    {/* Chi tiết các thuốc trong đơn */}
                    {medication.medications && medication.medications.length > 0 ? (
                      <div className="medications-container" style={{ marginTop: 16 }}>
                          <Collapse bordered={false} className="medications-collapse" expandIconPosition="end">
                            {medication.medications.map((med, idx) => (
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
                ))}
              </div>
            )}
          </TabPane>
          
          {/* Tab thuốc cần dùng hôm nay */}
          <TabPane tab="Thuốc cần dùng hôm nay" key="today">
            <TodayMedications />
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal cập nhật trạng thái đơn thuốc */}
      <Modal
        title="Cập nhật trạng thái đơn thuốc"
        open={modalVisible}
        onOk={handleUpdateStatus}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#722ed1', borderColor: '#722ed1' } }}
      >
        {selectedMedication && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>Học sinh:</strong> {selectedMedication.studentName}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Trạng thái hiện tại:</strong>
              <Tag
                icon={statusMap[selectedMedication.status]?.icon}
                color={statusMap[selectedMedication.status]?.color}
                style={{ marginLeft: 8 }}
              >
                {statusMap[selectedMedication.status]?.text}
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