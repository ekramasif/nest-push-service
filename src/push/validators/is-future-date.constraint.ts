import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Logger } from '@nestjs/common'; // Optional logging

@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  private readonly logger = new Logger(IsFutureDateConstraint.name);

  validate(dateString: string, args: ValidationArguments) {
    if (!dateString || typeof dateString !== 'string') return false;

    try {
      const scheduleDate = new Date(dateString);
      // Check if the date parsing itself was valid
      if (isNaN(scheduleDate.getTime())) {
          this.logger.warn(`Invalid date format received: ${dateString}`);
          return false;
      }

      const now = new Date();
      // Add a small buffer (e.g., 1 sec) to prevent race conditions near the current time
      return scheduleDate.getTime() > (now.getTime() + 1000);
    } catch (e) {
      this.logger.error(`Error parsing date in validator: ${dateString}`, e);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `scheduleAt ('${args.value}') must be a valid ISO 8601 string representing a time in the future.`;
  }
}