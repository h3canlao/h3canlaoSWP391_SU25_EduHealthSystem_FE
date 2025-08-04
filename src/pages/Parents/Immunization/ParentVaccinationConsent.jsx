import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Input, message, Tag, Empty, Spin } from "antd";
import { getPendingVaccinationConsents, acceptVaccinationConsent } from "@/services/apiServices";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export default function ParentVaccinationConsent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, schedule: null, student: null });
  const [note, setNote] = useState("");
  const [signature, setSignature] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { 
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPendingVaccinationConsents();
        setData(res.data?.data || []);
      } catch {
        message.error("Không thể tải danh sách lịch tiêm.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData(); 
  }, []);

  const openModal = (schedule, student) => {
    setModal({ open: true, schedule, student });
    setNote("");
    setSignature("");
  };
  
  const closeModal = () => setModal({ open: false, schedule: null, student: null });

  const handleSubmit = async (consentStatus) => {
    if (!signature) {
      message.warning("Vui lòng nhập chữ ký phụ huynh.");
      return;
    }
    
    setSubmitting(true);
    
    try {
      await acceptVaccinationConsent({
        studentIds: [modal.student.studentId],
        vaccinationScheduleId: modal.schedule.id,
        parentNote: note,
        parentSignature: signature,
        consentStatus: consentStatus
      });

      closeModal();
      
      // Refetch data
      setLoading(true);
      const res = await getPendingVaccinationConsents();
      setData(res.data?.data || []);
      setLoading(false);
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h2 style={{ fontWeight: 600, marginBottom: 24, textAlign: "center" }}>Phiếu xác nhận tiêm chủng</h2>
      
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
      ) : data.length === 0 ? (
        <Empty description="Không có lịch cần xác nhận." />
      ) : (
        <div style={{ width: "100%", maxWidth: 900 }}>
          {data.map((item, index) => (
            <Card
              key={item.id || index}
              title={
                <>
                  <b>{item.campaignName}</b> - {item.vaccinationTypeName}
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    {dayjs(item.scheduledAt).format("DD/MM/YYYY HH:mm")}
                  </Tag>
                  <Tag color="orange">
                    Hạn xác nhận: {dayjs(item.consentDeadline).format("DD/MM/YYYY HH:mm")}
                  </Tag>
                </>
              }
              style={{ marginBottom: 16 }}
              bodyStyle={{ padding: 16 }}
            >
              <div>
                {item.students.map((student, studentIndex) => (
                  <div 
                    key={student.studentId || studentIndex} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: studentIndex < item.students.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    <div>
                      <b>{student.studentName}</b> ({student.studentCode}) - Lớp {student.grade}{student.section}
                    </div>
                    <div>
                      {student.consentStatus === 1 && (
                        <Button type="primary" onClick={() => openModal(item, student)}>
                          Xác nhận
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <Modal
        open={modal.open}
        title="Xác nhận đơn tiêm chủng"
        onCancel={closeModal}
        footer={null}
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
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <Button onClick={closeModal}>Hủy</Button>
          <Button 
            type="primary" 
            loading={submitting} 
            onClick={() => handleSubmit(2)}
          >
            Đồng ý
          </Button>
          <Button 
            danger 
            loading={submitting}
            onClick={() => handleSubmit(3)}
          >
            Từ chối
          </Button>
        </div>
      </Modal>
    </div>
  );
} 