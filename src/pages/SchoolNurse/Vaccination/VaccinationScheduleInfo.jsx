import React, { useEffect, useState } from "react";
import { Card, Typography, Table, Tag, Button, Spin, Modal, message, Input } from "antd";
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined, FormOutlined, MedicineBoxOutlined, ArrowLeftOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { 
  getVaccinationScheduleDetail, 
  createVaccinationRecord, 
  updateVaccinationRecord, 
  getVaccinationRecordsByScheduleId,
  getSessionStudents,
  updateSessionStudentCheckInTime
} from "@/services/apiServices";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title } = Typography;

const REACTION_SEVERITY = [
  { label: "Không có phản ứng", value: 0 },
  { label: "Nhẹ", value: 1 },
  { label: "Vừa phải", value: 2 },
  { label: "Nặng", value: 3 },
];

// Bảng ánh xạ trạng thái đồng ý tiêm chủng
const consentStatusMap = {
  0: { color: 'blue', text: 'Chờ xử lý' },    // Pending
  1: { color: 'orange', text: 'Đã gửi' },     // Sent
  2: { color: 'green', text: 'Đã đồng ý' },   // Approved
  3: { color: 'red', text: 'Từ chối' },       // Rejected
  4: { color: 'gray', text: 'Hết hạn' },      // Expired
};

// Thêm bảng ánh xạ trạng thái từ tiếng Anh sang tiếng Việt
const statusMap = {
  Registered: { color: 'orange', text: 'Đã đăng kí' },
  Completed: { color: 'green', text: 'Hoàn thành' },
  Pending: { color: 'orange', text: 'Chờ tiêm' },
  Cancelled: { color: 'red', text: 'Đã huỷ' },
};

