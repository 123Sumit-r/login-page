const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

async function request(path, options = {}) {
  const token = localStorage.getItem('skovia_access_token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed.');
  return data;
}

const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });

export const authApi = {
  register: (data) => post('/api/auth/register', data),
  verifyOtp: (data) => post('/api/auth/verify-otp', data),
  resendOtp: (data) => post('/api/auth/resend-otp', data),
  login: (data) => post('/api/auth/login', data),
  forgotPassword: (data) => post('/api/auth/forgot-password', data),
  resetPassword: (data) => post('/api/auth/reset-password', data),
  getCurrentUser: () => request('/api/user/me'),
  updateProfile: (data) => request('/api/user/me', { method: 'PUT', body: JSON.stringify(data) })
};