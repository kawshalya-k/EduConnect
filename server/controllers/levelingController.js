const db = require('../config/db');

const WEIGHTS = {
  SESSION_COMPLETED:  5,    // per completed session
  AVG_RATING:        10,    // multiplied by 1–5 star rating
  REPEAT_SESSION:     3,    // per session where same learner rebooks
  ON_TIME_RATE:       0.2,  // per 1% of on-time punctuality (max 100)
};

// ── Level thresholds ─────────────────────────────────────────────────────────
export const LEVEL_THRESHOLDS = {
  GOLD:   100,
  SILVER:  50,
};

export function calculateScore(activity) {
  const {
    sessionsCompleted = 0,
    avgRating         = 0,
    repeatSessions    = 0,
    onTimeRate        = 0,
  } = activity;

  const sessionPoints  = sessionsCompleted * WEIGHTS.SESSION_COMPLETED;
  const ratingPoints   = avgRating         * WEIGHTS.AVG_RATING;
  const repeatPoints   = repeatSessions    * WEIGHTS.REPEAT_SESSION;
  const onTimePoints   = onTimeRate        * WEIGHTS.ON_TIME_RATE;

  const score = sessionPoints + ratingPoints + repeatPoints + onTimePoints;

  return {
    score: Math.round(score * 100) / 100,   
    breakdown: {
      sessionPoints,
      ratingPoints,
      repeatPoints,
      onTimePoints,
    },
  };
}

export function getLevel(score) {
  if (score >= LEVEL_THRESHOLDS.GOLD)   return 'gold';
  if (score >= LEVEL_THRESHOLDS.SILVER) return 'silver';
  return 'bronze';
}

export function evaluateMentorLevel(activity) {
  const { score, breakdown } = calculateScore(activity);
  const level = getLevel(score);

  let pointsToNext = null;
  let nextLevel    = null;

  if (level === 'bronze') {
    pointsToNext = Math.ceil(LEVEL_THRESHOLDS.SILVER - score);
    nextLevel    = 'silver';
  } else if (level === 'silver') {
    pointsToNext = Math.ceil(LEVEL_THRESHOLDS.GOLD - score);
    nextLevel    = 'gold';
  }

  return {
    score,
    level,
    breakdown,
    nextLevel,
    pointsToNext,  // null if already Gold
  };
}