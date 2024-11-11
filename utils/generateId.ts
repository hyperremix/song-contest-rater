const hex = (value: number): string => (value | 0).toString(16).toLowerCase();

const randomHexString = (length: number) =>
  Array(length)
    .fill('')
    .map(() => hex(Math.random() * 16))
    .join('');

export const generateId = (): string =>
  hex(Date.now() / 1000) + randomHexString(16);
