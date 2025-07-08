import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Row, Col, Descriptions, Typography, Divider, Table, Tag, Space } from "antd";
import { toast } from "react-toastify";
import moment from "moment";
import { UserOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "./ModalVaccine.css";
import { acceptVaccine } from "@/services/apiServices";
import { getAccessToken } from "@/services/handleStorageApi";

const { Title } = Typography;

const ModalVaccine = ({ show, setShow, vaccineData, resetData, onActionSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [parentSignature, setParentSignature] = useState("");
  const [parentNote, setParentNote] = useState("");
  const [localConsents, setLocalConsents] = useState([]);

  const isPendingConsent = vaccineData?.actionStatusName === "PendingConsent";

  useEffect(() => {
    if (vaccineData) {
      form.setFieldsValue({
        parentSignature: "",
        parentNote: "",
      });
      setParentSignature("");
      setParentNote("");
      setLocalConsents(
        (vaccineData.students || []).map(s => ({
          studentId: s.studentId,
          consentStatus: null
        }))
      );
    }
  }, [vaccineData, form]);

  const handleClose = () => {
    setShow(false);
    if (resetData) {
      resetData();
    }
  };

  const handleTempConsent = (studentId, consentStatus) => {
    setLocalConsents(prev => prev.map(s =>
      s.studentId === studentId ? { ...s, consentStatus } : s
    ));
  };

  const handleSaveAll = async () => {
    if (!parentSignature) {
      toast.error("Vui lòng ký tên để xác nhận.");
      return;
    }
    const sentStudents = (vaccineData.students || []).filter(s => s.consentStatusName === "Sent");
    const toSave = localConsents.filter(s => s.consentStatus && sentStudents.find(stu => stu.studentId === s.studentId));
    if (toSave.length === 0) {
      toast.info("Bạn chưa chọn xác nhận hoặc từ chối cho học sinh nào.");
      return;
    }
    
    // Kiểm tra xem tất cả học sinh có cùng consentStatus không
    const consentStatuses = [...new Set(toSave.map(s => s.consentStatus))];
    if (consentStatuses.length > 1) {
      toast.error("Tất cả học sinh phải có cùng trạng thái xác nhận (đồng ý hoặc từ chối).");
      return;
    }
    
    setLoading(true);
    try {
      await acceptVaccine({
        studentIds: toSave.map(s => s.studentId),
        vaccinationScheduleId: vaccineData.id,
        parentNote,
        parentSignature,
        consentStatus: consentStatuses[0]
      });
      toast.success("Lưu thông tin xác nhận thành công!");
      if (onActionSuccess) onActionSuccess();
      handleClose();
    } catch {
      toast.error("Có lỗi khi lưu thông tin xác nhận.");
    } finally {
      setLoading(false);
    }
  };

  // Table columns cho danh sách học sinh
  const studentColumns = [
    {
      title: "Tên học sinh",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Mã học sinh",
      dataIndex: "studentCode",
      key: "studentCode",
    },
    {
      title: "Khối/Lớp",
      render: (_, record) => `${record.grade}${record.section ? " - " + record.section : ""}`,
      key: "grade",
    },
    {
      title: "Trạng thái đồng ý",
      dataIndex: "consentStatusName",
      key: "consentStatusName",
      render: (status, record) => {
        const local = localConsents.find(s => s.studentId === record.studentId);
        if (local && local.consentStatus === 2) return <Tag icon={<CheckCircleOutlined />} color="success">Sẽ đồng ý</Tag>;
        if (local && local.consentStatus === 3) return <Tag icon={<CloseCircleOutlined />} color="error">Sẽ từ chối</Tag>;
        switch (status) {
          case "Sent":
            return <Tag icon={<ClockCircleOutlined />} color="warning">Chờ xác nhận</Tag>;
          case "Approved":
            return <Tag icon={<CheckCircleOutlined />} color="success">Đã đồng ý</Tag>;
          case "Rejected":
            return <Tag icon={<CloseCircleOutlined />} color="error">Đã từ chối</Tag>;
          default:
            return <Tag color="default">{status}</Tag>;
        }
      },
    },
    {
      title: "Hạn xác nhận",
      dataIndex: "consentDeadline",
      key: "consentDeadline",
      render: (date) => date ? moment(date).format("HH:mm DD/MM/YYYY") : "-",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, student) => (
        student.consentStatusName === "Sent" ? (
          <Space>
            <Button
              type={localConsents.find(s => s.studentId === student.studentId)?.consentStatus === 2 ? "primary" : "default"}
              size="middle"
              style={{ minWidth: 80, fontWeight: 500, fontSize: 14 }}
              icon={<CheckCircleOutlined />}
              loading={loading}
              onClick={() => handleTempConsent(student.studentId, 2)}
            >
              Đồng ý
            </Button>
            <Button
              type={localConsents.find(s => s.studentId === student.studentId)?.consentStatus === 3 ? "primary" : "default"}
              danger
              size="middle"
              style={{ minWidth: 80, fontWeight: 500, fontSize: 14 }}
              icon={<CloseCircleOutlined />}
              loading={loading}
              onClick={() => handleTempConsent(student.studentId, 3)}
            >
              Từ chối
            </Button>
          </Space>
        ) : null
      ),
    },
  ];

  const renderFooter = () => {
    if (!isPendingConsent) return null;
    return [
      <Button
        key="save"
        type="primary"
        size="large"
        style={{ minWidth: 160, fontWeight: 600, fontSize: 16 }}
        onClick={handleSaveAll}
        loading={loading}
        disabled={!parentSignature}
      >
        Lưu thông tin
      </Button>,
    ];
  };

  return (
    <Modal
      open={show}
      onCancel={handleClose}
      width={800}
      title={<Title level={4} style={{ color: '#1d3557', margin: 0 }}>Chi Tiết Yêu Cầu Tiêm Chủng</Title>}
      footer={renderFooter()}
      className="modal-vaccine-redesigned"
      centered
    >
      {vaccineData && (
        <div className="vaccine-modal-content">
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Tên chiến dịch">
              {vaccineData.campaignName}
            </Descriptions.Item>
            <Descriptions.Item label="Loại vaccine">
              {vaccineData.vaccinationTypeName}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {vaccineData.vaccineDescription || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian dự kiến">
              {vaccineData.scheduledAt ? moment(vaccineData.scheduledAt).format("HH:mm DD/MM/YYYY") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Hạn xác nhận">
              {vaccineData.consentDeadline ? moment(vaccineData.consentDeadline).format("HH:mm DD/MM/YYYY") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái chiến dịch">
              <b>{vaccineData.actionStatusName}</b>
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Danh sách học sinh</Divider>
          <Table
            dataSource={vaccineData.students || []}
            columns={studentColumns}
            rowKey="studentId"
            pagination={false}
            size="small"
          />

          {isPendingConsent && (
            <div className="parent-confirmation-section">
              <Divider>Xác Nhận Của Phụ Huynh</Divider>
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Ghi chú của phụ huynh (nếu có)"
                  name="parentNote"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Ví dụ: con bị dị ứng với..."
                    value={parentNote}
                    onChange={(e) => setParentNote(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Ký tên xác nhận"
                  name="parentSignature"
                  rules={[{ required: true, message: "Vui lòng ký tên để xác nhận" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập đầy đủ họ tên của bạn"
                    value={parentSignature}
                    onChange={(e) => setParentSignature(e.target.value)}
                  />
                </Form.Item>
              </Form>
            </div>
          )}

          {!isPendingConsent && (
            <div className="confirmation-details">
              <Divider>Trạng thái xác nhận</Divider>
              <Table
                dataSource={vaccineData.students || []}
                columns={[
                  { title: "Tên học sinh", dataIndex: "studentName", key: "studentName" },
                  { title: "Mã học sinh", dataIndex: "studentCode", key: "studentCode" },
                  { title: "Khối/Lớp", render: (_, r) => `${r.grade}${r.section ? " - " + r.section : ""}`, key: "grade" },
                  {
                    title: "Trạng thái xác nhận",
                    key: "status",
                    render: (_, s) => {
                      switch (s.consentStatusName) {
                        case "Approved":
                          return <Tag icon={<CheckCircleOutlined />} color="success">Đã đồng ý</Tag>;
                        case "Rejected":
                          return <Tag icon={<CloseCircleOutlined />} color="error">Đã từ chối</Tag>;
                        case "Sent":
                          return <Tag icon={<ClockCircleOutlined />} color="warning">Chờ xác nhận</Tag>;
                        default:
                          return <Tag color="default">{s.consentStatusName}</Tag>;
                      }
                    }
                  }
                ]}
                rowKey="studentId"
                pagination={false}
                size="small"
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ModalVaccine;