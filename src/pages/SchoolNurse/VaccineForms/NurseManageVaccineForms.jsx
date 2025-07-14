import React, { useState } from "react";
import { Card, Table, Typography, Divider, Button, Space } from "antd";
import "./NurseManageVaccineForms.css";
const { Title } = Typography;

const initialForms = [
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

export default function NurseManageVaccineForms() {
  const [forms, setForms] = useState(getStoredForms());

  const saveForms = (newForms) => {
    setForms(newForms);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newForms));
  };

  const handleDelete = (id) => {
    const updated = forms.filter(f => f.id !== id);
    saveForms(updated);
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
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Xóa</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="nurse-manage-vaccine-forms">
      <Card>
        <Title level={3}>Quản lý phiếu tiêm chủng</Title>
        <Divider />
        <Table dataSource={forms} columns={columns} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
} 