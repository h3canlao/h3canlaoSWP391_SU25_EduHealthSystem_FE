import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './resetPassword.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { resetPassword } from '../../../services/apiServices';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [formState, setFormState] = useState('');
    const [formState2, setFormState2] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setEmail(params.get('email') || '');
        setToken(params.get('token') || '');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            toast.error('Password must be at least 8 characters long, include a number and an uppercase letter!');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Password confirmation does not match');
            return;
        }
        if (!email || !token) {
            toast.error('Invalid reset password link');
            return;
        }

        setLoading(true);

        try {
            let response = await resetPassword({ email, token, newPassword });
            console.log(response)
            toast.success('Password reset successfully!');
            setFormState('rp-form-change');
            setFormState2('rp-form-content-change');
            setTimeout(() => {
                navigate('/signin');
            }, 1000);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleBackToSignin = () => {
        setFormState('rp-form-change');
        setFormState2('rp-form-content-change');
        setTimeout(() => {
            navigate('/signin');
        }, 1000);
    };

    return (
        <>
            <img className="rp-wave" src="/wave.png" alt="Wave" />
            <div className="rp-container">
                <div className="rp-img">
                    <img src="/logo.png" alt="Background" />
                </div>
                <div className="rp-content">
                    <form className={`rp-form ${formState}`} onSubmit={handleSubmit}>
                        <div className={`rp-form-content ${formState2}`}>
                            <img src="/avatar.svg" alt="Avatar" />
                            <h2 className="rp-title">Reset Password</h2>
                            <div className="rp-input-div one">
                                <div className="rp-i">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="rp-div">
                                    <input
                                        type="text"
                                        className="rp-input"
                                        placeholder="Email"
                                        value={email}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="rp-input-div pass">
                                <div className="rp-i">
                                    <i className="fas fa-lock"></i>
                                </div>
                                <div className="rp-div">
                                    <input
                                        type="password"
                                        className="rp-input"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="rp-input-div confirm-pass">
                                <div className="rp-i">
                                    <i className="fas fa-lock"></i>
                                </div>
                                <div className="rp-div">
                                    <input
                                        type="password"
                                        className="rp-input"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="rp-action-link">
                                <a onClick={handleBackToSignin} href="#">Back to Sign In</a>
                            </div>
                            <input
                                type="submit"
                                className="rp-btn"
                                value={loading ? 'Processing...' : 'Reset Password'}
                                disabled={loading}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;