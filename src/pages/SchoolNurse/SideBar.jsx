import React from "react";
import {
  HomeOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  FileProtectOutlined,
  AppstoreOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Sidebar from "@/components/Sidebar";

const routes = [
  { key: "/nurse/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
  { key: "/nurse/create-vaccine-schedule", icon: <FileProtectOutlined />, label: "Tạo lịch tiêm chủng" },
  { key: "/nurse/create-checkup-schedule", icon: <CalendarOutlined />, label: "Tạo lịch khám sức khỏe" },
  { key: "/nurse/pending-medications", icon: <MedicineBoxOutlined />, label: "Thuốc chờ xử lý" },
  { key: "/nurse/health-checkups", icon: <CalendarOutlined />, label: "Khám sức khỏe" },
  { key: "/nurse/counseling-appointments", icon: <FileProtectOutlined />, label: "Lịch tư vấn" },
  { key: "/nurse/vaccine-forms", icon: <AppstoreOutlined />, label: "Phiếu tiêm chủng" },
  { key: "/nurse/manage-vaccine-forms", icon: <AppstoreOutlined />, label: "Quản lý phiếu tiêm chủng" },
];

export default function SideBar() {
  // TODO: Lấy userInfo và onLogout thực tế nếu có
  const userInfo = { name: "Y tá", email: "nurse@email.com" };
  const onLogout = () => {};
  return <Sidebar routes={routes} userInfo={userInfo} onLogout={onLogout} />;
}