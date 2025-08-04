import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import ModalStudent from "./ModalStudent";
import { getStudentsByParentId, getNewestHealthProfile, createHealthProfile } from "../../../services/apiServices";
import { getUserInfo } from "@/services/handleStorageApi";
import "./StudentProfiles.css";

const { confirm } = Modal;

// Main Layout
const StudentCard = ({ student, onClick }) => {
  const imageUrl = student.image || "https://images.icon-icons.com/3310/PNG/512/student_man_avatar_user_toga_school_university_icon_209264.png";
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

  const handleCardClick = async (student) => {
    try {
      const res = await getNewestHealthProfile(student.studentCode);
      setHealthProfile(res?.data?.data || null);
      setShowModal(true);
    } catch (error) {
      if (error.response?.data?.message === "Không tìm thấy hồ sơ sức khỏe nào dựa trên mã học sinh này.") {
        confirm({
          title: "Bạn có muốn khai báo sức khỏe không?",
          content: `Không tìm thấy khai báo sức khỏe của ${student.firstName} ${student.lastName}. Bạn có muốn tạo không?`,
          okText: "Tạo",
          cancelText: "Hủy",
          onOk: async () => {
            try {
              const newProfile = { studentCode: student.studentCode };
              await createHealthProfile(newProfile);
              toast.success("Tạo hồ sơ sức khỏe thành công!");
              const res = await getNewestHealthProfile(student.studentCode);
              setHealthProfile(res?.data?.data || null);
              setShowModal(true);
            } catch (createError) {
              toast.error("Thất bại khi tạo hồ sơ sức khỏe.");
              setHealthProfile(null);
            }
          },
          onCancel: () => {},
        });
      } else {
        toast.error("Failed to get health profile.");
        setHealthProfile(null);
      }
    } finally {
      setHealthProfileLoading(false);
    }
  };

  const resetModalData = () => setHealthProfile(null);

  return (
    <div className="student-outer-container">
      <div className="student-inner-container">
        <div className="student-header-row">
          <h1 className="student-title">Danh Sách Học Sinh</h1>
        </div>
        {loading ? (
          <div className="loading-text">Đang tải danh sách học sinh...</div>
        ) : students.length === 0 ? (
          <div className="no-students-text">Không có học sinh nào.</div>
        ) : (
          <div className="students-grid">
            {students.map((student) => (
              <StudentCard student={student} onClick={handleCardClick} />
            ))}
          </div>
        )}
        <ModalStudent
          show={showModal}
          setShow={setShowModal}
          healthProfile={healthProfile}
          resetData={resetModalData}
        />
      </div>
    </div>
  );
};

export default StudentProfiles;