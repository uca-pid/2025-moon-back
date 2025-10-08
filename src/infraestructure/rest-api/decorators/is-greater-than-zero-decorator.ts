import {
  buildMessage,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export function IsGreaterThanZero(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanZero',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: number) => {
          return typeof value === 'number' && value >= 0;
        },
        defaultMessage: buildMessage(
          () => 'value must be greater than or equal to 0',
          validationOptions,
        ),
      },
    });
  };
}
