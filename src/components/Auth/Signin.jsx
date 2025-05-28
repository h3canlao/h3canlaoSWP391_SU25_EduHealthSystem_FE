import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Signin.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Signin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formState, setFormState] = useState(''); 
    const [formState2, setFormState2] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Invalid email!');
            return;
        }

        // Validate password
        if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            toast.error('Password must be at least 8 characters long, include a number and an uppercase letter!');
            return;
        }
        navigate('/');
    };

    const handleForgotPasswordClick = () => {
        setFormState('login-form-change-atene'); 
        setFormState2('login-form-content-change-atene');
        setTimeout(() => {
            navigate('/register'); 
        }, 1000); 
    };

    return (
        <>
            <img className="wave-atene" src="public/wave.png" alt="Wave"/>
            <div className="login-container-atene">
                <div className="img-atene">
                    <img src="public/logo.png" alt="Background" />
                </div>
                <div className="login-content-atene">
                    <form className={`login-form-atene ${formState}`} onSubmit={handleLogin}>
                        <div className={`login-form-content-atene ${formState2}`}>
                            <img src="public/avatar.svg" alt="Avatar" />
                            <h2 className="title-atene">Welcome</h2>
                            <div className="input-div-atene one-atene">
                                <div className="i-atene">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="div-atene">
                                    <input 
                                        type="text" 
                                        className="input-atene" 
                                        placeholder='Email'
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="input-div-atene pass-atene">
                                <div className="i-atene"> 
                                    <i className="fas fa-lock"></i>
                                </div>
                                <div className="div-atene">
                                    <input 
                                        type="password" 
                                        placeholder='Password'
                                        className="input-atene" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className='action-link-atene'>
                                <a onClick={handleForgotPasswordClick} href="#">Need Account?</a>
                                <a onClick={handleForgotPasswordClick} href="#">Forgot Password?</a>
                            </div>

                            <input type="submit" className="login-btn-atene" value="Login" />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Signin;
