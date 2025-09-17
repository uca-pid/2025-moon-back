import { IRandomService } from '../repositories/interfaces/random-service.interface';
import * as crypto from 'crypto';

export class RandomService implements IRandomService {
  randomString(count: number): string {
    return crypto.randomBytes(count).toString('hex');
  }
}
