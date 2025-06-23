import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { updateHealthProfile } from "../../../services/apiServices";
import "./ModalStudent.css";

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
    <p className="text-muted">Student Code: {studentInfo?.studentCode}</p>
    <div className="row text-left mt-4">
      <div className="col-6"><strong>Date of Birth:</strong> {studentInfo?.dateOfBirth?.slice(0, 10) ?? ""}</div>
      <div className="col-6"><strong>Gender:</strong> {studentInfo?.gender ?? ""}</div>
      <div className="col-6"><strong>Grade:</strong> {studentInfo?.grade ?? ""}</div>
      <div className="col-6"><strong>Section:</strong> {studentInfo?.section ?? ""}</div>
    </div>
  </div>
);

const HealthProfileForm = ({ formData, handleChange }) => (
  <>
    <div className="row">
      <div className="col-12 mb-3">
        <label className="form-label">Allergies</label>
        <textarea className="form-control form-control-sm" rows={2} name="allergies" value={formData.allergies} onChange={handleChange} />
      </div>
      <div className="col-12 mb-3">
        <label className="form-label">Chronic Conditions</label>
        <textarea className="form-control form-control-sm" rows={2} name="chronicConditions" value={formData.chronicConditions} onChange={handleChange} />
      </div>
      <div className="col-12 mb-3">
        <label className="form-label">Treatment History</label>
        <textarea className="form-control form-control-sm" rows={2} name="treatmentHistory" value={formData.treatmentHistory} onChange={handleChange} />
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Vision</label>
        <select className="form-control form-control-sm" name="vision" value={formData.vision} onChange={handleChange}>
          <option value="0">Normal</option>
          <option value="1">Mild</option>
          <option value="2">Moderate</option>
          <option value="3">Severe</option>
        </select>
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Hearing</label>
        <select className="form-control form-control-sm" name="hearing" value={formData.hearing} onChange={handleChange}>
          <option value="0">Normal</option>
          <option value="1">Mild</option>
          <option value="2">Moderate</option>
          <option value="3">Severe</option>
        </select>
      </div>
      <div className="col-12 mb-3">
        <label className="form-label">Vaccination Summary</label>
        <textarea className="form-control form-control-sm" rows={3} name="vaccinationSummary" value={formData.vaccinationSummary} onChange={handleChange} />
      </div>
    </div>
  </>
);

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
        alert("Update failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error updating health profile");
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
        <Modal.Title>{studentInfo.firstName}'s Health Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-tabs">
          <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            Student Info
          </button>
          <button className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`} onClick={() => setActiveTab('health')}>
            Health Details
          </button>
        </div>
        <div className="tab-content">
          {activeTab === 'profile' && <StudentStaticProfile studentInfo={studentInfo} />}
          {activeTab === 'health' && <HealthProfileForm formData={formData} handleChange={handleChange} />}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdate} disabled={loading || updating}>
          {updating ? "Updating..." : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalStudent;