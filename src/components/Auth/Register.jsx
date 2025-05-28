import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postRegister } from '../../services/apiServices';
import './Register.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

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
            const res = await postRegister(firstName, lastName, email, password, confirmPassword, Number(gender));
            console.log(res);
            if (res.data.isSuccess) {
            toast.success('Registration successful! Please check your email to confirm.');
            navigate('/signin');
            } else {
            toast.error(res.data.EM || 'Registration failed!');
            }
        } catch (error) {
            toast.error('An error occurred during registration.');
            console.error(error);
        }
    }

    return (
        <>
            <img className="wave-atene" src="/wave.png" alt="Wave" />
            <div className="register-container-atene">
                <div className="img-atene">
                    <img src="/logo.png" alt="Background" />
                </div>
                <div className="register-content-atene">
                    <form className="register-form-atene" onSubmit={handleRegister}>
                        <div className="register-form-content-atene">
                            <img src="/avatar.svg" alt="Avatar" />
                            <h2 className="title-atene">Register</h2>

                            <div className="input-div-atene one-atene">
                                <div className="i-atene">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="div-atene">
                                    <input
                                        type="text"
                                        className="input-atene"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="input-div-atene one-atene">
                                <div className="i-atene">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="div-atene">
                                    <input
                                        type="text"
                                        className="input-atene"
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="input-div-atene one-atene">
                                <div className="i-atene">
                                    <i className="fas fa-venus-mars"></i>
                                </div>
                                <div className="div-atene">
                                    <select
                                        className="input-atene"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="0">Other</option>
                                        <option value="1">Male</option>
                                        <option value="2">Female</option>

                                    </select>
                                </div>
                            </div>

                            <div className="input-div-atene one-atene">
                                <div className="i-atene">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div className="div-atene">
                                    <input
                                        type="email"
                                        className="input-atene"
                                        placeholder="Email"
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
                                        placeholder="Password"
                                        className="input-atene"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                        placeholder="Confirm Password"
                                        className="input-atene"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <input type="submit" className="register-btn-atene" value="Register" />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
export default Register;
