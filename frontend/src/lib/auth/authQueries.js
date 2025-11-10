import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";

const authAPI = axios.create({
  baseURL: "http://localhost:8800/api/",
});

const api = axios.create({
  baseURL: "http://localhost:8800/api/",
});

export const getStoredToken = () => {
  return localStorage.getItem("token");
};

const setStoredToken = (token) => {
  if (!token) {
    localStorage.removeItem("token");
    localStorage.removeItem("isLogin");
    return;
  }
  localStorage.setItem("token", token);
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const token = getStoredToken();
      if (!token) return null;

      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return { user: res.data.user, token: token };
      } catch (error) {
        // Clear invalid token and return null
        setStoredToken(null);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await authAPI.post("/auth/login", { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      setStoredToken(data.token);
      queryClient.setQueryData(["auth"], {
        user: data.user,
        token: data.token,
      });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      setStoredToken(null);
      queryClient.setQueryData(["auth"], null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await authAPI.post("/auth/register", { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      setStoredToken(data.token);
      queryClient.setQueryData(["auth"], {
        user: data.user,
        token: data.token,
      });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token automatically
      setStoredToken(null);
      // Force a page reload to clear all cached state
      window.location.reload();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export { api };
