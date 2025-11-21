import { Injectable } from '@nestjs/common';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { DiscountCoupon } from '../entities/user/discount-coupon.entity';
import { IDiscountCouponRepository } from './interfaces/discount-coupon-repository.interface';
import { UserReview } from 'src/infraestructure/entities/user/user-review.entity';
import { ReviewEnum } from 'src/infraestructure/entities/user/review.enum';

@Injectable()
export class DiscountCouponRepository
  extends Repository<DiscountCoupon>
  implements IDiscountCouponRepository
{
  constructor(private dataSource: DataSource) {
    super(DiscountCoupon, dataSource.createEntityManager());
  }

  async findActiveByUser(userId: number): Promise<DiscountCoupon | null> {
    const now = new Date();
    return this.findOne({
      where: {
        userId,
        isUsed: false,
        expiresAt: MoreThan(now),
      },
    });
  }

  async findActiveByUserAndWorkshop(
    userId: number,
    workshopId: number,
  ): Promise<DiscountCoupon | null> {
    const now = new Date();
    return this.findOne({
      where: {
        userId,
        workshopId,
        isUsed: false,
        expiresAt: MoreThan(now),
      },
    });
  }
  async markAsUsed(code: string): Promise<void> {
    const coupon = await this.findOne({ where: { code } });

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    if (coupon.isUsed) {
      throw new Error('Coupon already used');
    }

    const now = new Date();
    if (coupon.expiresAt <= now) {
      throw new Error('Coupon expired');
    }

    coupon.isUsed = true;
    await this.save(coupon);
  }

  async findAvailableCoupons(userId: number, workshopId: number) {
    return this.find({
      where: {
        userId,
        workshopId,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      order: { expiresAt: 'ASC' },
    });
  }

  async findById(id: number) {
    return this.findOne({ where: { id } });
  }

  async userHasPendingReviews(
    userId: number,
    mechanicId: number,
  ): Promise<boolean> {
    const pending = await this.manager.getRepository(UserReview).count({
      where: {
        userId,
        mechanicId,
        review: ReviewEnum.PENDING,
      },
    });

    return pending > 0;
  }
}
