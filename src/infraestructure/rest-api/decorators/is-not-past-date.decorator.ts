import { ValidateBy, buildMessage, ValidationOptions } from 'class-validator';

export const IS_NOT_PAST_DATE = 'isNotPastDate';

export function IsNotPastDate(validationOptions?: ValidationOptions) {
  return ValidateBy({
    name: IS_NOT_PAST_DATE,
    validator: {
      validate: (value: unknown) => {
        if (typeof value !== 'string') return false;
        const [y, m, d] = value.split('-').map(Number);
        if (!y || !m || !d) return false;

        const input = new Date(y, m - 1, d, 0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return input >= today;
      },
      defaultMessage: buildMessage(
        () => 'date must be greater or equal than actual date',
        validationOptions,
      ),
    },
  });
}
