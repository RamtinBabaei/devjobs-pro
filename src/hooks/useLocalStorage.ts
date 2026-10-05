import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validator?: (value: unknown) => value is T,
): readonly [T, Dispatch<SetStateAction<T>>] {
  const initialValueRef = useRef(initialValue);
  const validatorRef = useRef(validator);
  const [value, setValue] = useState<T>(() =>
    readStoredValue(key, initialValueRef.current, validatorRef.current),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be blocked or unavailable. The in-memory state still works.
    }
  }, [key, value]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage || event.key !== key) return;

      if (event.newValue === null) {
        setValue(initialValueRef.current);
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue) as unknown;
        if (!validatorRef.current || validatorRef.current(parsed)) {
          setValue(parsed as T);
        }
      } catch {
        // Ignore invalid values written by other tabs or older app versions.
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  return [value, setValue] as const;
}

function readStoredValue<T>(
  key: string,
  initialValue: T,
  validator?: (value: unknown) => value is T,
): T {
  if (typeof window === "undefined") return initialValue;

  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) return initialValue;

    const parsed = JSON.parse(saved) as unknown;
    if (validator && !validator(parsed)) {
      window.localStorage.removeItem(key);
      return initialValue;
    }

    return parsed as T;
  } catch {
    return initialValue;
  }
}
