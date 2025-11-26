import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import {
  IDiscountCouponService,
  CouponProgress,
} from 'src/domain/interfaces/discount-coupon-service.interface';
import type { IUserReviewRepository } from 'src/infraestructure/repositories/interfaces/user-review.repository.interface';
import { IUserReviewRepositoryToken } from 'src/infraestructure/repositories/interfaces/user-review.repository.interface';
import type { IDiscountCouponRepository } from 'src/infraestructure/repositories/interfaces/discount-coupon-repository.interface';
import { IDiscountCouponRepositoryToken } from 'src/infraestructure/repositories/interfaces/discount-coupon-repository.interface';
import { DiscountCoupon } from 'src/infraestructure/entities/user/discount-coupon.entity';

@Injectable()
export class DiscountCouponService implements IDiscountCouponService {
  private readonly REQUIRED_REVIEWS = 2;
  private readonly DISCOUNT_PERCENTAGE = 10;
  private readonly EXPIRATION_DAYS = 30;

  constructor(
    @Inject(IUserReviewRepositoryToken)
    private readonly userReviewRepository: IUserReviewRepository,
    @Inject(IDiscountCouponRepositoryToken)
    private readonly couponRepository: IDiscountCouponRepository,
  ) {}

  async generateCouponIfEligible(
    userId: number,
    workshopId: number,
  ): Promise<DiscountCoupon | null> {
    const activeCoupon =
      await this.couponRepository.findActiveByUserAndWorkshop(
        userId,
        workshopId,
      );

    if (activeCoupon) return null;

    const completedReviews =
      await this.userReviewRepository.countCompletedReviewsByUserAndMechanic(
        userId,
        workshopId,
      );

    if (completedReviews < this.REQUIRED_REVIEWS) {
      return null;
    }

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + this.EXPIRATION_DAYS);

    const code = this.generateCode(userId, workshopId);

    const coupon = this.couponRepository.create({
      userId,
      workshopId,
      code,
      discountPercentage: this.DISCOUNT_PERCENTAGE,
      isUsed: false,
      createdAt: now,
      expiresAt,
    });

    return await this.couponRepository.save(coupon);
  }

  async getUserCouponProgress(
    userId: number,
    workshopId: number,
  ): Promise<CouponProgress> {
    const [activeCoupon, completedReviews] = await Promise.all([
      this.couponRepository.findActiveByUserAndWorkshop(userId, workshopId),
      this.userReviewRepository.countCompletedReviewsByUserAndMechanic(
        userId,
        workshopId,
      ),
    ]);

    const required = this.REQUIRED_REVIEWS;
    const completedModulo = completedReviews % required;
    const percentage =
      completedReviews === 0
        ? 0
        : Math.min(100, Math.round((completedModulo / required) * 100));

    return {
      workshopId,
      required,
      completed: completedModulo,
      percentage,
      hasActiveCoupon: !!activeCoupon,
      activeCoupon: activeCoupon
        ? {
            code: activeCoupon.code,
            discountPercentage: activeCoupon.discountPercentage,
            expiresAt: activeCoupon.expiresAt,
            workshopId: activeCoupon.workshopId,
          }
        : null,
    };
  }

  private generateCode(userId: number, workshopId: number): string {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ESTALLER-${workshopId}-${userId}-${rand}`;
  }

  async validateCouponById(
    userId: number,
    workshopId: number,
    couponId: number,
  ): Promise<DiscountCoupon> {
    const coupon = await this.couponRepository.findOne({
      where: { id: couponId },
    });

    if (!coupon) {
      throw new BadRequestException('El cupón no existe');
    }

    if (coupon.userId !== userId || coupon.workshopId !== workshopId) {
      throw new BadRequestException(
        'El cupón no pertenece a este usuario/taller',
      );
    }

    if (coupon.isUsed) {
      throw new BadRequestException('El cupón ya fue utilizado');
    }

    if (coupon.expiresAt < new Date()) {
      throw new BadRequestException('El cupón está vencido');
    }

    return coupon;
  }

  async getAvailableCoupons(
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
  }> {
    const coupons = await this.couponRepository.findAvailableCoupons(
      userId,
      workshopId,
    );

    if (coupons.length > 0) {
      return {
        hasCoupons: true,
        coupons: coupons.map((c) => ({
          id: c.id,
          code: c.code,
          discountPercentage: c.discountPercentage,
          expiresAt: c.expiresAt,
        })),
      };
    }

    const completedReviews =
      await this.userReviewRepository.countCompletedReviewsByUserAndMechanic(
        userId,
        workshopId,
      );

    const required = this.REQUIRED_REVIEWS;
    const missingReviews = required - (completedReviews % required);

    const hasPendingReviews =
      await this.userReviewRepository.userHasPendingReviews(userId, workshopId);

    return {
      hasCoupons: false,
      missingReviews,
      hasPendingReviews,
      message:
        missingReviews === 1
          ? 'Te falta 1 reseña para obtener un cupón.'
          : `Te faltan ${missingReviews} reseñas para obtener un cupón.`,
    };
  }
}
