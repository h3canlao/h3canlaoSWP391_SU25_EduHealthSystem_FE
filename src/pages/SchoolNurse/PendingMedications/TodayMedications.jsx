import React, { useState, useEffect } from 'react';
import { Button, Typography, Spin, Empty, Card, Tag, Modal, message, Input, Form, Radio } from 'antd';
import { ClockCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { getPendingMedicationUsageRecords, updateMedicationUsageRecord } from '../../../services/apiServices';
import { getAccessToken } from '../../../services/handleStorageApi';
import './PendingMedications.css';
import { formatDateTime } from '../../../utils';

const { TextArea } = Input;

const TodayMedications = () => {
  const [usageRecords, setUsageRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState({ 
    visible: false, 
    record: null, 
    loading: false,
    isTaken: true,
    note: '' 
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const token = getAccessToken();
      if (!token) return;
      
      setLoading(true);
      try {
        const res = await getPendingMedicationUsageRecords();
        setUsageRecords(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (error) {
        message.error('Không thể tải danh sách thuốc cần dùng hôm nay');
        setUsageRecords([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter records based on search term
  const filteredRecords = usageRecords.filter(record =>
    record.studentName?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .includes(searchTerm.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')) ||
    record.medicationName?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .includes(searchTerm.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''))
  );

  // Handle update record
  const handleUpdate = async () => {
    if (!confirmModal.record) return;
    
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await updateMedicationUsageRecord(
        confirmModal.record.id,
        confirmModal.isTaken,
        confirmModal.note
      );
      
      message.success(confirmModal.isTaken ? 
        'Xác nhận đã dùng thuốc thành công!' : 
        'Xác nhận không dùng thuốc thành công!'
      );
      
      // Close modal and refresh data
      setConfirmModal({ visible: false, record: null, loading: false, isTaken: true, note: '' });
      
      const token = getAccessToken();
      if (token) {
        const res = await getPendingMedicationUsageRecords();
        setUsageRecords(Array.isArray(res.data?.data) ? res.data.data : []);
      }
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    } finally {
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Render medication card
  const renderCard = ({ id, medicationName, studentName, usedAt, dosageInstruction, 
    totalQuantity, quantityUsed, quantityRemaining, isTaken, note }) => (
    <Card
      key={id}
      className={`medication-card today-medication-card ${isTaken ? 'completed' : ''}`}
      style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      bodyStyle={{ padding: 20, background: "#fff" }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#2c3e50' }}>
            {medicationName}
          </div>
          <div style={{ color: '#666', marginBottom: 4 }}>
            <strong>Học sinh:</strong> {studentName}
          </div>
          <div style={{ color: '#666', marginBottom: 4 }}>
            <strong>Thời gian dùng:</strong> {formatDateTime(usedAt)}
          </div>
          <div style={{ color: '#666', marginBottom: 8 }}>
            <strong>Hướng dẫn sử dụng:</strong> {dosageInstruction || 'Không có'}
          </div>
          <div style={{ color: '#666', display: 'flex', gap: 16 }}>
            <span><strong>Số lượng:</strong> {totalQuantity}</span>
            <span><strong>Đã sử dụng:</strong> {quantityUsed}</span>
            <span><strong>Còn lại:</strong> {quantityRemaining}</span>
          </div>
        </div>
        
        <div style={{ textAlign: 'right', marginLeft: 16 }}>
          <Tag
            icon={isTaken ? <CheckOutlined /> : <ClockCircleOutlined />}
            color={isTaken ? '#52c41a' : '#faad14'}
            style={{ fontSize: 14, padding: '4px 12px', borderRadius: 6, marginBottom: 12 }}
          >
            {isTaken ? 'Đã dùng' : 'Chưa dùng'}
          </Tag>
          <br />
          {!isTaken && (
            <Button
              type="primary"
              size="small"
              onClick={() => setConfirmModal({ 
                visible: true, 
                record: { id, medicationName, studentName, usedAt },
                loading: false,
                isTaken: true,
                note: ''
              })}
              style={{ borderRadius: 6 }}
            >
              Cập nhật tình trạng
            </Button>
          )}
        </div>
      </div>

      {note && (
        <div style={{ marginTop: 16, background: '#f9f9f9', padding: 10, borderRadius: 8 }}>
          <strong>Ghi chú:</strong> {note}
        </div>
      )}
    </Card>
  );

  return (
    <>
      <Input
        placeholder="Tìm kiếm tên học sinh hoặc tên thuốc..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20, maxWidth: 350 }}
        allowClear
      />
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : filteredRecords.length === 0 ? (
        <Empty description="Không có thuốc nào cần dùng hôm nay." />
      ) : (
        <div className="medications-container">
          {filteredRecords.map(renderCard)}
        </div>
      )}

      {/* Modal xác nhận sử dụng thuốc */}
      <Modal
        title="Xác nhận tình trạng sử dụng thuốc"
        open={confirmModal.visible}
        onOk={handleUpdate}
        onCancel={() => setConfirmModal({ visible: false, record: null, loading: false, isTaken: true, note: '' })}
        confirmLoading={confirmModal.loading}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ 
          style: { 
            background: confirmModal.isTaken ? '#52c41a' : '#f5222d', 
            borderColor: confirmModal.isTaken ? '#52c41a' : '#f5222d' 
          } 
        }}
      >
        {confirmModal.record && (
          <Form layout="vertical">
            <div style={{ marginBottom: 16 }}>
              <strong>Thuốc:</strong> {confirmModal.record.medicationName}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Học sinh:</strong> {confirmModal.record.studentName}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Thời gian:</strong> {formatDateTime(confirmModal.record.usedAt)}
            </div>
            
            <Form.Item label="Tình trạng sử dụng">
              <Radio.Group 
                value={confirmModal.isTaken} 
                onChange={e => setConfirmModal(prev => ({ ...prev, isTaken: e.target.value }))}
              >
                <Radio value={true}>Đã uống thuốc</Radio>
                <Radio value={false}>Không uống thuốc</Radio>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item 
              label="Ghi chú" 
              help={confirmModal.isTaken ? 
                "Ghi chú về việc sử dụng thuốc (nếu có)" : 
                "Vui lòng ghi rõ lý do không sử dụng thuốc"
              }
              rules={[{
                required: !confirmModal.isTaken,
                message: "Vui lòng nhập lý do không uống thuốc"
              }]}
            >
              <TextArea 
                rows={4} 
                value={confirmModal.note}
                onChange={e => setConfirmModal(prev => ({ ...prev, note: e.target.value }))}
                placeholder={confirmModal.isTaken ? "Ghi chú (nếu có)" : "Lý do không sử dụng thuốc"} 
                required={!confirmModal.isTaken}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default TodayMedications; 