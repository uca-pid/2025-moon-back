import { ReviewEnum } from 'src/infraestructure/entities/user/review.enum';
import { IsEnum, IsInt, Min } from 'class-validator';

export class ReviewDto {
  @IsInt()
  @Min(1)
  mechanicId: number;

  @IsEnum(ReviewEnum)
  review: ReviewEnum;
}
