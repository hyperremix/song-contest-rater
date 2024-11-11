import { TProfile } from './TProfile';

export type TAuthData = {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresOn: string;
  profile?: TProfile;
};
