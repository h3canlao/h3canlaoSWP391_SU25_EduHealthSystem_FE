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

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={220}
      style={{
        background: colors.lightBlue,
        borderRight: "none",
        minHeight: "100vh",
        boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 64,
          padding: "0 16px",
          background: colors.lightBlue,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: 20, color: colors.blue }}
        />
        {!collapsed && (
          <span style={{ marginLeft: 12, fontWeight: 700, color: colors.blue, fontSize: 18 }}>
            EduHealth
          </span>
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        style={{
          background: "transparent",
          color: colors.dark,
          fontWeight: 600,
          fontSize: 16,
          borderRight: 0,
        }}
        items={routes}
        inlineCollapsed={collapsed}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: collapsed ? "12px 0" : "16px",
          background: colors.lightBlue,
          borderTop: "1px solid #e0e0e0",
          textAlign: "center",
        }}
      >
        <Avatar
          size={collapsed ? 32 : 40}
          icon={<UserOutlined />}
          src={userInfo?.avatar}
          style={{ marginBottom: 8 }}
        />
        {!collapsed && (
          <>
            <div style={{ fontWeight: 600 }}>{userInfo?.name || "User"}</div>
            <div style={{ fontSize: 12, color: colors.gray }}>{userInfo?.email}</div>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={onLogout}
              style={{ color: colors.gray, marginTop: 8 }}
            >
              Đăng xuất
            </Button>
          </>
        )}
      </div>
    </Sider>
  );
} 