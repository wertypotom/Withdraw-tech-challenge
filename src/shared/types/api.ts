export interface ApiError {
  error: 'conflict' | 'validation' | 'not_found' | 'internal';
  message: string;
}
