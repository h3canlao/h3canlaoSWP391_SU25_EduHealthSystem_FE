import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, Typography, message, Spin, Steps } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { getAllStudents, createHealthEvent } from "@/services/apiServices";
import HealthEventTreatmentForm from "./HealthEventTreatmentForm";

const { Title } = Typography;
const { Option } = Select;

const EVENT_TYPE = [
  { label: "Tai nạn", value: 0 }, 
  { label: "Sốt", value: 1 },    
  { label: "Ngã", value: 2 },   
  { label: "Bệnh", value: 3 },   
  { label: "Khác", value: 4 },   
  { label: "Phản ứng vắc xin", value: 5 },
];
const EVENT_CATEGORY = [
  { label: "Tiêm chủng", value: 0 }, // Vaccination
  { label: "Tư vấn", value: 1 },    // Consultation
];

export default function HealthEventForm() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [createdEventId, setCreatedEventId] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllStudents()
      .then(res => {
        setStudents(res.data?.data || []);
      })
      .catch(() => {
        message.error("Không lấy được danh sách học sinh");
      })
      .finally(() => setLoading(false));
  }, []);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        studentId: values.studentId,
        eventCategory: values.eventCategory, 
        vaccinationRecordId: null, 
        eventType: values.eventType, 
        description: values.description,
        occurredAt: values.occurredAt && values.occurredAt.toDate().toISOString(),
      };
      const res = await createHealthEvent(payload);
      const id = res.data?.data?.id;
      if (id) {
        setCreatedEventId(id);
        setStep(1);
      }
      message.success("Khai báo sự kiện thành công! Tiếp tục nhập vật tư y tế.");
    } catch (e) {
      message.error("Khai báo thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTreatmentFinish = () => {
    message.success("Hoàn tất khai báo sự kiện y tế!");
    setStep(0);
    setCreatedEventId(null);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(79,195,247,0.08)", padding: 32 }}>
      <Steps current={step} style={{ marginBottom: 32 }}>
        <Steps.Step title="Khai báo sự kiện" />
        <Steps.Step title="Vật tư y tế sử dụng" />
      </Steps>
      {step === 0 && (
        <>
          <Title level={3} style={{ textAlign: "center", color: "#4FC3F7" }}>
            <PlusCircleOutlined /> Khai báo sự kiện y tế
          </Title>
          {loading ? <Spin /> : (
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label="Học sinh" name="studentId" rules={[{ required: true, message: "Chọn học sinh" }]}> 
                <Select
                  placeholder="Chọn học sinh"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children || "").toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').includes(
                      input.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
                    )
                  }
                >
                  {students.map(s => (
                    <Option key={s.id} value={s.id}>{s.lastName + " " + s.firstName}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Loại sự kiện" name="eventType" rules={[{ required: true, message: "Chọn loại sự kiện" }]}> 
                <Select placeholder="Chọn loại sự kiện">
                  {EVENT_TYPE.map(e => <Option key={e.value} value={e.value}>{e.label}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item label="Loại lịch" name="eventCategory" rules={[{ required: true, message: "Chọn loại lịch" }]}> 
                <Select placeholder="Chọn loại lịch">
                  {EVENT_CATEGORY.map(e => <Option key={e.value} value={e.value}>{e.label}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: "Nhập mô tả" }]}> 
                <Input.TextArea rows={3} placeholder="Nhập mô tả sự kiện" />
              </Form.Item>
              <Form.Item label="Thời gian xảy ra" name="occurredAt" rules={[{ required: true, message: "Chọn thời gian" }]}> 
                <DatePicker showTime style={{ width: "100%" }} format="YYYY-MM-DD HH:mm" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={submitting} block>
                  Gửi khai báo
                </Button>
              </Form.Item>
            </Form>
          )}
        </>
      )}
      {step === 1 && createdEventId && (
        <HealthEventTreatmentForm healthEventId={createdEventId} onFinish={handleTreatmentFinish} />
      )}
    </div>
  );
} 