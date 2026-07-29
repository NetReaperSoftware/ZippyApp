import { useMemo } from 'react';

export interface Resource<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

/**
 * Wraps a static fixture in the shape screens expect from a real fetch.
 *
 * Every hook in this directory returns `{ data, loading, error }` so that
 * swapping the body for a HighLevel/Supabase call later is contained to the
 * hook — no screen needs to change.
 */
export function useMockResource<T>(value: T): Resource<T> {
  return useMemo(() => ({ data: value, loading: false, error: null }), [value]);
}
