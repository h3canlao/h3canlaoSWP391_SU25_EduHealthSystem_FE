import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './forgetPassword.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { forgetPassword } from '../../../services/apiServices';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [formState, setFormState] = useState('');
    const [formState2, setFormState2] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email.');
            return;
        }

        try {
            let response = await forgetPassword(email);
            console.log(response)
                toast.success('If the email is valid, you will receive reset instructions.');
                setFormState('fp-form-change');
                setFormState2('fp-form-content-change');
                setTimeout(() => {
                    navigate('/signin');
                }, 1000);
        } catch (error) {
        toast.error(error.response.data.message);
        }
    };
    


    const handleBackToSignin = () => {
        setFormState('fp-form-change');
        setFormState2('fp-form-content-change');
        setTimeout(() => {
            navigate('/signin');
        }, 1000);
    };

    return (
        <>
            <img className="fp-wave" src="/wave.png" alt="Wave" />
            <div className="fp-container">
                <div className="fp-img">
                    <img src="/logo.png" alt="Background" />
                </div>
                <div className="fp-content">
                    <form className={`fp-form ${formState}`} onSubmit={handleResetPassword}>
                        <div className={`fp-form-content ${formState2}`}>
                            <img src="/avatar.svg" alt="Avatar" />
                            <h2 className="fp-title">Forgot Password</h2>
                            <div className="fp-input-div one">
                                <div className="fp-i">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="fp-div">
                                    <input
                                        type="text"
                                        className="fp-input"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="fp-action-link">
                                <a onClick={handleBackToSignin} href="#">Back to Sign In</a>
                            </div>
                            <input type="submit" className="fp-btn" value="Send Reset Link" />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgetPassword;