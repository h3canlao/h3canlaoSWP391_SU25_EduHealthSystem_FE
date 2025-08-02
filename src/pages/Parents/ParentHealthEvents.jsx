import React, { useEffect, useState } from "react";
import { Card, List, Tag, Spin, Empty, Modal, Descriptions, Divider, Table, Space } from "antd";
import { getHealthEventsMyChild } from "@/services/apiServices"; // Đảm bảo đường dẫn này chính xác
import {
  HistoryOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
  AlertOutlined,
  MedicineBoxOutlined,
  ToolOutlined,
  PhoneOutlined,
  CarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// Ánh xạ trạng thái sang màu sắc và tên Tiếng Việt
const statusConfig = {
  Pending: { name: "Chờ xử lý", color: "orange" },
  InProgress: { name: "Đang xử lý", color: "blue" },
  Resolved: { name: "Đã hoàn thành", color: "green" },
  Cancelled: { name: "Đã huỷ", color: "red" },
};

// Hàm helper để lấy tag cho mức độ nghiêm trọng
const getSeverityTag = (severity) => {
  switch (severity) {
    case "Minor":
      return <Tag color="blue">Mức độ 1: Nhẹ</Tag>;
    case "Moderate":
      return <Tag color="orange">Mức độ 2: Trung bình</Tag>;
    case "Severe":
      return <Tag color="red">Mức độ 3: Nặng</Tag>;
    default:
      return <Tag color="default">Không xác định</Tag>;
  }
};

export default function ParentHealthEvents() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ✅ Hàm fetchData đã được cập nhật để gọi API thật
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getHealthEventsMyChild();
      // Lấy dữ liệu từ API và gán vào state
      setData(res.data?.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu sự kiện y tế:", error);
      setData([]); // Nếu lỗi, trả về mảng rỗng để hiển thị thông báo Empty
    }
    setLoading(false); // Dừng loading ở cả trường hợp thành công và thất bại
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = (item) => {
    setSelectedEvent(item);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };

  // Cấu hình cột cho bảng vật tư và thuốc
  const medicationColumns = [
    { title: "Tên thuốc", dataIndex: "medicationName", key: "medicationName" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity", align: "center" },
    { title: "Số lô", dataIndex: "lotNumber", key: "lotNumber" },
    {
      title: "Thời gian dùng",
      dataIndex: "usedAt",
      key: "usedAt",
      render: (text) => (text ? dayjs(text).format("HH:mm DD/MM/YYYY") : "N/A"),
    },
  ];

  const supplyColumns = [
    { title: "Tên vật tư", dataIndex: "medicalSupplyName", key: "medicalSupplyName" },
    { title: "Số lượng", dataIndex: "quantityUsed", key: "quantityUsed", align: "center" },
    { title: "Số lô", dataIndex: "lotNumber", key: "lotNumber" },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2 style={{ fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
        <HistoryOutlined /> Sự kiện y tế của con
      </h2>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
      ) : data.length === 0 ? (
        <Empty description="Không có sự kiện y tế nào." />
      ) : (
        <List
          grid={{ gutter: 24, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
          dataSource={data}
          renderItem={(item) => {
            const status = statusConfig[item.eventStatus] || { name: item.eventStatus, color: "default" };
            return (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => showModal(item)}
                  style={{ borderRadius: 8 }}
                  title={
                    <Space wrap size={[8, 8]}>
                      <UserOutlined />
                      <b>{item.studentName}</b>
                      <Tag color={status.color}>{status.name}</Tag>
                      {getSeverityTag(item.severity)}
                      {item.isReferredToHospital && <Tag color="volcano">Có chuyển viện</Tag>}
                    </Space>
                  }
                >
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item
                      label={
                        <>
                          <FileTextOutlined /> Loại sự kiện
                        </>
                      }
                    >
                      {item.eventType}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <CalendarOutlined /> Thời gian xảy ra
                        </>
                      }
                    >
                      {dayjs(item.occurredAt).format("HH:mm DD/MM/YYYY")}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <EnvironmentOutlined /> Vị trí
                        </>
                      }
                    >
                      {item.location}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <AlertOutlined /> Triệu chứng ban đầu
                        </>
                      }
                    >
                      {item.symptoms}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <ExclamationCircleOutlined /> Bộ phận bị thương
                        </>
                      }
                    >
                      {item.injuredBodyPartsRaw}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </List.Item>
            );
          }}
        />
      )}

      {selectedEvent && (
        <Modal
          title={<b style={{ fontSize: 18 }}>Chi tiết Sự kiện Y tế - {selectedEvent.eventCode}</b>}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={1000}
          destroyOnClose
        >
          <Divider />
          <Descriptions title="Thông tin chung" bordered column={2}>
            <Descriptions.Item label="Học sinh">{selectedEvent.studentName}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusConfig[selectedEvent.eventStatus]?.color || "default"}>
                {statusConfig[selectedEvent.eventStatus]?.name || selectedEvent.eventStatus}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Loại sự kiện">{selectedEvent.eventType}</Descriptions.Item>
            <Descriptions.Item label="Mức độ">{getSeverityTag(selectedEvent.severity)}</Descriptions.Item>
            <Descriptions.Item label="Thời gian xảy ra" span={2}>
              {dayjs(selectedEvent.occurredAt).format("HH:mm:ss DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Vị trí" span={2}>
              {selectedEvent.location}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>
              {selectedEvent.description}
            </Descriptions.Item>
            <Descriptions.Item label="Người báo cáo">{selectedEvent.reportedByName}</Descriptions.Item>
            <Descriptions.Item label="Thời gian báo cáo">
              {dayjs(selectedEvent.createdAt).format("HH:mm DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions
            title={
              <>
                <MedicineBoxOutlined /> Sơ cứu & Triệu chứng
              </>
            }
            bordered
            column={1}
          >
            <Descriptions.Item label="Triệu chứng">{selectedEvent.symptoms}</Descriptions.Item>
            <Descriptions.Item label="Bộ phận bị thương">{selectedEvent.injuredBodyPartsRaw}</Descriptions.Item>
            <Descriptions.Item label="Người sơ cứu">{selectedEvent.firstResponderName}</Descriptions.Item>
            <Descriptions.Item label="Thời gian sơ cứu">
              {selectedEvent.firstAidAt ? dayjs(selectedEvent.firstAidAt).format("HH:mm:ss DD/MM/YYYY") : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Các bước sơ cứu">{selectedEvent.firstAidDescription}</Descriptions.Item>
          </Descriptions>

          {selectedEvent.isReferredToHospital && (
            <>
              <Divider />
              <Descriptions
                title={
                  <>
                    <CarOutlined /> Thông tin chuyển viện
                  </>
                }
                bordered
                column={2}
              >
                <Descriptions.Item label="Bệnh viện chuyển đến" span={2}>
                  {selectedEvent.referralHospital}
                </Descriptions.Item>
                <Descriptions.Item label="Phương tiện di chuyển">{selectedEvent.referralTransportBy}</Descriptions.Item>
                <Descriptions.Item label="Thời gian khởi hành">
                  {selectedEvent.referralDepartureTime
                    ? dayjs(selectedEvent.referralDepartureTime).format("HH:mm DD/MM/YYYY")
                    : "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </>
          )}

          <Divider />

          <Descriptions
            title={
              <>
                <PhoneOutlined /> Thông báo Phụ huynh
              </>
            }
            bordered
            column={2}
          >
            <Descriptions.Item label="Phương thức">{selectedEvent.parentNotificationMethod}</Descriptions.Item>
            <Descriptions.Item label="Thời gian thông báo">
              {selectedEvent.parentNotifiedAt
                ? dayjs(selectedEvent.parentNotifiedAt).format("HH:mm DD/MM/YYYY")
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Phụ huynh đến lúc">
              {selectedEvent.parentArrivalAt ? dayjs(selectedEvent.parentArrivalAt).format("HH:mm DD/MM/YYYY") : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Người tiếp nhận">{selectedEvent.parentReceivedBy}</Descriptions.Item>
          </Descriptions>

          <Divider />

          <h3 style={{ marginBottom: 16 }}>
            <MedicineBoxOutlined /> Thuốc đã sử dụng ({selectedEvent.medications?.length || 0})
          </h3>
          {selectedEvent.medications && selectedEvent.medications.length > 0 ? (
            <Table columns={medicationColumns} dataSource={selectedEvent.medications} pagination={false} rowKey="id" />
          ) : (
            <p>Không sử dụng thuốc.</p>
          )}

          <h3 style={{ marginTop: 24, marginBottom: 16 }}>
            <ToolOutlined /> Vật tư y tế đã sử dụng ({selectedEvent.supplies?.length || 0})
          </h3>
          {selectedEvent.supplies && selectedEvent.supplies.length > 0 ? (
            <Table columns={supplyColumns} dataSource={selectedEvent.supplies} pagination={false} rowKey="id" />
          ) : (
            <p>Không sử dụng vật tư.</p>
          )}
        </Modal>
      )}
    </div>
  );
}
