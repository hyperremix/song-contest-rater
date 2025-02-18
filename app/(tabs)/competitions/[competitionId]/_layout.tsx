import { Stack } from 'expo-router';
import { BaseLayout } from '../../../../components/Layouts/BaseLayout';

const CompetitionLayout = () => (
  <BaseLayout>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="acts/[actId]" options={{ headerShown: false }} />
    </Stack>
  </BaseLayout>
);

export default CompetitionLayout;
