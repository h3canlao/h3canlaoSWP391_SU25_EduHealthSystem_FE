import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  InteractionOutlined, // Đã thêm lại icon này
  MedicineBoxOutlined,
  PhoneOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHealthEventById, handoverHealthEvent, resolveHealthEvent } from "../../../services/apiServices";

const { Title } = Typography;

// Các hàm helper không đổi
const statusConfig = {
  Pending: { name: "Chờ xử lý", color: "orange" },
  InProgress: { name: "Đang xử lý", color: "blue" },
  Resolved: { name: "Đã hoàn thành", color: "green" },
  Cancelled: { name: "Đã huỷ", color: "red" },
};

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

const HealthEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);
  const [isHandoverModalVisible, setIsHandoverModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Logic xử lý dữ liệu không thay đổi
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getHealthEventById(id);
      setData(res.data.data);
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResolve = async (values) => {
    setIsSubmitting(true);
    try {
      await resolveHealthEvent(id, values.completionNotes);
      message.success("Sự kiện đã được hoàn thành!");
      setIsResolveModalVisible(false);
      fetchData();
    } catch (err) {
      message.error("Có lỗi xảy ra khi hoàn thành sự kiện.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHandover = async (values) => {
    setIsSubmitting(true);
    const handoverData = {
      parentSignatureUrl: values.parentSignature,
      parentArrivalAt: dayjs().toISOString(),
    };
    try {
      await handoverHealthEvent(id, handoverData);
      message.success("Đã ghi nhận bàn giao cho phụ huynh!");
      setIsHandoverModalVisible(false);
      fetchData();
    } catch (err) {
      message.error("Có lỗi xảy ra khi bàn giao.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Các hàm render khi loading, error, no data giữ nguyên
  if (loading) {
    return (
      <div style={{ textAlign: "center", margin: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }
  if (error) {
    return <Alert message="Lỗi" description={error} type="error" showIcon />;
  }
  if (!data) {
    return <Alert message="Không tìm thấy dữ liệu" type="warning" />;
  }

  // Cấu hình các cột cho bảng giữ nguyên
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

  const canResolve = data.eventStatus !== "Resolved";
  const canHandover = !data.parentArrivalAt;

  return (
    <div style={{ padding: "24px", background: "#f5f5f5" }}>
      <Space style={{ marginBottom: "16px" }}>
        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
          Quay lại danh sách
        </Button>
      </Space>

      <Card
        title={
          <Title level={3} style={{ margin: 0 }}>
            Chi tiết Sự kiện: {data.eventCode}
          </Title>
        }
        extra={
          <Space>
            {canHandover && (
              <Button
                key="2"
                type="primary"
                ghost // <-- Sử dụng ghost để có style đẹp hơn
                icon={<InteractionOutlined />}
                onClick={() => setIsHandoverModalVisible(true)}
              >
                Bàn giao Phụ huynh
              </Button>
            )}
            {canResolve && (
              <Button
                key="1"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => setIsResolveModalVisible(true)}
              >
                Hoàn thành Sự kiện
              </Button>
            )}
          </Space>
        }
      >
        <Descriptions size="default" column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Học sinh">
            <UserOutlined /> {data.studentName}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian xảy ra">
            <CalendarOutlined /> {dayjs(data.occurredAt).format("HH:mm DD/MM/YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={statusConfig[data.eventStatus]?.color || "default"}>
              {statusConfig[data.eventStatus]?.name || data.eventStatus}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Thông tin chung">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Loại sự kiện">{data.eventType}</Descriptions.Item>
              <Descriptions.Item label="Mức độ">{getSeverityTag(data.severity)}</Descriptions.Item>
              <Descriptions.Item label="Vị trí">
                <EnvironmentOutlined /> {data.location}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">{data.description}</Descriptions.Item>
              <Descriptions.Item label="Người báo cáo">{data.reportedByName}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title={<> Sơ cứu & Triệu chứng</>}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Triệu chứng">{data.symptoms}</Descriptions.Item>
              <Descriptions.Item label="Bộ phận bị thương">{data.injuredBodyPartsRaw}</Descriptions.Item>
              <Descriptions.Item label="Người sơ cứu">{data.firstResponderName || "Chưa có"}</Descriptions.Item>
              <Descriptions.Item label="Thời gian sơ cứu">
                {dayjs(data.firstAidAt).format("HH:mm:ss DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Các bước sơ cứu">{data.firstAidDescription}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24}>
          <Card
            title={
              <>
                <PhoneOutlined /> Thông báo Phụ huynh
              </>
            }
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Phương thức">{data.parentNotificationMethod || "Chưa có"}</Descriptions.Item>
              <Descriptions.Item label="Thời gian thông báo">
                {data.parentNotifiedAt ? dayjs(data.parentNotifiedAt).format("HH:mm DD/MM/YYYY") : "Chưa thông báo"}
              </Descriptions.Item>
              <Descriptions.Item label="Phụ huynh đến lúc">
                {data.parentArrivalAt ? dayjs(data.parentArrivalAt).format("HH:mm DD/MM/YYYY") : "Chưa đến"}
              </Descriptions.Item>
              <Descriptions.Item label="Người tiếp nhận">{data.parentReceivedBy || "Chưa có"}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {data.isReferredToHospital && (
          <Col xs={24}>
            <Card
              title={
                <>
                  <CarOutlined /> Thông tin chuyển viện
                </>
              }
            >
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Bệnh viện chuyển đến">{data.referralHospital}</Descriptions.Item>
                <Descriptions.Item label="Phương tiện di chuyển">{data.referralTransportBy}</Descriptions.Item>
                <Descriptions.Item label="Thời gian khởi hành">
                  {data.referralDepartureTime
                    ? dayjs(data.referralDepartureTime).format("HH:mm DD/MM/YYYY")
                    : "Chưa có"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}

        <Col xs={24}>
          <Card
            title={
              <>
                <MedicineBoxOutlined /> Thuốc đã sử dụng ({data.medications?.length || 0})
              </>
            }
          >
            <Table columns={medicationColumns} dataSource={data.medications} pagination={false} rowKey="id" />
          </Card>
        </Col>

        <Col xs={24}>
          <Card
            title={
              <>
                <ToolOutlined /> Vật tư y tế đã sử dụng ({data.supplies?.length || 0})
              </>
            }
          >
            <Table columns={supplyColumns} dataSource={data.supplies} pagination={false} rowKey="id" />
          </Card>
        </Col>
      </Row>

      {/* Các Modal không thay đổi về logic, chỉ tinh chỉnh nhỏ */}
      <Modal
        title="Xác nhận Hoàn thành Sự kiện"
        open={isResolveModalVisible}
        onCancel={() => setIsResolveModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsResolveModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={isSubmitting} onClick={() => form.submit()}>
            Xác nhận
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleResolve} name="resolve_form">
          <Form.Item
            name="completionNotes"
            label="Ghi chú hoàn thành"
            rules={[{ required: true, message: "Vui lòng nhập ghi chú!" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập kết quả xử lý, tình trạng học sinh sau khi xử lý..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Ghi nhận Bàn giao cho Phụ huynh"
        open={isHandoverModalVisible}
        onCancel={() => setIsHandoverModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={isSubmitting}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleHandover}
          name="handover_form"
          initialValues={{ parentSignature: "" }}
        >
          <p>Thời gian bàn giao sẽ được ghi nhận là thời điểm hiện tại khi bạn nhấn "Xác nhận".</p>
          <Form.Item
            name="parentSignature"
            label="Phụ huynh xác nhận (Nhập họ tên)"
            rules={[{ required: true, message: "Vui lòng nhập tên phụ huynh để xác nhận!" }]}
          >
            <Input placeholder="Ví dụ: Nguyễn Văn A" />
          </Form.Item>
          <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
            Lưu ý: Việc nhập tên được xem như chữ ký xác nhận của phụ huynh.
          </Typography.Text>
        </Form>
      </Modal>
    </div>
  );
};

export default HealthEventDetail;
