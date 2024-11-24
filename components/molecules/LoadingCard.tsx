import { View, ViewProps } from 'react-native';

export const LoadingCard = (props: ViewProps) => (
  <View
    className="shadow-md rounded-lg p-4 bg-white dark:bg-zinc-900"
    {...props}
  >
    <View className="animate-pulse flex flex-row gap-4">
      <View className="rounded-full bg-slate-600 h-16 w-16" />
      <View className="flex-1 gap-4 py-1">
        <View className="h-4 bg-slate-600 rounded" />
        <View className="flex flex-row gap-4">
          <View className="h-4 bg-slate-600 rounded w-3/6" />
          <View className="h-4 bg-slate-600 rounded w-2/5" />
        </View>
        <View className="h-4 bg-slate-600 rounded" />
      </View>
    </View>
  </View>
);
