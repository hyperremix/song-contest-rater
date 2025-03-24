import { AxiosResponse } from 'axios';

export const callApi = async <T>(
  call: () => Promise<AxiosResponse<T>>,
): Promise<T> => (await call()).data;
