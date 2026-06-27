import { ApiError } from '@/types/api';

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof ApiError) {
    if (error.errors?.length) {
      const first = error.errors[0];
      if (typeof first === 'object' && first !== null && 'message' in first) {
        return String(first.message);
      }
    }
    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function getFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError) || !error.errors?.length) {
    return {};
  }

  return error.errors.reduce<Record<string, string>>((acc, item) => {
    if (typeof item === 'object' && item !== null && 'field' in item && 'message' in item) {
      acc[String(item.field)] = String(item.message);
    }
    return acc;
  }, {});
}
