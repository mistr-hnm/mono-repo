import axios from 'axios'

const url    = `${import.meta.env.VITE_BE_BASE_URL}`
const apiKey = `${import.meta.env.VITE_API_KEY}`

export const axiosInstance = axios.create({
    baseURL: url,
    timeout: 1000
})

axiosInstance.interceptors.request.use(
    (config) => {
        const auth = JSON.parse(localStorage.getItem("auth"));
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