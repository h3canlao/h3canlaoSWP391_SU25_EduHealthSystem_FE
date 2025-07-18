import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { updateHealthProfile } from "../../../services/apiServices";
import "./ModalStudent.css";
import { toast } from "react-toastify";
import Select from "react-select";


const StudentStaticProfile = ({ studentInfo }) => (
  <div className="text-center">
    <div className="student-profile-image-container">
      <img
        src={studentInfo?.image || "https://static.vecteezy.com/system/resources/previews/000/497/579/original/male-student-icon-design-vector.jpg"}
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
  <>
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
        <label className="form-label">Thị lực</label>
        <select className="form-control form-control-sm" name="vision" value={formData.vision} onChange={handleChange}>
          <option value="0">Bình thường</option>
          <option value="1">Nhẹ</option>
          <option value="2">Trung bình</option>
          <option value="3">Nặng</option>
        </select>
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Thính lực</label>
        <select className="form-control form-control-sm" name="hearing" value={formData.hearing} onChange={handleChange}>
          <option value="0">Bình thường</option>
          <option value="1">Nhẹ</option>
          <option value="2">Trung bình</option>
          <option value="3">Nặng</option>
        </select>
      </div>
      <div className="col-12 mb-3">
        <label className="form-label">Tóm tắt tiêm chủng</label>
        <textarea className="form-control form-control-sm" rows={3} name="vaccinationSummary" value={formData.vaccinationSummary} onChange={handleChange} placeholder="Nhập tóm tắt tiêm chủng nếu có" />
      </div>
    </div>
  </>
);

const VaccineDeclarationForm = ({ studentId, onSuccess }) => {
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [vaccineTypeId, setVaccineTypeId] = useState("");
  const [doseNumber, setDoseNumber] = useState(1);

  // Tạo options cho react-select
  const vaccineOptions = vaccineTypes.map(v => ({ value: v.id, label: v.name }));

  useEffect(() => {
    const fetchVaccineTypes = async () => {
      setLoading(true);
      try {
        const res = await import("../../../services/apiServices").then(m => m.getVaccineTypes());
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
      const administeredAt = new Date().toISOString();
      const payload = [{ studentId, vaccineTypeId, doseNumber: Number(doseNumber), administeredAt }];
      await import("../../../services/apiServices").then(m => m.declareVaccination(payload));
      toast.success("Khai báo vắc xin thành công!");
      setVaccineTypeId("");
      setDoseNumber(1);
      onSuccess?.();
    } catch {
      toast.error("Khai báo vắc xin thất bại!");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto", padding: 16 }}>
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
  );
};

const initialFormData = {
  allergies: "",
  chronicConditions: "",
  treatmentHistory: "",
  vision: "0",
  hearing: "0",
  vaccinationSummary: "",
};

const ModalStudent = ({ show, setShow, healthProfile, resetData, loading, onUpdated }) => {
  const [studentInfo, setStudentInfo] = useState({});
  const [formData, setFormData] = useState(initialFormData);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (show) {
      setActiveTab("profile");
    }
    if (healthProfile) {
      setStudentInfo(healthProfile.studentInformation || {});
      setFormData({
        allergies: healthProfile.allergies || "",
        chronicConditions: healthProfile.chronicConditions || "",
        treatmentHistory: healthProfile.treatmentHistory || "",
        vision: String(healthProfile.vision ?? "0"),
        hearing: String(healthProfile.hearing ?? "0"),
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    const updatedHealthProfile = {
      version: healthProfile?.version ?? 0,
      profileDate: new Date().toISOString(),
      ...formData,
      vision: Number(formData.vision),
      hearing: Number(formData.hearing),
    };
    try {
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

  if (!healthProfile) {
    return null;
  }

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
          {activeTab === 'vaccine' && <VaccineDeclarationForm studentId={studentInfo.id} onSuccess={() => {}} />}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleUpdate} disabled={loading || updating}>
          {updating ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalStudent;