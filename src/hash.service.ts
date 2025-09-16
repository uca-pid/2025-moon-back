import { Injectable } from '@nestjs/common';

import { hash, compare } from 'bcryptjs';

@Injectable()
export class HashService {
  public hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  public verify(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
