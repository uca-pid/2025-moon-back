import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { APPOINTMENT_EVENTS } from 'src/domain/events/appointments/appointment-events';
import type { AppointmentStatusChangedEvent } from 'src/domain/events/appointments/appointment-status-changed-event';
import { AppointmentStatus } from 'src/infraestructure/entities/appointment/appointment-status.enum';
import {
  ReviewEnum,
  SubCategroriesEnum,
} from 'src/infraestructure/entities/user/review.enum';
import { IUserReviewService } from 'src/domain/interfaces/user-review.interface';
import {
  type IUserReviewRepository,
  IUserReviewRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/user-review.repository.interface';
import { UserReview } from 'src/infraestructure/entities/user/user-review.entity';
import type { IDiscountCouponService } from 'src/domain/interfaces/discount-coupon-service.interface';
import { IDiscountCouponServiceToken } from 'src/domain/interfaces/discount-coupon-service.interface';

@Injectable()
export class UserReviewService implements IUserReviewService {
  constructor(
    @Inject(IUserReviewRepositoryToken)
    private readonly userReviewRepository: IUserReviewRepository,
    @Inject(IDiscountCouponServiceToken)
    private readonly discountCouponService: IDiscountCouponService,
  ) {}

  async setReview(
    userId: number,
    mechanicId: number,
    appointmentId: number,
    review: ReviewEnum,
    subCategories?: SubCategroriesEnum[],
  ): Promise<void> {
    await this.userReviewRepository.setReview(
      userId,
      mechanicId,
      appointmentId,
      review,
      subCategories,
    );

    if (review !== ReviewEnum.PENDING) {
      await this.discountCouponService.generateCouponIfEligible(
        userId,
        mechanicId,
      );
    }
  }

  async getUserReviews(userId: number): Promise<UserReview[]> {
    return await this.userReviewRepository.getUserReviews(userId);
  }

  async getReview(userId: number, mechanicId: number): Promise<ReviewEnum> {
    const review = await this.userReviewRepository.getReview(
      userId,
      mechanicId,
    );
    return review;
  }

  @OnEvent(APPOINTMENT_EVENTS.STATUS_CHANGED)
  async handle(event: AppointmentStatusChangedEvent) {
    if (event.appointment.status !== AppointmentStatus.COMPLETED) return;

    const userId = event.appointment.user.id;
    const mechanicId = event.appointment.workshop.id;
    const appointmentId = event.appointment.id;

    const existing = await this.userReviewRepository.findOne({
      where: { userId, mechanicId, appointmentId },
    });

    if (!existing) {
      await this.userReviewRepository.save({
        userId,
        mechanicId,
        appointmentId,
        review: ReviewEnum.PENDING,
      });
    }
  }

  async getMechanicsReviews(
    mechanicIds: number[],
  ): Promise<
    Record<
      number,
      { reviews: ReviewEnum[]; subCategories: SubCategroriesEnum[] }
    >
  > {
    const all = await this.userReviewRepository.getByMechanicIds(mechanicIds);
    const map: Record<
      number,
      { reviews: ReviewEnum[]; subCategories: SubCategroriesEnum[] }
    > = {};
    all.forEach((review: UserReview) => {
      if (!map[review.mechanicId]) {
        map[review.mechanicId] = { reviews: [], subCategories: [] };
      }
      map[review.mechanicId].reviews.push(review.review);
      if (review.subCategories && review.subCategories.length) {
        map[review.mechanicId].subCategories.push(...review.subCategories);
      }
    });
    return map;
  }

  async getTopMechanics(limit = 10) {
    return await this.userReviewRepository.getTopMechanics(limit);
  }

  async getMechanicRankingWithAdvice(mechanicId: number) {
    const all = await this.userReviewRepository.getTopMechanics();

    const totalMechanics = all.length;
    const entryIndex = all.findIndex((m) => m.mechanicId === mechanicId);

    if (entryIndex === -1) {
      return {
        mechanicId,
        position: null,
        totalMechanics,
        averageScore: null,
        totalReviews: 0,
        advice:
          'Todavía no tenés suficientes reseñas para aparecer en el ranking. Pedile a tus clientes que te califiquen luego de cada servicio.',
      };
    }

    const position = entryIndex + 1;
    const current = all[entryIndex];
    const { averageScore, totalReviews } = current;

    const advice = this.buildAdvice(all, entryIndex);

    return {
      mechanicId,
      position,
      totalMechanics,
      averageScore,
      totalReviews,
      advice,
    };
  }

  private buildAdvice(
    ranking: {
      mechanicId: number;
      workshopName: string;
      address: string;
      averageScore: number;
      totalReviews: number;
    }[],
    index: number,
  ): string {
    if (index === 0) {
      return '¡Felicitaciones! Estás en el primer lugar del ranking. Mantené la calidad del servicio y respondé a las reseñas para conservar tu posición.';
    }

    const current = ranking[index];
    const above = ranking[index - 1];

    const scoreDiff = above.averageScore - current.averageScore;
    const reviewsDiff = above.totalReviews - current.totalReviews;

    if (scoreDiff > 0.15) {
      return 'Para subir en el ranking, enfocáte en mejorar tu calificación general. Asegurate de brindar un buen servicio y pedile a tus clientes satisfechos que te dejen una reseña positiva.';
    }

    if (reviewsDiff > 5) {
      return 'Tu puntaje promedio es similar al del taller que está arriba tuyo, pero tiene más reseñas. Incentivá a más clientes a calificarse para ganar peso en el ranking.';
    }

    return 'Estás muy cerca de subir en el ranking. Unas pocas reseñas positivas más pueden ayudarte a mejorar tu posición.';
  }

  async getRankingGoals(mechanicId: number) {
    const ranking = await this.userReviewRepository.getTopMechanics();

    if (!ranking.length) {
      return {
        mechanicId,
        ranking: null,
        nextGoals: null,
      };
    }

    const index = ranking.findIndex((m) => m.mechanicId === mechanicId);

    if (index === -1) {
      return {
        mechanicId,
        ranking: null,
        nextGoals: null,
      };
    }

    const current = ranking[index];
    const totalMechanics = ranking.length;

    const calculateScore = (avg: number, n: number) =>
      avg * 0.7 + Math.log(n + 1) * 0.3;

    const currentScore = calculateScore(
      current.averageScore,
      current.totalReviews,
    );

    let climb: {
      targetMechanicId: number;
      extraPositiveReviewsNeeded: number | null;
      description: string;
    } | null = null;

    if (index > 0) {
      const above = ranking[index - 1];

      const targetScore = calculateScore(
        above.averageScore,
        above.totalReviews,
      );

      let x = 1;
      while (x <= 50) {
        const newAvg =
          (current.averageScore * current.totalReviews + 5 * x) /
          (current.totalReviews + x);

        const newScore = calculateScore(newAvg, current.totalReviews + x);

        if (newScore > targetScore) {
          climb = {
            targetMechanicId: above.mechanicId,
            extraPositiveReviewsNeeded: x,
            description: `Si obtenés ${x} reseñas excelentes podés superar al taller en la posición #${index}.`,
          };
          break;
        }

        x++;
      }

      if (!climb) {
        climb = {
          targetMechanicId: above.mechanicId,
          extraPositiveReviewsNeeded: null,
          description:
            'Necesitarías muchas reseñas excelentes para subir de posición.',
        };
      }
    }

    return {
      mechanicId,
      ranking: {
        position: index + 1,
        totalMechanics,
        averageScore: current.averageScore,
        totalReviews: current.totalReviews,
      },
      nextGoals: {
        climb,
      },
    };
  }
}
