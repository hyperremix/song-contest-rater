export type TLibraryImageExtension = 'png' | 'jpg' | 'jpeg' | 'gif';

export const extensionMimes: Record<TLibraryImageExtension, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
};

export const mimeToExtension = (mime: string): string => mime.split('/')[1];
