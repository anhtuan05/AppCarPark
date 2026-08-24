import Cookies from 'js-cookie';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

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
      Cookies.set(TOKEN_KEY, JSON.stringify(tokenData), { expires: 7, sameSite: 'lax' });
    } else {
      Cookies.set(TOKEN_KEY, JSON.stringify({ access_token: tokenData }), { expires: 7, sameSite: 'lax' });
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
    Cookies.set(USER_KEY, JSON.stringify(userData), { expires: 7, sameSite: 'lax' });
  },

  clearAll: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },
};

export default tokenStorage;
