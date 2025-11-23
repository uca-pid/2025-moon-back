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
    appointmentId: number,
    review: ReviewEnum,
    subCategories?: SubCategroriesEnum[],
  ): Promise<void>;
  getReview(userId: number, mechanicId: number): Promise<ReviewEnum>;
  getUserReviews(userId: number): Promise<UserReview[]>;
  handle(event: AppointmentStatusChangedEvent): Promise<void>;
  getMechanicsReviews(
    mechanicIds: number[],
  ): Promise<
    Record<
      number,
      { reviews: ReviewEnum[]; subCategories: SubCategroriesEnum[] }
    >
  >;
  getTopMechanics(limit?: number): Promise<
    {
      mechanicId: number;
      workshopName: string;
      address: string;
      averageScore: number;
      totalReviews: number;
    }[]
  >;
  getMechanicRankingWithAdvice(mechanicId: number): Promise<{
    mechanicId: number;
    position: number | null;
    totalMechanics: number;
    averageScore: number | null;
    totalReviews: number;
    advice: string;
  }>;
  getRankingGoals(mechanicId: number): Promise<{
    mechanicId: number;
    ranking: {
      position: number;
      totalMechanics: number;
      averageScore: number;
      totalReviews: number;
    } | null;
    nextGoals: {
      climb: {
        targetMechanicId: number;
        extraPositiveReviewsNeeded: number | null;
        description: string;
      } | null;
    } | null;
  }>;
  getMechanicRanking(mechanicId: number): Promise<{
    mechanicId: number;
    position: number | null;
    totalMechanics: number;
    averageScore: number | null;
    totalReviews: number;
  }>;
}

export const IUserReviewServiceToken = 'IUserReviewService';
