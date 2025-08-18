import axios, { AxiosError } from 'axios';
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  headers: {'Content-Type': 'application/json'},
  // timeout: 10000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const apiKey = process.env.NEXT_PUBLIC_API_KEY ;
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// // Response interceptor - handle errors
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     console.error('API Error:', error.response?.status, error.message);

//     switch (error.response?.status) {
//       case 401:
//         // Unauthorized - clear storage and redirect
//         if (typeof window !== 'undefined') {
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           window.location.href = '/login';
//         }
//         break;
//       case 403:
//         console.error('Access forbidden');
//         break;
//       case 500:
//         console.error('Server error');
//         break;
//     }

//     return Promise.reject(error);
//   }
// );

export { apiClient };