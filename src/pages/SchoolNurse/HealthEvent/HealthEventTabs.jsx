import React, { useEffect, useState } from "react";
import { Tabs, Table, Typography, Tag, Spin, message, Input } from "antd";
import { getHealthEvents } from "@/services/apiServices";
import HealthEventForm from "./HealthEventForm";
import "./HealthEvent.css";

const { Title } = Typography;

const EVENT_TYPE_MAP = {
  Accident: "Tai nạn",
  Fever: "Sốt",
  Fall: "Ngã",
  Disease: "Bệnh",
  Other: "Khác",
  VaccineReaction: "Phản ứng vắc xin"
};
const EVENT_STATUS_MAP = {
  InProgress: { color: "blue", text: "Đang xử lý" },
  Completed: { color: "green", text: "Hoàn thành" },
  Cancelled: { color: "red", text: "Đã hủy" }
};

export default function HealthEventTabs() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEvents = () => {
    setLoading(true);
    getHealthEvents()
      .then(res => setEvents(res.data?.data || []))
      .catch(() => message.error("Không lấy được danh sách sự kiện y tế"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Lọc danh sách sự kiện theo tên học sinh
  const filteredEvents = events.filter(ev =>
    ev.studentName?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .includes(searchTerm.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''))
  );

  const columns = [
    {
      title: "Học sinh",
      dataIndex: "studentName",
      key: "studentName",
      width: 140
    },
    {
      title: "Loại sự kiện",
      dataIndex: "eventType",
      key: "eventType",
      width: 120,
      render: v => EVENT_TYPE_MAP[v] || v
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200
    },
    {
      title: "Thời gian",
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 160,
      render: v => v ? new Date(v).toLocaleString("vi-VN") : ""
    },
    {
      title: "Trạng thái",
      dataIndex: "eventStatus",
      key: "eventStatus",
      width: 120,
      render: v => {
        const status = EVENT_STATUS_MAP[v] || { color: "default", text: v };
        return <Tag color={status.color}>{status.text}</Tag>;
      }
    }
  ];

  return (
    <div className="health-event">
      <div className="health-event-container">
        <Title level={3} className="health-event-title">Quản lý sự kiện y tế</Title>
        <Tabs defaultActiveKey="1" items={[
          {
            key: "1",
            label: "Danh sách sự kiện",
            children: loading ? <Spin /> : (
              <>
                <Input
                  placeholder="Tìm kiếm tên học sinh..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ marginBottom: 20, maxWidth: 350 }}
                  allowClear
                />
                <Table
                  columns={columns}
                  dataSource={filteredEvents}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  bordered
                  className="health-event-table"
                  rowClassName="health-event-row"
                />
              </>
            )
          },
          {
            key: "2",
            label: "Tạo sự kiện mới",
            children: <HealthEventForm />
          }
        ]} />
      </div>
    </div>
  );
} 