export function useLocalStorage<T>(
  key: string,
  initialValue: T
): any {
  const getStoredValue = () => {
    let deserialized: T;
    try {
      const item = window.localStorage.getItem(key);
      deserialized = item ? JSON.parse(item) : initialValue;
    }
    catch (e: any) {
      console.warn(e.message);
      deserialized = initialValue;
    }
    return deserialized;
  };

  let storedValue: T = getStoredValue();

  const setValue = (value: T): void => {
    storedValue = value;
    try {
      if (value === undefined) {
        window.localStorage.removeItem(key);
        return;
      }
      window.localStorage.setItem(key, JSON.stringify(value));
    }
    catch (e: any) {
      console.warn(e.message);
    }
  };

  return [storedValue, setValue];
}