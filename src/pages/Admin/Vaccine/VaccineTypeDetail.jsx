import React, { useEffect, useState } from "react";
import { Card, Descriptions, Spin, Button, Tag, message, Table, Typography } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getVaccineTypeDetail } from "@/services/vaccineManagerApi";
import dayjs from "dayjs";

const VaccineTypeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getVaccineTypeDetail(id);
        setData(res.data?.data || res.data || null);
      } catch (err) {
        message.error(err?.response?.data?.message ?? "Không lấy được thông tin loại vaccine!");
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) return <Spin style={{ marginTop: 40 }} />;
  if (!data) return (
    <Card>
      <p>Không tìm thấy dữ liệu loại vaccine!</p>
      <Button onClick={() => navigate(-1)}>Quay lại</Button>
    </Card>
  );

  // Columns cho bảng liều tiêm
  const doseColumns = [
    { title: "STT", render: (_, __, idx) => idx + 1, width: 60 },
    { title: "Số thứ tự liều", dataIndex: "doseNumber" },
    { title: "Tên vaccine", dataIndex: "vaccineTypeName" },
    { title: "Mã vaccine", dataIndex: "vaccineTypeCode" },
    {
      title: "Tuổi khuyến nghị (tháng)",
      dataIndex: "recommendedAgeMonths",
      render: v => v ?? <i>---</i>,
    },
    {
      title: "Khoảng cách tối thiểu với liều trước (ngày)",
      dataIndex: "minIntervalDays",
      render: v => v ?? <i>---</i>,
    },
    {
      title: "Tên liều trước",
      dataIndex: "previousDoseName",
      render: v => v || <i>---</i>
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: v => v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "",
    }
  ];

  return (
    <Card
      title="Chi tiết loại vaccine"
      extra={<Button onClick={() => navigate(-1)}>Quay lại</Button>}
      style={{ margin: "0 24px", boxShadow: "0 2px 16px #eee" }}
    >
      <Descriptions
        column={2}
        bordered
        size="middle"
        labelStyle={{ fontWeight: 600, width: 180 }}
        contentStyle={{ minWidth: 220 }}
      >
        <Descriptions.Item label="Mã">{data.code}</Descriptions.Item>
        <Descriptions.Item label="Tên">{data.name}</Descriptions.Item>
        <Descriptions.Item label="Nhóm">{data.group}</Descriptions.Item>
        <Descriptions.Item label="Kích hoạt">
          <Tag color={data.isActive ? "green" : "red"}>
            {data.isActive ? "Đang sử dụng" : "Ngưng sử dụng"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tuổi khuyến nghị (tháng)">
          {data.recommendedAgeMonths ?? <i>---</i>}
        </Descriptions.Item>
        <Descriptions.Item label="Khoảng cách tiêm (ngày)">
          {data.minIntervalDays ?? <i>---</i>}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng số liều">{data.totalDoses}</Descriptions.Item>
        <Descriptions.Item label="Tổng số lịch tiêm">{data.totalSchedules}</Descriptions.Item>
        <Descriptions.Item label="Tổng số lô thuốc">{data.totalMedicationLots}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {data.createdAt ? dayjs(data.createdAt).format("DD/MM/YYYY HH:mm") : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {data.updatedAt ? dayjs(data.updatedAt).format("DD/MM/YYYY HH:mm") : ""}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 36 }}>
        <Typography.Title level={5} style={{ marginBottom: 12 }}>
          Danh sách liều tiêm ({data.doseInfos?.length || 0})
        </Typography.Title>
        <Table
          rowKey="id"
          columns={doseColumns}
          dataSource={data.doseInfos || []}
          pagination={false}
          size="small"
          locale={{ emptyText: "Không có liều tiêm nào" }}
        />
      </div>

      {/* Nếu cần hiển thị medicationLots thì bổ sung bảng tương tự ở đây */}
    </Card>
  );
};

export default VaccineTypeDetail;
