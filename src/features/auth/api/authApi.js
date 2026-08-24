import axiosClient, { authApi } from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';
import tokenStorage from '../../../shared/api/tokenStorage';

const OAUTH_CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID || 'PgaDmKIxd4QitVu6uHji0B7UQ4LQVIcOTpahc4Vp';
const OAUTH_CLIENT_SECRET = import.meta.env.VITE_OAUTH_CLIENT_SECRET || 'Kol1igvmGhxYPLjdafUJG923Bo9zNgBremaIvTlIwoPRpGSoA6LHNvphph62ggUfEyLjUyg68N2DfZxbERdd5TexbN5Ef4ClRFVpDtdfa5ExsR8DBNRDH6LD0TIWDqJR';

export const authService = {
  login: async (username, password) => {
    const formData = new FormData();
    formData.append('client_id', OAUTH_CLIENT_ID);
    formData.append('client_secret', OAUTH_CLIENT_SECRET);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    const res = await axiosClient.post(endpoints.login, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.data) {
      tokenStorage.setToken(res.data);
      // Fetch user profile immediately
      const userRes = await authApi(res.data.access_token).get(endpoints.currentUser);
      tokenStorage.setUser(userRes.data);
      return { token: res.data, user: userRes.data };
    }
    return res.data;
  },

  loginWithFace: async (faceDescription) => {
    const formData = new FormData();
    formData.append('face_description', faceDescription);

    const res = await axiosClient.post(endpoints.faceRecognition, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.data?.access_token) {
      tokenStorage.setToken(res.data);
      const userRes = await authApi(res.data.access_token).get(endpoints.currentUser);
      tokenStorage.setUser(userRes.data);
      return { token: res.data, user: userRes.data };
    }
    return res.data;
  },

  register: async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (userData[key] !== undefined && userData[key] !== null) {
        formData.append(key, userData[key]);
      }
    });

    return axiosClient.post(endpoints.register, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getCurrentUser: async () => {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;
    const res = await axiosClient.get(endpoints.currentUser);
    tokenStorage.setUser(res.data);
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await axiosClient.put(endpoints.putUser, profileData);
    tokenStorage.setUser(res.data);
    return res.data;
  },

  logout: () => {
    tokenStorage.clearAll();
  },
};

export default authService;
