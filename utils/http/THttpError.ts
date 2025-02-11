import { AxiosError } from 'axios';
import { translations } from '../../i18n';

export type THttpError = {
  status: number;
  title: string;
  message: string;
  cause?: string;
};

export const toHttpError = (error: unknown): THttpError => {
  if (error instanceof AxiosError && !!error.response?.status) {
    const status = error.response.status;
    return {
      status,
      title: `error.${status}.title`,
      message: `error.${status}.message`,
      cause: error.response.data.message,
    };
  }

  return {
    status: 500,
    title: translations.error.default.title,
    message: translations.error.default.message,
  };
};
