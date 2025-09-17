export interface IRandomService {
  randomString(count: number): string;
}

export const IRandomServiceToken = 'IRandomService';
