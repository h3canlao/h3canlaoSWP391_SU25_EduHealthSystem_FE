import React from "react";
import {
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  TeamOutlined,
  AppstoreOutlined,
  FileProtectOutlined,
  HistoryOutlined,
  FormOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import Sidebar from "@/components/Sidebar";

const routes = [
  // { key: "/admin/manage-users", icon: <UserOutlined />, label: "Quản lý người dùng" },
  {
    key: "medication",
    icon: <AppstoreOutlined />,
    label: "Quản lý thuốc",
    children: [{ key: "/admin/manage-medication", icon: <MedicineBoxOutlined />, label: "Danh sách thuốc" }],
  },
  {
    key: "medical-supply",
    icon: <MedicineBoxOutlined />,
    label: "Vật tư y tế",
    children: [{ key: "/admin/manage-medicalSupply", icon: <FormOutlined />, label: "Danh sách vật tư" }],
  },
  {
    key: "vaccination",
    icon: <FileProtectOutlined />,
    label: "Tiêm chủng",
    children: [
      { key: "/admin/manage-vaccinationCampaign", icon: <HistoryOutlined />, label: "Chiến dịch tiêm chủng" },
      { key: "/admin/manage-vaccinationSchedule", icon: <CalendarOutlined />, label: "Lịch tiêm chủng" },
      { key: "/admin/manage-vaccine", icon: <MedicineBoxOutlined />, label: "Quản lý vắc xin" },
    ],
  },
  {
    key: "checkup",
    icon: <FileProtectOutlined />,
    label: "Khám định kỳ",
    children: [
      { key: "/admin/manage-checkupCampaign", icon: <HistoryOutlined />, label: "Chiến dịch khám" },
      { key: "/admin/manage-checkupSchedule", icon: <CalendarOutlined />, label: "Lịch khám" },
    ],
  },
  { key: "/admin/staff", icon: <TeamOutlined />, label: "Nhân sự" },
];

export default function SideBar() {
  const userInfo = { name: "Admin", email: "admin@email.com" };
  const onLogout = () => {};
  return <Sidebar routes={routes} userInfo={userInfo} onLogout={onLogout} />;
}
