import dayjs from 'dayjs';
import * as AuthSession from 'expo-auth-session';
import { jwtDecode } from 'jwt-decode';
import { TAuthData } from './TAuthData';
import { TProfile } from './TProfile';

export const mapTokenResponse = ({
  expiresIn,
  accessToken,
  idToken,
  refreshToken,
}: AuthSession.TokenResponse): TAuthData | null => {
  if (!(accessToken && expiresIn)) {
    return null;
  }

  return {
    expiresOn: dayjs().add(expiresIn, 'seconds').toISOString(),
    accessToken: accessToken,
    idToken: idToken,
    refreshToken: refreshToken,
    profile: idToken ? jwtDecode<TProfile>(idToken) : undefined,
  };
};
