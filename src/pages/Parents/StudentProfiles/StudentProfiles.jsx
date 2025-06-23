import React, { useState, useEffect } from "react";
import { Button, Typography, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBars } from "react-icons/fa";
import ModalStudent from "./ModalStudent";
import { getStudentsByParentId, getNewestHealthProfile, createHealthProfile } from "../../../services/apiServices";
import { getUserInfo } from "@/services/handleStorageApi";
import "./StudentProfiles.css";

const { Text } = Typography;
const { confirm } = Modal;

const StudentCard = ({ student, onClick }) => {
  const imageUrl = student.image || "https://static.vecteezy.com/system/resources/previews/000/497/579/original/male-student-icon-design-vector.jpg";
  return (
    <div onClick={() => onClick(student)} className="student-card">
      <img
        src={imageUrl}
        alt={`${student.firstName} ${student.lastName}`}
        className="student-image"
      />
      <div className="student-info">
        <h3>{`${student.firstName} ${student.lastName}`}</h3>
        <p>Student Code: {student.studentCode}</p>
      </div>
    </div>
  );
};

const StudentProfiles = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [healthProfile, setHealthProfile] = useState(null);
  const [healthProfileLoading, setHealthProfileLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const userId = JSON.parse(atob(userInfo.accessToken.split('.')[1]))?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

  useEffect(() => {
    const fetchStudents = async () => {
      if (!userId) {
        toast.error("Could not identify user. Please log in again.");
        setLoading(false);
        return;
      }
      try {
        const response = await getStudentsByParentId(userId);
        const studentData = Array.isArray(response.data.data) ? response.data.data : [];
        setStudents(studentData);
      } catch (error) {
        toast.error("Failed to fetch students");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [userId]);

  const handleAddStudent = () => {
    navigate("/add-student");
  };

  const handleCardClick = async (student) => {
    setSelectedStudent(student);
    setHealthProfileLoading(true);
    try {
      const res = await getNewestHealthProfile(student.studentCode);
      setHealthProfile(res?.data?.data || null);
      setShowModal(true);
    } catch (error) {
      if (error.response?.data?.message === "Không tìm thấy hồ sơ sức khỏe nào dựa trên mã học sinh này.") {
        confirm({
          title: "Create Health Profile?",
          content: `No health profile found for ${student.firstName}. Would you like to create one?`,
          okText: "Create",
          cancelText: "Cancel",
          onOk: async () => {
            try {
              const newProfile = { studentCode: student.studentCode };
              await createHealthProfile(newProfile);
              toast.success("Profile created! Loading details...");
              const res = await getNewestHealthProfile(student.studentCode);
              setHealthProfile(res?.data?.data || null);
              setShowModal(true);
            } catch (createError) {
              toast.error("Failed to create health profile.");
              setHealthProfile(null);
            }
          },
          onCancel: () => {
            setSelectedStudent(null);
          },
        });
      } else {
        toast.error("Failed to get health profile.");
        setHealthProfile(null);
      }
    } finally {
      setHealthProfileLoading(false);
    }
  };

  const resetModalData = () => {
    setHealthProfile(null);
    setSelectedStudent(null);
  };

  const handleProfileUpdate = () => {
    toast.success("Health profile updated successfully!");
    // Optional: refetch students if the update could change student list data
  };

  return (
    <div className="parents-container">
      <div className="parents-content">
        <div className="parents-header">
          <FaBars className="toggle-icon" style={{ cursor: "pointer" }} />
        </div>
        <div className="parents-main">
          <div className="student-profiles-container">
            <div className="student-profiles-header">
              <h1 style={{ color: "var(--primary-text-color)" }}>My Students</h1>
              <Button type="primary" size="large" className="add-student-btn" onClick={handleAddStudent}>
                ADD NEW STUDENT
              </Button>
            </div>

            {loading ? (
              <div className="loading-text">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="no-students-text">No students found. Add a new student to get started.</div>
            ) : (
              <div className="students-grid">
                {students.map((student) => (
                  <StudentCard key={student.id} student={student} onClick={handleCardClick} />
                ))}
              </div>
            )}

            <ModalStudent
              show={showModal}
              setShow={setShowModal}
              healthProfile={healthProfile}
              loading={healthProfileLoading}
              resetData={resetModalData}
              onUpdated={handleProfileUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfiles;