import { Injectable } from '@nestjs/common';

import { hash, compare } from 'bcryptjs';
import { IHashService } from 'src/domain/interfaces/hash-service.interface';

@Injectable()
export class HashService implements IHashService {
  public hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  public verify(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
