import React, { useEffect, useState } from "react";
import { Card, List, Tag, Spin, Empty } from "antd";
import { getVaccinationSchedulesMyChildren } from "@/services/apiServices";
import dayjs from "dayjs";

const statusColors = ["orange", "green", "red", "default"];
const statusNames = ["Chờ tiêm", "Đã tiêm", "Đã huỷ", "Khác"];

export default function ParentVaccinationSchedules() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getVaccinationSchedulesMyChildren();
      setData(res.data?.data || []);
    } catch {
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2 style={{ fontWeight: 600, marginBottom: 24 }}>Lịch tiêm của con</h2>
      {loading ? <Spin size="large" style={{ display: 'block', margin: '40px auto' }} /> : (
        data.length === 0 ? <Empty description="Không có lịch tiêm nào." /> :
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={data}
          renderItem={item => (
            <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
              <b>Học sinh:</b> {item.studentName} <br />
              <b>Loại vắc xin:</b> {item.vaccinationTypeName} <br />
              <b>Thời gian tiêm:</b> {dayjs(item.scheduledAt).format("DD/MM/YYYY HH:mm")} <br />
              <Tag color={statusColors[item.scheduleStatus] || "default"}>
                {statusNames[item.scheduleStatus] || "Khác"}
              </Tag>
            </Card>
          )}
        />
      )}
    </div>
  );
} 