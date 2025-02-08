import { View, ViewProps } from 'react-native';

export const Divider = ({ className = '', ...props }: ViewProps) => {
  return (
    <View
      className={`w-full h-px bg-zinc-200 dark:bg-zinc-500 ${className}`}
      {...props}
    />
  );
};
