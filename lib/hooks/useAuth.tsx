// File: lib/hooks/useAuth.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '../api/auth';
import type { LoginDto, LoginResponse, RegisterDto } from '../types/api';
import { useAuth } from '../context/AuthProvider';
import { useAuthStore } from '../auth-store';

// useLogin: typed mutation: TData = LoginResponse, TError = Error, TVariables = LoginDto
export function useLogin() {
  const qc = useQueryClient();
  const { setToken } = useAuth();
  const { setClientId } = useAuthStore();

  return useMutation<LoginResponse, Error, LoginDto, unknown>({
    mutationFn: (dto: LoginDto) => auth.login(dto),
    onSuccess: (data: LoginResponse) => {
      // CSR: store token in memory via AuthProvider
      const token = data?.token || data?.access_token;
      if (token) {
        setToken(token);
      }
      
      // If backend returns user data with clientId, store it in both localStorage and store
      if (data?.user?.clientId) {
        setClientId(data.user.clientId);
      }
      
      // invalidate any auth related queries
      qc.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

// useRegister: typed mutation
export function useRegister() {
  return useMutation<any, Error, RegisterDto, unknown>({
    mutationFn: (dto: RegisterDto) => auth.register(dto),
  });
}
