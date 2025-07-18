import React from "react";
import {
  HomeOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  FileProtectOutlined,
  AppstoreOutlined,
  TeamOutlined,
  SolutionOutlined,
  FormOutlined,
  HistoryOutlined,
  PlusCircleOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import Sidebar from "@/components/Sidebar";

const routes = [
  { key: "/nurse/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
  {
    key: "health",
    icon: <MedicineBoxOutlined />, label: "Khám sức khỏe",
    children: [
      { key: "/nurse/health-checkups", icon: <FormOutlined />, label: "Khám sức khỏe" },
      { key: "/nurse/counseling-appointments", icon: <HistoryOutlined />, label: "Lịch tư vấn" },
    ]
  },
  {
    key: "vaccine",
    icon: <AppstoreOutlined />, label: "Tiêm chủng",
    children: [
      { key: "/nurse/vaccination-schedules", icon: <ScheduleOutlined />, label: "Lịch tiêm chủng" },
      { key: "/nurse/vaccination-records", icon: <HistoryOutlined />, label: "Theo dõi phiếu tiêm chủng" },
    ]
  },
  { key: "/nurse/pending-medications", icon: <MedicineBoxOutlined />, label: "Thuốc chờ xử lý" },
  { key: "/nurse/health-event", icon: <PlusCircleOutlined />, label: "Sự kiện y tế" },
];

export default function SideBar() {
  const userInfo = { name: "Y tá", email: "nurse@email.com" };
  const onLogout = () => {};
  return <Sidebar routes={routes} userInfo={userInfo} onLogout={onLogout} />;
} 