import { auth } from '@clerk/nextjs/server';
import { Transport } from '@connectrpc/connect';
import { addStaticKeyToTransport } from '@connectrpc/connect-query';
import { createConnectTransport } from '@connectrpc/connect-web';

export const getServerTransport = async (): Promise<Transport> => {
  const { getToken } = await auth();
  const token = await getToken();

  return addStaticKeyToTransport(
    createConnectTransport({
      baseUrl: 'http://localhost:8080',
      interceptors: [
        (next) => (req) => {
          if (token) {
            req.header.set('Authorization', `Bearer ${token}`);
          }
          return next(req);
        },
      ],
    }),
    'scr',
  );
};
