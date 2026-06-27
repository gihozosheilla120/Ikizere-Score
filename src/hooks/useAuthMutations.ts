import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context';
import type { LoginPayload, RegisterPayload } from '@/types/models';

export function useLoginMutation() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => signIn(payload),
  });
}

export function useRegisterMutation() {
  const { signUp } = useAuth();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => signUp(payload),
  });
}
