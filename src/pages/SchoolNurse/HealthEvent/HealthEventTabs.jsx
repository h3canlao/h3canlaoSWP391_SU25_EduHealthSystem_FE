// src/pages/HealthEventTabs.js
import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Spin, message, Input, Card, Button, Space, Tabs, Popconfirm } from "antd"; // Thêm Tabs
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getHealthEvents } from "@/services/apiServices";
import HealthEventForm from "./HealthEventForm"; // Giả sử bạn có component form này
import "./HealthEvent.css";
import axios from "axios";

const { Title } = Typography;
const { Search } = Input;

// Các MAP hằng số giữ nguyên
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
  Resolved: { color: "green", text: "Hoàn thành" },
};

export default function HealthEventTabs() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("1"); // <-- State để quản lý tab
  const navigate = useNavigate();

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

  // Hàm được gọi khi tạo mới thành công
  const handleCreationSuccess = () => {
    message.success("Tạo sự kiện mới thành công!");
    setActiveTab("1"); // Chuyển về tab danh sách
    fetchEvents(); // Tải lại dữ liệu mới nhất
  };

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7096/api/HealthEvent/batch`, { data: id, params: { isPermanent: true } });
      fetchEvents();

      message.success("Xóa sự kiện thành công!");
    } catch (er) {
      message.error(er?.message || "Xóa thất bại");
    }
  };
  const columns = [
    // Các cột không đổi
    { title: "Mã sự kiện", dataIndex: "eventCode", key: "eventCode", width: 150 },
    { title: "Học sinh", dataIndex: "studentName", key: "studentName" },
    { title: "Loại sự kiện", dataIndex: "eventType", key: "eventType", render: (v) => EVENT_TYPE_MAP[v] || v },
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
          <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/nurse/health-event/${record.id}`)}>
            Xem
          </Button>

          <Popconfirm title="Xác nhận xóa sự kiện này?" onConfirm={() => handleDelete([record.id])}>
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "1",
      label: "Danh sách sự kiện",
      children: (
        <>
          <Search
            placeholder="Tìm tên học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 20, maxWidth: 350 }}
            allowClear
          />
          <Spin spinning={loading}>
            <Table columns={columns} dataSource={filteredEvents} rowKey="id" pagination={{ pageSize: 8 }} bordered />
          </Spin>
        </>
      ),
    },
    {
      key: "2",
      label: "Tạo sự kiện mới",
      children: <HealthEventForm onCreationSuccess={handleCreationSuccess} />, // <-- Truyền callback vào form
    },
  ];

  return (
    <div className="health-event-page" style={{ padding: 24 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={3} style={{ margin: 0 }}>
            Quản lý sự kiện y tế
          </Title>
          {/* Nút này sẽ chuyển sang tab tạo mới */}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setActiveTab("2")}>
            Tạo sự kiện mới
          </Button>
        </div>

        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} items={tabItems} />
      </Card>
    </div>
  );
}
