import { FontAwesome6 } from '@expo/vector-icons';
import { Tabs, usePathname } from 'expo-router';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';
import { color } from '../../constants/color';
import { t } from '../../i18n';
import { translations } from '../../i18n/translations';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const pathname = usePathname();

  const shouldShowTabBar = pathname === '/' || pathname === '/stats';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: color.primary,
        headerShown: false,
        tabBarStyle: {
          display: shouldShowTabBar ? 'flex' : 'none',
          backgroundColor: colorScheme === 'dark' ? colors.zinc[900] : 'white',
          borderTopColor: colorScheme === 'dark' ? colors.zinc[800] : 'white',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t(translations.homeScreenTitle),
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name="music" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="competitions/[competitionId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: t(translations.statistics.statsScreenTitle),
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name="chart-line" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
