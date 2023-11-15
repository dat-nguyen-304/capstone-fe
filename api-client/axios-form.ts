import axios, { AxiosError, AxiosResponse } from 'axios';

const axiosFormData = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

// Add a response interceptor
axiosFormData.interceptors.response.use(
    function (response: AxiosResponse) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error: AxiosError) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        // 401, 403, 500
        return Promise.reject(error.response?.data); // should be error response body
    }
);

export default axiosFormData;
