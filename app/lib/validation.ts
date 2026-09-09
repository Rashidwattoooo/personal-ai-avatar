export function sanitizeString(val: unknown, fallback: string = ''): string {
  if (typeof val === 'string') {
    return val.trim();
  }
  return fallback;
}

export function parseDocumentIds(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).map((s) => s.trim());
  }
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return [];
}

export function sanitizeRetrievalStrategy(val: unknown): 'balanced' | 'speed' | 'quality' {
  if (val === 'speed' || val === 'quality') {
    return val;
  }
  return 'balanced';
}
