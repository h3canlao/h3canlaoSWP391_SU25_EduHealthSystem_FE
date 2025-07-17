import React, { useEffect, useState } from "react";
import { Card, List, Tag, Spin, Empty } from "antd";
import { getHealthEventsMyChild } from "@/services/apiServices";
import { HistoryOutlined, UserOutlined, CalendarOutlined, FileTextOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const statusColors = {
  Pending: "orange",
  InProgress: "blue",
  Completed: "green",
  Cancelled: "red",
};
const statusNames = {
  Pending: "Chờ xử lý",
  InProgress: "Đang xử lý",
  Completed: "Hoàn thành",
  Cancelled: "Đã huỷ",
};

export default function ParentHealthEvents() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getHealthEventsMyChild();
      setData(res.data?.data || []);
    } catch {
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2 style={{ fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <HistoryOutlined /> Sự kiện y tế của con
      </h2>
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
      ) : data.length === 0 ? (
        <Empty description="Không có sự kiện y tế nào." />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={data}
          renderItem={item => (
            <Card
              style={{ marginBottom: 16 }}
              bodyStyle={{ padding: 16 }}
              title={<>
                <UserOutlined style={{ marginRight: 6 }} /> <b>{item.studentName}</b>
                <Tag color="default" style={{ marginLeft: 8 }}>{item.eventCategory}</Tag>
                <Tag color={statusColors[item.eventStatus] || "default"} style={{ marginLeft: 8 }}>
                  {statusNames[item.eventStatus] || item.eventStatus}
                </Tag>
              </>}
            >
              <div style={{ marginBottom: 8 }}>
                <FileTextOutlined style={{ marginRight: 6 }} /> <b>Loại sự kiện:</b> {item.eventType}
              </div>
              <div style={{ marginBottom: 8 }}>
                <ExclamationCircleOutlined style={{ marginRight: 6 }} /> <b>Mô tả:</b> {item.description}
              </div>
              <div style={{ marginBottom: 8 }}>
                <CalendarOutlined style={{ marginRight: 6 }} /> <b>Thời gian xảy ra:</b> {dayjs(item.occurredAt).format("DD/MM/YYYY HH:mm")}
              </div>
              <div style={{ marginBottom: 8 }}>
                <UserOutlined style={{ marginRight: 6 }} /> <b>Báo cáo bởi:</b> {item.reportedByName}
              </div>
              <div>
                <Tag color="purple">Tạo lúc: {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}</Tag>
                <Tag color="geekblue">Cập nhật: {dayjs(item.updatedAt).format("DD/MM/YYYY HH:mm")}</Tag>
              </div>
            </Card>
          )}
        />
      )}
    </div>
  );
} 