import { useMutation } from '@tanstack/react-query';
import { auth } from '../api/auth';
import type { LoginDto, RegisterDto, LoginResponse } from '../types/api';

export function useLogin() {
  return useMutation({
    mutationFn: (dto: LoginDto) => auth.login(dto),
    onSuccess: (data: LoginResponse) => {
      // Store token in localStorage or handle cookie
      if (data.token || data.access_token) {
        const token = data.token || data.access_token;
        localStorage.setItem('auth_token', token!);
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (dto: RegisterDto) => auth.register(dto),
  });
}
