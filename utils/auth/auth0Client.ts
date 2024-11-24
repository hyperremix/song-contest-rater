import * as AuthSession from 'expo-auth-session';
import { router } from 'expo-router';
import { environment } from '../../environment';
import { useUserStore } from '../../store';
import { generateId } from '../generateId';
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
    private auth0ClientId: string,
    private auth0Audience: string,
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
        audience: this.auth0Audience,
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

    useUserStore.setState({ authData, isAuthenticated: true });

    return authData;
  };

  public refreshToken = async (
    refreshToken?: string,
  ): Promise<TAuthData | null> => {
    const oldAuthData = useUserStore.getState().authData;

    try {
      const authData = await AuthSession.refreshAsync(
        {
          clientId: this.auth0ClientId,
          refreshToken: refreshToken ? refreshToken : oldAuthData?.refreshToken,
        },
        discovery,
      ).then(mapTokenResponse);

      if (!authData) {
        throw new Error('Auth data is null');
      }

      useUserStore.setState({ authData, isAuthenticated: true });

      return authData;
    } catch (error) {
      this.logout();
      return null;
    }
  };

  public getValidAuthData = async (): Promise<TAuthData | null> => {
    let authData = useUserStore.getState().authData;
    if (!authData) {
      return null;
    }

    const isValid = isTokenValid(authData);

    if (authData.refreshToken && !isValid) {
      authData = await this.refreshToken(authData.refreshToken);
      if (!authData) {
        return null;
      }

      useUserStore.setState({ authData, isAuthenticated: true });
    }

    return authData;
  };

  public logout = async (): Promise<void> => {
    useUserStore.setState({ authData: null, isAuthenticated: false });
    router.navigate('/');
  };
}

export const auth0Client = new Auth0Client(
  environment.auth0ClientId,
  environment.auth0Audience,
);
