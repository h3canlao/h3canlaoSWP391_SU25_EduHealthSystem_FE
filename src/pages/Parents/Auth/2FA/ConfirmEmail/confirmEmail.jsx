import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { verifyEmail } from '../../../../../services/apiServices';
import { Typography, Button } from 'antd';
import './confirmEmail.css'; // File CSS mới để style

const { Title, Text } = Typography;

const confirmEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const handleConfirmEmail = async () => {
            const search = location.search; // Lấy nguyên ?userId=...&token=...

            // Tự parse userId và token thủ công từ URL
            const userIdMatch = search.match(/userId=([^&]*)/);
            const tokenMatch = search.match(/token=([^&]*)/);

            const userId = userIdMatch ? userIdMatch[1] : null;
            const token = tokenMatch ? tokenMatch[1] : null;

            console.log('userId:', userId);
            console.log('token:', token); // Token giữ nguyên %2F %2B %3D

            if (!userId || !token) {
                setStatus('error');
                toast.error('Invalid confirmation link!');
                return;
            }

            try {
                const decodedToken = decodeURIComponent(token); // Giải mã token
                console.log('Decoded token:', decodedToken); // Token đã được giải mã
                const res = await verifyEmail(userId, decodedToken); 
                console.log(res);// Gửi userId và token đã decode

                if (res.status === 204 || res.data.success==true) {
                    setStatus('success');
                    toast.success('Email confirmed successfully!');
                    navigate('/signin'); // Chuyển về trang login
                } else {
                    setStatus('error');
                    toast.error('Email confirmation failed.');
                }
            } catch (err) {
                console.error('Confirm email error:', err);
                setStatus('error');
                toast.error('An error occurred during email confirmation.');
            }
        };

        handleConfirmEmail();
    }, [location.search, navigate]);

    return (
        <div className="confirm-email-container">
            <div className="confirm-email-split">
                {/* Phần nội dung xác nhận email */}
                <div className="confirm-email-card">
                    <Title level={2} className="confirm-email-title">
                        SchoolHealth
                    </Title>
                    {status === 'loading' && (
                        <div>
                            <Title level={3} className="confirm-email-status">
                                Confirming your email...
                            </Title>
                            <Text className="confirm-email-text">
                                Please wait a moment.
                            </Text>
                        </div>
                    )}
                    {status === 'success' && (
                        <div>
                            <Title level={3} className="confirm-email-status">
                                Email Confirmed ✅
                            </Title>
                            <Text className="confirm-email-text">
                                Your email has been successfully confirmed.
                            </Text>
                            <Button
                                type="primary"
                                size="large"
                                block
                                className="confirm-email-btn mt-3"
                                onClick={() => navigate('/signin')}
                            >
                                Go to Sign in
                            </Button>
                        </div>
                    )}
                    {status === 'error' && (
                        <div>
                            <Title level={3} className="confirm-email-status">
                                Confirmation Failed ❌
                            </Title>
                            <Text className="confirm-email-text">
                                The confirmation link is invalid or has expired.
                            </Text>
                            <Button
                                type="primary"
                                size="large"
                                block
                                className="confirm-email-btn mt-3"
                                onClick={() => navigate('/')}
                            >
                                Back to Home
                            </Button>
                        </div>
                    )}
                </div>

                {/* Phần hình ảnh */}
                <div className="confirm-email-image">
                    <img
                        src="public/StudentHealth.webp"
                        alt="Soccer Player"
                        className="confirm-email-player-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default confirmEmail;