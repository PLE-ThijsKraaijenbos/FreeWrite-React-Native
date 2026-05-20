import { NativeModules } from 'react-native';
import type * as SecureStoreType from 'expo-secure-store';

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

// expo-secure-store requires a native build; unavailable in Expo Go or web
const SecureStore: typeof SecureStoreType | null = (() => {
  try {
    if (!NativeModules?.ExpoSecureStore) return null;
    return require('expo-secure-store') as typeof SecureStoreType;
  } catch {
    return null;
  }
})();

const mem: Record<string, string> = {};

const get = (key: string): Promise<string | null> =>
  SecureStore ? SecureStore.getItemAsync(key) : Promise.resolve(mem[key] ?? null);
const set = (key: string, value: string): Promise<void> =>
  SecureStore
    ? SecureStore.setItemAsync(key, value)
    : Promise.resolve(void (mem[key] = value));
const del = (key: string): Promise<void> =>
  SecureStore
    ? SecureStore.deleteItemAsync(key)
    : Promise.resolve(void delete mem[key]);

export const saveTokens = (access: string, refresh: string) =>
  Promise.all([set(ACCESS_KEY, access), set(REFRESH_KEY, refresh)]);

export const getAccessToken = () => get(ACCESS_KEY);
export const getRefreshToken = () => get(REFRESH_KEY);

export const clearTokens = () => Promise.all([del(ACCESS_KEY), del(REFRESH_KEY)]);
