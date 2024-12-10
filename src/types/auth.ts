import { z } from 'zod';

export type Role = 'admin' | 'manager' | 'crew';

export interface User {
  uid: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  role: Role;
  inviteCode?: string;
}

export interface UpdateUserDTO {
  role: Role;
  password?: string;
}

export interface Invitation {
  id: string;
  code: string;
  role: Role;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

export const invitationSchema = z.object({
  role: z.enum(['manager', 'crew'], {
    errorMap: () => ({ message: 'Rol inválido' })
  }),
});

export type CreateInvitationDTO = z.infer<typeof invitationSchema>;