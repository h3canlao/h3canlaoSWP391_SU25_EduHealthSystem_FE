import React from 'react';
import { Card, Typography, List, Empty } from 'antd';
import './VaccineHistory.css';

const { Title } = Typography;

// Mock data mẫu
const vaccineHistory = [
  {
    id: 1,
    vaccineName: 'Viêm gan B',
    date: '2024-05-10',
    result: 'Đã tiêm',
    note: 'Không có phản ứng phụ',
  },
  {
    id: 2,
    vaccineName: 'Sởi',
    date: '2023-11-20',
    result: 'Đã tiêm',
    note: 'Sốt nhẹ sau tiêm',
  },
];

const VaccineHistory = () => {
  return (
    <div className="vaccine-history-outer">
      <div className="vaccine-history-inner">
        <Title level={2} className="vaccine-history-title">Lịch Sử Tiêm Chủng</Title>
        <List
          dataSource={vaccineHistory}
          locale={{ emptyText: <Empty description="Chưa có lịch sử tiêm chủng." /> }}
          renderItem={item => (
            <Card
              key={item.id}
              className="vaccine-history-card"
              style={{ marginBottom: 24, borderRadius: 12 }}
              bodyStyle={{ padding: 24, background: '#fafdff' }}
            >
              <div style={{ fontWeight: 600, color: '#00529b', fontSize: '1.1rem' }}>{item.vaccineName}</div>
              <div><b>Ngày tiêm:</b> {item.date}</div>
              <div><b>Kết quả:</b> {item.result}</div>
              <div><b>Ghi chú:</b> {item.note}</div>
            </Card>
          )}
        />
      </div>
    </div>
  );
};

export default VaccineHistory; 