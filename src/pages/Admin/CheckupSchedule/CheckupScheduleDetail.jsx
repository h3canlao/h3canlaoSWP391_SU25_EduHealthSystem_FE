import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Descriptions, Spin, Alert, Typography, Button, Space, Tag, Modal, Form, Input, message } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;

// Service APIs
const BASE_URL = "https://localhost:7096/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const checkupScheduleServices = {
  getScheduleDetail: (id) =>
    axios.get(`${BASE_URL}/CheckupSchedule/${id}/detail`, {
      headers: getAuthHeaders(),
    }), //
  updateStatus: (id, status, notes) =>
    axios.patch(
      `${BASE_URL}/CheckupSchedule/batch/update-status`,
      {
        scheduleIds: [id],
        newStatus: status,
        notes,
      },
      { headers: getAuthHeaders() }
    ), //
};

const CheckupScheduleDetail = () => {
  const { id } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [statusForm] = Form.useForm();
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(null);

  useEffect(() => {
    fetchScheduleDetail();
  }, [id]);

  const fetchScheduleDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await checkupScheduleServices.getScheduleDetail(id); //
      setSchedule(response.data.data);
    } catch (err) {
      setError("Không thể tải chi tiết lịch khám. Vui lòng thử lại.");
      console.error("Failed to fetch schedule detail:", err);
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();

  const handleUpdateStatus = (status) => {
    setNewStatus(status);
    setIsModalVisible(true);
  };

  const onModalOk = async () => {
    try {
      const values = await statusForm.validateFields();
      setUpdating(true);
      await checkupScheduleServices.updateStatus(id, newStatus, values.notes); //
      message.success(`Đã cập nhật trạng thái lịch khám thành ${newStatus}.`);
      setIsModalVisible(false);
      statusForm.resetFields();
      fetchScheduleDetail();
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại.");
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
        <Title level={4}>Đang tải chi tiết lịch khám...</Title>
      </div>
    );
  }

  if (error) {
    return <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: 24 }} />;
  }

  if (!schedule) {
    return (
      <Alert
        message="Không tìm thấy"
        description="Không tìm thấy lịch khám với ID đã cung cấp."
        type="warning"
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Chi tiết Lịch khám</Title>
      <Card
        title="Thông tin Lịch khám"
        extra={<Button onClick={() => navigate(-1)}>Quay lại</Button>}
        bordered={false}
        // actions={[
        //   <Space>
        //     <Button
        //       type="primary"
        //       icon={<CheckCircleOutlined />}
        //       onClick={() => handleUpdateStatus("Completed")}
        //       disabled={schedule.status === "Completed"}
        //     >
        //       Hoàn thành
        //     </Button>
        //     <Button
        //       type="primary"
        //       danger
        //       icon={<CloseCircleOutlined />}
        //       onClick={() => handleUpdateStatus("Cancelled")}
        //       disabled={schedule.status === "Cancelled"}
        //     >
        //       Hủy
        //     </Button>
        //   </Space>,
        // ]}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Chiến dịch">{schedule.campaignName}</Descriptions.Item>
          <Descriptions.Item label="Ngày khám">{new Date(schedule.scheduledAt).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="Thời gian">
            {new Date(schedule.scheduledAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={schedule.status === "Completed" ? "green" : "blue"}>{schedule.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú đặc biệt">{schedule.specialNotes || "Không có"}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Thông tin học sinh" style={{ marginTop: 24 }} bordered={false}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Họ và tên">{schedule.studentName}</Descriptions.Item>
          <Descriptions.Item label="Mã số">{schedule.studentCode}</Descriptions.Item>
          <Descriptions.Item label="Lớp">{schedule.grade}</Descriptions.Item>
          <Descriptions.Item label="Phân ban">{schedule.section}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        title={`Cập nhật trạng thái thành ${newStatus}`}
        visible={isModalVisible}
        onOk={onModalOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={updating}
      >
        <Form form={statusForm} layout="vertical">
          <Form.Item name="notes" label="Ghi chú (Tùy chọn)">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CheckupScheduleDetail;
