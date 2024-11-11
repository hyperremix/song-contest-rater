import { useState } from 'react';

export const useAppSetup = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const setupApplication = async () => {
    setAppIsReady(true);
  };

  return { appIsReady, setupApplication };
};
