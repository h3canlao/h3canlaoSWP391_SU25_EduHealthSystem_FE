import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { createParentMedicationDelivery } from '../../../services/apiServices';
import "./ModalMedication.css";
import { toast } from "react-toastify";

// Initial form data
const initialFormData = {
  medicationName: "",
  studentId: "",
  quantityDelivered: 1,
  deliveredDate: new Date().toISOString().split('T')[0], // Default to today's date
  deliveredTime: new Date().toTimeString().slice(0, 5), // Default to current time (HH:MM format)
  notes: ""
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
      
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      setFormData({
        ...initialFormData,
        studentId: defaultStudentId,
        deliveredDate: currentDate,
        deliveredTime: currentTime
      });
    }
  }, [show, students]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      // Create a formatted ISO datetime string that preserves Vietnam timezone (UTC+7)
      const { deliveredDate, deliveredTime } = formData;
      
      // Create datetime string in Vietnam timezone (UTC+7)
      const deliveredAt = `${deliveredDate}T${deliveredTime}:00+07:00`;
      
      // Submit data
      await createParentMedicationDelivery({
        medicationName: formData.medicationName,
        studentId: formData.studentId,
        parentId,
        quantityDelivered: Number(formData.quantityDelivered),
        deliveredAt,
        notes: formData.notes || ''
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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Gửi đơn thuốc mới</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="modal-medication-form">
          {/* Medication Name */}
          <Form.Group className="mb-3">
            <Form.Label>Tên thuốc <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="medicationName"
              value={formData.medicationName}
              onChange={handleChange}
              placeholder="Nhập tên thuốc"
              required
            />
          </Form.Group>
          
          {/* Student Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Chọn học sinh <span className="text-danger">*</span></Form.Label>
            <Form.Select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
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
          
          {/* Quantity */}
          <Form.Group className="mb-3">
            <Form.Label>Số lượng thuốc giao <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              name="quantityDelivered"
              value={formData.quantityDelivered}
              onChange={handleChange}
              min="1"
              required
            />
          </Form.Group>
          
          {/* Delivery Date and Time */}
          <Form.Group className="mb-3">
            <Form.Label>Thời gian giao <span className="text-danger">*</span></Form.Label>
            <Row>
              <Col>
                <Form.Control
                  type="date"
                  name="deliveredDate"
                  value={formData.deliveredDate}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type="time"
                  name="deliveredTime"
                  value={formData.deliveredTime}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>
          </Form.Group>
          
          {/* Notes */}
          <Form.Group className="mb-3">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Nhập ghi chú (nếu có)"
            />
          </Form.Group>
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