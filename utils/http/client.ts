import axios from 'axios';
import { Platform } from 'react-native';
import { environment } from '../../environment';
import { auth0Client } from '../auth';

export const httpClient = axios.create({
  baseURL:
    Platform.OS === 'web' && environment.stage === 'local'
      ? 'http://localhost:8080'
      : environment.backendUrl,
});

httpClient.interceptors.request.use(async (config) => {
  const authData = await auth0Client.getValidAuthData();
  if (!authData) {
    return config;
  }

  config.headers.Authorization = authData
    ? `Bearer ${authData.accessToken}`
    : '';
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await auth0Client.logout();
    }
    return Promise.reject(error);
  },
);
