import { UserRole } from 'src/infraestructure/entities/users/user-role.enum';

export type JwtPayload = {
  id: number;
  email: string;
  fullName: string;
  userRole: UserRole;
  workshopName: string;
  address: string;
};
