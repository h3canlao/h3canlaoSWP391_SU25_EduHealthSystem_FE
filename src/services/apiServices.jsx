import axios from 'axios';

const BASE_URL = 'https://localhost:7096/api';

const postSignin = async (email, password) => {
    return axios.post(`${BASE_URL}/Auth/login`, { email, password });
};

const postRegister = async (firstName, lastName, email, password, passwordConfirm, gender) => {
  return axios.post(`${BASE_URL}/Parent/register-User`, {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    gender,
  });
};

const forgetPassword = async (email) => {
    return axios.post(`${BASE_URL}/Auth/forgot-password`, { email });
};

const resetPassword = async ({ email, token, newPassword }) => {
    return axios.post(`${BASE_URL}/Auth/reset-password`, {
        email,
        token,
        newPassword
    });
};

const verifyEmail = async (userId, token) => {
    return axios.get(`${BASE_URL}/Auth/confirm-email`, {
        params: {
            userId,
            token
        }
    });
};

export {    
    postSignin,
    postRegister,
    forgetPassword,
    resetPassword,
    verifyEmail
};
