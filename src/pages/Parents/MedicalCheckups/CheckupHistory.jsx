import React from 'react';
import { Card, Typography, List, Empty } from 'antd';
import './CheckupHistory.css';

const { Title } = Typography;

// Mock data mẫu
const checkupHistory = [
  {
    id: 1,
    checkupType: 'Khám tổng quát',
    date: '2024-04-15',
    result: 'Bình thường',
    note: 'Không phát hiện bất thường',
  },
  {
    id: 2,
    checkupType: 'Khám mắt',
    date: '2023-10-10',
    result: 'Cận thị nhẹ',
    note: 'Khuyến nghị đeo kính',
  },
];

const CheckupHistory = () => {
  return (
    <div className="checkup-history-outer">
      <div className="checkup-history-inner">
        <Title level={2} className="checkup-history-title">Lịch Sử Kiểm Tra Y Tế</Title>
        <List
          dataSource={checkupHistory}
          locale={{ emptyText: <Empty description="Chưa có lịch sử kiểm tra y tế." /> }}
          renderItem={item => (
            <Card
              key={item.id}
              className="checkup-history-card"
              style={{ marginBottom: 24, borderRadius: 12 }}
              bodyStyle={{ padding: 24, background: '#fafdff' }}
            >
              <div style={{ fontWeight: 600, color: '#00529b', fontSize: '1.1rem' }}>{item.checkupType}</div>
              <div><b>Ngày kiểm tra:</b> {item.date}</div>
              <div><b>Kết quả:</b> {item.result}</div>
              <div><b>Ghi chú:</b> {item.note}</div>
            </Card>
          )}
        />
      </div>
    </div>
  );
};

export default CheckupHistory; 