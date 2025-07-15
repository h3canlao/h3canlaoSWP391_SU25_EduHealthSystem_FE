import React from "react";
import {
  HomeOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  BellOutlined,
  FileProtectOutlined,
  SolutionOutlined,
  HistoryOutlined,
  FormOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Sidebar from "@/components/Sidebar";

const routes = [
  {
    key: "health",
    icon: <SolutionOutlined />, label: "Khám sức khỏe",
    children: [
      { key: "/parents/checkup-schedules", icon: <CalendarOutlined />, label: "Lịch khám sức khỏe" },
      { key: "/parents/checkup-records", icon: <FormOutlined />, label: "Hồ sơ khám sức khỏe" },
      { key: "/parents/counseling-records", icon: <CheckCircleOutlined />, label: "Lịch sử tư vấn" },
    ]
  },
  {
    key: "vaccine",
    icon: <MedicineBoxOutlined />, label: "Tiêm chủng",
    children: [
      { key: "/parents/vaccine-overview", icon: <HomeOutlined />, label: "Tổng quan vắc xin" },
      { key: "/parents/vaccine-history", icon: <HistoryOutlined />, label: "Lịch sử tiêm chủng" },
      { key: "/parents/vaccine-forms", icon: <FileProtectOutlined />, label: "Phiếu tiêm chủng" },
    ]
  },
  { key: "/parents/send-medication", icon: <MedicineBoxOutlined />, label: "Gửi thuốc" },
  // { key: "/parents/notifications", icon: <BellOutlined />, label: "Thông báo" },
  { key: "/parents/student-profiles", icon: <UserOutlined />, label: "Hồ sơ học sinh" },
];

export default function SideBar() {
  const userInfo = { name: "Phụ huynh", email: "parent@email.com" };
  const onLogout = () => {};
  return <Sidebar routes={routes} userInfo={userInfo} onLogout={onLogout} />;
}