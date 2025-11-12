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

@Injectable()
export class UserReviewService implements IUserReviewService {
  constructor(
    @Inject(IUserReviewRepositoryToken)
    private readonly userReviewRepository: IUserReviewRepository,
  ) {}

  async setReview(
    userId: number,
    mechanicId: number,
    review: ReviewEnum,
    subCategories?: SubCategroriesEnum[],
  ): Promise<void> {
    await this.userReviewRepository.setReview(
      userId,
      mechanicId,
      review,
      subCategories,
    );
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
}
