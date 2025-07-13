import React, { useEffect, useState } from "react";
import { Card, Descriptions, Spin, Tag, Button, Table, Typography, message, Space } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  getVaccinationScheduleById,
  startVaccinationSchedule,
  completeVaccinationSchedule,
} from "@/services/vaccinationSchedule";

const statusOptions = [
  { value: 0, label: "Chưa bắt đầu", color: "default" },
  { value: 1, label: "Đang diễn ra", color: "blue" },
  { value: 2, label: "Đã hoàn thành", color: "green" },
  { value: 3, label: "Đã huỷ", color: "red" },
];

const studentStatusMap = [
  { value: 0, label: "Đã đăng ký", color: "default" },
  { value: 1, label: "Đã điểm danh", color: "blue" },
  { value: 2, label: "Đã tiêm", color: "green" },
  { value: 3, label: "Đã hủy", color: "red" },
];

const VaccinationScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch detail
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await getVaccinationScheduleById(id);
      setData(res.data?.data || null);
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Không lấy được thông tin lịch tiêm!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line
  }, [id]);

  // Action handler
  const handleAction = async (type) => {
    try {
      if (type === "start") {
        await startVaccinationSchedule(id);
        message.success("Bắt đầu lịch tiêm thành công!");
      } else if (type === "complete") {
        await completeVaccinationSchedule(id);
        message.success("Hoàn thành lịch tiêm thành công!");
      }
      await fetchDetail();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Thao tác thất bại!");
    }
  };

  if (loading) return <Spin style={{ marginTop: 40 }} />;
  if (!data)
    return (
      <Card>
        <p>Không tìm thấy dữ liệu lịch tiêm!</p>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </Card>
    );

  const status = statusOptions.find((s) => s.value === data.scheduleStatus);

  // Bảng học sinh trong lịch tiêm
  const studentColumns = [
    { title: "Tên học sinh", dataIndex: "studentName", key: "studentName" },
    { title: "Mã học sinh", dataIndex: "studentCode", key: "studentCode" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const opt = studentStatusMap[record.status] || {};
        return <Tag color={opt.color}>{record.statusName || opt.label}</Tag>;
      },
    },
    {
      title: "Check-in",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "--"),
    },
    {
      title: "Phụ huynh đã được thông báo",
      dataIndex: "parentNotifiedAt",
      key: "parentNotifiedAt",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : <i style={{ color: "#bbb" }}>(Chưa)</i>),
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (v) => v || <i style={{ color: "#bbb" }}>(Không có)</i>,
    },
  ];

  // Bảng kết quả tiêm chủng
  const recordColumns = [
    { title: "Tên học sinh", dataIndex: "studentName", key: "studentName" },
    { title: "Kết quả", dataIndex: "result", key: "result" },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
  ];

  // Action button condition
  const canStart = data.scheduleStatus === 0;
  const canComplete = data.scheduleStatus === 1;

  return (
    <Card
      title="Chi tiết lịch tiêm chủng"
      extra={
        <Space>
          {canStart && (
            <Button type="primary" onClick={() => handleAction("start")}>
              Bắt đầu lịch tiêm
            </Button>
          )}
          {canComplete && (
            <Button type="primary" danger onClick={() => handleAction("complete")}>
              Hoàn thành lịch tiêm
            </Button>
          )}
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </Space>
      }
      style={{ margin: "0 24px", boxShadow: "0 2px 16px #eee" }}
    >
      <Descriptions
        column={1}
        bordered
        labelStyle={{ fontWeight: 600, width: 180 }}
        contentStyle={{ minWidth: 220 }}
      >
        <Descriptions.Item label="Tên chiến dịch">{data.campaignName}</Descriptions.Item>
        <Descriptions.Item label="Loại vaccine">
          {data.vaccinationTypeName}
          <span style={{ color: "#999" }}>
            {data.vaccinationTypeCode ? ` (${data.vaccinationTypeCode})` : ""}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian tiêm">
          {data.scheduledAt ? dayjs(data.scheduledAt).format("DD/MM/YYYY HH:mm") : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={status?.color}>{data.scheduleStatusName || status?.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tổng số học sinh">{data.totalStudents}</Descriptions.Item>
        <Descriptions.Item label="Số lượng đã tiêm xong">{data.completedRecords}</Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 40 }}>
        <Typography.Title level={5} style={{ marginBottom: 12 }}>
          Danh sách học sinh tham gia
        </Typography.Title>
        <Table
          rowKey="id"
          columns={studentColumns}
          dataSource={data.sessionStudents || []}
          pagination={false}
          size="small"
          bordered
          locale={{ emptyText: "Không có học sinh nào trong lịch tiêm này" }}
        />
      </div>

      <div style={{ marginTop: 40 }}>
        <Typography.Title level={5} style={{ marginBottom: 12 }}>
          Danh sách kết quả tiêm chủng
        </Typography.Title>
        <Table
          rowKey="id"
          columns={recordColumns}
          dataSource={data.records || []}
          pagination={false}
          size="small"
          bordered
          locale={{ emptyText: "Chưa có kết quả tiêm chủng" }}
        />
      </div>
    </Card>
  );
};

export default VaccinationScheduleDetail;
