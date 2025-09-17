export interface IHashService {
  hash(password: string): Promise<string>;
  verify(password: string, hashedPassword: string): Promise<boolean>;
}

export const IHashServiceToken = 'IHashService';
