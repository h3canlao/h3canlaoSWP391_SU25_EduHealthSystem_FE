import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';
import { toast } from 'react-toastify';
import { forgetPassword } from '../../../../../services/apiServices';
import './forgetPassword.css';

const { Title, Text, Link } = Typography;

const ForgetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleForgetPassword = async (values) => {
    const { email } = values;

    setLoading(true);
    try {
      const res = await forgetPassword(email);
      console.log(res);
      toast.success('If the email is valid, you will receive reset instructions.');
      setTimeout(() => {
        navigate('/signin');
      }, 1000);
    } catch (error) {
      toast.error(error.res?.data?.message || 'An error occurred while sending the reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-bg">
      <div className="fp-card">
        <Title level={2} className="fp-title">
          SchoolHealth
        </Title>
        <Text className="fp-welcome">
          Enter your email to receive a password reset link.
        </Text>

        <Form
          form={form}
          layout="vertical"
          className="fp-form"
          onFinish={handleForgetPassword}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Invalid email address!' },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="fp-btn"
            >
              Send Reset Link
            </Button>
          </Form.Item>

          <div className="fp-header">
            <Text type="secondary" className="fp-header-text">
              Remember your password?
            </Text>
            <Button
              type="link"
              className="fp-signin-btn"
              onClick={() => navigate('/signin')}
            >
              Sign in
            </Button>
          </div>

          <div className="fp-home">
            <Link onClick={() => navigate('/')}>← Go To Home Page</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgetPassword;