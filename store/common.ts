import { THttpError, toHttpError } from '../utils/http';

export type TCallApiOptions<T> = {
  onPreCall?: () => void;
  call: () => Promise<T>;
  onSuccess?: (result: T) => void;
  onError?: (error: THttpError) => void;
  onFinally?: () => void;
};

export const callApi = async <T>({
  onPreCall,
  call,
  onSuccess,
  onError,
  onFinally,
}: TCallApiOptions<T>): Promise<void> => {
  try {
    onPreCall && onPreCall();
    const result = await call();
    onSuccess && onSuccess(result);
  } catch (error: unknown) {
    onError && onError(toHttpError(error));
  } finally {
    onFinally && onFinally();
  }
};
