import axios from 'axios';

// Base URL cho API Authentication
const BASE_URL = 'https://localhost:7191/api';

// ========== PARTICIPANT APIs ==========
const postCreateNewUser = async (email, password, firstName, lastName, gender) => {
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    data.append('firstName', firstName);
    data.append('lastName', lastName);
    data.append('gender', Number(gender));
    return axios.post(`${PARTICIPANT_URL}/participant`, data);
};

const putUpdateUser = async (id, username, role, image) => {
    const data = new FormData();
    data.append('id', id);
    data.append('username', username);
    data.append('role', role);
    data.append('userImage', image);
    return axios.put(`${PARTICIPANT_URL}/participant`, data);
};

const postSignin = async (email, password) => {
    return axios.post(`${BASE_URL}/Auth/login`, { email, password });
};

const postRegister = async (firstName, lastName, email, password, passwordConfirm, gender) => {
    return axios.post(`${BASE_URL}/Auth/register`, {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        gender
    });
};

const googleLogin = async (credential) => {
    return axios.post(`${BASE_URL}/Auth/google-login`, { credential });
};

const googleResponse = async () => {
    return axios.get(`${BASE_URL}/Auth/google-response`);
};

const confirmEmail = async (userId, token) => {
    return axios.get(`https://localhost:7191/api/Auth/confirm-email`, {
        params: {
            userId,
            token
        }
    });
};

const resendConfirmationEmail = async (email) => {
    return axios.post(`${BASE_URL}/Auth/resend-confirmation`, { email });
};

const getAllUsers = async (token) => {
    return axios.get(`${BASE_URL}/User`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const deleteUser = async (userId) => {
    return axios.delete(`${BASE_URL}/User/bulk`, {
        params: {
            ids: userId
        }
    });
};

const currentUsers = async (token) => {
    return axios.get(`${BASE_URL}/Auth/current-user`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const sendResetEmail = async (email) => {
    return axios.post(`${BASE_URL}/Auth/forgot-password`, { email });
};

const resetPassword = async ({ email, token, newPassword }) => {
    return axios.post(`${BASE_URL}/Auth/reset-password`, {
        email,
        token,
        newPassword
    });
};

export {
    // Participant
    postCreateNewUser,
    putUpdateUser,

    // Auth
    postSignin,
    postRegister,
    googleLogin,
    googleResponse,
    confirmEmail,
    resendConfirmationEmail,

    // User
    getAllUsers,
    deleteUser,
    currentUsers,

    // Password
    sendResetEmail,
    resetPassword
};
