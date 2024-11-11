import qs from 'qs';

export const parseUrlParams = <T extends { [key: string]: string | undefined }>(
  requestUrl: string,
): T | null => {
  try {
    return qs.parse(requestUrl.split('?')[1], { ignoreQueryPrefix: true }) as T;
  } catch (err) {
    console.error(err);
    return null;
  }
};
