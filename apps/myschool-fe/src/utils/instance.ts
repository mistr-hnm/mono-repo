import axios from 'axios';

const url = `${import.meta.env.VITE_BE_BASE_URL}/api`;
const apiKey = `${import.meta.env.VITE_API_KEY}`;

export const axiosInstance = axios.create({
    baseURL: url,
    timeout: 1000,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = "test"
        if (token) {
            
            config.headers['Authorization'] = 'Bearer ' + token
            config.headers['apiKey'] = apiKey
        }
        return config;
    },
    (error) => {
        Promise.reject(error)
    }
)