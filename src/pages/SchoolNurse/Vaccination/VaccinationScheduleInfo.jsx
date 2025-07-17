import React, { useEffect, useState } from "react";
import { Card, Typography, Table, Tag, Button, Spin, Modal, message } from "antd";
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined, FormOutlined, MedicineBoxOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { getVaccinationScheduleDetail, createVaccinationRecord } from "@/services/apiServices";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title } = Typography;

const REACTION_SEVERITY = [
  { label: "Không có phản ứng", value: 0 },
  { label: "Nhẹ", value: 1 },
  { label: "Vừa phải", value: 2 },
  { label: "Nặng", value: 3 },
];

export default function VaccinationScheduleInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [recordSubmitting, setRecordSubmitting] = useState(false);
  const [form, setForm] = useState({ administeredDate: null, reactionFollowup24h: false, reactionFollowup72h: false, reactionSeverity: 0 });

  useEffect(() => {
    setLoading(true);
    getVaccinationScheduleDetail(id)
      .then(res => setDetail(res.data?.data || null))
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [id]);

  const openRecordModal = (student) => {
    setSelectedStudent(student);
    setForm({ administeredDate: dayjs(), reactionFollowup24h: false, reactionFollowup72h: false, reactionSeverity: 0 });
    setModalOpen(true);
  };

  const handleRecord = async () => {
    setRecordSubmitting(true);
    try {
      // nurseId từ token (giả lập)
      const nurseId = JSON.parse(atob(localStorage.getItem("accessToken")?.split(".")[1] || ""))?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      await createVaccinationRecord({
        studentId: selectedStudent.studentId,
        scheduleId: id,
        administeredDate: form.administeredDate.toDate().toISOString(),
        vaccinatedById: nurseId,
        vaccinatedAt: form.administeredDate.toDate().toISOString(),
        reactionFollowup24h: form.reactionFollowup24h,
        reactionFollowup72h: form.reactionFollowup72h,
        reactionSeverity: form.reactionSeverity,
      });
      message.success("Ghi nhận tiêm chủng thành công!");
      setModalOpen(false);
      // reload lại detail
      setLoading(true);
      getVaccinationScheduleDetail(id)
        .then(res => setDetail(res.data?.data || null))
        .finally(() => setLoading(false));
    } catch {
      message.error("Ghi nhận thất bại!");
    } finally {
      setRecordSubmitting(false);
    }
  };

  // Chia danh sách học sinh thành 2 nhóm
  const studentsChuaTiem = detail?.sessionStudents?.filter(s => s.statusName === 'Registered') || [];
  const studentsDaTiem = detail?.sessionStudents?.filter(s => s.statusName !== 'Registered') || [];

  // Cột cho bảng chưa tiêm (có nút ghi nhận)
  const columnsChuaTiem = [
    { title: "Học sinh", dataIndex: "studentName", key: "studentName", render: (text) => <><UserOutlined /> {text}</> },
    { title: "Mã HS", dataIndex: "studentCode", key: "studentCode" },
    { title: "Trạng thái", dataIndex: "statusName", key: "statusName", render: (text) => <Tag color={text === "Registered" ? "orange" : "green"}>{text}</Tag> },
    { title: "Ghi nhận", key: "action", render: (_, record) => (
      <Button type="primary" icon={<FormOutlined />} onClick={() => openRecordModal(record)}>
        Ghi nhận tiêm chủng
      </Button>
    ) },
  ];
  // Cột cho bảng đã tiêm (không có nút ghi nhận)
  const columnsDaTiem = [
    { title: "Học sinh", dataIndex: "studentName", key: "studentName", render: (text) => <><UserOutlined /> {text}</> },
    { title: "Mã HS", dataIndex: "studentCode", key: "studentCode" },
    { title: "Trạng thái", dataIndex: "statusName", key: "statusName", render: (text) => <Tag color={"green"}>{text}</Tag> },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Nút Back */}
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16, paddingLeft: 0 }}>
        Quay lại
      </Button>
      {loading || !detail ? <Spin /> : (
        <>
          <Card style={{ borderRadius: 16, marginBottom: 24 }}>
            <Title level={4}><MedicineBoxOutlined /> {detail.vaccinationTypeName}</Title>
            <div><ClockCircleOutlined /> {dayjs(detail.scheduledAt).format("DD/MM/YYYY HH:mm")}</div>
            <div><b>Chiến dịch:</b> {detail.campaignName}</div>
            <div><b>Trạng thái:</b> <Tag color={detail.scheduleStatusName === "Pending" ? "orange" : "green"}>{detail.scheduleStatusName}</Tag></div>
            <div><UserOutlined /> Tổng học sinh: <b>{detail.totalStudents}</b> &nbsp; <CheckCircleOutlined style={{ color: "#52c41a" }} /> Đã tiêm: <b>{detail.completedRecords}</b></div>
          </Card>
          <Card style={{ borderRadius: 16 }}>
            <Title level={5} style={{ marginBottom: 16 }}><UserOutlined /> Danh sách học sinh</Title>
            <Table
              dataSource={studentsChuaTiem}
              columns={columnsChuaTiem}
              rowKey="id"
              pagination={false}
            />
          </Card>
          <Modal
            open={modalOpen}
            title={<><FormOutlined /> Ghi nhận tiêm chủng cho {selectedStudent?.studentName}</>}
            onCancel={() => setModalOpen(false)}
            onOk={handleRecord}
            confirmLoading={recordSubmitting}
            okText="Ghi nhận"
            cancelText="Hủy"
          >
            <div style={{ marginBottom: 12 }}>
              <b>Ngày giờ tiêm:</b><br />
              <input type="datetime-local" value={form.administeredDate && dayjs(form.administeredDate).format("YYYY-MM-DDTHH:mm")} onChange={e => setForm(f => ({ ...f, administeredDate: dayjs(e.target.value) }))} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #B0BEC5" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Phản ứng sau 24h:</b>
              <input type="checkbox" checked={form.reactionFollowup24h} onChange={e => setForm(f => ({ ...f, reactionFollowup24h: e.target.checked }))} style={{ marginLeft: 8 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Phản ứng sau 72h:</b>
              <input type="checkbox" checked={form.reactionFollowup72h} onChange={e => setForm(f => ({ ...f, reactionFollowup72h: e.target.checked }))} style={{ marginLeft: 8 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Mức độ phản ứng:</b>
              <select value={form.reactionSeverity} onChange={e => setForm(f => ({ ...f, reactionSeverity: Number(e.target.value) }))} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #B0BEC5" }}>
                {REACTION_SEVERITY.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
} 