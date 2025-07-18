import React, { useState } from "react";
import { Layout, Menu, Avatar, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { colors } from "@/theme/colors";

const { Sider } = Layout;

export default function Sidebar({ routes = [], userInfo, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Đăng xuất tổng quát: xóa token + chuyển trang
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    if (typeof onLogout === 'function') onLogout();
    navigate('/signin');
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={220}
      style={{
        background: colors.lightBlue,
        color: colors.dark,
        minHeight: "100vh",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header: Logo + Toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 64,
          padding: "0 16px",
          background: colors.lightBlue,
          borderBottom: "1px solid #e0e0e0",
          flexShrink: 0,
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: 22, color: colors.blue }}
        />
        {!collapsed && (
          <span style={{ marginLeft: 14, fontWeight: 700, color: colors.blue, fontSize: 20, letterSpacing: 1 }}>
            EduHealth
          </span>
        )}
      </div>
      {/* Menu */}
      <div style={{ flex: 1, overflowY: "auto", background: colors.lightBlue }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          style={{
            background: colors.lightBlue,
            color: colors.dark,
            fontWeight: 600,
            fontSize: 16,
            borderRight: 0,
          }}
          items={routes}
          inlineCollapsed={collapsed}
          theme="light"
        />
      </div>
      {/* Footer: User info + Logout */}
      <div
        style={{
          width: "100%",
          padding: collapsed ? "12px 0" : "18px 16px 20px 16px",
          background: colors.lightBlue,
          borderTop: "1px solid #e0e0e0",
          textAlign: "center",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          bottom: 40
        }}
      >
        <Avatar
          size={collapsed ? 32 : 44}
          icon={<UserOutlined />}
          src={userInfo?.avatar}
          style={{ marginBottom: 8, background: colors.white, color: colors.blue, border: `2px solid ${colors.blue}` }}
        />
        {!collapsed && (
          <>
            <div style={{ fontWeight: 600, color: colors.dark, fontSize: 16 }}>{userInfo?.name || "User"}</div>
            <div style={{ fontSize: 12, color: colors.gray, marginBottom: 8 }}>{userInfo?.email}</div>
          </>
        )}
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ color: colors.blue, marginTop: 4, fontWeight: 600, fontSize: 16 }}
        >
          {!collapsed && "Đăng xuất"}
        </Button>
      </div>
    </Sider>
  );
}
