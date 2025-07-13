import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMedicationById } from "@/services/medicationApi";
import { Card, Descriptions, Button, Spin, Tag, message } from "antd";
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

  return (
    <Card
      title={<span style={{ fontWeight: 700 }}>Chi tiết thuốc: {data.name}</span>}
      extra={<Button onClick={() => navigate(-1)}>Quay lại</Button>}
      style={{  margin: "0 24px" }}
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
    </Card>
  );
};

export default MedicationDetail;
