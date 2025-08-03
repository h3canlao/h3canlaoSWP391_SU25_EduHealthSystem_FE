// src/pages/HealthEventTabs.js
import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Spin, message, Input, Card, Button, Space } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Hook để điều hướng
import { getHealthEvents } from "@/services/apiServices";
import "./HealthEvent.css"; // Bạn có thể giữ lại CSS cũ hoặc tùy chỉnh thêm

const { Title } = Typography;
const { Search } = Input;

const EVENT_TYPE_MAP = {
  Accident: "Tai nạn",
  Fever: "Sốt",
  Fall: "Ngã",
  Disease: "Bệnh",
  Other: "Khác",
  VaccineReaction: "Phản ứng vắc xin",
};

const EVENT_STATUS_MAP = {
  InProgress: { color: "blue", text: "Đang xử lý" },
  Completed: { color: "green", text: "Hoàn thành" },
  Pending: { color: "grey", text: "Chờ xử lý" },
  Cancelled: { color: "red", text: "Đã hủy" },
  // Thêm status mới từ data example
  Resolved: { color: "green", text: "Hoàn thành" },
};

export default function HealthEventTabs() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Khởi tạo hook navigate

  const fetchEvents = () => {
    setLoading(true);
    getHealthEvents()
      .then((res) => setEvents(res.data?.data || []))
      .catch(() => message.error("Không lấy được danh sách sự kiện y tế"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((ev) =>
    ev.studentName
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .includes(
        searchTerm
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
      )
  );

  const columns = [
    {
      title: "Mã sự kiện",
      dataIndex: "eventCode",
      key: "eventCode",
      width: 150,
    },
    {
      title: "Học sinh",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Loại sự kiện",
      dataIndex: "eventType",
      key: "eventType",
      render: (v) => EVENT_TYPE_MAP[v] || v,
    },
    {
      title: "Thời gian",
      dataIndex: "occurredAt",
      key: "occurredAt",
      render: (v) => (v ? new Date(v).toLocaleString("vi-VN") : ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "eventStatus",
      key: "eventStatus",
      render: (v) => {
        const status = EVENT_STATUS_MAP[v] || { color: "default", text: v };
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/nurse/health-event/${record.id}`)} // Điều hướng đến trang chi tiết
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="health-event-page" style={{ padding: 24 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            Quản lý sự kiện y tế
          </Title>
          <Space>
            <Search
              placeholder="Tìm tên học sinh..."
              onSearch={(value) => setSearchTerm(value)}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/health-events/new")} // Điều hướng đến trang tạo mới
            >
              Tạo sự kiện mới
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Table columns={columns} dataSource={filteredEvents} rowKey="id" pagination={{ pageSize: 8 }} bordered />
        </Spin>
      </Card>
    </div>
  );
}
