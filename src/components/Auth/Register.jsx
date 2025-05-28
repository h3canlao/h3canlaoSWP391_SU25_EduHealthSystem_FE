import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Register.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('student'); // 'student' or 'parent'
    const [relationship, setRelationship] = useState('');

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

        if (role === 'student' && !studentId) {
            toast.error('Student ID is required for students!');
            return;
        }

        if (role === 'parent' && !studentId) {
            toast.error('Student ID is required for parents!');
            return;
        }

        toast.success('Registration successful!');
        navigate('/');
    };

    return (
        <>
            <img className="wave-atene" src="public/wave.png" alt="Wave" />
            <div className="register-container-atene">
                <div className="img-atene">
                    <img src="public/logo.png" alt="Background" />
                </div>
                <div className="register-content-atene">
                    <form className="register-form-atene" onSubmit={handleRegister}>
                        <div className="register-form-content-atene">
                            <img src="public/avatar.svg" alt="Avatar" />
                            <h2 className="title-atene">Register</h2>

                            <div className="input-div-atene one-atene">
                                <div className="i-atene">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="div-atene">
                                    <select 
                                        className="input-atene" 
                                        value={role} 
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="student">Student</option>
                                        <option value="parent">Parent</option>
                                    </select>
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
                                        placeholder='Full Name'
                                        value={fullName} 
                                        onChange={(e) => setFullName(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div className="input-div-atene one-atene">
                                <div className="i-atene">
                                    <i className="fas fa-calendar-alt"></i>
                                </div>
                                <div className="div-atene">
                                    <input 
                                        type="date" 
                                        className="input-atene" 
                                        value={dob} 
                                        onChange={(e) => setDob(e.target.value)} 
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
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {role === 'student' && (
                                <div className="input-div-atene one-atene">
                                    <div className="i-atene">
                                        <i className="fas fa-id-card"></i>
                                    </div>
                                    <div className="div-atene">
                                        <input 
                                            type="text" 
                                            className="input-atene" 
                                            placeholder='Student ID'
                                            value={studentId} 
                                            onChange={(e) => setStudentId(e.target.value)} 
                                        />
                                    </div>
                                </div>
                            )}

                            {role === 'parent' && (
                                <div className="input-div-atene one-atene">
                                    <div className="i-atene">
                                        <i className="fas fa-child"></i>
                                    </div>
                                    <div className="div-atene">
                                        <input 
                                            type="text" 
                                            className="input-atene" 
                                            placeholder='Relationship to Student'
                                            value={relationship} 
                                            onChange={(e) => setRelationship(e.target.value)} 
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="input-div-atene one-atene">
                                <div className="i-atene">
                                    <i className="fas fa-phone"></i>
                                </div>
                                <div className="div-atene">
                                    <input 
                                        type="text" 
                                        className="input-atene" 
                                        placeholder='Phone Number'
                                        value={phone} 
                                        onChange={(e) => setPhone(e.target.value)} 
                                    />
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

                            <div className="input-div-atene pass-atene">
                                <div className="i-atene">
                                    <i className="fas fa-lock"></i>
                                </div>
                                <div className="div-atene">
                                    <input 
                                        type="password" 
                                        placeholder='Confirm Password'
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
