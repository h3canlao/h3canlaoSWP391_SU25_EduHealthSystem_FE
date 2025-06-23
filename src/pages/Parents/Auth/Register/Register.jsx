import React, { useState } from "react";
import { Form, Input, Button, Select, Typography, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { postRegister } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import "./Register.css";

const { Title, Text, Link } = Typography;
const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
  const { firstName, lastName, email, password, confirmPassword, gender } = values;

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast.error('Invalid email!');
    return;
  }

  // Validate password
  if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    toast.error('Password must be at least 8 characters long, include a number and an uppercase letter!');
    return;
  }

  if (password !== confirmPassword) {
    toast.error('Passwords do not match!');
    return;
  }

  try {
    let res = await postRegister(firstName, lastName, email, password, confirmPassword, Number(gender));
    console.log(res);
    toast.success('Registration successful! Please check your email to confirm.');
    navigate('/signin');
  } catch (error) {
    toast.error(error.res?.data?.message || 'An error occurred during registration!');
  }
};

  return (
    <div className="register-bg">
      <div className="register-card">
        <Title level={2} className="register-title">
          SchoolHealth
        </Title>
        <Text className="register-welcome">
          Welcome! Please enter your details to register.
        </Text>

        <Form
          form={form}
          layout="vertical"
          className="register-form"
          onFinish={handleRegister}
          initialValues={{ gender: 0 }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: "Please input your first name!" },
                ]}
              >
                <Input size="large" placeholder="Enter your first name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: "Please input your last name!" },
                ]}
              >
                <Input size="large" placeholder="Enter your last name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Invalid email address!" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Select size="large">
                  <Option value={2}>Other</Option>
                  <Option value={0}>Male</Option>
                  <Option value={1}>Female</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters!",
                  },
                  {
                    pattern: /[A-Z]/,
                    message: "Must contain an uppercase letter!",
                  },
                  { pattern: /[0-9]/, message: "Must contain a number!" },
                ]}
                hasFeedback
              >
                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="register-btn"
            >
              Register
            </Button>
          </Form.Item>

          <div className="register-header">
            <Text type="secondary" className="register-header-text">
              Already have an account?
            </Text>
            <Button
              type="link"
              className="register-signin-btn"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </Button>
          </div>

          <div className="register-home">
            <Link onClick={() => navigate("/")}>&larr; Go To Home Page</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
