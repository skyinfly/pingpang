import { Injectable } from '@nestjs/common';

@Injectable()
export class RecommendationsService {
  score(distanceKm: number, matchRate: number) {
    return Number((matchRate * 0.7 + (5 - distanceKm) * 0.3).toFixed(2));
  }

  estimateMatchRate(distanceKm: number, hostCreditScore: number) {
    const raw = 99 - distanceKm * 3.75 + (hostCreditScore - 95) * 0.35;

    return Math.max(0, Math.min(100, Math.round(raw)));
  }
}
