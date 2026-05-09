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
};

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
