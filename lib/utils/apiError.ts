// File: lib/utils/apiError.ts
export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function isApiError(e: unknown): e is ApiError {
  return typeof e === 'object' && e !== null && (e as any).name === 'ApiError';
}
