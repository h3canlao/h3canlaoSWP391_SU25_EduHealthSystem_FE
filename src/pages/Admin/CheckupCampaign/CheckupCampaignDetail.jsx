import React, { useEffect, useState } from "react";
import { Card, Descriptions, Spin, Tag, message, Button, Table, Badge, Space, Modal } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  cancelCheckupCampaign,
  completeCheckupCampaign,
  getCheckupCampaignDetail,
  startCheckupCampaign,
} from "@/services/checkupCampaignApi";
import dayjs from "dayjs";

const statusOptions = [
  { value: 0, label: "Đang lên kế hoạch", color: "default" },
  { value: 1, label: "Đã lên lịch", color: "cyan" },
  { value: 2, label: "Đang thực hiện", color: "blue" },
  { value: 3, label: "Đã hoàn thành", color: "green" },
  { value: 4, label: "Đã hủy", color: "red" },
];

const scheduleStatusOptions = [
  { value: 0, label: "Chưa diễn ra", color: "default", badge: "processing" },
  { value: 1, label: "Đang diễn ra", color: "blue", badge: "warning" },
  { value: 2, label: "Đã hoàn thành", color: "green", badge: "success" },
  { value: 3, label: "Đã hủy", color: "red", badge: "error" },
];

const CheckupCampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getCheckupCampaignDetail(id);
        setData(res.data?.data || null);
      } catch (err) {
        message.error(err?.response?.data?.message ?? "Không lấy được thông tin chiến dịch!");
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleAction = async (type) => {
    setActionLoading(true);
    try {
      // Các hàm API start, complete, cancel đã được định nghĩa
      if (type === "start") {
        await startCheckupCampaign(id);
        message.success("Bắt đầu chiến dịch thành công!");
      } else if (type === "complete") {
        await completeCheckupCampaign(id);
        message.success("Đã chuyển sang hoàn thành!");
      } else if (type === "cancel") {
        await cancelCheckupCampaign(id);
        message.success("Đã huỷ chiến dịch!");
      }
      // Reload chi tiết để cập nhật trạng thái mới nhất
      const res = await getCheckupCampaignDetail(id);
      setData(res.data?.data || null);
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Thao tác thất bại!");
    }
    setActionLoading(false);
  };

  if (loading) return <Spin style={{ marginTop: 40 }} />;
  if (!data)
    return (
      <Card>
        <p>Không tìm thấy dữ liệu chiến dịch!</p>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </Card>
    );

  const status = statusOptions.find((s) => s.value === data.status);

  // Table columns for schedules (giữ nguyên)
  const scheduleColumns = [
    {
      title: "Loại khám",
      dataIndex: "checkupTypeName",
      key: "checkupTypeName",
    },
    {
      title: "Thời gian dự kiến",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "scheduleStatus",
      key: "scheduleStatus",
      render: (status, record) => {
        const opt = scheduleStatusOptions[record.scheduleStatus] || {};
        return <Badge status={opt.badge} text={record.scheduleStatusName || opt.label} />;
      },
    },
    {
      title: "Số học sinh dự kiến",
      dataIndex: "totalStudents",
      key: "totalStudents",
      align: "center",
    },
    {
      title: "Đã khám xong",
      dataIndex: "completedRecords",
      key: "completedRecords",
      align: "center",
      render: (v, r) => `${v}/${r.totalStudents}`,
    },
  ];

  return (
    <Card
      title={<span>Chi tiết chiến dịch khám định kỳ</span>}
      extra={<Button onClick={() => navigate(-1)}>Quay lại</Button>}
      style={{ margin: "0 24px", boxShadow: "0 2px 16px #eee" }}
    >
      <Space style={{ marginBottom: 16 }}>
        {/* Logic hiển thị nút cập nhật */}
        {data.status === 0 && (
          <Button
            type="primary"
            loading={actionLoading}
            onClick={() => {
              Modal.confirm({
                title: "Bắt đầu chiến dịch?",
                content: "Bạn có chắc muốn bắt đầu chiến dịch này?",
                onOk: () => handleAction("start"),
              });
            }}
          >
            Bắt đầu
          </Button>
        )}
        {data.status === 2 && (
          <>
            <Button
              type="primary"
              loading={actionLoading}
              onClick={() => {
                Modal.confirm({
                  title: "Hoàn thành chiến dịch?",
                  content: "Xác nhận chuyển chiến dịch sang trạng thái hoàn thành?",
                  onOk: () => handleAction("complete"),
                });
              }}
            >
              Đánh dấu đã hoàn thành
            </Button>
            <Button
              danger
              loading={actionLoading}
              onClick={() => {
                Modal.confirm({
                  title: "Huỷ chiến dịch?",
                  content: "Bạn chắc chắn muốn huỷ chiến dịch này?",
                  onOk: () => handleAction("cancel"),
                });
              }}
            >
              Huỷ chiến dịch
            </Button>
          </>
        )}
        {/* Nút hủy cũng có thể từ trạng thái 1 */}
        {data.status === 1 && (
          <Button
            danger
            loading={actionLoading}
            onClick={() => {
              Modal.confirm({
                title: "Huỷ chiến dịch?",
                content: "Bạn chắc chắn muốn huỷ chiến dịch này?",
                onOk: () => handleAction("cancel"),
              });
            }}
          >
            Huỷ chiến dịch
          </Button>
        )}
      </Space>
      <Descriptions
        column={2}
        bordered
        size="middle"
        labelStyle={{ fontWeight: 600, width: 180 }}
        contentStyle={{ minWidth: 200 }}
      >
        <Descriptions.Item label="Tên chiến dịch">{data.name}</Descriptions.Item>
        <Descriptions.Item label="Năm học">{data.schoolYear || <i>---</i>}</Descriptions.Item>
        <Descriptions.Item label="Ngày bắt đầu">
          {data.startDate ? dayjs(data.startDate).format("DD/MM/YYYY HH:mm") : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày kết thúc">
          {data.endDate ? dayjs(data.endDate).format("DD/MM/YYYY HH:mm") : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={status?.color}>{data.statusName || status?.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Đang hoạt động">
          {data.isActive ? <Tag color="green">Có</Tag> : <Tag color="red">Không</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng số lịch khám">{data.totalSchedules}</Descriptions.Item>
        <Descriptions.Item label="Số lịch đã hoàn thành">{data.completedSchedules}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {data.createdAt ? dayjs(data.createdAt).format("DD/MM/YYYY HH:mm") : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {data.updatedAt ? dayjs(data.updatedAt).format("DD/MM/YYYY HH:mm") : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>
          {data.description || <i>(Không có)</i>}
        </Descriptions.Item>
      </Descriptions>
      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontWeight: 600 }}>Danh sách lịch khám trong chiến dịch</h3>
        <Table
          rowKey="id"
          columns={scheduleColumns}
          dataSource={data.schedules || []}
          pagination={false}
          size="middle"
          bordered
          locale={{ emptyText: "Chưa có lịch khám nào" }}
          style={{ marginTop: 12 }}
        />
      </div>
    </Card>
  );
};

export default CheckupCampaignDetail;
