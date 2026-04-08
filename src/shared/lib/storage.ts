export function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function readLocalStorageJson<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  return safeJsonParse<T>(raw);
}

export function writeLocalStorageJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

