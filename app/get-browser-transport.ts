import { Transport } from '@connectrpc/connect';
import { addStaticKeyToTransport } from '@connectrpc/connect-query';
import { createConnectTransport } from '@connectrpc/connect-web';

let browserTransport: Transport | undefined = undefined;

export const getBrowserTransport = (): Transport => {
  if (!browserTransport)
    browserTransport = addStaticKeyToTransport(
      createConnectTransport({
        baseUrl: 'http://localhost:8080',
      }),
      'scr',
    );
  return browserTransport;
};
