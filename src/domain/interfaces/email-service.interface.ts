export interface IEmailService {
  sendPasswordRecovery(url: string, to: string): Promise<void>;
}

export const IEmailServiceToken = 'IEmailService';
