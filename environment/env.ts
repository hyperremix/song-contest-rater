export const environment = {
  stage: process.env.EXPO_PUBLIC_STAGE ?? 'not-set',
  auth0Domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN ?? 'not-set',
  auth0ClientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID ?? 'not-set',
  auth0Audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE ?? 'not-set',
  backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL ?? 'not-set',
  imagekitUrlEndpoint:
    process.env.EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? 'not-set',
  clerkPublishableKey:
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? 'not-set',
};
