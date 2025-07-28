import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Tag, Button, Spin, Empty, Input } from "antd";
import { ScheduleOutlined, UserOutlined, CheckCircleOutlined, ClockCircleOutlined, SearchOutlined } from "@ant-design/icons";
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
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getVaccinationSchedules()
      .then(res => {
        const data = res.data?.data || [];
        setSchedules(data);
        setFilteredSchedules(data);
      })
      .catch(() => {
        setSchedules([]);
        setFilteredSchedules([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [searchQuery, schedules]);

  const filterSchedules = () => {
    if (!searchQuery.trim()) {
      setFilteredSchedules(schedules);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = schedules.filter((schedule) => {
      return schedule.vaccinationTypeName.toLowerCase().includes(query);
    });

    setFilteredSchedules(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Title level={3} style={{ color: "#4FC3F7", marginBottom: 24 }}>
        <ScheduleOutlined /> Lịch tiêm chủng
      </Title>
      
      <div style={{ marginBottom: 24 }}>
        <Input
          placeholder="Tìm kiếm theo tên chiến dịch tiêm chủng..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={handleSearchChange}
          allowClear
          style={{ borderRadius: 8 }}
          size="large"
        />
      </div>

      {loading ? <Spin /> : (
        filteredSchedules.length === 0 ? (
          <Empty description={searchQuery ? "Không tìm thấy lịch tiêm nào phù hợp" : "Không có lịch tiêm nào"} />
        ) : (
          <Row gutter={[24, 24]}>
            {filteredSchedules.map(sch => (
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