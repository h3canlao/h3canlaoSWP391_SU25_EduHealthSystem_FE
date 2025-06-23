import React, { useState } from "react";
import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBars } from "react-icons/fa";
import ModalMedication from "./ModalMedication"; // Updated component
import "./SendMedication.css";

const { Title, Text } = Typography;

const SendMedication = () => {
  // Sample vaccine data
  const [vaccines, setVaccines] = useState([
    {
      id: 1,
      vaccineName: "Ibuprofen Vaccine",
      quantity: 10,
      startTime: "2025-06-09T10:00",
      endTime: "2025-06-09T12:00",
      notes: "For headache prevention",
      parentNote: "Parent note: Ensure proper rest after vaccination.",
      status: "Delivered",
    },
    {
      id: 2,
      vaccineName: "Paracetamol Vaccine",
      quantity: 5,
      startTime: "2025-06-08T14:00",
      endTime: "2025-06-08T16:00",
      notes: "For fever prevention",
      parentNote: "Parent note: Monitor temperature post-vaccine.",
      status: "Pending",
    },
    {
      id: 3,
      vaccineName: "MMR Vaccine",
      quantity: 1,
      startTime: "2025-06-20T09:00",
      endTime: "2025-06-20T11:00",
      notes: "Pending vaccination confirmation",
      parentNote: "Parent note: Contact doctor if reaction occurs.",
      status: "Pending",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const navigate = useNavigate();

  // Handle adding new vaccine
  const handleAddMedication = () => {
    const newVaccine = {
      id: Date.now(),
      vaccineName: "",
      quantity: "",
      startTime: "",
      endTime: "",
      notes: "",
      parentNote: "",
      status: "Pending",
    };
    setSelectedVaccine(newVaccine);
    setShowModal(true);
  };

  // Handle vaccine card click to show modal
  const handleCardClick = (vaccine) => {
    setSelectedVaccine(vaccine);
    setShowModal(true);
  };

  // Reset modal data
  const resetModalData = () => {
    setSelectedVaccine(null);
  };

  return (
    <div className="parents-container">
      <div className="parents-content">
        <div className="parents-header">
          <FaBars className="toggle-icon" style={{ cursor: "pointer" }} />
        </div>
        <div className="parents-main">
          <div className="medication-profiles-container">
            <div className="controls">
              <Button
                type="primary"
                size="large"
                className="add-medication-btn"
                onClick={handleAddMedication}
              >
                ADD NEW MEDICATION
              </Button>
            </div>

            <div className="medications-grid">
              {vaccines.map((vaccine) => (
                <div
                  onClick={() => handleCardClick(vaccine)}
                  key={vaccine.id}
                  className="medication-card"
                >
                  <div className="medication-info">
                    <h3>{vaccine.vaccineName}</h3>
                    <p>Quantity: {vaccine.quantity}</p>
                    <p>Start Time: {vaccine.startTime}</p>
                    <p>End Time: {vaccine.endTime}</p>
                    <p>Status: {vaccine.status}</p>
                  </div>
                </div>
              ))}
            </div>

            <ModalMedication
              show={showModal}
              setShow={setShowModal}
              vaccineData={selectedVaccine}
              resetData={resetModalData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMedication;