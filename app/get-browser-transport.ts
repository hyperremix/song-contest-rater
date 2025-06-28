import { Transport } from '@connectrpc/connect';
import { addStaticKeyToTransport } from '@connectrpc/connect-query';
import { createConnectTransport } from '@connectrpc/connect-web';

export const getBrowserTransport = (
  getToken: () => Promise<string | null>,
): Transport =>
  addStaticKeyToTransport(
    createConnectTransport({
      baseUrl: 'http://localhost:8080',
      interceptors: [
        (next) => async (req) => {
          const token = await getToken();
          if (token) {
            req.header.set('Authorization', `Bearer ${token}`);
          }
          return next(req);
        },
      ],
    }),
    'scr',
  );
