import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Tag, Button, Spin, Empty } from "antd";
import { ScheduleOutlined, UserOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { getVaccinationSchedules } from "@/services/apiServices";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title } = Typography;

const statusColor = {
  Pending: "orange",
  Completed: "green",
  Cancelled: "red",
};

export default function VaccinationSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Tải dữ liệu khi component mount
  useEffect(() => {
    setLoading(true);
    getVaccinationSchedules()
      .then(res => {
        setSchedules(res.data?.data || []);
      })
      .catch(() => {
        setSchedules([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Title level={3} style={{ color: "#4FC3F7", marginBottom: 24 }}>
        <ScheduleOutlined /> Lịch tiêm chủng
      </Title>
      
      {loading ? <Spin /> : (
        schedules.length === 0 ? (
          <Empty description="Không có lịch tiêm nào" />
        ) : (
          <Row gutter={[24, 24]}>
            {schedules.map(sch => (
              <Col xs={24} sm={12} md={8} key={sch.id}>
                <Card
                  hoverable
                  style={{ borderRadius: 16, minHeight: 200 }}
                  onClick={() => navigate(`/nurse/vaccination-schedules/${sch.id}`)}
                  cover={<div style={{ textAlign: "center", padding: 16 }}><ScheduleOutlined style={{ fontSize: 40, color: "#4FC3F7" }} /></div>}
                >
                  <Title level={5} style={{ marginBottom: 8 }}>{sch.vaccinationTypeName}</Title>
                  <div style={{ marginBottom: 8 }}>
                    <ClockCircleOutlined /> {dayjs(sch.scheduledAt).format("DD/MM/YYYY HH:mm")}
                  </div>
                  <Tag color={statusColor[sch.scheduleStatusName] || "blue"}>{sch.scheduleStatusName}</Tag>
                  <div style={{ marginTop: 8 }}>
                    <UserOutlined /> Tổng học sinh: <b>{sch.totalStudents}</b> &nbsp;
                    <CheckCircleOutlined style={{ color: "#52c41a" }} /> Đã tiêm: <b>{sch.completedRecords}</b>
                  </div>
                  <Button type="primary" block style={{ marginTop: 16 }}>
                    Xem chi tiết
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )
      )}
    </div>
  );
} 