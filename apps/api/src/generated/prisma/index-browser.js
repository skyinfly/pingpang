
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  phone: 'phone',
  wechatOpenId: 'wechatOpenId',
  wechatUnionId: 'wechatUnionId',
  nickname: 'nickname',
  city: 'city',
  level: 'level',
  creditScore: 'creditScore',
  createdAt: 'createdAt'
};

exports.Prisma.VenueScalarFieldEnum = {
  id: 'id',
  name: 'name',
  city: 'city',
  district: 'district',
  distanceKm: 'distanceKm',
  sortOrder: 'sortOrder',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VenueCourtScalarFieldEnum = {
  id: 'id',
  venueId: 'venueId',
  name: 'name',
  sortOrder: 'sortOrder',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VenueAvailabilitySlotScalarFieldEnum = {
  id: 'id',
  venueId: 'venueId',
  label: 'label',
  startTime: 'startTime',
  endTime: 'endTime',
  sortOrder: 'sortOrder',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OptionPresetScalarFieldEnum = {
  id: 'id',
  kind: 'kind',
  value: 'value',
  label: 'label',
  sortOrder: 'sortOrder',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MatchScalarFieldEnum = {
  id: 'id',
  title: 'title',
  venueName: 'venueName',
  venueId: 'venueId',
  courtId: 'courtId',
  slotId: 'slotId',
  startTime: 'startTime',
  city: 'city',
  level: 'level',
  maxPlayers: 'maxPlayers',
  openSlots: 'openSlots',
  status: 'status',
  checkInCode: 'checkInCode',
  hostUserId: 'hostUserId',
  hostCreditScore: 'hostCreditScore',
  distanceKm: 'distanceKm',
  matchRate: 'matchRate',
  createdAt: 'createdAt'
};

exports.Prisma.MatchApplicationScalarFieldEnum = {
  id: 'id',
  matchId: 'matchId',
  userId: 'userId',
  status: 'status',
  decisionReason: 'decisionReason',
  createdAt: 'createdAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  matchId: 'matchId',
  reviewerId: 'reviewerId',
  revieweeId: 'revieweeId',
  score: 'score',
  tags: 'tags',
  anonymous: 'anonymous',
  createdAt: 'createdAt'
};

exports.Prisma.ChatThreadScalarFieldEnum = {
  id: 'id',
  matchId: 'matchId',
  title: 'title',
  venueName: 'venueName',
  scheduledAt: 'scheduledAt',
  hostUserId: 'hostUserId',
  status: 'status',
  latestMessagePreview: 'latestMessagePreview',
  latestMessageAt: 'latestMessageAt',
  lastMessageSenderId: 'lastMessageSenderId',
  lastMessageSenderName: 'lastMessageSenderName',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChatThreadParticipantScalarFieldEnum = {
  id: 'id',
  threadId: 'threadId',
  userId: 'userId',
  role: 'role',
  joinedAt: 'joinedAt',
  lastReadAt: 'lastReadAt',
  checkedInAt: 'checkedInAt'
};

exports.Prisma.ReportScalarFieldEnum = {
  id: 'id',
  reporterId: 'reporterId',
  targetUserId: 'targetUserId',
  matchId: 'matchId',
  reason: 'reason',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  kind: 'kind',
  title: 'title',
  content: 'content',
  senderId: 'senderId',
  senderName: 'senderName',
  isRead: 'isRead',
  status: 'status',
  matchId: 'matchId',
  threadId: 'threadId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.OptionPresetKind = exports.$Enums.OptionPresetKind = {
  LEVEL: 'LEVEL',
  PLAYER_COUNT: 'PLAYER_COUNT'
};

exports.Prisma.ModelName = {
  User: 'User',
  Venue: 'Venue',
  VenueCourt: 'VenueCourt',
  VenueAvailabilitySlot: 'VenueAvailabilitySlot',
  OptionPreset: 'OptionPreset',
  Match: 'Match',
  MatchApplication: 'MatchApplication',
  Review: 'Review',
  ChatThread: 'ChatThread',
  ChatThreadParticipant: 'ChatThreadParticipant',
  Report: 'Report',
  Message: 'Message'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
