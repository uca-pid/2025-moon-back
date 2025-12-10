import { DiscountCoupon } from 'src/infraestructure/entities/user/discount-coupon.entity';

export interface CouponProgress {
  workshopId: number;
  required: number;
  completed: number;
  percentage: number;
  hasActiveCoupon: boolean;
  activeCoupon: {
    code: string;
    discountPercentage: number;
    expiresAt: Date;
    workshopId: number;
  } | null;
}

export interface IDiscountCouponService {
  generateCouponIfEligible(
    userId: number,
    workshopId: number,
  ): Promise<DiscountCoupon | null>;

  getUserCouponProgress(
    userId: number,
    workshopId: number,
  ): Promise<CouponProgress>;

  getAvailableCoupons(
    userId: number,
    workshopId: number,
  ): Promise<{
    hasCoupons: boolean;
    coupons?: {
      id: number;
      code: string;
      discountPercentage: number;
      expiresAt: Date;
    }[];
    message?: string;
    missingReviews?: number;
    hasPendingReviews?: boolean;
  }>;

  validateCouponById(
    userId: number,
    workshopId: number,
    couponId: number,
  ): Promise<DiscountCoupon>;
}

export const IDiscountCouponServiceToken = 'IDiscountCouponService';
