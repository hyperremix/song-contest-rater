import { AxiosError } from 'axios';
import { translations } from '../../i18n';

export class HttpError extends Error {
  status: number;
  title: string;
  message: string;
  cause?: string;

  constructor(status: number, title: string, message: string, cause?: string) {
    super(message);
    this.status = status;
    this.title = title;
    this.message = message;
    this.cause = cause;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export const toHttpError = (error: unknown): HttpError => {
  if (error instanceof AxiosError && !!error.response?.status) {
    const status = error.response.status;
    return new HttpError(
      status,
      `error.${status}.title`,
      `error.${status}.message`,
      error.response.data.message,
    );
  }

  return new HttpError(
    500,
    translations.error.default.title,
    translations.error.default.message,
  );
};
