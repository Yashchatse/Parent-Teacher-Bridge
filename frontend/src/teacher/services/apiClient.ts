import axios from 'axios'
import { STORAGE_KEYS, readFromStorage } from '../storage'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  timeout: 10000,
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = readFromStorage<string | null>(STORAGE_KEYS.token, null)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log("API Request:", {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers
    })
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  }
)

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error("API Response Error:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      url: error?.config?.url,
      message: error.message
    })
    return Promise.reject(error)
  }
)

export default apiClient