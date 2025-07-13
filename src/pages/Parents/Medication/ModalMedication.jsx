import React, { useState } from 'react';
import { Modal, Form, InputNumber, DatePicker, Select, Input, Button, message } from 'antd';
import { createParentMedicationDelivery } from '../../../services/apiServices';
import { getAccessToken } from '../../../services/handleStorageApi';

const { TextArea } = Input;

const ModalMedication = ({ show, setShow, onClose, students, parentId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Xác định studentId mặc định nếu chỉ có 1 học sinh
  const defaultStudentId = students && students.length === 1 ? (students[0].id || students[0].studentId || students[0].studentCode) : undefined;

  const handleCancel = () => {
    setShow(false);
    form.resetFields();
    if (onClose) onClose(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const data = {
        medicationName: values.medicationName,
        studentId: values.studentId,
        parentId,
        quantityDelivered: values.quantityDelivered,  
        deliveredAt: values.deliveredAt.format('YYYY-MM-DDTHH:mm:ss'),
        notes: values.notes || ''
      };
      await createParentMedicationDelivery(data);
      message.success('Gửi đơn thuốc thành công!');
      setShow(false);
      form.resetFields();
      if (onClose) onClose(true);
    } catch (err) {
      if (err && err.errorFields) return; // Lỗi validate
      message.error('Gửi đơn thuốc thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={show}
      title="Gửi đơn thuốc mới"
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      centered
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          studentId: defaultStudentId,
          quantityDelivered: 1,
          notes: ''
        }}
        onFinish={handleOk}
      >
        <Form.Item
          label="Tên thuốc"
          name="medicationName"
          rules={[{ required: true, message: 'Vui lòng nhập tên thuốc!' }]}
        >
          <Input placeholder="Nhập tên thuốc" />
        </Form.Item>
        <Form.Item
          label="Chọn học sinh"
          name="studentId"
          rules={[{ required: true, message: 'Vui lòng chọn học sinh!' }]}
        >
          <Select disabled={students.length === 1} placeholder="Chọn học sinh">
            {students.map(stu => (
              <Select.Option key={stu.id || stu.studentId || stu.studentCode} value={stu.id || stu.studentId || stu.studentCode}>
                {stu.firstName} {stu.lastName} ({stu.studentCode})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Số lượng thuốc giao"
          name="quantityDelivered"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số lượng thuốc" />
        </Form.Item>
        <Form.Item
          label="Thời gian giao"
          name="deliveredAt"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian giao!' }]}
        >
          <DatePicker
            showTime
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Chọn thời gian giao"
          />
        </Form.Item>
        <Form.Item
          label="Ghi chú"
          name="notes"
        >
          <TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Gửi đơn thuốc
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalMedication;