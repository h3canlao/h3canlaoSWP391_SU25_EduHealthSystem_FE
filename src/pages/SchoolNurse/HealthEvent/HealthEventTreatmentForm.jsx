import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, InputNumber, Typography, message, Spin, Row, Col } from "antd";
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
      const response = await updateHealthEventTreatment(payload);
      if (onFinish) onFinish();
    } catch (e) {
      const errorMessage = e.response?.data?.message || "Cập nhật điều trị thất bại!";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Safe filter function that properly handles non-string values
  const filterOption = (input, option) => {
    try {
      // Convert both values to strings to prevent type errors
      const childText = String(option?.children || "");
      const inputText = String(input || "");
      
      return childText
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .includes(
          inputText
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
        );
    } catch (error) {
      // Fallback in case of any errors
      console.error("Search filter error:", error);
      return false;
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(79,195,247,0.08)", padding: 32 }}>
      <Title level={4} style={{ textAlign: "center", color: "#4FC3F7", marginBottom: 24 }}>Khai báo vật tư y tế sử dụng</Title>
      {loading ? <Spin /> : (
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ supplyUsages: [{}] }}>
          <Form.List name="supplyUsages">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, idx) => (
                  <Row key={field.key} gutter={8} style={{ marginBottom: 8 }} align="middle">
                    <Col span={10}>
                      <Form.Item
                        {...field}
                        name={[field.name, "medicalSupplyLotId"]}
                        fieldKey={[field.fieldKey, "medicalSupplyLotId"]}
                        rules={[{ required: true, message: "Chọn vật tư" }]}
                        style={{ marginBottom: 0 }}
                      >
                        <Select
                          placeholder="Chọn vật tư y tế"
                          showSearch
                          filterOption={filterOption}
                        >
                          {lots.map(lot => (
                            <Select.Option key={lot.id} value={lot.id}>
                              {lot.medicalSupplyName} ({lot.lotNumber})
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...field}
                        name={[field.name, "quantityUsed"]}
                        fieldKey={[field.fieldKey, "quantityUsed"]}
                        rules={[{ required: true, message: "Nhập số lượng" }]}
                        style={{ marginBottom: 0 }}
                      >
                        <InputNumber min={1} placeholder="Số lượng" style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, "notes"]}
                        fieldKey={[field.fieldKey, "notes"]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="Ghi chú" />
                      </Form.Item>
                    </Col>
                    <Col span={2} style={{ textAlign: "center" }}>
                      {idx > 0 && (
                        <Button danger onClick={() => remove(field.name)}>-</Button>
                      )}
                    </Col>
                  </Row>
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