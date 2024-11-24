import { View, ViewProps } from 'react-native';

export const Card = ({ children, className, ...props }: ViewProps) => (
  <View
    className={`flex flex-col bg-white dark:bg-zinc-900 rounded-lg ${className}`}
    {...props}
  >
    {children}
  </View>
);
