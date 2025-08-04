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
import { Link } from "react-router-dom";

const routes = [
  { key: "/parents/student-profiles", icon: <UserOutlined />, label: "Hồ sơ học sinh" },
  
  {
    key: "medication",
    icon: <MedicineBoxOutlined />, 
    label: "Gửi thuốc",
    children: [
      { key: "/parents/send-medication", icon: <MedicineBoxOutlined />, label: "Gửi thuốc" },
      { key: "/parents/today-medication", icon: <CheckCircleOutlined />, label: "Theo dõi uống thuốc" },
    ]
  },

  {
    
    key: "health",
    icon: <SolutionOutlined />, label: "Khám sức khỏe",
    children: [
      { key: "/parents/checkup-schedules", icon: <CalendarOutlined />, label: "Lịch khám sức khỏe" },
      { key: "/parents/checkup-records", icon: <FormOutlined />, label: "Hồ sơ khám sức khỏe" },
      { key: "/parents/counseling-records", icon: <CheckCircleOutlined />, label: "Lịch sử tư vấn" },
      { key: "/parents/health-events", icon: <HistoryOutlined />, label: "Sự kiện y tế" },
    ]
  },

  {
    key: "vaccination",
    icon: <MedicineBoxOutlined />, label: "Tiêm chủng",
    children: [
      { key: "/parents/vaccine-consent", icon: <CheckCircleOutlined />, label: "Chờ xác nhận" },
      { key: "/parents/vaccination-schedules", icon: <CalendarOutlined />, label: "Lịch tiêm của con" },
      { key: "/parents/vaccination-records", icon: <HistoryOutlined />, label: "Theo dõi tiêm chủng" },
    ]
  },
];

export default function SideBar() {
  const userInfo = { name: "Phụ huynh", email: "parent@email.com" };
  const onLogout = () => {};
  return <Sidebar routes={routes} userInfo={userInfo} onLogout={onLogout} />;
}