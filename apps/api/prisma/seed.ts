import { Prisma, PrismaClient } from '../src/generated/prisma';
import { loadLocalEnvFile } from '../src/common/env/load-local-env';
import { buildDevUserData } from '../src/auth/dev-auth';

loadLocalEnvFile();

const seededRecordTimestamp = new Date('2026-04-22T10:00:00+08:00');

const seededVenues = [
  {
    id: 'venue-seed-1',
    name: '徐家汇活力馆',
    city: '上海',
    district: '徐汇',
    distanceKm: 1.8,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'venue-seed-2',
    name: '静安寺白领馆',
    city: '上海',
    district: '静安',
    distanceKm: 3.2,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'venue-inactive-1',
    name: '浦东备用馆',
    city: '上海',
    district: '浦东',
    distanceKm: 4.9,
    sortOrder: 99,
    isActive: false,
  },
] as const;

const seededVenueCourts = [
  {
    id: 'venue-court-1',
    venueId: 'venue-seed-1',
    name: '3号台',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'venue-court-2',
    venueId: 'venue-seed-1',
    name: '5号台',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'venue-court-3',
    venueId: 'venue-seed-2',
    name: '2号台',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'venue-court-4',
    venueId: 'venue-seed-2',
    name: '4号台',
    sortOrder: 2,
    isActive: true,
  },
] as const;

const seededAvailabilitySlots = [
  {
    id: 'venue-slot-1',
    venueId: 'venue-seed-1',
    label: '工作日晚间',
    startTime: 19 * 60 + 30,
    endTime: 20 * 60 + 30,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'venue-slot-2',
    venueId: 'venue-seed-1',
    label: '晚间续场',
    startTime: 20 * 60 + 30,
    endTime: 22 * 60,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'venue-slot-3',
    venueId: 'venue-seed-2',
    label: '午间快打',
    startTime: 12 * 60 + 30,
    endTime: 13 * 60 + 30,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'venue-slot-4',
    venueId: 'venue-seed-2',
    label: '下班开打',
    startTime: 18 * 60 + 30,
    endTime: 20 * 60,
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'venue-slot-archived',
    venueId: 'venue-inactive-1',
    label: '备用时段',
    startTime: 21 * 60,
    endTime: 22 * 60 + 30,
    sortOrder: 99,
    isActive: false,
  },
] as const;

const seededOptionPresets = [
  {
    id: 'level-beginner',
    kind: 'LEVEL' as const,
    value: 'beginner',
    label: '初级',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'level-intermediate',
    kind: 'LEVEL' as const,
    value: 'intermediate',
    label: '中级',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'level-advanced',
    kind: 'LEVEL' as const,
    value: 'advanced',
    label: '高级',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'level-expert-archived',
    kind: 'LEVEL' as const,
    value: 'expert',
    label: '大师',
    sortOrder: 99,
    isActive: false,
  },
  {
    id: 'player-count-2',
    kind: 'PLAYER_COUNT' as const,
    value: '2',
    label: '2 人局',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'player-count-4',
    kind: 'PLAYER_COUNT' as const,
    value: '4',
    label: '4 人局',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'player-count-6',
    kind: 'PLAYER_COUNT' as const,
    value: '6',
    label: '6 人局',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'player-count-8-archived',
    kind: 'PLAYER_COUNT' as const,
    value: '8',
    label: '8 人局',
    sortOrder: 99,
    isActive: false,
  },
] as const;

function daysFromNow(days: number, hour: number, minute: number) {
  const base = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  base.setUTCHours(hour - 8, minute, 0, 0);
  return base;
}

