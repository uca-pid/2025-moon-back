import {
  ReviewEnum,
  SubCategroriesEnum,
} from 'src/infraestructure/entities/user/review.enum';
import { IBaseRepository } from './base-repository.interface';
import { UserReview } from 'src/infraestructure/entities/user/user-review.entity';

export interface IUserReviewRepository extends IBaseRepository<UserReview> {
  setReview(
    userId: number,
    mechanicId: number,
    review: ReviewEnum,
    subCategories?: SubCategroriesEnum[],
  ): Promise<void>;
  getReview(userId: number, mechanicId: number): Promise<ReviewEnum>;
  getUserReviews(userId: number): Promise<UserReview[]>;
  getByMechanicIds(mechanicIds: number[]): Promise<UserReview[]>;
  getTopMechanics(limit?: number): Promise<
    {
      mechanicId: number;
      workshopName: string;
      address: string;
      averageScore: number;
      totalReviews: number;
    }[]
  >;
}

export const IUserReviewRepositoryToken = 'IUserReviewRepository';
