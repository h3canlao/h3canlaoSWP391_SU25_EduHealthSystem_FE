import React from "react";
import { Modal, Form, Input, Button, Select, InputNumber, DatePicker, Row, Col, Space, Checkbox } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const TreatEventModal = ({
  open,
  onFinish,
  onCancel,
  submitting,
  users = [],
  medicationLots = [],
  supplyLots = [],
}) => {
  const [form] = Form.useForm();
  const isReferred = Form.useWatch("isReferredToHospital", form);

  return (
    <Modal
      open={open}
      title="Xử lý / Sơ cứu Sự kiện Y tế"
      onCancel={onCancel}
      width={900}
      destroyOnClose
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={submitting} onClick={() => form.submit()}>
          Lưu thông tin
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} name="treat_event_form">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstAidAt"
              label="Thời gian sơ cứu"
              rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="firstResponderId"
              label="Người sơ cứu"
              rules={[{ required: true, message: "Vui lòng chọn người sơ cứu!" }]}
            >
              <Select
                showSearch
                placeholder="Chọn người thực hiện"
                filterOption={(input, option) => (option?.children ?? "").toLowerCase().includes(input.toLowerCase())}
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.id}>
                    {user.fullName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="firstAidDescription"
              label="Các bước sơ cứu"
              rules={[{ required: true, message: "Vui lòng mô tả các bước sơ cứu!" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="location" label="Vị trí">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="severity" label="Mức độ">
              <Select placeholder="Chọn mức độ">
                <Option value="Minor">Mức độ 1: Nhẹ</Option>
                <Option value="Moderate">Mức độ 2: Trung bình</Option>
                <Option value="Severe">Mức độ 3: Nặng</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="symptoms" label="Triệu chứng">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="injuredBodyPartsRaw" label="Bộ phận bị thương">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Thuốc đã sử dụng">
          <Form.List name="medications">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "medicationLotId"]}
                      rules={[{ required: true, message: "Chọn thuốc!" }]}
                      style={{ width: 300 }}
                    >
                      <Select showSearch placeholder="Chọn thuốc">
                        {medicationLots.map((lot) => (
                          <Option key={lot.id} value={lot.id}>
                            {lot.medicationName} (Lô: {lot.lotNumber})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[{ required: true, message: "Nhập SL!" }]}
                    >
                      <InputNumber placeholder="SL" min={1} />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "notes"]} style={{ width: 250 }}>
                      <Input placeholder="Ghi chú" />
                    </Form.Item>
                    <DeleteOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm thuốc
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item label="Vật tư đã sử dụng">
          <Form.List name="supplies">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "medicalSupplyLotId"]}
                      rules={[{ required: true, message: "Chọn vật tư!" }]}
                      style={{ width: 300 }}
                    >
                      <Select showSearch placeholder="Chọn vật tư">
                        {supplyLots.map((lot) => (
                          <Option key={lot.id} value={lot.id}>
                            {lot.medicalSupplyName} (Lô: {lot.lotNumber})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantityUsed"]}
                      rules={[{ required: true, message: "Nhập SL!" }]}
                    >
                      <InputNumber placeholder="SL" min={1} />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "notes"]} style={{ width: 250 }}>
                      <Input placeholder="Ghi chú" />
                    </Form.Item>
                    <DeleteOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm vật tư
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item name="isReferredToHospital" valuePropName="checked" initialValue={false}>
          <Checkbox>Có chuyển viện</Checkbox>
        </Form.Item>
        {isReferred && (
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="referralHospital" label="Bệnh viện">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="referralTransportBy" label="Phương tiện">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="referralDepartureTime" label="Thời gian đi">
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default TreatEventModal;
