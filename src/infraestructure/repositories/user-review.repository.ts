import { IUserReviewRepository } from './interfaces/user-review.repository.interface';
import { DataSource, Repository } from 'typeorm';
import { UserReview } from '../entities/user/user-review.entity';
import { Injectable } from '@nestjs/common';
import { ReviewEnum } from '../entities/user/review.enum';

@Injectable()
export class UserReviewRepository
  extends Repository<UserReview>
  implements IUserReviewRepository
{
  constructor(private dataSource: DataSource) {
    super(UserReview, dataSource.createEntityManager());
  }

  async setReview(
    userId: number,
    mechanicId: number,
    review: ReviewEnum,
  ): Promise<void> {
    const reviewRepo = this.manager.getRepository(UserReview);
    const pending = await reviewRepo.findOne({
      where: { userId, mechanicId, review: ReviewEnum.PENDING },
      order: { appointmentId: 'DESC' },
    });
    if (pending) {
      pending.review = review;
      await reviewRepo.save(pending);
      return;
    }
    const latest = await reviewRepo.findOne({
      where: { userId, mechanicId },
      order: { appointmentId: 'DESC' },
    });
    if (latest) {
      latest.review = review;
      await reviewRepo.save(latest);
    }
  }

  async getReview(userId: number, mechanicId: number): Promise<ReviewEnum> {
    const reviewRepo = this.manager.getRepository(UserReview);
    const pending = await reviewRepo.findOne({
      where: { userId, mechanicId, review: ReviewEnum.PENDING },
      order: { appointmentId: 'DESC' },
    });
    if (pending) return ReviewEnum.PENDING;
    const latest = await reviewRepo.findOne({
      where: { userId, mechanicId },
      order: { appointmentId: 'DESC' },
    });
    return latest?.review ?? ReviewEnum.PENDING;
  }

  async getUserReviews(userId: number): Promise<UserReview[]> {
    const reviewRepo = this.manager.getRepository(UserReview);
    const reviews = await reviewRepo.find({
      where: { userId },
    });
    return reviews;
  }
}
