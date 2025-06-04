import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';
import { toast } from 'react-toastify';
import { resetPassword } from '../../../../services/apiServices';
import './ResetPassword.css';

const { Title, Text, Link } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get('email') || '');
    setToken(params.get('token') || '');
  }, []);

  const handleResetPassword = async (values) => {
    const { newPassword, confirmPassword } = values;

    if (!email || !token) {
      toast.error('Invalid reset password link!');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({ email, token, newPassword });
      console.log(response);
      toast.success('Password reset successfully! Redirecting to sign-in...');
      setTimeout(() => {
        navigate('/signin');
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred during password reset!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-bg">
      <div className="rp-card">
        <Title level={2} className="rp-title">
          Freddying
        </Title>
        <Text className="rp-welcome">
          Reset your password to continue.
        </Text>

        <Form
          form={form}
          layout="vertical"
          className="rp-form"
          onFinish={handleResetPassword}
        >

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
              { pattern: /[A-Z]/, message: 'Must contain an uppercase letter!' },
              { pattern: /[0-9]/, message: 'Must contain a number!' },
            ]}
            hasFeedback
          >
            <Input.Password
              size="large"
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="rp-btn"
            >
              Reset Password
            </Button>
          </Form.Item>

          <div className="rp-header">
            <Text type="secondary" className="rp-header-text">
              Remember your password?
            </Text>
            <Button
              type="link"
              className="rp-signin-btn"
              onClick={() => navigate('/signin')}
            >
              Sign in
            </Button>
          </div>

          <div className="rp-home">
            <Link onClick={() => navigate('/')}>← Go To Home Page</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;