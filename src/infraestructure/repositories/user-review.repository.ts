import { IUserReviewRepository } from './interfaces/user-review.repository.interface';
import { DataSource, In, Not, Repository } from 'typeorm';
import { UserReview } from '../entities/user/user-review.entity';
import { Injectable } from '@nestjs/common';
import { ReviewEnum, SubCategroriesEnum } from '../entities/user/review.enum';

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
    appointmentId: number,
    review: ReviewEnum,
    subCategories?: SubCategroriesEnum[],
  ): Promise<void> {
    const reviewRepo = this.manager.getRepository(UserReview);

    const existing = await reviewRepo.findOne({
      where: { userId, mechanicId, appointmentId },
    });

    if (existing) {
      existing.review = review;
      if (subCategories !== undefined) {
        existing.subCategories = subCategories;
      }
      await reviewRepo.save(existing);
      return;
    }

    const newReview = reviewRepo.create({
      userId,
      mechanicId,
      appointmentId,
      review,
      subCategories,
    });

    await reviewRepo.save(newReview);
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

  async getByMechanicIds(mechanicIds: number[]): Promise<UserReview[]> {
    if (!mechanicIds.length) return [];
    const reviewRepo = this.manager.getRepository(UserReview);
    return reviewRepo.find({ where: { mechanicId: In(mechanicIds) } });
  }

  async getTopMechanics(limit = 10): Promise<
    {
      mechanicId: number;
      workshopName: string;
      address: string;
      averageScore: number;
      totalReviews: number;
    }[]
  > {
    const qb = this.createQueryBuilder('ur')
      .innerJoin('ur.mechanic', 'u')
      .select('u.id', 'mechanicId')
      .addSelect('u.workshopName', 'workshopName')
      .addSelect('u.address', 'address')
      .addSelect(
        `
      AVG(
        CASE
          WHEN ur.review = 'excellent' THEN 5
          WHEN ur.review = 'good' THEN 4
          WHEN ur.review = 'bad' THEN 1
          ELSE 0
        END
      )
      `,
        'averageScore',
      )
      .addSelect('COUNT(*)', 'totalReviews')
      .where("ur.review != 'pending'")
      .groupBy('u.id')
      .addGroupBy('u.workshopName')
      .addGroupBy('u.address')
      .orderBy(
        `(
        (AVG(
          CASE
            WHEN ur.review = 'excellent' THEN 5
            WHEN ur.review = 'good' THEN 4
            WHEN ur.review = 'bad' THEN 1
            ELSE 0
          END
        ) * 0.7) + LOG(COUNT(*) + 1) * 0.3
      )`,
        'DESC',
      )
      .addOrderBy('COUNT(*)', 'DESC')
      .limit(limit);

    const results = await qb.getRawMany();

    return results.map((r) => ({
      mechanicId: Number(r.mechanicId),
      workshopName: r.workshopName,
      address: r.address,
      averageScore: parseFloat(r.averageScore),
      totalReviews: Number(r.totalReviews),
    }));
  }

  async countCompletedReviewsByUserAndMechanic(
    userId: number,
    mechanicId: number,
  ): Promise<number> {
    const reviewRepo = this.manager.getRepository(UserReview);
    return reviewRepo.count({
      where: {
        userId,
        mechanicId,
        review: Not(ReviewEnum.PENDING),
      },
    });
  }

  async userHasPendingReviews(
    userId: number,
    mechanicId: number,
  ): Promise<boolean> {
    const count = await this.count({
      where: {
        userId,
        mechanicId,
        review: ReviewEnum.PENDING,
      },
    });

    return count > 0;
  }
}
