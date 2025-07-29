import React, { useEffect, useState } from "react";
import { Card, List, Button, Modal, Input, message, Tag, Empty, Spin } from "antd";
import { getPendingVaccinationConsents, acceptVaccinationConsent } from "@/services/apiServices";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export default function ParentVaccinationConsent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, schedule: null, student: null, consentStatus: 0 });
  const [note, setNote] = useState("");
  const [signature, setSignature] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getPendingVaccinationConsents();
      setData(res.data?.data || []);
    } catch (err) {
      message.error("Không thể tải danh sách lịch tiêm.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (schedule, student, consentStatus) => {
    setModal({ open: true, schedule, student, consentStatus });
    setNote("");
    setSignature("");
  };
  const closeModal = () => setModal({ open: false, schedule: null, student: null, consentStatus: 0 });

  // const handleSubmit = async () => {
  //   if (!signature) return message.warning("Vui lòng nhập chữ ký phụ huynh.");
  //   setSubmitting(true);
  //   try {
  //     const res = await acceptVaccinationConsent({
  //       studentIds: [modal.student.studentId],
  //       vaccinationScheduleId: modal.schedule.id,
  //       parentNote: note,
  //       parentSignature: signature,
  //       consentStatus: modal.consentStatus
  //     });
      
  //     // Check if there are any specific error messages in the data array
  //     if (res?.data?.data && Array.isArray(res.data.data)) {
  //       const failedRecord = res.data.data.find(item => !item.isSuccess);
  //       if (failedRecord) {
  //         // Show the specific error message from the failed record
  //         toast.error(failedRecord.message);
  //         closeModal();
  //         fetchData();
  //         return;
  //       }
  //     }
      
  //     // If no specific errors, show the general success message
  //     toast.success(res?.data?.message);
  //     closeModal();
  //     fetchData();
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Có lỗi xảy ra");
  //   }
  //   setSubmitting(false);
  // };
  const handleSubmit = async () => {
    if (!signature) return message.warning("Vui lòng nhập chữ ký phụ huynh.");
    setSubmitting(true);
    try {
      const res = await acceptVaccinationConsent({
        studentIds: [modal.student.studentId],
        vaccinationScheduleId: modal.schedule.id,
        parentNote: note,
        parentSignature: signature,
        consentStatus: modal.consentStatus
      });
  
      // Check if there are messages in the response's data
      if (res?.data?.data && Array.isArray(res.data.data)) {
        const errorMessage = res.data.data[0]?.message;
        if (errorMessage) {
          toast.error(errorMessage); // Show error message using toast
        }
      }
  
      // For successful response
      // const successMessage = res?.data?.message;
      // if (successMessage) {
      //   toast.success(successMessage); // Show success message using toast
      // }
  
      closeModal();
      fetchData();
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
    setSubmitting(false);
  };
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <h2 style={{ fontWeight: 600, marginBottom: 24, textAlign: "center" }}>
        Phiếu xác nhận tiêm chủng
      </h2>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
      ) : data.length === 0 ? (
        <Empty description="Không có lịch cần xác nhận." />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={data}
          style={{ width: "100%", maxWidth: 900 }}
          renderItem={item => (
            <Card
              title={<>
                <b>{item.campaignName}</b> - {item.vaccinationTypeName}
                <Tag color="blue" style={{ marginLeft: 8 }}>{dayjs(item.scheduledAt).format("DD/MM/YYYY HH:mm")}</Tag>
                <Tag color="orange">Hạn xác nhận: {dayjs(item.consentDeadline).format("DD/MM/YYYY HH:mm")}</Tag>
              </>}
              style={{ marginBottom: 16 }}
              bodyStyle={{ padding: 16 }}
            >
              <List
                dataSource={item.students}
                renderItem={student => (
                  <List.Item actions={[
                    student.consentStatus === 1 && (
                      <>
                        <Button type="primary" onClick={() => openModal(item, student, 2)}>Đồng ý</Button>
                        <Button danger style={{ marginLeft: 8 }} onClick={() => openModal(item, student, 3)}>Từ chối</Button>
                      </>
                    ),
                    student.consentStatus === 2 && <Tag color="green">Đã đồng ý</Tag>,
                    student.consentStatus === 3 && <Tag color="red">Đã từ chối</Tag>
                  ]}>
                    <b>{student.studentName}</b> ({student.studentCode}) - Lớp {student.grade}{student.section}
                  </List.Item>
                )}
              />
            </Card>
          )}
        />
      )}
      <Modal
        open={modal.open}
        title={modal.consentStatus === 2 ? "Xác nhận đồng ý tiêm" : "Từ chối tiêm"}
        onCancel={closeModal}
        onOk={handleSubmit}
        okText={modal.consentStatus === 2 ? "Đồng ý" : "Từ chối"}
        confirmLoading={submitting}
      >
        <p>Học sinh: <b>{modal.student?.studentName}</b></p>
        <Input.TextArea
          rows={3}
          placeholder="Ghi chú (nếu có)"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <Input
          style={{ marginTop: 12 }}
          placeholder="Chữ ký phụ huynh (nhập tên hoặc ký)"
          value={signature}
          onChange={e => setSignature(e.target.value)}
        />
      </Modal>
    </div>
  );
} 