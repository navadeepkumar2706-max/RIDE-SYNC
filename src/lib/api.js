// In production, VITE_API_URL must point to the separately-hosted Express
// backend (e.g. https://your-api.onrender.com/api).
// In development the Vite proxy forwards /api → http://localhost:5000/api,
// so the empty fallback keeps local dev working without any .env file.
const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // Send and receive HttpOnly cookies
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status) throw error;
    // Network or server unreachable
    const netError = new Error('Unable to connect to the RideSync server. Please check your connection.');
    netError.status = 0;
    throw netError;
  }
}

export const api = {
  auth: {
    login: (credentials) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    logout: () =>
      request('/auth/logout', { method: 'POST' }),
    getMe: () =>
      request('/auth/me'),
  },

  users: {
    updateProfile: (profileData) =>
      request('/users/me', { method: 'PATCH', body: JSON.stringify(profileData) }),
  },

  rides: {
    list: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const qs = query.toString();
      return request(`/rides${qs ? `?${qs}` : ''}`);
    },
    get: (id) =>
      request(`/rides/${id}`),
    create: (rideData) =>
      request('/rides', { method: 'POST', body: JSON.stringify(rideData) }),
    cancel: (id) =>
      request(`/rides/${id}/cancel`, { method: 'PATCH' }),
    getPublished: () =>
      request('/rides/me/published'),
  },

  bookings: {
    request: (rideId, bookingData) =>
      request(`/rides/${rideId}/bookings`, {
        method: 'POST',
        body: JSON.stringify(bookingData),
      }),
    getMyBookings: () =>
      request('/bookings/me'),
    getRideBookings: (rideId) =>
      request(`/rides/${rideId}/bookings`),
    updateStatus: (bookingId, statusData) =>
      request(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData),
      }),
    cancel: (bookingId) =>
      request(`/bookings/${bookingId}/cancel`, { method: 'PATCH' }),
  },

  notifications: {
    list: () =>
      request('/notifications'),
    markRead: (id) =>
      request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () =>
      request('/notifications/read-all', { method: 'PATCH' }),
  },

  reviews: {
    create: (reviewData) =>
      request('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
  },

  reports: {
    create: (reportData) =>
      request('/reports', { method: 'POST', body: JSON.stringify(reportData) }),
  },

  admin: {
    getStats: () =>
      request('/admin/stats'),
    getUsers: () =>
      request('/admin/users'),
    updateUserStatus: (userId, updateData) =>
      request(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      }),
    getReports: () =>
      request('/admin/reports'),
    updateReportStatus: (reportId, statusData) =>
      request(`/admin/reports/${reportId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData),
      }),
  },

  demo: {
    reseed: () =>
      request('/seed', { method: 'POST' }),
  },
};
