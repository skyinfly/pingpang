const levelLabels: Record<string, string> = {
  beginner: '新手',
  intermediate: '中级',
  advanced: '高级',
};

const reviewTagLabels: Record<string, string> = {
  on_time: '准时到场',
  great_communication: '沟通顺畅',
  positive_energy: '气氛积极',
};

const threadStatusLabels: Record<string, string> = {
  active: '进行中',
  pending: '待开启',
  completed: '已结束',
  cancelled: '已取消',
};

/**
 * Derive a friendlier status for the chat-thread card. Backend keeps
 * status='active' even after a match's startTime has passed — we
 * interpret "active + scheduled time + 2h window elapsed" as 已结束 so
 * the card doesn't claim 进行中 for last week's match.
 */
const LIVE_WINDOW_MS = 2 * 60 * 60 * 1000;
export function deriveThreadStatus(status?: string | null, scheduledAt?: string | null) {
  if (status === 'cancelled' || status === 'completed') return status;
  if (scheduledAt) {
    const end = new Date(scheduledAt).getTime() + LIVE_WINDOW_MS;
    if (!Number.isNaN(end) && Date.now() > end) return 'completed';
  }
  return status ?? 'active';
}

export function formatLevel(level?: string | null) {
  if (!level) {
    return '待确认';
  }

  return levelLabels[level] ?? level;
}

export function formatReviewTag(tag: string) {
  return reviewTagLabels[tag] ?? tag;
}

export function formatThreadStatus(status?: string | null) {
  if (!status) {
    return '进行中';
  }

  return threadStatusLabels[status] ?? status;
}
