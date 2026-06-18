import { Injectable } from '@nestjs/common';

/**
 * Recommendation scoring used to sort the discover feed.
 *
 * The score blends "how close it is" with "how well the host's history
 * matches the player base". When location is unknown we fall back to a
 * scheduled-time sort upstream, so this only matters once a real
 * `distanceKm` is supplied.
 */
@Injectable()
export class RecommendationsService {
  /**
   * Returns a 0..100-ish score. Distance contributes more aggressively near
   * the user (0-5km) and decays gracefully past that — capped so a venue
   * 30km away doesn't produce a runaway negative number.
   */
  score(distanceKm: number, matchRate: number) {
    const safeDistance = Math.max(0, distanceKm);
    // Distance term: full credit at 0km, half at ~5km, zero past ~15km.
    const distanceTerm = 100 * Math.exp(-safeDistance / 7);
    const blended = matchRate * 0.6 + distanceTerm * 0.4;
    return Number(blended.toFixed(2));
  }

  /**
   * Predict the match-fit rate that gets stored on the row at creation
   * time. We bias it slightly off the host's credit score and the venue's
   * default distance (so a brand-new game still gets a believable preview
   * number before any real users have engaged with it).
   */
  estimateMatchRate(distanceKm: number, hostCreditScore: number) {
    const raw = 99 - distanceKm * 3.75 + (hostCreditScore - 95) * 0.35;
    return Math.max(0, Math.min(100, Math.round(raw)));
  }
}
