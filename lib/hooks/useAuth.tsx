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
  const { login: loginStore, setClientId } = useAuthStore();

  return useMutation<LoginResponse, Error, LoginDto, unknown>({
    mutationFn: (dto: LoginDto) => auth.login(dto),
    onSuccess: (data: LoginResponse, variables: LoginDto) => {
      // CSR: store token in memory via AuthProvider
      const token = data?.token || data?.access_token;
      if (token) {
        setToken(token);
      }
      
      // Guardar datos del usuario en el store para persistencia
      if (data?.user) {
        loginStore(variables.email);
        // Si el backend devuelve más datos del usuario, actualizarlos
        if (data.user.name || data.user.email) {
          // Los datos adicionales se cargarán desde el perfil
        }
      } else {
        // Si no hay datos del usuario en la respuesta, al menos guardar el email
        loginStore(variables.email);
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
