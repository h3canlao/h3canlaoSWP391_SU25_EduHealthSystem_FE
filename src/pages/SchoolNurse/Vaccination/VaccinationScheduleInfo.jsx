// Import các thư viện cần thiết
import React, { useEffect, useState } from "react";
import { Card, Typography, Tag, Button, Spin, Modal, message, Input, Empty } from "antd";
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined, FormOutlined, MedicineBoxOutlined, ArrowLeftOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { 
  getVaccinationScheduleDetail, createVaccinationRecord, updateVaccinationRecord, 
  getVaccinationRecordsByScheduleId, getSessionStudents, updateSessionStudentCheckInTime
} from "@/services/apiServices";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title } = Typography;

// Mức độ phản ứng sau tiêm
const REACTION_SEVERITY = [
  { label: "Không có phản ứng", value: 0 }, 
  { label: "Nhẹ", value: 1 },
  { label: "Vừa phải", value: 2 }, 
  { label: "Nặng", value: 3 },
];

export default function VaccinationScheduleInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State cơ bản
  const [detail, setDetail] = useState(null);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [vaccinatedStudents, setVaccinatedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State tìm kiếm
  const [searchPending, setSearchPending] = useState("");
  const [searchVaccinated, setSearchVaccinated] = useState("");
  
  // State modal
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  
  // State form đơn giản
  const [administeredDate, setAdministeredDate] = useState(dayjs());
  const [reactionFollowup24h, setReactionFollowup24h] = useState(false);
  const [reactionFollowup72h, setReactionFollowup72h] = useState(false);
  const [reactionSeverity, setReactionSeverity] = useState(0);
  
  // Tải dữ liệu
  useEffect(() => {
    loadData();
  }, [id]);

  // Hàm tải dữ liệu
  const loadData = async () => {
    setLoading(true);
    try {
      // Tải thông tin lịch và danh sách học sinh đã tiêm
      const [detailRes, recordsRes] = await Promise.all([
        getVaccinationScheduleDetail(id),
        getVaccinationRecordsByScheduleId(id)
      ]);
      
      const detailData = detailRes.data?.data || null;
      const recordsData = recordsRes.data?.data || [];
      
      setDetail(detailData);
      setVaccinatedStudents(recordsData);
      
      // Lọc học sinh chưa tiêm
      if (detailData?.sessionStudents) {
        const pending = detailData.sessionStudents.filter(s => 
          s.consentStatus === 2 && s.status !== 4
        );
        setPendingStudents(pending);
      }
    } catch (error) {
      message.error("Lỗi tải dữ liệu: " + (error.message || "Không xác định"));
    } finally {
      setLoading(false);
    }
  };

  // Lọc học sinh theo từ khóa tìm kiếm
  const getFilteredStudents = () => {
    // Hàm chuẩn hóa để tìm kiếm không phân biệt dấu
    const normalize = text => text?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '') || '';
    
    const pendingQuery = normalize(searchPending);
    const vaccinatedQuery = normalize(searchVaccinated);
    
    // Lọc học sinh chưa tiêm
    const filteredPending = pendingQuery 
      ? pendingStudents.filter(s => normalize(s.studentName).includes(pendingQuery) || 
                                   normalize(s.studentCode || "").includes(pendingQuery))
      : pendingStudents;
      
    // Lọc học sinh đã tiêm
    const filteredVaccinated = vaccinatedQuery
      ? vaccinatedStudents.filter(s => normalize(s.studentName).includes(vaccinatedQuery) || 
                                      normalize(s.studentCode || "").includes(vaccinatedQuery))
      : vaccinatedStudents;
      
    return { filteredPending, filteredVaccinated };
  };

  // Mở modal ghi nhận tiêm chủng
  const openCreateModal = (student) => {
    setSelectedStudent(student);
    setIsUpdateMode(false);
    setAdministeredDate(dayjs());
    setReactionFollowup24h(false);
    setReactionFollowup72h(false);
    setReactionSeverity(0);
    setShowModal(true);
  };
  
  // Mở modal cập nhật
  const openUpdateModal = (student) => {
    setSelectedStudent(student);
    setIsUpdateMode(true);
    setAdministeredDate(dayjs(student.administeredDate));
    setReactionFollowup24h(student.reactionFollowup24h === "True");
    setReactionFollowup72h(student.reactionFollowup72h === "True");
    setReactionSeverity(Number(student.reactionSeverity || 0));
    setShowModal(true);
  };

  // Lưu tiêm chủng
  const handleSave = async () => {
    if (!selectedStudent) return;
    
    setModalLoading(true);
    try {
      if (isUpdateMode) {
        // Cập nhật hồ sơ tiêm chủng
        await updateVaccinationRecord(selectedStudent.id, {
          vaccinatedAt: administeredDate.toDate().toISOString(),
          reactionFollowup24h,
          reactionFollowup72h,
          reactionSeverity,
        });
        message.success("Cập nhật tiêm chủng thành công!");
      } else {
        // Lấy ID y tá
      const nurseId = JSON.parse(atob(localStorage.getItem("accessToken")?.split(".")[1] || ""))
        ?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      
        // Lấy thông tin phiên học sinh
      const res = await getSessionStudents(selectedStudent.studentId, id);
      const sessionStudents = res.data?.data || [];
      
      if (sessionStudents.length === 0) {
        message.error("Không tìm thấy thông tin phiên cho học sinh này!");
        return;
      }
      
        // Cập nhật check-in và tạo hồ sơ tiêm
      const currentSessionStudent = sessionStudents[0];
      await updateSessionStudentCheckInTime({
        sessionStudentId: [currentSessionStudent.sessionStudentId],
          note: `Đã tiêm chủng vào lúc ${administeredDate.format("DD/MM/YYYY HH:mm")}`
      });
      
      await createVaccinationRecord({
        studentId: selectedStudent.studentId,
        scheduleId: id,
          administeredDate: administeredDate.toDate().toISOString(),
        vaccinatedById: nurseId,
          vaccinatedAt: administeredDate.toDate().toISOString(),
          reactionFollowup24h,
          reactionFollowup72h,
          reactionSeverity,
      });
      
        message.success("Ghi nhận tiêm chủng thành công!");
      }
      
      // Tải lại dữ liệu
      await loadData();
      setShowModal(false);
    } catch (error) {
      message.error(`Thao tác thất bại: ${error.response?.data?.message || error.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  // Hiển thị loading
  if (loading || !detail) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Lọc danh sách học sinh theo từ khóa
  const { filteredPending, filteredVaccinated } = getFilteredStudents();

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: '20px' }}>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: 16, paddingLeft: 0 }}
      >
        Quay lại
      </Button>
      
      {/* Thông tin lịch tiêm */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>{detail.vaccinationTypeName}</Title>
        <div>Thời gian: {dayjs(detail.scheduledAt).format("DD/MM/YYYY HH:mm")}</div>
        <div>Chiến dịch: {detail.campaignName}</div>
        <div style={{ margin: '10px 0' }}>
          <Tag color={detail.scheduleStatusName === "Pending" ? "orange" : "green"}>
            {detail.scheduleStatusName}
          </Tag>
        </div>
        <div>Tổng số học sinh: {detail.totalStudents}</div>
        <div>Đã tiêm: {detail.completedRecords}</div>
        <div style={{ margin: '10px 0' }}>
          <div>
            <span style={{ marginRight: 20 }}>
              <Tag color="green">Đã đồng ý: {detail.approvedConsentCount || 0}</Tag>
            </span>
            <span style={{ marginRight: 20 }}>
              <Tag color="orange">Chờ xác nhận: {detail.pendingConsentCount || 0}</Tag>
            </span>
            <span>
              <Tag color="red">Từ chối: {detail.rejectedConsentCount || 0}</Tag>
            </span>
          </div>
        </div>
        <div>Số lượng vaccine cần thiết: {detail.vaccineExpectedCount || 0}</div>
      </Card>
      
      {/* Hai danh sách học sinh */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Học sinh chưa tiêm */}
        <Card title="Học sinh chưa tiêm" style={{ marginBottom: 20 }}>
          {/* Thêm ô tìm kiếm */}
            <Input
            placeholder="Tìm kiếm theo tên hoặc mã học sinh"
              prefix={<SearchOutlined />}
              value={searchPending}
              onChange={e => setSearchPending(e.target.value)}
              style={{ marginBottom: 16 }}
              allowClear
            />
            
          <div style={{ maxHeight: 600, overflow: 'auto' }}>
            {filteredPending.length === 0 ? (
              <Empty description={searchPending ? "Không tìm thấy học sinh nào phù hợp" : "Không có học sinh nào chưa tiêm"} />
            ) : (
              filteredPending.map(student => (
                <Card 
                  key={student.id} 
                  size="small" 
                  style={{ marginBottom: 10 }}
                  extra={
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => openCreateModal(student)}
                    >
                      Ghi nhận
                    </Button>
                  }
                >
                  <div><strong>{student.studentName}</strong></div>
                  <div>Mã học sinh: {student.studentCode}</div>
                </Card>
              ))
            )}
          </div>
        </Card>
          
        {/* Học sinh đã tiêm */}
        <Card title="Học sinh đã tiêm" style={{ marginBottom: 20 }}>
          {/* Thêm ô tìm kiếm */}
            <Input
            placeholder="Tìm kiếm theo tên hoặc mã học sinh"
              prefix={<SearchOutlined />}
              value={searchVaccinated}
              onChange={e => setSearchVaccinated(e.target.value)}
              style={{ marginBottom: 16 }}
              allowClear
            />
            
          <div style={{ maxHeight: 600, overflow: 'auto' }}>
            {filteredVaccinated.length === 0 ? (
              <Empty description={searchVaccinated ? "Không tìm thấy học sinh nào phù hợp" : "Chưa có học sinh nào được tiêm"} />
            ) : (
              filteredVaccinated.map(student => (
                <Card 
                  key={student.id} 
                  size="small" 
                  style={{ marginBottom: 10 }}
                  extra={
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => openUpdateModal(student)}
                    >
                      Cập nhật
                    </Button>
                  }
                >
                  <div><strong>{student.studentName}</strong></div>
                  <div>Mã học sinh: {student.studentCode}</div>
                  <div>Tiêm ngày: {dayjs(student.administeredDate).format("DD/MM/YYYY HH:mm")}</div>
                </Card>
              ))
            )}
          </div>
        </Card>
        </div>
      
      {/* Modal tiêm chủng */}
      <Modal
        title={isUpdateMode ? "Cập nhật tiêm chủng" : "Ghi nhận tiêm chủng"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleSave}
        confirmLoading={modalLoading}
        okText="Lưu"
        cancelText="Hủy"
      >
        {selectedStudent && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>Học sinh:</strong> {selectedStudent.studentName}
        </div>
            
        <div style={{ marginBottom: 12 }}>
              <div><strong>Ngày giờ tiêm:</strong></div>
          <input 
                type="datetime-local"
                value={administeredDate?.format("YYYY-MM-DDTHH:mm")}
                onChange={e => setAdministeredDate(dayjs(e.target.value))}
                style={{ width: "100%", padding: 8, border: "1px solid #d9d9d9", borderRadius: 4 }}
          />
        </div>
            
        <div style={{ marginBottom: 12 }}>
              <label>
          <input 
            type="checkbox" 
                  checked={reactionFollowup24h} 
                  onChange={e => setReactionFollowup24h(e.target.checked)} 
                  style={{ marginRight: 8 }} 
          />
                Phản ứng sau 24h
              </label>
        </div>
            
        <div style={{ marginBottom: 12 }}>
              <label>
          <input 
            type="checkbox" 
                  checked={reactionFollowup72h} 
                  onChange={e => setReactionFollowup72h(e.target.checked)} 
                  style={{ marginRight: 8 }} 
          />
                Phản ứng sau 72h
              </label>
        </div>
            
        <div style={{ marginBottom: 12 }}>
              <div><strong>Mức độ phản ứng:</strong></div>
              <select
                value={reactionSeverity}
                onChange={e => setReactionSeverity(Number(e.target.value))}
                style={{ width: "100%", padding: 8, border: "1px solid #d9d9d9", borderRadius: 4 }}
              >
                {REACTION_SEVERITY.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
        </div>
        </div>
        )}
      </Modal>
    </div>
  );
} 