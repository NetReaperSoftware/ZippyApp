import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin, typed wrapper around AsyncStorage so callers never have to deal with
 * JSON parsing or swallowed errors at each call site.
 */
export const StorageUtils = {
  async getItem<T>(key: string, fallback: T): Promise<T> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch (error) {
      console.warn(`StorageUtils.getItem failed for "${key}"`, error);
      return fallback;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`StorageUtils.setItem failed for "${key}"`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn(`StorageUtils.removeItem failed for "${key}"`, error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.warn('StorageUtils.clearAll failed', error);
    }
  },
};
