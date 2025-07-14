import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMedicalSupplyById } from "@/services/medicalSupplyApi";
import { Card, Descriptions, Button, Spin, message, Tag, Space, Table, Tooltip } from "antd";
import dayjs from "dayjs";

const MedicalSupplyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMedicalSupplyById(id)
      .then(res => setData(res.data.data))
      .catch(() => message.error("Không tải được thông tin vật tư!"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin />;
  if (!data) return <div>Không tìm thấy dữ liệu!</div>;

  const formatDate = (date) => date ? dayjs(date).format("HH:mm DD/MM/YYYY") : "--";

  // Table columns cho lots
  const lotColumns = [
    {
      title: "Mã lô",
      dataIndex: "lotNumber",
      key: "lotNumber",
      render: text => <b>{text}</b>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "manufactureDate",
      key: "manufactureDate",
      render: d => formatDate(d),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (d, record) => (
        <Space>
          {formatDate(d)}
          {record.isExpired ? (
            <Tag color="red">Đã hết hạn</Tag>
          ) : (
            <Tag color="green">Còn hạn</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Tình trạng hạn",
      dataIndex: "expiryStatus",
      key: "expiryStatus",
      render: (text, record) => (
        <Tooltip title={`Số ngày đến hạn: ${record.daysUntilExpiry}`}>
          {text === "Hết hạn" ? (
            <Tag color="red">Hết hạn</Tag>
          ) : (
            <Tag color="green">{text}</Tag>
          )}
        </Tooltip>
      ),
      align: "center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: d => formatDate(d),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: d => formatDate(d),
    },
  ];

  return (
    <Card
      title={
        <Space>
          Chi tiết vật tư: {data.name}
          {data.isLowStock && <Tag color="orange">Tồn kho thấp</Tag>}
          {!data.isActive && <Tag color="red">Đã ngưng</Tag>}
          {data.isDeleted && <Tag color="volcano">Đã xóa</Tag>}
        </Space>
      }
      extra={<Button onClick={() => navigate(-1)}>Quay lại</Button>}
      style={{ margin: "0 24px" }}
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
        <Descriptions.Item label="Tên vật tư">{data.name}</Descriptions.Item>
        <Descriptions.Item label="Đơn vị">{data.unit}</Descriptions.Item>
        <Descriptions.Item label="Tồn kho">{data.currentStock}</Descriptions.Item>
        <Descriptions.Item label="Tồn tối thiểu">{data.minimumStock}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {data.isActive ? <Tag color="green">Đang dùng</Tag> : <Tag color="red">Ngưng dùng</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Tồn kho thấp">
          {data.isLowStock ? <Tag color="orange">Có</Tag> : <Tag color="green">Không</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Đã xóa">
          {data.isDeleted ? <Tag color="volcano">Đã xóa</Tag> : <Tag color="green">Chưa xóa</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng số lô">{data.totalLots}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{formatDate(data.createdAt)}</Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">{formatDate(data.updatedAt)}</Descriptions.Item>
        <Descriptions.Item label="Người tạo">{data.createdBy}</Descriptions.Item>
        <Descriptions.Item label="Người cập nhật">{data.updatedBy}</Descriptions.Item>
      </Descriptions>

      {/* Hiển thị lô hàng */}
      <div style={{ marginTop: 32 }}>
        <h3>Danh sách lô</h3>
        <Table
          columns={lotColumns}
          dataSource={data.lots}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: "Không có lô nào" }}
          size="small"
        />
      </div>
    </Card>
  );
};

export default MedicalSupplyDetail;
