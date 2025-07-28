import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, InputNumber, Typography, message, Spin, Row, Col } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { getMedicalSupplyLots, updateHealthEventTreatment } from "@/services/apiServices";
import "./HealthEvent.css";

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

  return (
    <div className="health-event">
      <Title level={4} className="health-event-title">Khai báo vật tư y tế sử dụng</Title>
      {loading ? <Spin size="large" className="health-event-loading" /> : (
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleFinish} 
          initialValues={{ supplyUsages: [{}] }}
          className="health-event-form"
        >
          <Form.List name="supplyUsages">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, idx) => (
                  <div className="health-event-card" key={field.key}>
                    <Row gutter={16} align="middle">
                      <Col xs={24} sm={24} md={10} lg={10}>
                        <Form.Item
                          {...field}
                          name={[field.name, "medicalSupplyLotId"]}
                          fieldKey={[field.fieldKey, "medicalSupplyLotId"]}
                          rules={[{ required: true, message: "Chọn vật tư" }]}
                          label="Vật tư y tế"
                        >
                          <Select
                            placeholder="Chọn vật tư y tế"
                            showSearch
                            filterOption={(input, option) =>
                              (option?.children || "").toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').includes(
                                input.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
                              )
                            }
                          >
                            {lots.map(lot => (
                              <Select.Option key={lot.id} value={lot.id}>
                                {lot.medicalSupplyName} ({lot.lotNumber})
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={12} sm={8} md={4} lg={4}>
                        <Form.Item
                          {...field}
                          name={[field.name, "quantityUsed"]}
                          fieldKey={[field.fieldKey, "quantityUsed"]}
                          rules={[{ required: true, message: "Nhập số lượng" }]}
                          label="Số lượng"
                        >
                          <InputNumber min={1} placeholder="Số lượng" style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={12} sm={16} md={8} lg={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, "notes"]}
                          fieldKey={[field.fieldKey, "notes"]}
                          label="Ghi chú"
                        >
                          <Input placeholder="Ghi chú" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={2} lg={2} style={{ textAlign: "center", marginTop: idx === 0 ? 29 : 0 }}>
                        {idx > 0 && (
                          <Button 
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />} 
                            onClick={() => remove(field.name)}
                            className="remove-btn"
                          />
                        )}
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    Thêm vật tư
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting} 
              block
              size="large"
            >
              Lưu điều trị
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
} 