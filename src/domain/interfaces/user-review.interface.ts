import { AppointmentStatusChangedEvent } from 'src/domain/events/appointments/appointment-status-changed-event';
import {
  ReviewEnum,
  SubCategroriesEnum,
} from 'src/infraestructure/entities/user/review.enum';
import { UserReview } from 'src/infraestructure/entities/user/user-review.entity';

export interface IUserReviewService {
  setReview(
    userId: number,
    mechanicId: number,
    review: ReviewEnum,
    subCategories?: SubCategroriesEnum[],
  ): Promise<void>;
  getReview(userId: number, mechanicId: number): Promise<ReviewEnum>;
  getUserReviews(userId: number): Promise<UserReview[]>;
  handle(event: AppointmentStatusChangedEvent): Promise<void>;
}

export const IUserReviewServiceToken = 'IUserReviewService';
