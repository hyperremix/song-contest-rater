import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const storage = {
  setObject: async (key: string, value: any): Promise<void> => {
    const jsonValue = JSON.stringify(value);
    await storage.setItem(key, jsonValue);
  },
  getObject: async (key: string): Promise<any> => {
    let jsonValue = await storage.getItem(key);
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error(err);
    }
  },
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.error(err);
    }
  },
};
