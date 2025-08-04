import React, { useState, useEffect } from 'react';
import { Button, Typography, Spin, Empty, Card, Tag, Modal, message, Form, Radio, Input } from 'antd';
import { ClockCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { getPendingMedicationUsageRecords, updateMedicationUsageRecord } from '../../../services/apiServices';
import './PendingMedications.css';
import { formatDateTime } from '../../../utils';

const { TextArea } = Input;

// Component hiển thị thuốc cần dùng trong ngày
const TodayMedications = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isTaken, setIsTaken] = useState(true);
  const [note, setNote] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    setLoading(true);
    getPendingMedicationUsageRecords()
      .then(res => {
        setRecords(Array.isArray(res.data?.data) ? res.data.data : []);
      })
      .catch(() => {
        message.error('Không thể tải danh sách thuốc cần dùng hôm nay');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Mở modal xác nhận sử dụng thuốc
  const showModal = (record) => {
    setSelectedRecord(record);
    setIsTaken(true);
    setNote('');
    setVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setVisible(false);
  };

  // Xử lý cập nhật trạng thái sử dụng thuốc
  const handleUpdate = async () => {
    if (!selectedRecord) return;
    
    setConfirmLoading(true);
    try {
      await updateMedicationUsageRecord(
        selectedRecord.id,
        isTaken,
        note
      );
      
      message.success(isTaken ? 
        'Xác nhận đã dùng thuốc thành công!' : 
        'Xác nhận không dùng thuốc thành công!'
      );
      
      // Đóng modal và tải lại dữ liệu
      setVisible(false);
      
      // Tải lại dữ liệu
      const res = await getPendingMedicationUsageRecords();
      setRecords(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      {/* Hiển thị loading hoặc dữ liệu */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : records.length === 0 ? (
        <Empty description="Không có thuốc nào cần dùng hôm nay." />
      ) : (
        <div className="medications-container">
          {records.map(record => (
            <Card
              key={record.id}
              className={`medication-card today-medication-card ${record.isTaken ? 'completed' : ''}`}
              style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              bodyStyle={{ padding: 20, background: "#fff" }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#2c3e50' }}>
                    {record.medicationName}
                  </div>
                  <div style={{ color: '#666', marginBottom: 4 }}>
                    <strong>Học sinh:</strong> {record.studentName}
                  </div>
                  <div style={{ color: '#666', marginBottom: 4 }}>
                    <strong>Thời gian dùng:</strong> {formatDateTime(record.usedAt)}
                  </div>
                  <div style={{ color: '#666', marginBottom: 8 }}>
                    <strong>Hướng dẫn sử dụng:</strong> {record.dosageInstruction || 'Không có'}
                  </div>
                  <div style={{ color: '#666', display: 'flex', gap: 16 }}>
                    <span><strong>Số lượng:</strong> {record.totalQuantity}</span>
                    <span><strong>Đã sử dụng:</strong> {record.quantityUsed}</span>
                    <span><strong>Còn lại:</strong> {record.quantityRemaining}</span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right', marginLeft: 16 }}>
                  <Tag
                    icon={record.isTaken ? <CheckOutlined /> : <ClockCircleOutlined />}
                    color={record.isTaken ? '#52c41a' : '#faad14'}
                    style={{ fontSize: 14, padding: '4px 12px', borderRadius: 6, marginBottom: 12 }}
                  >
                    {record.isTaken ? 'Đã dùng' : 'Chưa dùng'}
                  </Tag>
                  <br />
                  {!record.isTaken && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => showModal(record)}
                      style={{ borderRadius: 6 }}
                    >
                      Cập nhật tình trạng
                    </Button>
                  )}
                </div>
              </div>

              {record.note && (
                <div style={{ marginTop: 16, background: '#f9f9f9', padding: 10, borderRadius: 8 }}>
                  <strong>Ghi chú:</strong> {record.note}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal xác nhận sử dụng thuốc */}
      <Modal
        title="Xác nhận tình trạng sử dụng thuốc"
        open={visible}
        onOk={handleUpdate}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ 
          style: { 
            background: isTaken ? '#52c41a' : '#f5222d', 
            borderColor: isTaken ? '#52c41a' : '#f5222d' 
          } 
        }}
      >
        {selectedRecord && (
          <Form layout="vertical">
            <div style={{ marginBottom: 16 }}>
              <strong>Thuốc:</strong> {selectedRecord.medicationName}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Học sinh:</strong> {selectedRecord.studentName}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Thời gian:</strong> {formatDateTime(selectedRecord.usedAt)}
            </div>
            
            <Form.Item label="Tình trạng sử dụng">
              <Radio.Group 
                value={isTaken} 
                onChange={e => setIsTaken(e.target.value)}
              >
                <Radio value={true}>Đã uống thuốc</Radio>
                <Radio value={false}>Không uống thuốc</Radio>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item 
              label="Ghi chú" 
              help={isTaken ? 
                "Ghi chú về việc sử dụng thuốc (nếu có)" : 
                "Vui lòng ghi rõ lý do không sử dụng thuốc"
              }
              rules={[{
                required: !isTaken,
                message: "Vui lòng nhập lý do không uống thuốc"
              }]}
            >
              <TextArea 
                rows={4} 
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder={isTaken ? "Ghi chú (nếu có)" : "Lý do không sử dụng thuốc"} 
                required={!isTaken}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default TodayMedications; 