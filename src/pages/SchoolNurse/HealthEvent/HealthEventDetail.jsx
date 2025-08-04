import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Spin,
  Alert,
  Descriptions,
  Tag,
  Card,
  Button,
  Row,
  Col,
  Table,
  Modal,
  Form,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  MedicineBoxOutlined,
  ToolOutlined,
  PhoneOutlined,
  CarOutlined,
  CheckCircleOutlined,
  InteractionOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// Import các service cần thiết từ file API của bạn
import {
  getHealthEventById,
  resolveHealthEvent,
  handoverHealthEvent,
  treatHealthEvent,
  getUsers,
  getMedicationLots,
  getMedicalSupplyLots,
} from "../../../services/apiServices";

// Import Modal xử lý sự kiện từ file riêng
import TreatEventModal from "./TreatEventModal";

const { Title } = Typography;

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
  const [resolveForm] = Form.useForm();
  const [handoverForm] = Form.useForm();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);
  const [isHandoverModalVisible, setIsHandoverModalVisible] = useState(false);
  const [isTreatModalVisible, setIsTreatModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [users, setUsers] = useState([]);
  const [medicationLots, setMedicationLots] = useState([]);
  const [supplyLots, setSupplyLots] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getHealthEventById(id);
      setData(res.data.data);
    } catch (err) {
      setError("Không thể tải dữ liệu chi tiết sự kiện.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchFormData = useCallback(async () => {
    try {
      const [usersRes, medLotsRes, supplyLotsRes] = await Promise.all([
        getUsers({ role: "SchoolNurse" }),
        getMedicationLots({ inStock: true }),
        getMedicalSupplyLots({ inStock: true }),
      ]);
      setUsers(usersRes.data?.data || []);
      setMedicationLots(medLotsRes.data?.data || []);
      setSupplyLots(supplyLotsRes.data?.data || []);
    } catch (err) {
      message.error("Lỗi khi tải dữ liệu cho form xử lý.");
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchFormData();
  }, [fetchData, fetchFormData]);

  const handleTreat = async (values) => {
    setIsSubmitting(true);
    const treatData = {
      ...values,
      firstAidAt: values.firstAidAt ? dayjs(values.firstAidAt).toISOString() : null,
      referralDepartureTime: values.referralDepartureTime ? dayjs(values.referralDepartureTime).toISOString() : null,
    };
    try {
      await treatHealthEvent(id, treatData);
      message.success("Cập nhật thông tin xử lý thành công!");
      setIsTreatModalVisible(false);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message || "Có lỗi xảy ra khi cập nhật xử lý.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async (values) => {
    setIsSubmitting(true);
    try {
      await resolveHealthEvent(id, values);
      message.success("Sự kiện đã được hoàn thành!");
      setIsResolveModalVisible(false);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message || "Có lỗi xảy ra khi hoàn thành sự kiện.");
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
      message.error(err?.response?.data?.message || "Có lỗi xảy ra khi bàn giao.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", margin: "50px" }}>
        <Spin size="large" />
      </div>
    );
  if (error) return <Alert message="Lỗi" description={error} type="error" showIcon />;
  if (!data) return <Alert message="Không tìm thấy dữ liệu" type="warning" />;

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

  const canTreat = data.eventStatus === "Pending";
  const canResolve = data.eventStatus !== "Resolved" && data.eventStatus !== "Cancelled";
  const canHandover = !data.parentArrivalAt && data.eventStatus !== "Cancelled";

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
            {canTreat && (
              <Button
                key="treat"
                type="primary"
                icon={<InteractionOutlined />}
                onClick={() => setIsTreatModalVisible(true)}
              >
                Xử lý / Sơ cứu
              </Button>
            )}
            {canHandover && (
              <Button
                key="handover"
                type="primary"
                ghost
                icon={<InteractionOutlined />}
                onClick={() => setIsHandoverModalVisible(true)}
              >
                Bàn giao Phụ huynh
              </Button>
            )}
            {canResolve && (
              <Button
                key="resolve"
                type="primary"
                onClick={() => setIsResolveModalVisible(true)}
                icon={<CheckCircleOutlined />}
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
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Loại sự kiện">{data.eventType || "Chưa có"}</Descriptions.Item>
              <Descriptions.Item label="Mức độ">{getSeverityTag(data.severity)}</Descriptions.Item>
              <Descriptions.Item label="Vị trí">
                <EnvironmentOutlined /> {data.location || "Chưa có"}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả ban đầu">{data.description || "Không có"}</Descriptions.Item>
              <Descriptions.Item label="Người báo cáo">{data.reportedByName || "Chưa có"}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={
              <>
                <InteractionOutlined /> Sơ cứu & Triệu chứng
              </>
            }
          >
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Triệu chứng">{data.symptoms || "Chưa có"}</Descriptions.Item>
              <Descriptions.Item label="Bộ phận bị thương">{data.injuredBodyPartsRaw || "Không rõ"}</Descriptions.Item>
              <Descriptions.Item label="Người sơ cứu">{data.firstResponderName || "Chưa xử lý"}</Descriptions.Item>
              <Descriptions.Item label="Thời gian sơ cứu">
                {data.firstAidAt ? dayjs(data.firstAidAt).format("HH:mm:ss DD/MM/YYYY") : "Chưa xử lý"}
              </Descriptions.Item>
              <Descriptions.Item label="Các bước sơ cứu">{data.firstAidDescription || "Chưa xử lý"}</Descriptions.Item>
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
            <Descriptions bordered column={1} size="small">
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
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Bệnh viện chuyển đến">{data.referralHospital || "Chưa có"}</Descriptions.Item>
                <Descriptions.Item label="Phương tiện di chuyển">
                  {data.referralTransportBy || "Chưa có"}
                </Descriptions.Item>
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
            <Table
              columns={medicationColumns}
              dataSource={data.medications}
              pagination={false}
              rowKey="id"
              size="small"
            />
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
            <Table columns={supplyColumns} dataSource={data.supplies} pagination={false} rowKey="id" size="small" />
          </Card>
        </Col>
      </Row>

      <TreatEventModal
        open={isTreatModalVisible}
        onCancel={() => setIsTreatModalVisible(false)}
        onFinish={handleTreat}
        submitting={isSubmitting}
        users={users}
        medicationLots={medicationLots}
        supplyLots={supplyLots}
      />

      <Modal
        title="Xác nhận Hoàn thành Sự kiện"
        open={isResolveModalVisible}
        onCancel={() => setIsResolveModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsResolveModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={isSubmitting} onClick={() => resolveForm.submit()}>
            Xác nhận
          </Button>,
        ]}
      >
        <Form form={resolveForm} layout="vertical" onFinish={handleResolve} name="resolve_form">
          <Form.Item
            name="completionNotes"
            label="Ghi chú hoàn thành"
            rules={[{ required: true, message: "Vui lòng nhập ghi chú!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập kết quả xử lý, tình trạng học sinh sau khi hoàn thành sự kiện..."
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Ghi nhận Bàn giao cho Phụ huynh"
        open={isHandoverModalVisible}
        onCancel={() => setIsHandoverModalVisible(false)}
        onOk={() => handoverForm.submit()}
        confirmLoading={isSubmitting}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form form={handoverForm} layout="vertical" onFinish={handleHandover} name="handover_form">
          <p>Thời gian bàn giao sẽ được ghi nhận là thời điểm hiện tại.</p>
          <Form.Item
            name="parentSignature"
            label="Phụ huynh xác nhận (Nhập họ tên)"
            rules={[{ required: true, message: "Vui lòng nhập tên phụ huynh!" }]}
          >
            <Input placeholder="Ví dụ: Nguyễn Văn A" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HealthEventDetail;
