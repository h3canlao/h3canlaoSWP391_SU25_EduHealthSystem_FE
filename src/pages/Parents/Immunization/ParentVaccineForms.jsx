import React from "react";
import { Card, Table, Typography, Divider } from "antd";
import "./ParentVaccineForms.css";
const { Title } = Typography;

const forms = [
  { id: 1, studentName: "Nguyễn Văn A", studentCode: "HS001", reaction: "Tốt" },
  { id: 2, studentName: "Trần Thị B", studentCode: "HS002", reaction: "Bình thường" },
];

const STORAGE_KEY = "vaccineForms";

function getStoredForms() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return forms;
}

export default function ParentVaccineForms() {
  const columns = [
    { title: "Họ tên học sinh", dataIndex: "studentName", key: "studentName" },
    { title: "Mã học sinh", dataIndex: "studentCode", key: "studentCode" },
    { title: "Tình trạng phản ứng", dataIndex: "reaction", key: "reaction" },
  ];
  const data = getStoredForms();
  return (
    <div className="parent-vaccine-forms">
      <Card>
        <Title level={3}>Phiếu tiêm chủng của học sinh</Title>
        <Divider />
        <Table dataSource={data} columns={columns} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
} 