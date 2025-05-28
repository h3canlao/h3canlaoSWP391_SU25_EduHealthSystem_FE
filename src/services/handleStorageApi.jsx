export const setAccessToken = (token) => {
    localStorage.setItem('accessToken', token);
};

export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

export const setUserName = (name) => {
    localStorage.setItem('username', name);
};

export const getUserName = () => {
    return localStorage.getItem('username');
};

export const logoutUser = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
};

export const setUserInfo = (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

export const getUserInfo = () => {
    const info = localStorage.getItem('userInfo');
    return info ? JSON.parse(info) : null;
};