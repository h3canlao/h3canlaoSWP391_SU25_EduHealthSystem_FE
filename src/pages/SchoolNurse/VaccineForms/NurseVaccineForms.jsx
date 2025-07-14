import React, { useState } from "react";
import { Card, Form, Input, Button, Select, Table, Typography, Divider, Space, Modal } from "antd";
import "./NurseVaccineForms.css";
import { toast } from "react-toastify";
const { Title } = Typography;
const { Option } = Select;

const initialForms = [
  // Dữ liệu mẫu ban đầu
  { id: 1, studentName: "Nguyễn Văn A", studentCode: "HS001", reaction: "Tốt" },
  { id: 2, studentName: "Trần Thị B", studentCode: "HS002", reaction: "Bình thường" },
];

const STORAGE_KEY = "vaccineForms";

function getStoredForms() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return initialForms;
}

export default function NurseVaccineForms() {
  const [forms, setForms] = useState(getStoredForms());
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(null);
  const [modal, setModal] = useState({ open: false, record: null });

  const saveForms = (newForms) => {
    setForms(newForms);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newForms));
  };

  const handleFinish = async (values) => {
    // Debug log giá trị form
    console.log('Form values:', values);
    try {
      await form.validateFields();
      if (editing) {
        const updated = forms.map(f => f.id === editing ? { ...values, id: editing } : f);
        saveForms(updated);
        setEditing(null);
        form.resetFields();
        toast.success("Cập nhật phiếu thành công!");
      } else {
        const updated = [...forms, { ...values, id: Date.now() }];
        saveForms(updated);
        form.resetFields();
        toast.success("Tạo phiếu thành công!");
      }
    } catch (err) {
      // Nếu có lỗi validate, log ra để debug
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      console.log('Validate error:', err);
    }
  };

  const handleEdit = (record) => {
    setEditing(record.id);
    form.setFieldsValue(record);
  };

  const handleDelete = (id) => {
    const updated = forms.filter(f => f.id !== id);
    saveForms(updated);
    toast.success("Đã xóa phiếu thành công!");
  };

  const columns = [
    { title: "Họ tên học sinh", dataIndex: "studentName", key: "studentName" },
    { title: "Mã học sinh", dataIndex: "studentCode", key: "studentCode" },
    { title: "Tình trạng phản ứng", dataIndex: "reaction", key: "reaction" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Xóa</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="nurse-vaccine-forms">
      <Card>
        <Title level={3}>Tạo Phiếu Tiêm Chủng</Title>
        <Divider />
        <Form form={form} layout="vertical" onFinish={handleFinish} style={{ maxWidth: 500 }}>
          <Form.Item label="Họ tên học sinh" name="studentName" rules={[{ required: true, message: "Nhập họ tên học sinh" }]}> 
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item label="Mã học sinh" name="studentCode" rules={[{ required: true, message: "Nhập mã học sinh" }]}> 
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item label="Tình trạng phản ứng sau tiêm" name="reaction" rules={[{ required: true, message: "Chọn tình trạng" }]}> 
            <Select>
              <Option value="Tốt">Tốt</Option>
              <Option value="Bình thường">Bình thường</Option>
              <Option value="Nặng">Nặng</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">{editing ? "Cập nhật" : "Tạo phiếu"}</Button>
            {editing && <Button style={{ marginLeft: 8 }} onClick={() => { setEditing(null); form.resetFields(); }}>Hủy</Button>}
          </Form.Item>
        </Form>
        <Divider />
        <Title level={4}>Danh sách phiếu tiêm chủng đã tạo</Title>
        <Table dataSource={forms} columns={columns} rowKey="id" pagination={false} style={{ marginTop: 16 }} />
      </Card>
    </div>
  );
} 