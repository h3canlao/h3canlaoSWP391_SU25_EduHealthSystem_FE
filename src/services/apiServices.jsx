import axios from 'axios';

const BASE_URL = 'https://localhost:7096/api';

const postSignin = async (email, password) => {
    return axios.post(`${BASE_URL}/Auth/login`, { email, password });
};

const postRegister = async (firstName, lastName, email, password, passwordConfirm, gender) => {
  return axios.post(`https://localhost:7096/parent/registerUser`, {
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

export {
    postSignin,
    postRegister,
    forgetPassword,
    resetPassword
};