export default function VaccinationScheduleInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [recordSubmitting, setRecordSubmitting] = useState(false);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [form, setForm] = useState({ administeredDate: null, reactionFollowup24h: false, reactionFollowup72h: false, reactionSeverity: 0 });
  const [updateForm, setUpdateForm] = useState({ 
    administeredDate: null, 
    reactionFollowup24h: false, 
    reactionFollowup72h: false, 
    reactionSeverity: 0 
  });
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [searchPending, setSearchPending] = useState("");
  const [searchVaccinated, setSearchVaccinated] = useState("");

  const loadData = () => {
    setLoading(true);
    setRecordsLoading(true);
    
    // Fetch schedule details
    getVaccinationScheduleDetail(id)
      .then(res => {
        console.log("Schedule detail:", res.data?.data);
        setDetail(res.data?.data || null);
      })
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
      
    // Fetch vaccination records
    getVaccinationRecordsByScheduleId(id)
      .then(res => {
        console.log("Vaccination records:", res.data?.data);
        setVaccinationRecords(res.data?.data || []);
      })
      .catch(() => setVaccinationRecords([]))
      .finally(() => setRecordsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const openRecordModal = (student) => {
    setSelectedStudent(student);
    setForm({ administeredDate: dayjs(), reactionFollowup24h: false, reactionFollowup72h: false, reactionSeverity: 0 });
    setModalOpen(true);
  };

  const openUpdateModal = (record) => {
    // Now using direct record data from the API
    console.log("Opening update modal for record:", record);
    setSelectedStudent(record);
    
    // Parse boolean values correctly from strings
    const reactionFollowup24h = record.reactionFollowup24h === "True";
    const reactionFollowup72h = record.reactionFollowup72h === "True";
    
    setUpdateForm({
      administeredDate: dayjs(record.administeredDate),
      reactionFollowup24h: reactionFollowup24h,
      reactionFollowup72h: reactionFollowup72h,
      reactionSeverity: 0 // Assuming default if not available
    });
    setUpdateModalOpen(true);
  };

  // Modify the checkbox handlers to allow both options to be selected simultaneously

  // Handler for 24h reaction checkbox in create form
  const handleReaction24hChange = (e) => {
    const checked = e.target.checked;
    setForm(f => ({ 
      ...f, 
      reactionFollowup24h: checked
      // Remove the code that automatically unsets reactionFollowup72h
    }));
  };

  // Handler for 72h reaction checkbox in create form
  const handleReaction72hChange = (e) => {
    const checked = e.target.checked;
    setForm(f => ({ 
      ...f, 
      reactionFollowup72h: checked
      // Remove the code that automatically unsets reactionFollowup24h
    }));
  };

  // Handler for 24h reaction checkbox in update form
  const handleUpdateReaction24hChange = (e) => {
    const checked = e.target.checked;
    setUpdateForm(f => ({ 
      ...f, 
      reactionFollowup24h: checked
      // Remove the code that automatically unsets reactionFollowup72h
    }));
  };

  // Handler for 72h reaction checkbox in update form
  const handleUpdateReaction72hChange = (e) => {
    const checked = e.target.checked;
    setUpdateForm(f => ({ 
      ...f, 
      reactionFollowup72h: checked
      // Remove the code that automatically unsets reactionFollowup24h
    }));
  };

  const handleRecord = async () => {
    setRecordSubmitting(true);
    try {
      // nurseId từ token (giả lập)
      const nurseId = JSON.parse(atob(localStorage.getItem("accessToken")?.split(".")[1] || ""))?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      
      // Step 1: Get session student information with both parameters
      const sessionStudentResponse = await getSessionStudents(
        selectedStudent.studentId,
        id
      );
      
      const sessionStudents = sessionStudentResponse.data?.data || [];
      
      // Since we're filtering by both studentId and vaccinationScheduleId, we should get exactly what we need
      if (sessionStudents.length > 0) {
        const currentSessionStudent = sessionStudents[0];
        
        // Step 2: Update check-in time for the session student
        await updateSessionStudentCheckInTime({
          sessionStudentId: [currentSessionStudent.sessionStudentId],
          note: `Đã tiêm chủng vào lúc ${form.administeredDate.format("DD/MM/YYYY HH:mm")}`
        });
        
        // Step 3: Create vaccination record
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
        
        message.success("Ghi nhận tiêm chủng và check-in thành công!");
        
      setModalOpen(false);
      
      // reload lại data
      loadData();
      } else {
        message.error("Không tìm thấy thông tin phiên cho học sinh này, không thể ghi nhận tiêm chủng!");
      }
    } catch (error) {
      console.error("Error recording vaccination:", error);
      message.error("Ghi nhận thất bại: " + (error.response?.data?.message || error.message));
    } finally {
      setRecordSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    setUpdateSubmitting(true);
    try {
      // Using the ID directly from the record
      const recordId = selectedStudent.id;
      
      console.log("Updating vaccination record with ID:", recordId);
      
      if (!recordId) {
        message.error("Không tìm thấy ID bản ghi tiêm chủng!");
        setUpdateSubmitting(false);
        return;
      }
      
      await updateVaccinationRecord(
        recordId, 
        {
          vaccinatedAt: updateForm.administeredDate.toDate().toISOString(),
          reactionFollowup24h: updateForm.reactionFollowup24h,
          reactionFollowup72h: updateForm.reactionFollowup72h,
          reactionSeverity: updateForm.reactionSeverity,
        }
      );
      
      message.success("Cập nhật tiêm chủng thành công!");
      setUpdateModalOpen(false);
      
      // reload lại data
      loadData();
    } catch (error) {
      console.error("Error updating vaccination record:", error);
      message.error("Cập nhật thất bại: " + (error.response?.data?.message || error.message));
    } finally {
      setUpdateSubmitting(false);
    }
  };

  // Lọc học sinh chưa tiêm dựa vào trạng thái đồng ý (consentStatus = 2 tương ứng với Approved)
  // và loại bỏ những học sinh đã tiêm xong (status = 4)
  const studentsChuaTiem = detail?.sessionStudents?.filter(s => s.consentStatus === 2 && s.status !== 4) || [];
  
  // Use the records from the new API endpoint
  const studentsDaTiem = vaccinationRecords;

  const columnsChuaTiem = [
    { title: "Học sinh", dataIndex: "studentName", key: "studentName", render: (text) => <><UserOutlined /> {text}</> },
    { title: "Mã HS", dataIndex: "studentCode", key: "studentCode" },
    { title: "Trạng thái", dataIndex: "consentStatus", key: "consentStatus", render: (status) => {
      const statusInfo = consentStatusMap[status] || { color: 'default', text: 'Không xác định' };
      return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
    }},
    { title: "Ghi nhận", key: "action", render: (_, record) => (
      <Button type="primary" icon={<FormOutlined />} onClick={() => openRecordModal(record)}>
        Ghi nhận
      </Button>
    ) },
  ];
  
  // Updated columns for the new data structure
  const columnsDaTiem = [
    { title: "Học sinh", dataIndex: "studentName", key: "studentName", render: (text) => <><UserOutlined /> {text}</> },
    { title: "Mã HS", dataIndex: "studentCode", key: "studentCode" },
    { title: "Trạng thái", dataIndex: "sessionStatus", key: "sessionStatus", render: (text) => <Tag color={statusMap[text]?.color || "green"}>{statusMap[text]?.text || text}</Tag> },
    { title: "Cập nhật", key: "update", render: (_, record) => (
      <Button type="primary" icon={<EditOutlined />} onClick={() => openUpdateModal(record)}>
        Cập nhật
      </Button>
    ) },
  ];

  // Filter students who haven't been vaccinated based on search term
  const filteredStudentsChuaTiem = detail?.sessionStudents
    ?.filter(s => s.consentStatus === 2 && s.status !== 4) // Approved status and not completed
    .filter(s => 
      s.studentName?.toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .includes(searchPending.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''))
    ) || [];
  
  // Filter vaccinated students based on search term
  const filteredStudentsDaTiem = vaccinationRecords.filter(s => 
    s.studentName?.toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .includes(searchVaccinated.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''))
  );

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto" }}>
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
          <Card style={{ borderRadius: 16, overflow: 'hidden', height: '600px' }}>
            <Title level={5} style={{ marginBottom: 16 }}><UserOutlined /> Danh sách học sinh</Title>
            
            {/* Two-column layout for tables */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', overflow: 'hidden', height: '580px', width: '100%' }}>
              {/* Left column - Students pending vaccination */}
              <div style={{ 
                flex: '1 1 48%', 
                minWidth: '420px', 
                maxHeight: '520px', 
                height: '520px',
                overflow: 'hidden',
                padding: '10px',
                border: '1px solid #f0f0f0',
                borderRadius: '8px'
              }}>
                <Title level={5} style={{ marginBottom: 16, position: 'sticky', top: 0, background: 'white', padding: '10px 0', zIndex: 1 }}>
                  <ClockCircleOutlined style={{ color: "#faad14" }} /> Chưa tiêm
                </Title>
                
                {/* Search input for pending students */}
                <Input 
                  placeholder="Tìm kiếm học sinh..." 
                  prefix={<SearchOutlined />} 
                  value={searchPending}
                  onChange={e => setSearchPending(e.target.value)}
                  style={{ marginBottom: 16 }}
                  allowClear
                />
                
                <div style={{ height: '370px', overflow: 'hidden' }}>
                  <Table
                    dataSource={filteredStudentsChuaTiem}
                    columns={columnsChuaTiem}
                    rowKey="id"
                    pagination={false}
                    locale={{ emptyText: "Không có học sinh nào chưa tiêm" }}
                    scroll={{ y: 370 }}
                  />
                </div>
              </div>
              
              {/* Right column - Vaccinated students */}
              <div style={{ 
                flex: '1 1 48%', 
                minWidth: '400px', 
                maxHeight: '520px', 
                height: '520px',
                overflow: 'hidden',
                padding: '10px',
                border: '1px solid #f0f0f0',
                borderRadius: '8px'
              }}>
                <Title level={5} style={{ marginBottom: 16, position: 'sticky', top: 0, background: 'white', padding: '10px 0', zIndex: 1 }}>
                  <CheckCircleOutlined style={{ color: "#52c41a" }} /> Đã tiêm
                </Title>
                
                {/* Search input for vaccinated students */}
                <Input 
                  placeholder="Tìm kiếm học sinh..." 
                  prefix={<SearchOutlined />} 
                  value={searchVaccinated}
                  onChange={e => setSearchVaccinated(e.target.value)}
                  style={{ marginBottom: 16 }}
                  allowClear
                />
                
                <div style={{ height: '370px', overflow: 'auto' }}>
                  <Table
                    dataSource={filteredStudentsDaTiem}
                    columns={columnsDaTiem}
                    rowKey="id"
                    pagination={false}
                    loading={recordsLoading}
                    locale={{ emptyText: "Chưa có học sinh nào được tiêm" }}
                    scroll={{ y: 370 }}
                  />
                </div>
              </div>
            </div>
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
              <input 
                type="checkbox" 
                checked={form.reactionFollowup24h} 
                onChange={handleReaction24hChange} 
                style={{ marginLeft: 8 }} 
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Phản ứng sau 72h:</b>
              <input 
                type="checkbox" 
                checked={form.reactionFollowup72h} 
                onChange={handleReaction72hChange} 
                style={{ marginLeft: 8 }} 
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Mức độ phản ứng:</b>
              <select value={form.reactionSeverity} onChange={e => setForm(f => ({ ...f, reactionSeverity: Number(e.target.value) }))} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #B0BEC5" }}>
                {REACTION_SEVERITY.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </Modal>
          
          {/* Modal cập nhật tiêm chủng */}
          <Modal
            open={updateModalOpen}
            title={<><EditOutlined /> Cập nhật tiêm chủng cho {selectedStudent?.studentName}</>}
            onCancel={() => setUpdateModalOpen(false)}
            onOk={handleUpdate}
            confirmLoading={updateSubmitting}
            okText="Cập nhật"
            cancelText="Hủy"
          >
            <div style={{ marginBottom: 12 }}>
              <b>Ngày giờ tiêm:</b><br />
              <input type="datetime-local" value={updateForm.administeredDate && dayjs(updateForm.administeredDate).format("YYYY-MM-DDTHH:mm")} onChange={e => setUpdateForm(f => ({ ...f, administeredDate: dayjs(e.target.value) }))} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #B0BEC5" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Phản ứng sau 24h:</b>
              <input 
                type="checkbox" 
                checked={updateForm.reactionFollowup24h} 
                onChange={handleUpdateReaction24hChange} 
                style={{ marginLeft: 8 }} 
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Phản ứng sau 72h:</b>
              <input 
                type="checkbox" 
                checked={updateForm.reactionFollowup72h} 
                onChange={handleUpdateReaction72hChange} 
                style={{ marginLeft: 8 }} 
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Mức độ phản ứng:</b>
              <select value={updateForm.reactionSeverity} onChange={e => setUpdateForm(f => ({ ...f, reactionSeverity: Number(e.target.value) }))} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #B0BEC5" }}>
                {REACTION_SEVERITY.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
} 