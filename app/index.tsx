import React from 'react';
import { Logo } from '../components/atoms/Logo';
import { HeaderLayout } from '../components/Layouts/HeaderLayout';
import { LoginContent } from '../components/organisms/LoginContent';
import { useAuthData } from '../hooks/useAuthData';

const Home = () => {
  const { isAuthenticated } = useAuthData();

  if (!isAuthenticated) {
    return <LoginContent />;
  }

  return (
    <HeaderLayout className="flex-1 justify-center items-center gap-4">
      <Logo />
    </HeaderLayout>
  );
};

export default Home;
