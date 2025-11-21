import { DiscountCoupon } from 'src/infraestructure/entities/user/discount-coupon.entity';
import { IBaseRepository } from './base-repository.interface';

export interface IDiscountCouponRepository
  extends IBaseRepository<DiscountCoupon> {
  findActiveByUser(userId: number): Promise<DiscountCoupon | null>;
  findActiveByUserAndWorkshop(
    userId: number,
    workshopId: number,
  ): Promise<DiscountCoupon | null>;
  markAsUsed(code: string): Promise<void>;
  userHasPendingReviews(userId: number, mechanicId: number): Promise<boolean>;
  findAvailableCoupons(
    userId: number,
    workshopId: number,
  ): Promise<DiscountCoupon[]>;
}

export const IDiscountCouponRepositoryToken = 'IDiscountCouponRepository';
