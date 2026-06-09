import axios from 'axios';

/**
 * Instância global do Axios.
 * A baseURL agora aponta para a variável de ambiente. 
 */
const api = axios.create({
  baseURL: `${import.meta.env.VITE_URL_BACKEND}/api/`,
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