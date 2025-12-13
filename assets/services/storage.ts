
// Generic storage service to mimic database operations
// This makes it easy to swap LocalStorage for a real API later.

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from storage`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to storage`, error);
    }
  },

  remove: (key: string): void => {
    window.localStorage.removeItem(key);
  }
};
