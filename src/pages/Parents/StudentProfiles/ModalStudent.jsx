import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { updateHealthProfile, getVaccineTypes, declareVaccination } from "../../../services/apiServices";
import "./ModalStudent.css";
import { toast } from "react-toastify";
import Select from "react-select";



const initialFormData = {
  allergies: "",
  chronicConditions: "",
  treatmentHistory: "",
  vision: "1",
  hearing: "1",
  vaccinationSummary: "",
};

const ModalStudent = ({ show, setShow, healthProfile, resetData, onUpdated }) => {
  const [studentInfo, setStudentInfo] = useState({});
  const [formData, setFormData] = useState(initialFormData);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (show) setActiveTab("profile");
    if (healthProfile) {
      setStudentInfo(healthProfile.studentInformation || {});
      setFormData({
        allergies: healthProfile.allergies || "",
        chronicConditions: healthProfile.chronicConditions || "",
        treatmentHistory: healthProfile.treatmentHistory || "",
        vision: String(healthProfile.vision ?? "1"),
        hearing: String(healthProfile.hearing ?? "1"),
        vaccinationSummary: healthProfile.vaccinationSummary || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [healthProfile, show]);

  const handleClose = () => {
    setShow(false);
    resetData?.();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const updatedHealthProfile = {
        version: healthProfile?.version ?? 0,
        profileDate: new Date().toISOString(),
        ...formData,
        vision: Number(formData.vision),
        hearing: Number(formData.hearing),
      };
      const response = await updateHealthProfile(studentInfo.studentCode, updatedHealthProfile);
      if (response?.data?.isSuccess || response?.status === 200) {
        onUpdated?.();
        handleClose();
      } else {
        toast.error("Cập nhật thông tin sức khỏe thất bại!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật thông tin sức khỏe!");
    } finally {
      setUpdating(false);
    }
  };

  if (!healthProfile) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="modal-user-detail">
      <Modal.Header closeButton>
        <Modal.Title>Hồ sơ sức khỏe của {studentInfo.firstName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-tabs">
          <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            Thông tin học sinh
          </button>
          <button className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`} onClick={() => setActiveTab('health')}>
            Khai báo sức khỏe
          </button>
          <button className={`tab-btn ${activeTab === 'vaccine' ? 'active' : ''}`} onClick={() => setActiveTab('vaccine')}>
            Khai báo vắc xin
          </button>
        </div>
        <div className="tab-content">
          {activeTab === 'profile' && <StudentStaticProfile studentInfo={studentInfo} />}
          {activeTab === 'health' && <HealthProfileForm formData={formData} handleChange={handleChange} />}
          {activeTab === 'vaccine' && <VaccineDeclarationForm 
            studentId={studentInfo.id} 
            formData={formData}
            setFormData={setFormData}
          />}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Đóng</Button>
        <Button variant="primary" onClick={handleUpdate} disabled={updating}>
          {updating ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const StudentStaticProfile = ({ studentInfo }) => (
  <div className="text-center">
    <div className="student-profile-image-container">
      <img
        src={studentInfo?.image || "https://images.icon-icons.com/3310/PNG/512/student_man_avatar_user_toga_school_university_icon_209264.png"}
        alt="avatar"
        className="student-profile-image"
      />
    </div>
    <h4 className="font-weight-bold">{studentInfo?.firstName} {studentInfo?.lastName}</h4>
    <p className="text-muted">Mã học sinh: {studentInfo?.studentCode}</p>
    <div className="row text-left mt-4">
      <div className="col-6"><strong>Ngày sinh:</strong> {studentInfo?.dateOfBirth?.slice(0, 10) ?? ""}</div>
      <div className="col-6"><strong>Giới tính:</strong> {studentInfo?.gender === 0 ? "Nam" : studentInfo?.gender === 1 ? "Nữ" : "Khác"}</div>
      <div className="col-6"><strong>Lớp:</strong> {studentInfo?.grade ?? ""}</div>
      <div className="col-6"><strong>Khối:</strong> {studentInfo?.section ?? ""}</div>
    </div>
  </div>
);

const HealthProfileForm = ({ formData, handleChange }) => (
  <div className="row">
    <div className="col-12 mb-3">
      <label className="form-label">Dị ứng</label>
      <textarea className="form-control form-control-sm" rows={2} name="allergies" value={formData.allergies} onChange={handleChange} placeholder="Nhập dị ứng nếu có" />
    </div>
    <div className="col-12 mb-3">
      <label className="form-label">Bệnh mãn tính</label>
      <textarea className="form-control form-control-sm" rows={2} name="chronicConditions" value={formData.chronicConditions} onChange={handleChange} placeholder="Nhập bệnh mãn tính nếu có" />
    </div>
    <div className="col-12 mb-3">
      <label className="form-label">Lịch sử điều trị</label>
      <textarea className="form-control form-control-sm" rows={2} name="treatmentHistory" value={formData.treatmentHistory} onChange={handleChange} placeholder="Nhập lịch sử điều trị nếu có" />
    </div>
    <div className="col-md-6 mb-3">
      <label className="form-label">Thị lực (/10)</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="number"
          className="form-control form-control-sm"
          name="vision"
          value={formData.vision}
          onChange={handleChange}
          min="1"
          max="10"
          style={{ width: '80px' }}
        />
        <span style={{ color: '#666' }}>/ 10</span>
      </div>
    </div>
    <div className="col-md-6 mb-3">
      <label className="form-label">Thính lực (/10)</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="number"
          className="form-control form-control-sm"
          name="hearing"
          value={formData.hearing}
          onChange={handleChange}
          min="1"
          max="10"
          style={{ width: '80px' }}
        />
        <span style={{ color: '#666' }}>/ 10</span>
      </div>
    </div>
    <div className="col-12 mb-3">
      <label className="form-label">Tóm tắt tiêm chủng</label>
      <textarea className="form-control form-control-sm" rows={3} name="vaccinationSummary" value={formData.vaccinationSummary} onChange={handleChange} placeholder="Nhập tóm tắt tiêm chủng nếu có" />
    </div>
  </div>
);

const VaccineDeclarationForm = ({ studentId, formData, setFormData }) => {
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [vaccineTypeId, setVaccineTypeId] = useState("");
  const [doseNumber, setDoseNumber] = useState(1);

  const vaccineOptions = vaccineTypes.map(v => ({ value: v.id, label: v.name }));

  useEffect(() => {
    const fetchVaccineTypes = async () => {
      setLoading(true);
      try {
        const res = await getVaccineTypes();
        setVaccineTypes(res.data?.data || []);
      } catch {
        setVaccineTypes([]);
        toast.error("Không thể tải danh sách vắc xin!");
      }
      setLoading(false);
    };
    fetchVaccineTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vaccineTypeId || !doseNumber) {
      toast.warning("Vui lòng chọn loại vắc xin và nhập số mũi đã tiêm!");
      return;
    }
    setSubmitting(true);
    try {
      await declareVaccination([{ 
        studentId, 
        vaccineTypeId, 
        doseNumber: Number(doseNumber), 
        administeredAt: new Date().toISOString() 
      }]);
      
      // Get the selected vaccine name
      const selectedVaccine = vaccineTypes.find(v => v.id === vaccineTypeId);
      const vaccineName = selectedVaccine ? selectedVaccine.name : "Vắc xin không xác định";
      
      // Update the vaccination summary
      const newEntry = `- ${vaccineName} - ${doseNumber} mũi`;
      const updatedSummary = formData.vaccinationSummary 
        ? `${formData.vaccinationSummary}\n${newEntry}` 
        : newEntry;
        
      // Update the form data with the new summary
      setFormData(prev => ({ ...prev, vaccinationSummary: updatedSummary }));
      
      toast.success("Khai báo vắc xin thành công!");
      setVaccineTypeId("");
      setDoseNumber(1);
    } catch {
      toast.error("Khai báo vắc xin thất bại!");
    }
    setSubmitting(false);
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <form onSubmit={handleSubmit} className="p-3 border rounded">
          <h5 className="text-center mb-3">Khai báo vắc xin đã tiêm</h5>
          <div className="mb-3">
            <label className="form-label">Loại vắc xin</label>
            <Select
              options={vaccineOptions}
              isLoading={loading}
              placeholder="Tìm kiếm hoặc chọn loại vắc xin..."
              value={vaccineOptions.find(opt => opt.value === vaccineTypeId) || null}
              onChange={opt => setVaccineTypeId(opt ? opt.value : "")}
              isClearable
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Số mũi đã tiêm</label>
            <input
              type="number"
              className="form-control form-control-sm"
              min={1}
              value={doseNumber}
              onChange={e => setDoseNumber(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting || loading} style={{ width: "100%" }}>
            {submitting ? "Đang gửi..." : "Khai báo"}
          </button>
        </form>
      </div>
      
      <div className="col-md-6">
        <div className="border rounded p-3 h-100">
          <h5 className="text-center mb-3">Tóm tắt tiêm chủng</h5>
          <div className="bg-light rounded p-3" style={{ minHeight: '150px', maxHeight: '240px', overflowY: 'auto' }}>
            {formData.vaccinationSummary ? (
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                {formData.vaccinationSummary}
              </pre>
            ) : (
              <p className="text-center text-muted my-4">Chưa có thông tin tiêm chủng</p>
            )}
          </div>
          <div className="mt-2 text-center">
            <small className="text-muted">Các khai báo mới sẽ được tự động thêm vào tóm tắt này</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalStudent;