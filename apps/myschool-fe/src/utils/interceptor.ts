import axios from 'axios'
import { toast } from 'sonner'

const url = `${import.meta.env.VITE_BE_BASE_URL}`
const apiKey = `${import.meta.env.VITE_API_KEY}`

export const axiosInstance = axios.create({
    baseURL: url,
    timeout: 5000
})

axiosInstance.interceptors.request.use(
    (config) => {
        const auth = JSON.parse(localStorage.getItem("auth") as string);
        if (auth && auth?.token) {
            config.headers['Authorization'] = 'Bearer ' + auth.token
        }
        config.headers['myschool-signature'] = apiKey
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("interceptor error",error);
        if (error?.response?.status === 401) {
            toast.error("Authentication failed.")
            localStorage.removeItem("auth");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        }
        return Promise.reject(error);
    }
)