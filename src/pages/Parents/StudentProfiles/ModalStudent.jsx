import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./ModalStudent.css";

const ModalStudent = ({ show, setShow, studentData, resetData }) => {
  const handleClose = () => {
    setShow(false);
    resetData && resetData();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      backdrop="static"
      keyboard={false}
      centered
      className="modal-user-detail"
    >
      <Modal.Header closeButton>
        <Modal.Title>Student Health Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="modal-user-detail-container">
          <div className="container-fluid">
            {/* === Row 1: Image + Student Info === */}
            <div className="row">
              {/* Left: Image */}
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
                    background: "#f8f9fa"
                  }}
                >
                  <span style={{ color: "#aaa" }}>Image Preview</span>
                </div>
              </div>

              {/* Right: Student Basic Info */}
              <div className="col-md-8 student-detail-panel d-flex flex-column gap-3">
                {/* First + Last Name */}
                <div className="row">
                  <div className="col-md-6">
                    <input className="form-control" type="text" placeholder="First Name" />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" type="text" placeholder="Last Name" />
                  </div>
                </div>

                {/* DOB + Student ID */}
                <div className="row">
                  <div className="col-md-6">
                    <input className="form-control" type="text" placeholder="Date of Birth" />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" type="text" placeholder="Student ID" />
                  </div>
                </div>

                {/* Gender + Grade + Section */}
                <div className="row">
                  <div className="col-md-4">
                    <input className="form-control" type="text" placeholder="Gender" />
                  </div>
                  <div className="col-md-4">
                    <input className="form-control" type="text" placeholder="Grade" />
                  </div>
                  <div className="col-md-4">
                    <input className="form-control" type="text" placeholder="Section" />
                  </div>
                </div>

                {/* Created At + Updated At */}
                <div className="row">
                  <div className="col-md-6">
                    <input className="form-control" type="text" placeholder="Created At" />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" type="text" placeholder="Updated At" />
                  </div>
                </div>
              </div>
            </div>

            {/* === Row 2: Health Profile (col-12) === */}
            <div className="row mt-4">
              <div className="col-12">
                <h5 className="mb-3">Health Profile</h5>
                <textarea className="form-control mb-2" rows={2} placeholder="Allergies" />
                <textarea className="form-control mb-2" rows={2} placeholder="Chronic Conditions" />
                <textarea className="form-control mb-2" rows={2} placeholder="Treatment History" />
                <div className="row">
                  <div className="col-md-6">
                    <input className="form-control" type="text" placeholder="Vision" />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" type="text" placeholder="Hearing" />
                  </div>
                </div>
              </div>
            </div>

            {/* === Row 3: Parents (col-12) === */}
            <div className="row mt-4">
              <div className="col-12">
                <h5 className="mb-3">Parents / Guardians</h5>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <input className="form-control" type="text" placeholder="Relationship: Father" />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input className="form-control" type="text" placeholder="Full Name: John Doe" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalStudent;
