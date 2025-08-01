import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { createParentMedicationDelivery } from '../../../services/apiServices';
import "./ModalMedication.css";
import { toast } from "react-toastify";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// Initial form data
const initialFormData = {
  studentId: "",
  notes: "",
  medications: [
    {
      medicationName: "",
      quantityDelivered: 1,
      dosageInstruction: "",
      dailySchedule: [
        {
          time: "",
          dosage: 1,
          note: ""
        }
      ]
    }
  ]
};

const ModalMedication = ({ show, setShow, onClose, students = [], parentId }) => {
  // State management
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  // Set default student if there's only one
  useEffect(() => {
    if (students.length === 1) {
      setFormData(prev => ({ 
        ...prev, 
        studentId: students[0]?.id || students[0]?.studentId || students[0]?.studentCode 
      }));
    }
  }, [students]);

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      const defaultStudentId = students.length === 1 
        ? students[0]?.id || students[0]?.studentId || students[0]?.studentCode 
        : "";
      
      setFormData({
        ...initialFormData,
        studentId: defaultStudentId
      });
    }
  }, [show, students]);

  // Handle student selection change
  const handleStudentChange = (e) => {
    setFormData(prev => ({ ...prev, studentId: e.target.value }));
  };

  // Handle notes change
  const handleNotesChange = (e) => {
    setFormData(prev => ({ ...prev, notes: e.target.value }));
  };

  // Handle medication fields change
  const handleMedicationChange = (index, field, value) => {
    setFormData(prev => {
      const updatedMedications = [...prev.medications];
      updatedMedications[index] = { 
        ...updatedMedications[index], 
        [field]: value 
      };
      return { ...prev, medications: updatedMedications };
    });
  };

  // Handle daily schedule change
  const handleScheduleChange = (medIndex, scheduleIndex, field, value) => {
    setFormData(prev => {
      const updatedMedications = [...prev.medications];
      const updatedSchedule = [...updatedMedications[medIndex].dailySchedule];
      updatedSchedule[scheduleIndex] = { 
        ...updatedSchedule[scheduleIndex], 
        [field]: value 
      };
      updatedMedications[medIndex] = {
        ...updatedMedications[medIndex],
        dailySchedule: updatedSchedule
      };
      return { ...prev, medications: updatedMedications };
    });
  };

  // Add a new medication
  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          medicationName: "",
          quantityDelivered: 1,
          dosageInstruction: "",
          dailySchedule: [
            {
              time: "",
              dosage: 1,
              note: ""
            }
          ]
        }
      ]
    }));
  };

  // Remove a medication
  const removeMedication = (index) => {
    if (formData.medications.length <= 1) return;
    
    setFormData(prev => {
      const updatedMedications = [...prev.medications];
      updatedMedications.splice(index, 1);
      return { ...prev, medications: updatedMedications };
    });
  };

  // Add a new schedule item
  const addScheduleItem = (medicationIndex) => {
    setFormData(prev => {
      const updatedMedications = [...prev.medications];
      updatedMedications[medicationIndex] = {
        ...updatedMedications[medicationIndex],
        dailySchedule: [
          ...updatedMedications[medicationIndex].dailySchedule,
          {
            time: "08:00:00",
            dosage: 1,
            note: ""
          }
        ]
      };
      return { ...prev, medications: updatedMedications };
    });
  };

  // Remove a schedule item
  const removeScheduleItem = (medicationIndex, scheduleIndex) => {
    if (formData.medications[medicationIndex].dailySchedule.length <= 1) return;
    
    setFormData(prev => {
      const updatedMedications = [...prev.medications];
      const updatedSchedule = [...updatedMedications[medicationIndex].dailySchedule];
      updatedSchedule.splice(scheduleIndex, 1);
      updatedMedications[medicationIndex] = {
        ...updatedMedications[medicationIndex],
        dailySchedule: updatedSchedule
      };
      return { ...prev, medications: updatedMedications };
    });
  };

  // Close modal
  const handleClose = () => {
    setShow(false);
    setFormData(initialFormData);
    onClose?.(false);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Submit data
      await createParentMedicationDelivery({
        studentId: formData.studentId,
        notes: formData.notes || '',
        medications: formData.medications.map(med => ({
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
      setShow(false);
      setFormData(initialFormData);
      onClose?.(true);
    } catch (err) {
      toast.error('Gửi đơn thuốc thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Gửi đơn thuốc mới</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="modal-medication-form">
          {/* Student Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Chọn học sinh <span className="text-danger">*</span></Form.Label>
            <Form.Select
              name="studentId"
              value={formData.studentId}
              onChange={handleStudentChange}
              disabled={students.length === 1}
              required
            >
              <option value="">Chọn học sinh</option>
              {students.map(student => (
                <option 
                  key={student.id || student.studentId || student.studentCode}
                  value={student.id || student.studentId || student.studentCode}
                >
                  {student.firstName} {student.lastName} ({student.studentCode})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          {/* Notes */}
          <Form.Group className="mb-3">
            <Form.Label>Ghi chú chung</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleNotesChange}
              rows={2}
              placeholder="Nhập ghi chú chung (nếu có)"
            />
          </Form.Group>
          
          <hr className="my-4" />
          
          {/* Medications */}
          {formData.medications.map((medication, medIndex) => (
            <div key={medIndex} className="medication-item mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="m-0">Thuốc #{medIndex + 1}</h5>
                {formData.medications.length > 1 && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeMedication(medIndex)}
                  >
                    <DeleteOutlined /> Xóa thuốc
                  </Button>
                )}
              </div>
              
              {/* Medication Name */}
              <Form.Group className="mb-3">
                <Form.Label>Tên thuốc <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={medication.medicationName}
                  onChange={(e) => handleMedicationChange(medIndex, 'medicationName', e.target.value)}
                  placeholder="Nhập tên thuốc"
                  required
                />
              </Form.Group>
              
              {/* Quantity */}
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Số lượng thuốc giao <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      value={medication.quantityDelivered}
                      onChange={(e) => handleMedicationChange(medIndex, 'quantityDelivered', e.target.value)}
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
                      onChange={(e) => handleMedicationChange(medIndex, 'dosageInstruction', e.target.value)}
                      placeholder="VD: Uống sau khi ăn"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              {/* Daily Schedule */}
              <div className="daily-schedule mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="mb-0">Lịch uống thuốc hàng ngày</Form.Label>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => addScheduleItem(medIndex)}
                  >
                    <PlusOutlined /> Thêm lịch
                  </Button>
                </div>
                
                {medication.dailySchedule.map((schedule, scheduleIndex) => (
                  <div key={scheduleIndex} className="schedule-item border rounded p-3 mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small>Lịch #{scheduleIndex + 1}</small>
                      {medication.dailySchedule.length > 1 && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeScheduleItem(medIndex, scheduleIndex)}
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
                            onChange={(e) => handleScheduleChange(medIndex, scheduleIndex, 'time', e.target.value)}
                            min="08:00:00"
                            max="17:00:00"
                            step="1"
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={3}>
                        <Form.Group className="mb-2">
                          <Form.Label>Liều lượng <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="number"
                            value={schedule.dosage}
                            onChange={(e) => handleScheduleChange(medIndex, scheduleIndex, 'dosage', e.target.value)}
                            min="1"
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={5}>
                        <Form.Group className="mb-2">
                          <Form.Label>Ghi chú</Form.Label>
                          <Form.Control
                            type="text"
                            value={schedule.note}
                            onChange={(e) => handleScheduleChange(medIndex, scheduleIndex, 'note', e.target.value)}
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
        <Button variant="secondary" onClick={handleClose}>
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