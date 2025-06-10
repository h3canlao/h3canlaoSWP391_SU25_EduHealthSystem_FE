import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./ModalUser.css";

const ModalUser = ({ show, setShow, studentData, resetData }) => {
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
        <Modal.Title>Nurse Profile</Modal.Title>
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

                {/* DOB   */}
                <div className="row">
                  <div className="col-md-6">
                    <input className="form-control" type="text" placeholder="Date of Birth" />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" type="text" placeholder="Gender" />
                  </div>
                </div>

                {/* Gender + Grade + Section */}
                <div className="row">
                  <div className="col-md-12">
                    <input className="form-control" type="text" placeholder="Department" />
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

export default ModalUser;
