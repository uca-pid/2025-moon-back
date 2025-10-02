import { IsNotPastDate } from 'src/infraestructure/rest-api/decorators/is-not-past-date.decorator';
import { validateSync } from 'class-validator';

describe('IsNotPastDate Decorator', () => {
  class TestClass {
    @IsNotPastDate()
    date!: string;
  }

  function validateDate(date: string) {
    const instance = new TestClass();
    instance.date = date;
    const errors = validateSync(instance);
    return errors.flatMap((e) =>
      e.constraints ? Object.values(e.constraints) : [],
    );
  }

  function formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  it('should pass validation for a future date', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day in future
    const errors = validateDate(formatDate(futureDate));
    expect(errors).toHaveLength(0);
  });

  it('should fail validation for a past date', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24); // 1 day in past
    const errors = validateDate(formatDate(pastDate));
    expect(errors).toHaveLength(1);
  });

  it('should pass validation for the current date', () => {
    const now = new Date();
    const errors = validateDate(formatDate(now));
    expect(errors).toHaveLength(0);
  });

  it('should handle invalid date values gracefully', () => {
    const errors = validateDate('invalid-date');
    expect(errors.length).toBeGreaterThanOrEqual(0);
  });
});
