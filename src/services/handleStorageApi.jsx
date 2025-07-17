import { jwtDecode } from "jwt-decode";

// Lưu access token
export const setAccessToken = (token) => {
    localStorage.setItem('accessToken', token);
};

// Lấy access token
export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

export const getUserRole = () => {
    const token = getAccessToken();
    if (!token) return null;

    try {
        const payload = jwtDecode(token);
        // Trả về role theo định dạng chuẩn của ASP.NET Identity
        const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] 
                  || payload.role 
                  || payload.roles;
        return role;
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
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
    localStorage.removeItem('username');
};

export const setUserInfo = (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
};
export const getUserInfo = () => {
    const info = localStorage.getItem('userInfo');
    return info ? JSON.parse(info) : null;
};
