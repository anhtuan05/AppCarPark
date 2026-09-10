import Cookies from 'js-cookie';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const COOKIE_OPTIONS = {
  expires: 7,
  sameSite: 'strict',
  secure: globalThis.location?.protocol === 'https:',
};

export const tokenStorage = {
  getToken: () => {
    try {
      const raw = Cookies.get(TOKEN_KEY);
      if (!raw) return null;
      return typeof raw === 'string' && raw.startsWith('{') ? JSON.parse(raw) : { access_token: raw };
    } catch {
      return null;
    }
  },

  getAccessToken: () => {
    const tokenObj = tokenStorage.getToken();
    return tokenObj?.access_token || null;
  },

  setToken: (tokenData) => {
    if (typeof tokenData === 'object') {
      Cookies.set(TOKEN_KEY, JSON.stringify(tokenData), COOKIE_OPTIONS);
    } else {
      Cookies.set(TOKEN_KEY, JSON.stringify({ access_token: tokenData }), COOKIE_OPTIONS);
    }
  },

  getUser: () => {
    try {
      const raw = Cookies.get(USER_KEY);
      if (!raw) return null;
      return typeof raw === 'string' && raw.startsWith('{') ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser: (userData) => {
    Cookies.set(USER_KEY, JSON.stringify(userData), COOKIE_OPTIONS);
  },

  clearAll: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },
};

export default tokenStorage;
