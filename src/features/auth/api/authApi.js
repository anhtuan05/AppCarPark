import axiosClient, { authApi } from '../../../shared/api/axiosClient';
import { endpoints } from '../../../shared/api/endpoints';
import tokenStorage from '../../../shared/api/tokenStorage';
import { authTokenSchema, parseResponse, userSchema } from '../../../shared/api/contracts';

const OAUTH_CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = import.meta.env.VITE_OAUTH_CLIENT_SECRET;

export const authService = {
  login: async (username, password) => {
    if (!OAUTH_CLIENT_ID) {
      const configurationError = new Error('VITE_OAUTH_CLIENT_ID is not configured.');
      configurationError.code = 'AUTH_CONFIG_MISSING';
      throw configurationError;
    }

    const formData = new FormData();
    formData.append('client_id', OAUTH_CLIENT_ID);
    if (OAUTH_CLIENT_SECRET) {
      formData.append('client_secret', OAUTH_CLIENT_SECRET);
    }
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    const res = await axiosClient.post(endpoints.oauthToken, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.data) {
      const token = parseResponse(authTokenSchema, res.data, 'authToken');
      tokenStorage.setToken(token);
      // Fetch user profile immediately
      const userRes = await authApi(token.access_token).get(endpoints.currentUser);
      const user = parseResponse(userSchema, userRes.data, 'currentUser');
      tokenStorage.setUser(user);
      return { token, user };
    }
    return res.data;
  },

  loginWithFace: async (faceDescription) => {
    const formData = new FormData();
    formData.append('face_description', faceDescription);

    const res = await axiosClient.post(endpoints.faceLogin, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.data?.access_token) {
      const token = parseResponse(authTokenSchema, res.data, 'faceAuthToken');
      tokenStorage.setToken(token);
      const userRes = await authApi(token.access_token).get(endpoints.currentUser);
      const user = parseResponse(userSchema, userRes.data, 'currentUser');
      tokenStorage.setUser(user);
      return { token, user };
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

    const res = await axiosClient.post(endpoints.users, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return parseResponse(userSchema, res.data, 'registeredUser');
  },

  getCurrentUser: async () => {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;
    const res = await axiosClient.get(endpoints.currentUser);
    const user = parseResponse(userSchema, res.data, 'currentUser');
    tokenStorage.setUser(user);
    return user;
  },

  updateProfile: async (profileData) => {
    const res = await axiosClient.put(endpoints.userProfile, profileData);
    const user = parseResponse(userSchema, res.data, 'updatedUser');
    tokenStorage.setUser(user);
    return user;
  },

  logout: () => {
    tokenStorage.clearAll();
  },
};

export default authService;