const seededMatches = [
  {
    id: 'match-seed-1',
    title: '徐汇今晚练球局',
    venueName: '徐家汇活力馆 3 号台',
    venueId: 'venue-seed-1',
    courtId: 'venue-court-1',
    slotId: 'venue-slot-1',
    startTime: daysFromNow(2, 19, 30),
    city: '上海',
    level: 'intermediate',
    maxPlayers: 4,
    openSlots: 2,
    hostUserId: 'user-reviewee-1',
    hostCreditScore: 97,
    distanceKm: 1.8,
    matchRate: 93,
  },
  {
    id: 'match-seed-past-1',
    title: '上周末的徐汇晚场',
    venueName: '徐家汇活力馆 5 号台',
    venueId: 'venue-seed-1',
    courtId: 'venue-court-2',
    slotId: 'venue-slot-1',
    startTime: daysFromNow(-5, 19, 30),
    city: '上海',
    level: 'intermediate',
    maxPlayers: 4,
    openSlots: 1,
    hostUserId: 'user-reviewee-1',
    hostCreditScore: 97,
    distanceKm: 1.8,
    matchRate: 91,
  },
  {
    id: 'match-seed-2',
    title: '静安明日午休快打局',
    venueName: '静安寺白领馆 2 号台',
    venueId: 'venue-seed-2',
    courtId: 'venue-court-3',
    slotId: 'venue-slot-3',
    startTime: daysFromNow(3, 12, 30),
    city: '上海',
    level: 'intermediate',
    maxPlayers: 2,
    openSlots: 1,
    hostUserId: 'user-reviewee-1',
    hostCreditScore: 95,
    distanceKm: 3.2,
    matchRate: 87,
  },
] as const;

