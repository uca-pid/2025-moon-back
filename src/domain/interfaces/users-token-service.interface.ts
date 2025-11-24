export interface IUsersTokenService {
  getTokenOrThrow(userId: number): Promise<string>;
}

export const IUsersTokenServiceToken = 'IUsersTokenServiceToken';
