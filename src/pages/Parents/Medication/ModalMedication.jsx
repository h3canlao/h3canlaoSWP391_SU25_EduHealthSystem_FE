import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import moment from "moment";
import "./ModalMedication.css";

const ModalMedication = ({ show, setShow, vaccineData, resetData }) => {
  const [vaccineName, setVaccineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [notes, setNotes] = useState("");
  const [parentNote, setParentNote] = useState("");
  const [parentSignature, setParentSignature] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vaccineData) {
      setVaccineName(vaccineData.vaccineName || "");
      setQuantity(vaccineData.quantity || "");
      setStartTime(vaccineData.startTime ? moment(vaccineData.startTime, "YYYY-MM-DDTHH:mm") : null);
      setEndTime(vaccineData.endTime ? moment(vaccineData.endTime, "YYYY-MM-DDTHH:mm") : null);
      setNotes(vaccineData.notes || "");
      setParentNote(vaccineData.parentNote || "");
      setParentSignature(""); // Reset signature for new confirmation
    } else {
      setVaccineName("");
      setQuantity("");
      setStartTime(null);
      setEndTime(null);
      setNotes("");
      setParentNote("");
      setParentSignature("");
    }
  }, [vaccineData]);

  const handleClose = () => {
    setShow(false);
    resetData && resetData();
  };

  const handleConfirmVaccination = () => {
    if (!vaccineName || !quantity || !startTime || !endTime || !parentSignature) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formattedStartTime = startTime.format("YYYY-MM-DD HH:mm");
    const formattedEndTime = endTime.format("YYYY-MM-DD HH:mm");

    Modal.confirm({
      title: "Xác nhận tiêm vắc-xin",
      content: (
        <div>
          <p>Bạn có chắc chắn muốn đồng ý tiêm vắc-xin cho con?</p>
          <p>Tên vắc-xin: {vaccineName}</p>
          <p>Số lượng: {quantity}</p>
          <p>Thời gian bắt đầu: {formattedStartTime}</p>
          <p>Thời gian kết thúc: {formattedEndTime}</p>
          <p>Ghi chú: {notes}</p>
          <p>Notes Phụ Huynh: {parentNote}</p>
          <p>Chữ ký phụ huynh: {parentSignature}</p>
        </div>
      ),
      onOk: async () => {
        setLoading(true);
        try {
          // Mock API call for vaccination confirmation
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
          const mockResponse = {
            id: Date.now(),
            vaccineName,
            quantity,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            notes,
            parentNote,
            parentSignature,
            status: "Confirmed",
            confirmedAt: new Date().toLocaleString(),
          };
          toast.success("Xác nhận tiêm vắc-xin thành công!");
          handleClose();
          console.log("Mock Vaccination Data:", mockResponse);
          // Optionally update vaccines state in parent if needed
        } catch (error) {
          toast.error("Xác nhận tiêm vắc-xin thất bại!");
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => {
        // No action on cancel
      },
      okText: "Đồng ý",
      cancelText: "Hủy",
    });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      backdrop="static"
      keyboard={false}
      centered
      className="modal-medication-detail"
    >
      <Modal.Header closeButton>
        <Modal.Title>Vaccine Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="modal-medication-detail-container">
          <div className="container-fluid">
            {/* === Row 1: Image + Vaccine Info === */}
            <div className="row">
              {/* Left: Image Placeholder */}
              <div className="col-md-4 d-flex justify-content-center align-items-center mb-3 mb-md-0">
                <div
                  style={{
                    width: "220px",
                    height: "220px",
                    border: "2px dashed #ccc",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f8f9fa",
                  }}
                >
                  <span style={{ color: "#aaa" }}>Vaccine Image</span>
                </div>
              </div>

              {/* Right: Vaccine Basic Info */}
              <div className="col-md-8 vaccine-detail-panel d-flex flex-column gap-3">
                {/* Vaccine Name */}
                <div className="row">
                  <div className="col-md-12">
                    <label className="form-label">Tên Vaccin:</label>
                    <Form.Control
                      type="text"
                      placeholder="Vaccine Name"
                      value={vaccineName}
                      onChange={(e) => setVaccineName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Số lượng:</label>
                    <Form.Control
                      type="number"
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </div>

                {/* Start Time + End Time */}
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Thời gian bắt đầu:</label>
                    <Form.Control
                      type="datetime-local"
                      value={startTime ? startTime.format("YYYY-MM-DDTHH:mm") : ""}
                      onChange={(e) => setStartTime(moment(e.target.value, "YYYY-MM-DDTHH:mm"))}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Thời gian kết thúc:</label>
                    <Form.Control
                      type="datetime-local"
                      value={endTime ? endTime.format("YYYY-MM-DDTHH:mm") : ""}
                      onChange={(e) => setEndTime(moment(e.target.value, "YYYY-MM-DDTHH:mm"))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* === Row 2: Notes + Parent Note + Parent Signature === */}
            <div className="row mt-4">
              <div className="col-md-6">
                <label className="form-label">Ghi chú:</label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Note Phụ Huynh về học sinh:</label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter parent note"
                  value={parentNote}
                  onChange={(e) => setParentNote(e.target.value)}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <label className="form-label">Chữ ký phụ huynh:</label>
                <Form.Control
                  type="text"
                  placeholder="Enter parent signature"
                  value={parentSignature}
                  onChange={(e) => setParentSignature(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirmVaccination} disabled={loading}>
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalMedication;