import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, InputNumber, Typography, message, Spin, Space } from "antd";
import { getMedicalSupplyLots, updateHealthEventTreatment } from "@/services/apiServices";

const { Title } = Typography;

export default function HealthEventTreatmentForm({ healthEventId, onFinish }) {
  const [form] = Form.useForm();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMedicalSupplyLots()
      .then(res => setLots(res.data?.data || []))
      .catch(() => message.error("Không lấy được vật tư y tế"))
      .finally(() => setLoading(false));
  }, []);

  const handleFinish = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        healthEventId,
        supplyUsages: values.supplyUsages.map(item => ({
          medicalSupplyLotId: item.medicalSupplyLotId,
          quantityUsed: item.quantityUsed,
          notes: item.notes || ""
        }))
      };
      await updateHealthEventTreatment(payload);
      message.success("Cập nhật điều trị thành công!");
      if (onFinish) onFinish();
    } catch (e) {
      message.error("Cập nhật điều trị thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(79,195,247,0.08)", padding: 32 }}>
      <Title level={4} style={{ textAlign: "center", color: "#4FC3F7" }}>Khai báo vật tư y tế sử dụng</Title>
      {loading ? <Spin /> : (
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ supplyUsages: [{}] }}>
          <Form.List name="supplyUsages">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, idx) => (
                  <Space key={field.key} align="baseline" style={{ display: "flex", marginBottom: 8, width: '100%', gap: 8 }}>
                    <Form.Item
                      {...field}
                      name={[field.name, "medicalSupplyLotId"]}
                      fieldKey={[field.fieldKey, "medicalSupplyLotId"]}
                      rules={[{ required: true, message: "Chọn vật tư" }]}
                      style={{ flex: 2, minWidth: 220, marginBottom: 0 }}
                    >
                      <Select placeholder="Chọn vật tư y tế">
                        {lots.map(lot => (
                          <Select.Option key={lot.id} value={lot.id}>
                            {lot.medicalSupplyName} ({lot.lotNumber})
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "quantityUsed"]}
                      fieldKey={[field.fieldKey, "quantityUsed"]}
                      rules={[{ required: true, message: "Nhập số lượng" }]}
                      style={{ flex: 1, minWidth: 100, marginBottom: 0 }}
                    >
                      <InputNumber min={1} placeholder="Số lượng" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "notes"]}
                      fieldKey={[field.fieldKey, "notes"]}
                      style={{ flex: 2, minWidth: 180, marginBottom: 0 }}
                    >
                      <Input placeholder="Ghi chú" />
                    </Form.Item>
                    {/* Ẩn nút xóa ở dòng cuối cùng (dòng đang nhập mới) */}
                    {fields.length > 1 && idx !== fields.length - 1 && (
                      <Button danger onClick={() => remove(field.name)}>-</Button>
                    )}
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>+ Thêm vật tư</Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              Lưu điều trị
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
} 