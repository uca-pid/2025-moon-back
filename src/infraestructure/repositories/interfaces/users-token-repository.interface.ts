export interface IUsersTokenRepository {
  upsertToken(
    workshopId: number,
    token: string,
    refreshToken: string,
  ): Promise<void>;

  findByUserId(workshopId: number): Promise<null | [string, string]>;
}

export const IUsersTokenRepositoryToken = 'IUsersTokenRepositoryToken';