export async function seedDatabaseInTransaction(tx: Prisma.TransactionClient) {
  await tx.chatThreadParticipant.deleteMany();
  await tx.chatThread.deleteMany();
  await tx.review.deleteMany();
  await tx.message.deleteMany();
  await tx.matchApplication.deleteMany();
  await tx.match.deleteMany();
  await tx.venueAvailabilitySlot.deleteMany();
  await tx.venueCourt.deleteMany();
  await tx.optionPreset.deleteMany();
  await tx.venue.deleteMany();
  await tx.user.deleteMany();

  for (const user of [
    {
      id: 'user-13800138000',
      ...buildDevUserData('13800138000'),
    },
    {
      id: 'user-reviewee-1',
      phone: '13900139000',
      nickname: '球友里卡',
      city: '上海',
      level: 'intermediate',
      creditScore: 100,
    },
  ]) {
    await tx.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }

  for (const venue of seededVenues) {
    await tx.venue.upsert({
      where: { id: venue.id },
      update: {
        name: venue.name,
        city: venue.city,
        district: venue.district,
        distanceKm: venue.distanceKm,
        sortOrder: venue.sortOrder,
        isActive: venue.isActive,
      },
      create: {
        id: venue.id,
        name: venue.name,
        city: venue.city,
        district: venue.district,
        distanceKm: venue.distanceKm,
        sortOrder: venue.sortOrder,
        isActive: venue.isActive,
        createdAt: seededRecordTimestamp,
        updatedAt: seededRecordTimestamp,
      },
    });
  }

  for (const court of seededVenueCourts) {
    await tx.venueCourt.upsert({
      where: { id: court.id },
      update: {
        venueId: court.venueId,
        name: court.name,
        sortOrder: court.sortOrder,
        isActive: court.isActive,
      },
      create: {
        id: court.id,
        venueId: court.venueId,
        name: court.name,
        sortOrder: court.sortOrder,
        isActive: court.isActive,
        createdAt: seededRecordTimestamp,
        updatedAt: seededRecordTimestamp,
      },
    });
  }

  for (const slot of seededAvailabilitySlots) {
    await tx.venueAvailabilitySlot.upsert({
      where: { id: slot.id },
      update: {
        venueId: slot.venueId,
        label: slot.label,
        startTime: slot.startTime,
        endTime: slot.endTime,
        sortOrder: slot.sortOrder,
        isActive: slot.isActive,
      },
      create: {
        id: slot.id,
        venueId: slot.venueId,
        label: slot.label,
        startTime: slot.startTime,
        endTime: slot.endTime,
        sortOrder: slot.sortOrder,
        isActive: slot.isActive,
        createdAt: seededRecordTimestamp,
        updatedAt: seededRecordTimestamp,
      },
    });
  }

  for (const preset of seededOptionPresets) {
    await tx.optionPreset.upsert({
      where: { id: preset.id },
      update: {
        kind: preset.kind,
        value: preset.value,
        label: preset.label,
        sortOrder: preset.sortOrder,
        isActive: preset.isActive,
      },
      create: {
        id: preset.id,
        kind: preset.kind,
        value: preset.value,
        label: preset.label,
        sortOrder: preset.sortOrder,
        isActive: preset.isActive,
        createdAt: seededRecordTimestamp,
        updatedAt: seededRecordTimestamp,
      },
    });
  }

  for (const match of seededMatches) {
    await tx.match.upsert({
      where: { id: match.id },
      update: {
        title: match.title,
        venueName: match.venueName,
        venueId: match.venueId,
          courtId: match.courtId,
          slotId: match.slotId,
        startTime: match.startTime,
        city: match.city,
        level: match.level,
        maxPlayers: match.maxPlayers,
        openSlots: match.openSlots,
        hostUserId: match.hostUserId,
        hostCreditScore: match.hostCreditScore,
        distanceKm: match.distanceKm,
        matchRate: match.matchRate,
      },
      create: {
        id: match.id,
        title: match.title,
        venueName: match.venueName,
        venueId: match.venueId,
          courtId: match.courtId,
          slotId: match.slotId,
        startTime: match.startTime,
        city: match.city,
        level: match.level,
        maxPlayers: match.maxPlayers,
        openSlots: match.openSlots,
        hostUserId: match.hostUserId,
        hostCreditScore: match.hostCreditScore,
        distanceKm: match.distanceKm,
        matchRate: match.matchRate,
      },
    });
  }

  for (const thread of [
    {
      id: 'match-seed-1',
      matchId: 'match-seed-1',
      title: '徐汇今晚练球局',
      venueName: '徐家汇活力馆 3 号台',
      scheduledAt: daysFromNow(2, 19, 30),
      hostUserId: 'user-reviewee-1',
      status: 'active',
      latestMessagePreview: '我大概 19:20 到，先去前台等你们。',
      latestMessageAt: daysFromNow(2, 18, 40),
      lastMessageSenderId: 'user-13800138000',
      lastMessageSenderName: '球友1380013',
    },
    {
      id: 'match-seed-past-1',
      matchId: 'match-seed-past-1',
      title: '上周末的徐汇晚场',
      venueName: '徐家汇活力馆 5 号台',
      scheduledAt: daysFromNow(-5, 19, 30),
      hostUserId: 'user-reviewee-1',
      status: 'active',
      latestMessagePreview: '辛苦今晚来打球的朋友，记得在球局结束后互相评价一下。',
      latestMessageAt: daysFromNow(-5, 22, 0),
      lastMessageSenderId: 'user-reviewee-1',
      lastMessageSenderName: '球友里卡',
    },
    {
      id: 'match-seed-2',
      matchId: 'match-seed-2',
      title: '静安明日午休快打局',
      venueName: '静安寺白领馆 2 号台',
      scheduledAt: daysFromNow(3, 12, 30),
      hostUserId: 'user-reviewee-1',
      status: 'active',
      latestMessagePreview: '明天中午刚好空出一个位置，想来的可以直接补位。',
      latestMessageAt: daysFromNow(3, 11, 0),
      lastMessageSenderId: null,
      lastMessageSenderName: '系统',
    },
  ]) {
    await tx.chatThread.upsert({
      where: { id: thread.id },
      update: thread,
      create: thread,
    });
  }

  for (const participant of [
    {
      threadId: 'match-seed-1',
      userId: 'user-reviewee-1',
      role: 'host',
      lastReadAt: new Date('2026-04-18T10:40:00+08:00'),
    },
    {
      threadId: 'match-seed-1',
      userId: 'user-13800138000',
      role: 'member',
      lastReadAt: null,
    },
    {
      threadId: 'match-seed-past-1',
      userId: 'user-reviewee-1',
      role: 'host',
      lastReadAt: null,
    },
    {
      threadId: 'match-seed-past-1',
      userId: 'user-13800138000',
      role: 'member',
      lastReadAt: null,
    },
  ]) {
    await tx.chatThreadParticipant.upsert({
      where: {
        threadId_userId: {
          threadId: participant.threadId,
          userId: participant.userId,
        },
      },
      update: participant,
      create: participant,
    });
  }

  for (const message of [
    {
      id: 'message-seed-1',
      userId: 'user-13800138000',
      kind: 'system',
      title: '申请已通过',
      content: '你申请的徐汇今晚练球局已通过，可以准备进群沟通了。',
      senderName: '系统',
      isRead: false,
      createdAt: new Date('2026-04-23T18:55:00+08:00'),
      matchId: 'match-seed-1',
      threadId: null,
    },
    {
      id: 'message-seed-2',
      userId: 'user-13800138000',
      kind: 'invite',
      title: '补位邀请',
      content: '静安寺白领馆 2 号台明天午休场刚空出一个位置，看看要不要补进来。',
      senderName: '系统',
      isRead: false,
      status: 'pending',
      createdAt: new Date('2026-04-23T10:50:00+08:00'),
      matchId: 'match-seed-2',
      threadId: null,
    },
    {
      id: 'message-seed-3',
      userId: 'user-13800138000',
      kind: 'chat',
      title: '局内沟通',
      content: '我大概 19:20 到，先去前台等你们。',
      senderId: 'user-13800138000',
      senderName: '球友1380013',
      isRead: false,
      createdAt: new Date('2026-04-23T18:40:00+08:00'),
      matchId: 'match-seed-1',
      threadId: 'match-seed-1',
    },
    {
      id: 'message-seed-4',
      userId: 'user-13800138000',
      kind: 'chat',
      title: '场地确认',
      content: '前台已经确认是 3 号台，到了直接报我手机号就行。',
      senderId: 'user-reviewee-1',
      senderName: '球友里卡',
      isRead: false,
      createdAt: new Date('2026-04-23T18:20:00+08:00'),
      matchId: 'match-seed-1',
      threadId: 'match-seed-1',
    },
    {
      id: 'message-seed-5',
      userId: 'user-13800138000',
      kind: 'chat',
      title: '路况提醒',
      content: '这个时间地铁出来走五分钟就到，开车的话停车位也还够。',
      senderId: 'user-reviewee-1',
      senderName: '球友里卡',
      isRead: false,
      createdAt: new Date('2026-04-23T18:05:00+08:00'),
      matchId: 'match-seed-1',
      threadId: 'match-seed-1',
    },
    {
      id: 'message-seed-6',
      userId: 'user-13800138000',
      kind: 'system',
      title: '开局提醒',
      content: '记得带上球拍和替换衣服，场馆里有饮水机。',
      senderName: '系统',
      isRead: false,
      createdAt: new Date('2026-04-23T17:50:00+08:00'),
      matchId: 'match-seed-1',
      threadId: null,
    },
  ]) {
    await tx.message.upsert({
      where: { id: message.id },
      update: message,
      create: message,
    });
  }

  for (const review of [
    {
      id: 'review-profile-seed-1',
      matchId: 'match-seed-1',
      reviewerId: 'user-reviewee-1',
      revieweeId: 'user-13800138000',
      score: 5,
      tags: ['on_time', 'great_communication'],
      createdAt: new Date('2026-04-17T21:30:00+08:00'),
    },
    {
      id: 'review-profile-seed-2',
      matchId: 'match-seed-2',
      reviewerId: 'user-reviewee-1',
      revieweeId: 'user-13800138000',
      score: 4,
      tags: ['positive_energy'],
      createdAt: new Date('2026-04-16T21:30:00+08:00'),
    },
  ]) {
    await tx.review.upsert({
      where: { id: review.id },
      update: review,
      create: review,
    });
  }
}

export async function seedDatabase(prisma: PrismaClient) {
  await prisma.$transaction(seedDatabaseInTransaction);
}

async function main() {
  const prisma = new PrismaClient();

  try {
    await seedDatabase(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
