import { auth } from '@clerk/nextjs/server';
import axios from 'axios';
import { enviroment } from '../../environment';

export const httpClient = axios.create({
  baseURL: enviroment.public.backendUrl,
});

httpClient.interceptors.request.use(async (config) => {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) {
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
