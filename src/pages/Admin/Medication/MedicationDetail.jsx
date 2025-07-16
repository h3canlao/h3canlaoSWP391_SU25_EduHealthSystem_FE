import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMedicationById } from "@/services/medicationApi";
import { Card, Descriptions, Button, Spin, Tag, message, Table } from "antd"; // Import Table
import dayjs from "dayjs";

const MedicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMedicationById(id)
      .then((res) => setData(res.data.data ?? res.data))
      .catch(() => message.error("Không tải được thông tin thuốc!"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin />;
  if (!data) return <div>Không tìm thấy dữ liệu!</div>;

  // Status
  const renderStatus = (status) =>
    status === 0 ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Khóa</Tag>;

  // Format ngày
  const formatDate = (dateStr) =>
    dateStr ? dayjs(dateStr).format("DD/MM/YYYY HH:mm") : "";

  // Columns for the Lots Table
  const lotColumns = [
    {
      title: "Số lô",
      dataIndex: "lotNumber",
      key: "lotNumber",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Vị trí lưu trữ",
      dataIndex: "storageLocation",
      key: "storageLocation",
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (dateStr) => dayjs(dateStr).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái hết hạn",
      dataIndex: "expiryStatus",
      key: "expiryStatus",
      render: (status) => {
        let color = '';
        if (status === 'Còn hạn') {
          color = 'green';
        } else if (status === 'Sắp hết hạn') { // Assuming you might have this status
          color = 'orange';
        } else if (status === 'Đã hết hạn') {
          color = 'red';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Ngày tạo lô",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (dateStr) => formatDate(dateStr),
    },
  ];

  return (
    <Card
      title={<span style={{ fontWeight: 700 }}>Chi tiết thuốc: {data.name}</span>}
      extra={<Button onClick={() => navigate(-1)}>Quay lại</Button>}
      style={{ margin: "0 24px" }}
      bodyStyle={{ padding: 24 }}
      headStyle={{ fontSize: 20 }}
    >
      <Descriptions column={1} bordered size="middle" labelStyle={{ width: 180, fontWeight: 600 }}>
        <Descriptions.Item label="Tên thuốc">{data.name}</Descriptions.Item>
        <Descriptions.Item label="Đơn vị">{data.unit}</Descriptions.Item>
        <Descriptions.Item label="Dạng dùng">{data.dosageForm}</Descriptions.Item>
        <Descriptions.Item label="Danh mục">
          {data.categoryName || `ID: ${data.category}`}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{renderStatus(data.status)}</Descriptions.Item>
        <Descriptions.Item label="Tổng số lô">{data.totalLots ?? 0}</Descriptions.Item>
        <Descriptions.Item label="Tổng tồn kho">{data.totalQuantity ?? 0}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{formatDate(data.createdAt)}</Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">{formatDate(data.updatedAt)}</Descriptions.Item>
      </Descriptions>

      {data.lots && data.lots.length > 0 && (
        <>
          <br />
          <h3>Chi tiết lô hàng</h3>
          <Table
            columns={lotColumns}
            dataSource={data.lots}
            rowKey="id"
            pagination={false}
            bordered
            size="small"
          />
        </>
      )}
    </Card>
  );
};

export default MedicationDetail;