import { translations } from '@/i18n';
import axios from 'axios';

export function useErrorTranslation(error: Error): {
  titleKey: string;
  messageKey: string;
  status: 401 | 403 | 404 | 500;
} {
  const status = getStatusCode(error);
  return {
    titleKey: translations.error[status].title,
    messageKey: translations.error[status].message,
    status,
  };
}

const getStatusCode = (error: Error): 401 | 403 | 404 | 500 => {
  if (
    axios.isAxiosError(error) &&
    error.response &&
    (error.response.status === 401 ||
      error.response.status === 403 ||
      error.response.status === 404)
  ) {
    return error.response.status;
  }

  if (error.message) {
    const message = error.message.toLowerCase();
    if (message.includes('401')) {
      return 401;
    }
    if (message.includes('403')) {
      return 403;
    }
    if (message.includes('404')) {
      return 404;
    }
  }

  return 500;
};
