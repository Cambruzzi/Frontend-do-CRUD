import axios from 'axios';
const api = axios.create({
    baseURL: 'https://leocambruzzi.pythonanywhere.com/api/', 
    timeout: 10000,
    });
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default api;