import {
  ReviewEnum,
  SubCategroriesEnum,
} from 'src/infraestructure/entities/user/review.enum';
import { IsArray, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ArrayMaxSize } from 'class-validator';

export class ReviewDto {
  @IsInt()
  @Min(1)
  mechanicId: number;

  @IsInt()
  @Min(1)
  appointmentId: number;

  @IsEnum(ReviewEnum)
  review: ReviewEnum;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @IsEnum(SubCategroriesEnum, { each: true })
  subCategories?: SubCategroriesEnum[];
}
