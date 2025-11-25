// File: lib/api/auth.ts
import { apiClient } from './client';
import type { LoginDto, LoginResponse, RegisterDto } from '../types/api';

export const auth = {
  async login(dto: LoginDto) {
    return apiClient<LoginResponse>('/auth/login', { method: 'POST', body: dto });
  },
  async register(dto: RegisterDto) {
    return apiClient('/auth/register', { method: 'POST', body: dto });
  },
};
