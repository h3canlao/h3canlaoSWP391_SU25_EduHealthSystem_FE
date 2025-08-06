import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { createParentMedicationDelivery } from '../../../../services/apiServices';
import "./ModalMedication.css";
import { toast } from "react-toastify";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// Mẫu thuốc rỗng
const emptyMedication = {
  medicationName: "",
  quantityDelivered: 1,
  dosageInstruction: "",
  dailySchedule: [{ time: "08:00:00", dosage: 1, note: "" }]
};

const ModalMedication = ({ show, setShow, onClose, students = [] }) => {
  const [studentId, setStudentId] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState([{...emptyMedication}]);
  const [loading, setLoading] = useState(false);

  // Reset form khi mở modal
  useEffect(() => {
    if (show) {
      const defaultId = students.length === 1 ? (students[0]?.id || students[0]?.studentId || "") : "";
      setStudentId(defaultId);
      setNotes("");
      setMedications([{...emptyMedication}]);
    }
  }, [show, students]);

  // Thao tác với thuốc
  const addMedication = () => {
    setMedications([...medications, {...emptyMedication}]);
  };
  
  const removeMedication = (index) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };
  
  const updateMedication = (index, field, value) => {
    const newMeds = [...medications];
    newMeds[index] = {...newMeds[index], [field]: value};
    setMedications(newMeds);
  };

  // Thao tác với lịch uống thuốc
  const addSchedule = (medIndex) => {
    const newMeds = [...medications];
    newMeds[medIndex].dailySchedule.push({ time: "02:00:00", dosage: 1, note: "" });
    setMedications(newMeds);
  };
  
  const removeSchedule = (medIndex, scheduleIndex) => {
    if (medications[medIndex].dailySchedule.length > 1) {
      const newMeds = [...medications];
      newMeds[medIndex].dailySchedule = 
        newMeds[medIndex].dailySchedule.filter((_, i) => i !== scheduleIndex);
      setMedications(newMeds);
    }
  };
  
  const updateSchedule = (medIndex, scheduleIndex, field, value) => {
    const newMeds = [...medications];
    // Nếu là field time và không có định dạng giây, thêm :00 vào cuối
    if (field === 'time' && !value.includes(':00', 3)) {
      value = value + ':00';
    }
    newMeds[medIndex].dailySchedule[scheduleIndex][field] = value;
    setMedications(newMeds);
  };

  // Gửi form
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!studentId) {
      toast.error("Vui lòng chọn học sinh!");
      return;
    }

    setLoading(true);
    try {
      await createParentMedicationDelivery({
        studentId,
        notes,
        medications: medications.map(med => ({
          medicationName: med.medicationName,
          quantityDelivered: Number(med.quantityDelivered),
          dosageInstruction: med.dosageInstruction || '',
          dailySchedule: med.dailySchedule.map(schedule => ({
            time: schedule.time,
            dosage: Number(schedule.dosage),
            note: schedule.note || ''
          }))
        }))
      });
      
      toast.success('Gửi đơn thuốc thành công!');
      handleClose(true);
    } catch (err) {
      toast.error('Gửi đơn thuốc thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Đóng modal
  const handleClose = (success = false) => {
    setShow(false);
    onClose?.(success);
  };
  // Nơi render ra modal
  return (
    <Modal show={show} onHide={() => handleClose()} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Gửi đơn thuốc mới</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="modal-medication-form">
          {/* Chọn học sinh */}
          <Form.Group className="mb-3">
            <Form.Label>Chọn học sinh <span className="text-danger">*</span></Form.Label>
            <Form.Select
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              disabled={students.length === 1}
              required
            >
              <option value="">Chọn học sinh</option>
              {students.map(student => {
                const id = student.id || student.studentId;
                const displayName = student.studentName || student.name || `Học sinh ${student.studentCode}`;
                return <option key={id} value={id}>{displayName}</option>;
              })}
            </Form.Select>
          </Form.Group>
          
          {/* Ghi chú chung */}
          <Form.Group className="mb-3">
            <Form.Label>Ghi chú chung</Form.Label>
            <Form.Control
              as="textarea"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Nhập ghi chú chung (nếu có)"
            />
          </Form.Group>
          
          <hr className="my-4" />
          
          {/* Danh sách thuốc */}
          {medications.map((medication, medIndex) => (
            <div key={medIndex} className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="m-0">Thuốc #{medIndex + 1}</h5>
                {medications.length > 1 && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeMedication(medIndex)}
                  >
                    <DeleteOutlined /> Xóa thuốc
                  </Button>
                )}
              </div>
              
              {/* Tên thuốc */}
              <Form.Group className="mb-3">
                <Form.Label>Tên thuốc <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={medication.medicationName}
                  onChange={e => updateMedication(medIndex, 'medicationName', e.target.value)}
                  placeholder="Nhập tên thuốc"
                  required
                />
              </Form.Group>
              
              {/* Số lượng và hướng dẫn */}
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Số lượng thuốc giao (Viên, gói, ...) <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      value={medication.quantityDelivered}
                      onChange={e => updateMedication(medIndex, 'quantityDelivered', e.target.value)}
                      min="1"
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col>
                  <Form.Group>
                    <Form.Label>Hướng dẫn sử dụng</Form.Label>
                    <Form.Control
                      type="text"
                      value={medication.dosageInstruction}
                      onChange={e => updateMedication(medIndex, 'dosageInstruction', e.target.value)}
                      placeholder="VD: Uống sau khi ăn"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              {/* Lịch uống thuốc */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="mb-0">Lịch uống thuốc hàng ngày</Form.Label>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => addSchedule(medIndex)}
                  >
                    <PlusOutlined /> Thêm lịch
                  </Button>
                </div>
                
                {/* Danh sách lịch uống */}
                {medication.dailySchedule.map((schedule, scheduleIndex) => (
                  <div key={scheduleIndex} className="border rounded p-3 mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small>Lịch #{scheduleIndex + 1}</small>
                      {medication.dailySchedule.length > 1 && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeSchedule(medIndex, scheduleIndex)}
                        >
                          <DeleteOutlined />
                        </Button>
                      )}
                    </div>
                    
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>Thời gian <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="time"
                            value={schedule.time}
                            onChange={e => updateSchedule(medIndex, scheduleIndex, 'time', e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>Liều lượng (Viên, gói, ...) <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="number"
                            value={schedule.dosage}
                            onChange={e => updateSchedule(medIndex, scheduleIndex, 'dosage', e.target.value)}
                            min="1"
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>Ghi chú</Form.Label>
                          <Form.Control
                            type="text"
                            value={schedule.note}
                            onChange={e => updateSchedule(medIndex, scheduleIndex, 'note', e.target.value)}
                            placeholder="VD: Uống trước khi ăn"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
              
              <hr className="my-4" />
            </div>
          ))}
          
          {/* Nút thêm thuốc */}
          <div className="d-flex justify-content-center mb-3">
            <Button 
              variant="outline-primary" 
              onClick={addMedication}
              className="w-100"
            >
              <PlusOutlined /> Thêm thuốc
            </Button>
          </div>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose()}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi đơn thuốc"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalMedication;