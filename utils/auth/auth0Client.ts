import { AxiosRequestConfig } from 'axios';
import * as AuthSession from 'expo-auth-session';
import { firstValueFrom, take } from 'rxjs';
import { environment } from '../../environment';
import { generateId } from '../generateId';
import { authStorage, tokensSubject } from './authStorage';
import { isTokenValid } from './authUtils';
import { mapTokenResponse } from './mapTokenResponse';
import { TAuthData } from './TAuthData';

const discovery = {
  authorizationEndpoint: `https://${environment.auth0Domain}/authorize`,
  tokenEndpoint: `https://${environment.auth0Domain}/oauth/token`,
  revocationEndpoint: `https://${environment.auth0Domain}/oauth/revoke`,
};
const redirectUri = AuthSession.makeRedirectUri();

export class Auth0Client {
  constructor(
    private auth0Domain: string,
    private auth0ClientId: string,
  ) {}

  public authorize = async (): Promise<TAuthData | null> => {
    const request = new AuthSession.AuthRequest({
      redirectUri,
      clientId: this.auth0ClientId,
      responseType: AuthSession.ResponseType.Code,
      prompt: AuthSession.Prompt.Login,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      extraParams: {
        nonce: generateId(),
      },
      usePKCE: true,
    });

    const authorizeResult = await request.promptAsync(discovery);

    if (authorizeResult.type !== 'success') {
      throw new Error('Authorization result is not success');
    }

    const authData = await AuthSession.exchangeCodeAsync(
      {
        code: authorizeResult.params.code,
        clientId: this.auth0ClientId,
        redirectUri,
        extraParams: {
          code_verifier: request.codeVerifier ?? '',
        },
      },
      discovery,
    ).then(mapTokenResponse);

    if (!authData) {
      throw new Error('Auth data is null');
    }

    await authStorage.storeAuthData(authData);

    return authData;
  };

  public refreshToken = async (
    refreshToken: string,
  ): Promise<TAuthData | null> => {
    const discovery = await AuthSession.fetchDiscoveryAsync(this.auth0Domain);

    const authData = await AuthSession.refreshAsync(
      {
        clientId: this.auth0ClientId,
        refreshToken,
      },
      discovery,
    ).then(mapTokenResponse);

    if (!authData) {
      throw new Error('Auth data is null');
    }

    await authStorage.storeAuthData(authData);

    return authData;
  };

  public authRequestInterceptor = async (
    config: AxiosRequestConfig,
  ): Promise<AxiosRequestConfig> => {
    let authData = await this.getValidAuthData();

    if (!authData?.accessToken) {
      return config;
    }

    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${authData.accessToken}`,
      },
    };
  };

  public getValidAuthData = async (): Promise<TAuthData | null> => {
    let authData: TAuthData | null = await firstValueFrom(
      tokensSubject.pipe(take(1)),
    );
    if (!authData) {
      return null;
    }

    const isValid = isTokenValid(authData);

    if (authData.refreshToken && !isValid) {
      authData = await this.refreshToken(authData.refreshToken);
      if (!authData) {
        return null;
      }

      await authStorage.storeAuthData(authData);
    }

    return authData;
  };

  public logout = async (): Promise<void> => {
    await authStorage.deleteAuthData();
  };
}

export const auth0Client = new Auth0Client(
  environment.auth0Domain,
  environment.auth0ClientId,
);
