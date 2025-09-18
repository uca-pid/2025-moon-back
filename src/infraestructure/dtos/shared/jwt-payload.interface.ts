import { UserRole } from 'src/infraestructure/entities/user/user-role.enum';

export type JwtPayload = {
  id: number;
  email: string;
  fullName: string;
  userRole: UserRole;
  workshopName: string;
  address: string;
};
