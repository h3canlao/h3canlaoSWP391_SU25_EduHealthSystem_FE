import React from 'react';
import { Card, Typography, List, Empty } from 'antd';
import './ConsultationSchedule.css';

const { Title } = Typography;

// Mock data mẫu
const consultationList = [
  {
    id: 1,
    date: '2024-06-01 09:00',
    doctor: 'BS. Nguyễn Văn A',
    topic: 'Tư vấn dinh dưỡng',
    status: 'Đã xác nhận',
  },
  {
    id: 2,
    date: '2024-06-10 14:30',
    doctor: 'BS. Trần Thị B',
    topic: 'Tư vấn thị lực',
    status: 'Chờ xác nhận',
  },
];

const ConsultationSchedule = () => {
  return (
    <div className="consultation-outer">
      <div className="consultation-inner">
        <Title level={2} className="consultation-title">Lịch Hẹn Tư Vấn</Title>
        <List
          dataSource={consultationList}
          locale={{ emptyText: <Empty description="Chưa có lịch hẹn tư vấn." /> }}
          renderItem={item => (
            <Card
              key={item.id}
              className="consultation-card"
              style={{ marginBottom: 24, borderRadius: 12 }}
              bodyStyle={{ padding: 24, background: '#fafdff' }}
            >
              <div style={{ fontWeight: 600, color: '#00529b', fontSize: '1.1rem' }}>{item.topic}</div>
              <div><b>Thời gian:</b> {item.date}</div>
              <div><b>Bác sĩ:</b> {item.doctor}</div>
              <div><b>Trạng thái:</b> {item.status}</div>
            </Card>
          )}
        />
      </div>
    </div>
  );
};

export default ConsultationSchedule; 