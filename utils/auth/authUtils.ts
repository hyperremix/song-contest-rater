import dayjs from 'dayjs';
import { buildQueryParams } from '../url';
import { TAuthData } from './TAuthData';

const getQueryParams = (
  clientId: string,
  audience: string,
  websiteUrl: string,
) =>
  buildQueryParams({
    response_type: 'code',
    scope: 'openid email offline_access',
    client_id: clientId,
    redirect_uri: websiteUrl,
    audience,
  });

export const getLoginUrl = (
  auth0Domain: string,
  clientId: string,
  audience: string,
  websiteUrl: string,
) =>
  `${auth0Domain}/authorize${getQueryParams(clientId, audience, websiteUrl)}`;

export const getLogoutUrl = (
  auth0Domain: string,
  clientId: string,
  audience: string,
  websiteUrl: string,
) => `${auth0Domain}/logout${getQueryParams(clientId, audience, websiteUrl)}`;

export const isTokenValid = (authData: TAuthData): boolean =>
  !authData ? false : dayjs(authData.expiresOn).isAfter(dayjs());

export const isCallToWebsite = (websiteUrl: string, url: string) =>
  url.startsWith(websiteUrl);
