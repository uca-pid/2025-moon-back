import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

export type AuthenticatedRequestDto = Request & { user?: JwtPayload };
