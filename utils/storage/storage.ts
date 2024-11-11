import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const storage = {
  storeObject: async (key: string, value: any): Promise<void> => {
    const jsonValue = JSON.stringify(value);
    await storage.storeValue(key, jsonValue);
  },
  getObject: async (key: string): Promise<any> => {
    let jsonValue = await storage.getValue(key);
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  },
  storeValue: async (key: string, value: string): Promise<void> => {
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
  getValue: async (key: string): Promise<string | null> => {
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
  deleteKey: async (key: string): Promise<void> => {
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
