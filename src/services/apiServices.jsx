import axios from 'axios';

const BASE_URL = 'https://localhost:7096/api';

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

export {
    postSignin,
    postRegister
};
