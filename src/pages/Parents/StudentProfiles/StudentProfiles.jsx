import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./StudentProfiles.css"; // Tạo file CSS riêng
import "antd/dist/reset.css"; // For Antd v5
import ModalStudent from "./ModalStudent";

const { Title, Text } = Typography;

export default function StudentProfiles() {
  // Dữ liệu mẫu cho danh sách sinh viên
  const [students] = useState([
    { id: 1, name: "Karthi Madesh", age: 15, grade: "Grade 10", image: "https://static.vecteezy.com/system/resources/previews/000/497/579/original/male-student-icon-design-vector.jpg" },
    { id: 2, name: "Student Name", age: 14, grade: "Grade 9", image: "https://static.vecteezy.com/system/resources/previews/000/497/579/original/male-student-icon-design-vector.jpg" },
    { id: 3, name: "Student Name", age: 16, grade: "Grade 11", image: "https://static.vecteezy.com/system/resources/previews/000/497/579/original/male-student-icon-design-vector.jpg" },
  ]);

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const handleAddStudent = () => {
    navigate("/add-student");
    toast.success("Redirecting to add new student!");
  };

  const handleCardClick = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const resetModalData = () => {
    setSelectedStudent(null);
  };
  return (
    <div className="student-profiles-container">
      <div className="controls">
        <Button
          type="primary"
          size="large"
          className="add-student-btn"
          onClick={handleAddStudent}
        >
          ADD NEW STUDENT
        </Button>
      </div>

      <div className="students-grid">
        {students.map((student) => (
          <div onClick={() => handleCardClick(student)}  key={student.id} className="student-card">
            <img
              src={student.image}
              alt={student.name}
              className="student-image"
            />
            <div className="student-info">
              <h3>{student.name}</h3>
              <p>Age: {student.age}</p>
              <p>Grade: {student.grade}</p>
            </div>
          </div>
        ))}
      </div>
      <ModalStudent
        show={showModal}
        setShow={setShowModal}
        studentData={selectedStudent}
        resetData={resetModalData}
      />
    </div>
  );
}