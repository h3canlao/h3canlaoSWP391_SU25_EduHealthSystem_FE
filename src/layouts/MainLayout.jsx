import React from "react";
import { Layout } from "antd";
import { colors } from "@/theme/colors";

const { Sider, Header, Content, Footer } = Layout;

export default function MainLayout({ children, sidebar }) {
  return (
    <Layout style={{ minHeight: "100vh", background: colors.lightGray }}>
      <Sider
        width={220}
        style={{ background: colors.lightBlue, borderRight: "none" }}
        breakpoint="lg"
        collapsedWidth={64}
      >
        {sidebar}
      </Sider>
      <Layout>
        <Header
          style={{
            background: colors.white,
            color: colors.dark,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            height: 64,
            boxShadow: "0 2px 8px #f0f1f2",
            zIndex: 10,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 20, color: colors.blue }}>
            EduHealth System
          </div>
          {/* Có thể thêm avatar, thông báo, logout ở đây */}
        </Header>
        <Content
          style={{
            margin: 0,
            padding: 24,
            background: colors.lightGray,
            minHeight: "calc(100vh - 64px - 50px)",
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            background: colors.white,
            textAlign: "center",
            color: colors.gray,
            fontSize: 14,
            minHeight: 50,
          }}
        >
          © {new Date().getFullYear()} EduHealth. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
} 