import React, { useState } from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { postSignin, currentUsers } from "@/services/apiServices";
import {  setUserInfo, setAccessToken } from '../../../../services/handleStorageApi';
import "./Signin.css";
import { getUserRole } from "@/services/handleStorageApi";

import "antd/dist/reset.css";

const { Title, Text, Link } = Typography;

export default function Signin() {
  // Đã loại bỏ state email, password
  const navigate = useNavigate();


  // Hàm xử lý đăng nhập
  const handleSignin = async (values) => {
    const { email, password } = values;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email!");
      return;
    }

    // Validate password
    if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      toast.error("Password must be at least 8 characters long, include a number and an uppercase letter!");
      return;
    }

    try {
      let res = await postSignin(email, password);
      console.log(res);
      const token = res.data.data.accessToken;
      console.log(token)
      setAccessToken(token);
      if (res.data.isSuccess === true) {
        const currentUser = await currentUsers();
        if (currentUser.data.isSuccess) {
            setUserInfo(currentUser.data.data);
        }
        // Lấy lại role từ token mới
        const newRole = getUserRole();
        console.log("Role:", newRole);
        toast.success('Login successfully.');
        // Điều hướng theo role
        if (newRole === "Parent") navigate("/parents");
        else if (newRole === "Admin") navigate("/admin");
        else if (newRole === "SchoolNurse") navigate("/nurse");
        else navigate("/");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'An error occurred during registration!';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-split">
        {/* Phần form đăng nhập */}
        <div className="signin-card">
          <Title level={2} className="signin-title">
            SchoolHealth
          </Title>
          <Text className="signin-welcome">
            Welcome back! Please enter your details.
          </Text>

          <Form layout="vertical" onFinish={handleSignin} className="signin-form">
            {/* Email Input Field */}
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: "email", message: "Please enter your email!" }]}
            >
              <Input
                size="large"
                autoComplete="email"
                placeholder="Enter your email"
              />
            </Form.Item>

            {/* Password Input Field */}
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password
                className="fix-input-pw"
                size="large"
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </Form.Item>


            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="signin-btn"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {/* Sign Up Link */}
          <div className="signin-header">
            <Text type="secondary" className="signin-header-text">
              Forget Password?
            </Text>
            <Button
              type="link"
              className="signin-signup-btn"
              onClick={() => navigate("/forget-password")}
            >
              Change Password
            </Button>
          </div>

          {/* Divider */}
          <Divider plain>Or</Divider>

          {/* Back to Home Page Link */}
          <div className="signin-home">
            <Link onClick={() => navigate("/")}>← Go To Home Page</Link>
          </div>
        </div>

        {/* Phần hình ảnh */}
        <div className="signin-image">
          <img
            src="public/EduHealth.webp"
            alt="Soccer Player"
            className="signin-player-image"
          />
        </div>
      </div>
    </div>
  );
}