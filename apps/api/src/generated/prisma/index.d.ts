
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Venue
 * 
 */
export type Venue = $Result.DefaultSelection<Prisma.$VenuePayload>
/**
 * Model VenueCourt
 * 
 */
export type VenueCourt = $Result.DefaultSelection<Prisma.$VenueCourtPayload>
/**
 * Model VenueAvailabilitySlot
 * 
 */
export type VenueAvailabilitySlot = $Result.DefaultSelection<Prisma.$VenueAvailabilitySlotPayload>
/**
 * Model OptionPreset
 * 
 */
export type OptionPreset = $Result.DefaultSelection<Prisma.$OptionPresetPayload>
/**
 * Model Match
 * 
 */
export type Match = $Result.DefaultSelection<Prisma.$MatchPayload>
/**
 * Model MatchApplication
 * 
 */
export type MatchApplication = $Result.DefaultSelection<Prisma.$MatchApplicationPayload>
/**
 * Model Review
 * 
 */
export type Review = $Result.DefaultSelection<Prisma.$ReviewPayload>
/**
 * Model ChatThread
 * 
 */
export type ChatThread = $Result.DefaultSelection<Prisma.$ChatThreadPayload>
/**
 * Model ChatThreadParticipant
 * 
 */
export type ChatThreadParticipant = $Result.DefaultSelection<Prisma.$ChatThreadParticipantPayload>
/**
 * Model Report
 * 
 */
export type Report = $Result.DefaultSelection<Prisma.$ReportPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const OptionPresetKind: {
  LEVEL: 'LEVEL',
  PLAYER_COUNT: 'PLAYER_COUNT'
};

export type OptionPresetKind = (typeof OptionPresetKind)[keyof typeof OptionPresetKind]

}

export type OptionPresetKind = $Enums.OptionPresetKind

export const OptionPresetKind: typeof $Enums.OptionPresetKind

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.venue`: Exposes CRUD operations for the **Venue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Venues
    * const venues = await prisma.venue.findMany()
    * ```
    */
  get venue(): Prisma.VenueDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.venueCourt`: Exposes CRUD operations for the **VenueCourt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VenueCourts
    * const venueCourts = await prisma.venueCourt.findMany()
    * ```
    */
  get venueCourt(): Prisma.VenueCourtDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.venueAvailabilitySlot`: Exposes CRUD operations for the **VenueAvailabilitySlot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VenueAvailabilitySlots
    * const venueAvailabilitySlots = await prisma.venueAvailabilitySlot.findMany()
    * ```
    */
  get venueAvailabilitySlot(): Prisma.VenueAvailabilitySlotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.optionPreset`: Exposes CRUD operations for the **OptionPreset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OptionPresets
    * const optionPresets = await prisma.optionPreset.findMany()
    * ```
    */
  get optionPreset(): Prisma.OptionPresetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.match`: Exposes CRUD operations for the **Match** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Matches
    * const matches = await prisma.match.findMany()
    * ```
    */
  get match(): Prisma.MatchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.matchApplication`: Exposes CRUD operations for the **MatchApplication** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MatchApplications
    * const matchApplications = await prisma.matchApplication.findMany()
    * ```
    */
  get matchApplication(): Prisma.MatchApplicationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.review`: Exposes CRUD operations for the **Review** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reviews
    * const reviews = await prisma.review.findMany()
    * ```
    */
  get review(): Prisma.ReviewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatThread`: Exposes CRUD operations for the **ChatThread** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatThreads
    * const chatThreads = await prisma.chatThread.findMany()
    * ```
    */
  get chatThread(): Prisma.ChatThreadDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatThreadParticipant`: Exposes CRUD operations for the **ChatThreadParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatThreadParticipants
    * const chatThreadParticipants = await prisma.chatThreadParticipant.findMany()
    * ```
    */
  get chatThreadParticipant(): Prisma.ChatThreadParticipantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.report`: Exposes CRUD operations for the **Report** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reports
    * const reports = await prisma.report.findMany()
    * ```
    */
  get report(): Prisma.ReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "venue" | "venueCourt" | "venueAvailabilitySlot" | "optionPreset" | "match" | "matchApplication" | "review" | "chatThread" | "chatThreadParticipant" | "report" | "message"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Venue: {
        payload: Prisma.$VenuePayload<ExtArgs>
        fields: Prisma.VenueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VenueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VenueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>
          }
          findFirst: {
            args: Prisma.VenueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VenueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>
          }
          findMany: {
            args: Prisma.VenueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>[]
          }
          create: {
            args: Prisma.VenueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>
          }
          createMany: {
            args: Prisma.VenueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VenueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>[]
          }
          delete: {
            args: Prisma.VenueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>
          }
          update: {
            args: Prisma.VenueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>
          }
          deleteMany: {
            args: Prisma.VenueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VenueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VenueUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>[]
          }
          upsert: {
            args: Prisma.VenueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>
          }
          aggregate: {
            args: Prisma.VenueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVenue>
          }
          groupBy: {
            args: Prisma.VenueGroupByArgs<ExtArgs>
            result: $Utils.Optional<VenueGroupByOutputType>[]
          }
          count: {
            args: Prisma.VenueCountArgs<ExtArgs>
            result: $Utils.Optional<VenueCountAggregateOutputType> | number
          }
        }
      }
      VenueCourt: {
        payload: Prisma.$VenueCourtPayload<ExtArgs>
        fields: Prisma.VenueCourtFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VenueCourtFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueCourtPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VenueCourtFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueCourtPayload>
          }
          findFirst: {
            args: Prisma.VenueCourtFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueCourtPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VenueCourtFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueCourtPayload>
          }
          findMany: {
            args: Prisma.VenueCourtFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueCourtPayload>[]
          }
          create: {
            args: Prisma.VenueCourtCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueCourtPayload>
          }
          createMany: {
            args: Prisma.VenueCourtCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VenueCourtCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueCourtPayload>[]
          }
          delete: {
            args: Prisma.VenueCourtDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueCourtPayload>
          }
          update: {
            args: Prisma.VenueCourtUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueCourtPayload>
          }
          deleteMany: {
            args: Prisma.VenueCourtDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VenueCourtUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VenueCourtUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueCourtPayload>[]
          }
          upsert: {
            args: Prisma.VenueCourtUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueCourtPayload>
          }
          aggregate: {
            args: Prisma.VenueCourtAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVenueCourt>
          }
          groupBy: {
            args: Prisma.VenueCourtGroupByArgs<ExtArgs>
            result: $Utils.Optional<VenueCourtGroupByOutputType>[]
          }
          count: {
            args: Prisma.VenueCourtCountArgs<ExtArgs>
            result: $Utils.Optional<VenueCourtCountAggregateOutputType> | number
          }
        }
      }
      VenueAvailabilitySlot: {
        payload: Prisma.$VenueAvailabilitySlotPayload<ExtArgs>
        fields: Prisma.VenueAvailabilitySlotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VenueAvailabilitySlotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueAvailabilitySlotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VenueAvailabilitySlotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueAvailabilitySlotPayload>
          }
          findFirst: {
            args: Prisma.VenueAvailabilitySlotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueAvailabilitySlotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VenueAvailabilitySlotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueAvailabilitySlotPayload>
          }
          findMany: {
            args: Prisma.VenueAvailabilitySlotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueAvailabilitySlotPayload>[]
          }
          create: {
            args: Prisma.VenueAvailabilitySlotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueAvailabilitySlotPayload>
          }
          createMany: {
            args: Prisma.VenueAvailabilitySlotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VenueAvailabilitySlotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueAvailabilitySlotPayload>[]
          }
          delete: {
            args: Prisma.VenueAvailabilitySlotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueAvailabilitySlotPayload>
          }
          update: {
            args: Prisma.VenueAvailabilitySlotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueAvailabilitySlotPayload>
          }
          deleteMany: {
            args: Prisma.VenueAvailabilitySlotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VenueAvailabilitySlotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VenueAvailabilitySlotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueAvailabilitySlotPayload>[]
          }
          upsert: {
            args: Prisma.VenueAvailabilitySlotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VenueAvailabilitySlotPayload>
          }
          aggregate: {
            args: Prisma.VenueAvailabilitySlotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVenueAvailabilitySlot>
          }
          groupBy: {
            args: Prisma.VenueAvailabilitySlotGroupByArgs<ExtArgs>
            result: $Utils.Optional<VenueAvailabilitySlotGroupByOutputType>[]
          }
          count: {
            args: Prisma.VenueAvailabilitySlotCountArgs<ExtArgs>
            result: $Utils.Optional<VenueAvailabilitySlotCountAggregateOutputType> | number
          }
        }
      }
      OptionPreset: {
        payload: Prisma.$OptionPresetPayload<ExtArgs>
        fields: Prisma.OptionPresetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OptionPresetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OptionPresetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OptionPresetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OptionPresetPayload>
          }
          findFirst: {
            args: Prisma.OptionPresetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OptionPresetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OptionPresetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OptionPresetPayload>
          }
          findMany: {
            args: Prisma.OptionPresetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OptionPresetPayload>[]
          }
          create: {
            args: Prisma.OptionPresetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OptionPresetPayload>
          }
          createMany: {
            args: Prisma.OptionPresetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OptionPresetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OptionPresetPayload>[]
          }
          delete: {
            args: Prisma.OptionPresetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OptionPresetPayload>
          }
          update: {
            args: Prisma.OptionPresetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OptionPresetPayload>
          }
          deleteMany: {
            args: Prisma.OptionPresetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OptionPresetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OptionPresetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OptionPresetPayload>[]
          }
          upsert: {
            args: Prisma.OptionPresetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OptionPresetPayload>
          }
          aggregate: {
            args: Prisma.OptionPresetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOptionPreset>
          }
          groupBy: {
            args: Prisma.OptionPresetGroupByArgs<ExtArgs>
            result: $Utils.Optional<OptionPresetGroupByOutputType>[]
          }
          count: {
            args: Prisma.OptionPresetCountArgs<ExtArgs>
            result: $Utils.Optional<OptionPresetCountAggregateOutputType> | number
          }
        }
      }
      Match: {
        payload: Prisma.$MatchPayload<ExtArgs>
        fields: Prisma.MatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findFirst: {
            args: Prisma.MatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findMany: {
            args: Prisma.MatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          create: {
            args: Prisma.MatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          createMany: {
            args: Prisma.MatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          delete: {
            args: Prisma.MatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          update: {
            args: Prisma.MatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          deleteMany: {
            args: Prisma.MatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          upsert: {
            args: Prisma.MatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          aggregate: {
            args: Prisma.MatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatch>
          }
          groupBy: {
            args: Prisma.MatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchCountArgs<ExtArgs>
            result: $Utils.Optional<MatchCountAggregateOutputType> | number
          }
        }
      }
      MatchApplication: {
        payload: Prisma.$MatchApplicationPayload<ExtArgs>
        fields: Prisma.MatchApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchApplicationPayload>
          }
          findFirst: {
            args: Prisma.MatchApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchApplicationPayload>
          }
          findMany: {
            args: Prisma.MatchApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchApplicationPayload>[]
          }
          create: {
            args: Prisma.MatchApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchApplicationPayload>
          }
          createMany: {
            args: Prisma.MatchApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchApplicationPayload>[]
          }
          delete: {
            args: Prisma.MatchApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchApplicationPayload>
          }
          update: {
            args: Prisma.MatchApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchApplicationPayload>
          }
          deleteMany: {
            args: Prisma.MatchApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchApplicationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchApplicationPayload>[]
          }
          upsert: {
            args: Prisma.MatchApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchApplicationPayload>
          }
          aggregate: {
            args: Prisma.MatchApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatchApplication>
          }
          groupBy: {
            args: Prisma.MatchApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<MatchApplicationCountAggregateOutputType> | number
          }
        }
      }
      Review: {
        payload: Prisma.$ReviewPayload<ExtArgs>
        fields: Prisma.ReviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findFirst: {
            args: Prisma.ReviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findMany: {
            args: Prisma.ReviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          create: {
            args: Prisma.ReviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          createMany: {
            args: Prisma.ReviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          delete: {
            args: Prisma.ReviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          update: {
            args: Prisma.ReviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          deleteMany: {
            args: Prisma.ReviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReviewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          upsert: {
            args: Prisma.ReviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          aggregate: {
            args: Prisma.ReviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReview>
          }
          groupBy: {
            args: Prisma.ReviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReviewCountArgs<ExtArgs>
            result: $Utils.Optional<ReviewCountAggregateOutputType> | number
          }
        }
      }
      ChatThread: {
        payload: Prisma.$ChatThreadPayload<ExtArgs>
        fields: Prisma.ChatThreadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatThreadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatThreadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadPayload>
          }
          findFirst: {
            args: Prisma.ChatThreadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatThreadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadPayload>
          }
          findMany: {
            args: Prisma.ChatThreadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadPayload>[]
          }
          create: {
            args: Prisma.ChatThreadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadPayload>
          }
          createMany: {
            args: Prisma.ChatThreadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatThreadCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadPayload>[]
          }
          delete: {
            args: Prisma.ChatThreadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadPayload>
          }
          update: {
            args: Prisma.ChatThreadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadPayload>
          }
          deleteMany: {
            args: Prisma.ChatThreadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatThreadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatThreadUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadPayload>[]
          }
          upsert: {
            args: Prisma.ChatThreadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadPayload>
          }
          aggregate: {
            args: Prisma.ChatThreadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatThread>
          }
          groupBy: {
            args: Prisma.ChatThreadGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatThreadGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatThreadCountArgs<ExtArgs>
            result: $Utils.Optional<ChatThreadCountAggregateOutputType> | number
          }
        }
      }
      ChatThreadParticipant: {
        payload: Prisma.$ChatThreadParticipantPayload<ExtArgs>
        fields: Prisma.ChatThreadParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatThreadParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatThreadParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadParticipantPayload>
          }
          findFirst: {
            args: Prisma.ChatThreadParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatThreadParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadParticipantPayload>
          }
          findMany: {
            args: Prisma.ChatThreadParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadParticipantPayload>[]
          }
          create: {
            args: Prisma.ChatThreadParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadParticipantPayload>
          }
          createMany: {
            args: Prisma.ChatThreadParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatThreadParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadParticipantPayload>[]
          }
          delete: {
            args: Prisma.ChatThreadParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadParticipantPayload>
          }
          update: {
            args: Prisma.ChatThreadParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadParticipantPayload>
          }
          deleteMany: {
            args: Prisma.ChatThreadParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatThreadParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatThreadParticipantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadParticipantPayload>[]
          }
          upsert: {
            args: Prisma.ChatThreadParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatThreadParticipantPayload>
          }
          aggregate: {
            args: Prisma.ChatThreadParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatThreadParticipant>
          }
          groupBy: {
            args: Prisma.ChatThreadParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatThreadParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatThreadParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<ChatThreadParticipantCountAggregateOutputType> | number
          }
        }
      }
      Report: {
        payload: Prisma.$ReportPayload<ExtArgs>
        fields: Prisma.ReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findFirst: {
            args: Prisma.ReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findMany: {
            args: Prisma.ReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          create: {
            args: Prisma.ReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          createMany: {
            args: Prisma.ReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          delete: {
            args: Prisma.ReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          update: {
            args: Prisma.ReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          deleteMany: {
            args: Prisma.ReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          upsert: {
            args: Prisma.ReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          aggregate: {
            args: Prisma.ReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReport>
          }
          groupBy: {
            args: Prisma.ReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReportCountArgs<ExtArgs>
            result: $Utils.Optional<ReportCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    venue?: VenueOmit
    venueCourt?: VenueCourtOmit
    venueAvailabilitySlot?: VenueAvailabilitySlotOmit
    optionPreset?: OptionPresetOmit
    match?: MatchOmit
    matchApplication?: MatchApplicationOmit
    review?: ReviewOmit
    chatThread?: ChatThreadOmit
    chatThreadParticipant?: ChatThreadParticipantOmit
    report?: ReportOmit
    message?: MessageOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    hostedMatches: number
    threadMembership: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hostedMatches?: boolean | UserCountOutputTypeCountHostedMatchesArgs
    threadMembership?: boolean | UserCountOutputTypeCountThreadMembershipArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountHostedMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountThreadMembershipArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatThreadParticipantWhereInput
  }


  /**
   * Count Type VenueCountOutputType
   */

  export type VenueCountOutputType = {
    courts: number
    availabilitySlots: number
    matches: number
  }

  export type VenueCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courts?: boolean | VenueCountOutputTypeCountCourtsArgs
    availabilitySlots?: boolean | VenueCountOutputTypeCountAvailabilitySlotsArgs
    matches?: boolean | VenueCountOutputTypeCountMatchesArgs
  }

  // Custom InputTypes
  /**
   * VenueCountOutputType without action
   */
  export type VenueCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCountOutputType
     */
    select?: VenueCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VenueCountOutputType without action
   */
  export type VenueCountOutputTypeCountCourtsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VenueCourtWhereInput
  }

  /**
   * VenueCountOutputType without action
   */
  export type VenueCountOutputTypeCountAvailabilitySlotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VenueAvailabilitySlotWhereInput
  }

  /**
   * VenueCountOutputType without action
   */
  export type VenueCountOutputTypeCountMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }


  /**
   * Count Type VenueCourtCountOutputType
   */

  export type VenueCourtCountOutputType = {
    matches: number
  }

  export type VenueCourtCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    matches?: boolean | VenueCourtCountOutputTypeCountMatchesArgs
  }

  // Custom InputTypes
  /**
   * VenueCourtCountOutputType without action
   */
  export type VenueCourtCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourtCountOutputType
     */
    select?: VenueCourtCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VenueCourtCountOutputType without action
   */
  export type VenueCourtCountOutputTypeCountMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }


  /**
   * Count Type VenueAvailabilitySlotCountOutputType
   */

  export type VenueAvailabilitySlotCountOutputType = {
    matches: number
  }

  export type VenueAvailabilitySlotCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    matches?: boolean | VenueAvailabilitySlotCountOutputTypeCountMatchesArgs
  }

  // Custom InputTypes
  /**
   * VenueAvailabilitySlotCountOutputType without action
   */
  export type VenueAvailabilitySlotCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlotCountOutputType
     */
    select?: VenueAvailabilitySlotCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VenueAvailabilitySlotCountOutputType without action
   */
  export type VenueAvailabilitySlotCountOutputTypeCountMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }


  /**
   * Count Type MatchCountOutputType
   */

  export type MatchCountOutputType = {
    applications: number
  }

  export type MatchCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | MatchCountOutputTypeCountApplicationsArgs
  }

  // Custom InputTypes
  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCountOutputType
     */
    select?: MatchCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchApplicationWhereInput
  }


  /**
   * Count Type ChatThreadCountOutputType
   */

  export type ChatThreadCountOutputType = {
    participants: number
    messages: number
  }

  export type ChatThreadCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | ChatThreadCountOutputTypeCountParticipantsArgs
    messages?: boolean | ChatThreadCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ChatThreadCountOutputType without action
   */
  export type ChatThreadCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadCountOutputType
     */
    select?: ChatThreadCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChatThreadCountOutputType without action
   */
  export type ChatThreadCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatThreadParticipantWhereInput
  }

  /**
   * ChatThreadCountOutputType without action
   */
  export type ChatThreadCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    creditScore: number | null
  }

  export type UserSumAggregateOutputType = {
    creditScore: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    phone: string | null
    wechatOpenId: string | null
    wechatUnionId: string | null
    nickname: string | null
    city: string | null
    level: string | null
    creditScore: number | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    phone: string | null
    wechatOpenId: string | null
    wechatUnionId: string | null
    nickname: string | null
    city: string | null
    level: string | null
    creditScore: number | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    phone: number
    wechatOpenId: number
    wechatUnionId: number
    nickname: number
    city: number
    level: number
    creditScore: number
    createdAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    creditScore?: true
  }

  export type UserSumAggregateInputType = {
    creditScore?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    phone?: true
    wechatOpenId?: true
    wechatUnionId?: true
    nickname?: true
    city?: true
    level?: true
    creditScore?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    phone?: true
    wechatOpenId?: true
    wechatUnionId?: true
    nickname?: true
    city?: true
    level?: true
    creditScore?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    phone?: true
    wechatOpenId?: true
    wechatUnionId?: true
    nickname?: true
    city?: true
    level?: true
    creditScore?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    phone: string | null
    wechatOpenId: string | null
    wechatUnionId: string | null
    nickname: string
    city: string
    level: string
    creditScore: number
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    wechatOpenId?: boolean
    wechatUnionId?: boolean
    nickname?: boolean
    city?: boolean
    level?: boolean
    creditScore?: boolean
    createdAt?: boolean
    hostedMatches?: boolean | User$hostedMatchesArgs<ExtArgs>
    threadMembership?: boolean | User$threadMembershipArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    wechatOpenId?: boolean
    wechatUnionId?: boolean
    nickname?: boolean
    city?: boolean
    level?: boolean
    creditScore?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    wechatOpenId?: boolean
    wechatUnionId?: boolean
    nickname?: boolean
    city?: boolean
    level?: boolean
    creditScore?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    phone?: boolean
    wechatOpenId?: boolean
    wechatUnionId?: boolean
    nickname?: boolean
    city?: boolean
    level?: boolean
    creditScore?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phone" | "wechatOpenId" | "wechatUnionId" | "nickname" | "city" | "level" | "creditScore" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hostedMatches?: boolean | User$hostedMatchesArgs<ExtArgs>
    threadMembership?: boolean | User$threadMembershipArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      hostedMatches: Prisma.$MatchPayload<ExtArgs>[]
      threadMembership: Prisma.$ChatThreadParticipantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phone: string | null
      wechatOpenId: string | null
      wechatUnionId: string | null
      nickname: string
      city: string
      level: string
      creditScore: number
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    hostedMatches<T extends User$hostedMatchesArgs<ExtArgs> = {}>(args?: Subset<T, User$hostedMatchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    threadMembership<T extends User$threadMembershipArgs<ExtArgs> = {}>(args?: Subset<T, User$threadMembershipArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly wechatOpenId: FieldRef<"User", 'String'>
    readonly wechatUnionId: FieldRef<"User", 'String'>
    readonly nickname: FieldRef<"User", 'String'>
    readonly city: FieldRef<"User", 'String'>
    readonly level: FieldRef<"User", 'String'>
    readonly creditScore: FieldRef<"User", 'Int'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.hostedMatches
   */
  export type User$hostedMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * User.threadMembership
   */
  export type User$threadMembershipArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantInclude<ExtArgs> | null
    where?: ChatThreadParticipantWhereInput
    orderBy?: ChatThreadParticipantOrderByWithRelationInput | ChatThreadParticipantOrderByWithRelationInput[]
    cursor?: ChatThreadParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatThreadParticipantScalarFieldEnum | ChatThreadParticipantScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Venue
   */

  export type AggregateVenue = {
    _count: VenueCountAggregateOutputType | null
    _avg: VenueAvgAggregateOutputType | null
    _sum: VenueSumAggregateOutputType | null
    _min: VenueMinAggregateOutputType | null
    _max: VenueMaxAggregateOutputType | null
  }

  export type VenueAvgAggregateOutputType = {
    distanceKm: number | null
    sortOrder: number | null
  }

  export type VenueSumAggregateOutputType = {
    distanceKm: number | null
    sortOrder: number | null
  }

  export type VenueMinAggregateOutputType = {
    id: string | null
    name: string | null
    city: string | null
    district: string | null
    distanceKm: number | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VenueMaxAggregateOutputType = {
    id: string | null
    name: string | null
    city: string | null
    district: string | null
    distanceKm: number | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VenueCountAggregateOutputType = {
    id: number
    name: number
    city: number
    district: number
    distanceKm: number
    sortOrder: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VenueAvgAggregateInputType = {
    distanceKm?: true
    sortOrder?: true
  }

  export type VenueSumAggregateInputType = {
    distanceKm?: true
    sortOrder?: true
  }

  export type VenueMinAggregateInputType = {
    id?: true
    name?: true
    city?: true
    district?: true
    distanceKm?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VenueMaxAggregateInputType = {
    id?: true
    name?: true
    city?: true
    district?: true
    distanceKm?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VenueCountAggregateInputType = {
    id?: true
    name?: true
    city?: true
    district?: true
    distanceKm?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VenueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Venue to aggregate.
     */
    where?: VenueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Venues to fetch.
     */
    orderBy?: VenueOrderByWithRelationInput | VenueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VenueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Venues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Venues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Venues
    **/
    _count?: true | VenueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VenueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VenueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VenueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VenueMaxAggregateInputType
  }

  export type GetVenueAggregateType<T extends VenueAggregateArgs> = {
        [P in keyof T & keyof AggregateVenue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVenue[P]>
      : GetScalarType<T[P], AggregateVenue[P]>
  }




  export type VenueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VenueWhereInput
    orderBy?: VenueOrderByWithAggregationInput | VenueOrderByWithAggregationInput[]
    by: VenueScalarFieldEnum[] | VenueScalarFieldEnum
    having?: VenueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VenueCountAggregateInputType | true
    _avg?: VenueAvgAggregateInputType
    _sum?: VenueSumAggregateInputType
    _min?: VenueMinAggregateInputType
    _max?: VenueMaxAggregateInputType
  }

  export type VenueGroupByOutputType = {
    id: string
    name: string
    city: string
    district: string | null
    distanceKm: number
    sortOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: VenueCountAggregateOutputType | null
    _avg: VenueAvgAggregateOutputType | null
    _sum: VenueSumAggregateOutputType | null
    _min: VenueMinAggregateOutputType | null
    _max: VenueMaxAggregateOutputType | null
  }

  type GetVenueGroupByPayload<T extends VenueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VenueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VenueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VenueGroupByOutputType[P]>
            : GetScalarType<T[P], VenueGroupByOutputType[P]>
        }
      >
    >


  export type VenueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    city?: boolean
    district?: boolean
    distanceKm?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    courts?: boolean | Venue$courtsArgs<ExtArgs>
    availabilitySlots?: boolean | Venue$availabilitySlotsArgs<ExtArgs>
    matches?: boolean | Venue$matchesArgs<ExtArgs>
    _count?: boolean | VenueCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["venue"]>

  export type VenueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    city?: boolean
    district?: boolean
    distanceKm?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["venue"]>

  export type VenueSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    city?: boolean
    district?: boolean
    distanceKm?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["venue"]>

  export type VenueSelectScalar = {
    id?: boolean
    name?: boolean
    city?: boolean
    district?: boolean
    distanceKm?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VenueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "city" | "district" | "distanceKm" | "sortOrder" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["venue"]>
  export type VenueInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courts?: boolean | Venue$courtsArgs<ExtArgs>
    availabilitySlots?: boolean | Venue$availabilitySlotsArgs<ExtArgs>
    matches?: boolean | Venue$matchesArgs<ExtArgs>
    _count?: boolean | VenueCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VenueIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type VenueIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $VenuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Venue"
    objects: {
      courts: Prisma.$VenueCourtPayload<ExtArgs>[]
      availabilitySlots: Prisma.$VenueAvailabilitySlotPayload<ExtArgs>[]
      matches: Prisma.$MatchPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      city: string
      district: string | null
      distanceKm: number
      sortOrder: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["venue"]>
    composites: {}
  }

  type VenueGetPayload<S extends boolean | null | undefined | VenueDefaultArgs> = $Result.GetResult<Prisma.$VenuePayload, S>

  type VenueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VenueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VenueCountAggregateInputType | true
    }

  export interface VenueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Venue'], meta: { name: 'Venue' } }
    /**
     * Find zero or one Venue that matches the filter.
     * @param {VenueFindUniqueArgs} args - Arguments to find a Venue
     * @example
     * // Get one Venue
     * const venue = await prisma.venue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VenueFindUniqueArgs>(args: SelectSubset<T, VenueFindUniqueArgs<ExtArgs>>): Prisma__VenueClient<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Venue that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VenueFindUniqueOrThrowArgs} args - Arguments to find a Venue
     * @example
     * // Get one Venue
     * const venue = await prisma.venue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VenueFindUniqueOrThrowArgs>(args: SelectSubset<T, VenueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VenueClient<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Venue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueFindFirstArgs} args - Arguments to find a Venue
     * @example
     * // Get one Venue
     * const venue = await prisma.venue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VenueFindFirstArgs>(args?: SelectSubset<T, VenueFindFirstArgs<ExtArgs>>): Prisma__VenueClient<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Venue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueFindFirstOrThrowArgs} args - Arguments to find a Venue
     * @example
     * // Get one Venue
     * const venue = await prisma.venue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VenueFindFirstOrThrowArgs>(args?: SelectSubset<T, VenueFindFirstOrThrowArgs<ExtArgs>>): Prisma__VenueClient<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Venues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Venues
     * const venues = await prisma.venue.findMany()
     * 
     * // Get first 10 Venues
     * const venues = await prisma.venue.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const venueWithIdOnly = await prisma.venue.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VenueFindManyArgs>(args?: SelectSubset<T, VenueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Venue.
     * @param {VenueCreateArgs} args - Arguments to create a Venue.
     * @example
     * // Create one Venue
     * const Venue = await prisma.venue.create({
     *   data: {
     *     // ... data to create a Venue
     *   }
     * })
     * 
     */
    create<T extends VenueCreateArgs>(args: SelectSubset<T, VenueCreateArgs<ExtArgs>>): Prisma__VenueClient<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Venues.
     * @param {VenueCreateManyArgs} args - Arguments to create many Venues.
     * @example
     * // Create many Venues
     * const venue = await prisma.venue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VenueCreateManyArgs>(args?: SelectSubset<T, VenueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Venues and returns the data saved in the database.
     * @param {VenueCreateManyAndReturnArgs} args - Arguments to create many Venues.
     * @example
     * // Create many Venues
     * const venue = await prisma.venue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Venues and only return the `id`
     * const venueWithIdOnly = await prisma.venue.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VenueCreateManyAndReturnArgs>(args?: SelectSubset<T, VenueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Venue.
     * @param {VenueDeleteArgs} args - Arguments to delete one Venue.
     * @example
     * // Delete one Venue
     * const Venue = await prisma.venue.delete({
     *   where: {
     *     // ... filter to delete one Venue
     *   }
     * })
     * 
     */
    delete<T extends VenueDeleteArgs>(args: SelectSubset<T, VenueDeleteArgs<ExtArgs>>): Prisma__VenueClient<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Venue.
     * @param {VenueUpdateArgs} args - Arguments to update one Venue.
     * @example
     * // Update one Venue
     * const venue = await prisma.venue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VenueUpdateArgs>(args: SelectSubset<T, VenueUpdateArgs<ExtArgs>>): Prisma__VenueClient<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Venues.
     * @param {VenueDeleteManyArgs} args - Arguments to filter Venues to delete.
     * @example
     * // Delete a few Venues
     * const { count } = await prisma.venue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VenueDeleteManyArgs>(args?: SelectSubset<T, VenueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Venues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Venues
     * const venue = await prisma.venue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VenueUpdateManyArgs>(args: SelectSubset<T, VenueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Venues and returns the data updated in the database.
     * @param {VenueUpdateManyAndReturnArgs} args - Arguments to update many Venues.
     * @example
     * // Update many Venues
     * const venue = await prisma.venue.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Venues and only return the `id`
     * const venueWithIdOnly = await prisma.venue.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VenueUpdateManyAndReturnArgs>(args: SelectSubset<T, VenueUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Venue.
     * @param {VenueUpsertArgs} args - Arguments to update or create a Venue.
     * @example
     * // Update or create a Venue
     * const venue = await prisma.venue.upsert({
     *   create: {
     *     // ... data to create a Venue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Venue we want to update
     *   }
     * })
     */
    upsert<T extends VenueUpsertArgs>(args: SelectSubset<T, VenueUpsertArgs<ExtArgs>>): Prisma__VenueClient<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Venues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueCountArgs} args - Arguments to filter Venues to count.
     * @example
     * // Count the number of Venues
     * const count = await prisma.venue.count({
     *   where: {
     *     // ... the filter for the Venues we want to count
     *   }
     * })
    **/
    count<T extends VenueCountArgs>(
      args?: Subset<T, VenueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VenueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Venue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VenueAggregateArgs>(args: Subset<T, VenueAggregateArgs>): Prisma.PrismaPromise<GetVenueAggregateType<T>>

    /**
     * Group by Venue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VenueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VenueGroupByArgs['orderBy'] }
        : { orderBy?: VenueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VenueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVenueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Venue model
   */
  readonly fields: VenueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Venue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VenueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    courts<T extends Venue$courtsArgs<ExtArgs> = {}>(args?: Subset<T, Venue$courtsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    availabilitySlots<T extends Venue$availabilitySlotsArgs<ExtArgs> = {}>(args?: Subset<T, Venue$availabilitySlotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    matches<T extends Venue$matchesArgs<ExtArgs> = {}>(args?: Subset<T, Venue$matchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Venue model
   */
  interface VenueFieldRefs {
    readonly id: FieldRef<"Venue", 'String'>
    readonly name: FieldRef<"Venue", 'String'>
    readonly city: FieldRef<"Venue", 'String'>
    readonly district: FieldRef<"Venue", 'String'>
    readonly distanceKm: FieldRef<"Venue", 'Float'>
    readonly sortOrder: FieldRef<"Venue", 'Int'>
    readonly isActive: FieldRef<"Venue", 'Boolean'>
    readonly createdAt: FieldRef<"Venue", 'DateTime'>
    readonly updatedAt: FieldRef<"Venue", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Venue findUnique
   */
  export type VenueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null
    /**
     * Filter, which Venue to fetch.
     */
    where: VenueWhereUniqueInput
  }

  /**
   * Venue findUniqueOrThrow
   */
  export type VenueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null
    /**
     * Filter, which Venue to fetch.
     */
    where: VenueWhereUniqueInput
  }

  /**
   * Venue findFirst
   */
  export type VenueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null
    /**
     * Filter, which Venue to fetch.
     */
    where?: VenueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Venues to fetch.
     */
    orderBy?: VenueOrderByWithRelationInput | VenueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Venues.
     */
    cursor?: VenueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Venues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Venues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Venues.
     */
    distinct?: VenueScalarFieldEnum | VenueScalarFieldEnum[]
  }

  /**
   * Venue findFirstOrThrow
   */
  export type VenueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null
    /**
     * Filter, which Venue to fetch.
     */
    where?: VenueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Venues to fetch.
     */
    orderBy?: VenueOrderByWithRelationInput | VenueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Venues.
     */
    cursor?: VenueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Venues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Venues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Venues.
     */
    distinct?: VenueScalarFieldEnum | VenueScalarFieldEnum[]
  }

  /**
   * Venue findMany
   */
  export type VenueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null
    /**
     * Filter, which Venues to fetch.
     */
    where?: VenueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Venues to fetch.
     */
    orderBy?: VenueOrderByWithRelationInput | VenueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Venues.
     */
    cursor?: VenueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Venues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Venues.
     */
    skip?: number
    distinct?: VenueScalarFieldEnum | VenueScalarFieldEnum[]
  }

  /**
   * Venue create
   */
  export type VenueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null
    /**
     * The data needed to create a Venue.
     */
    data: XOR<VenueCreateInput, VenueUncheckedCreateInput>
  }

  /**
   * Venue createMany
   */
  export type VenueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Venues.
     */
    data: VenueCreateManyInput | VenueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Venue createManyAndReturn
   */
  export type VenueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * The data used to create many Venues.
     */
    data: VenueCreateManyInput | VenueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Venue update
   */
  export type VenueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null
    /**
     * The data needed to update a Venue.
     */
    data: XOR<VenueUpdateInput, VenueUncheckedUpdateInput>
    /**
     * Choose, which Venue to update.
     */
    where: VenueWhereUniqueInput
  }

  /**
   * Venue updateMany
   */
  export type VenueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Venues.
     */
    data: XOR<VenueUpdateManyMutationInput, VenueUncheckedUpdateManyInput>
    /**
     * Filter which Venues to update
     */
    where?: VenueWhereInput
    /**
     * Limit how many Venues to update.
     */
    limit?: number
  }

  /**
   * Venue updateManyAndReturn
   */
  export type VenueUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * The data used to update Venues.
     */
    data: XOR<VenueUpdateManyMutationInput, VenueUncheckedUpdateManyInput>
    /**
     * Filter which Venues to update
     */
    where?: VenueWhereInput
    /**
     * Limit how many Venues to update.
     */
    limit?: number
  }

  /**
   * Venue upsert
   */
  export type VenueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null
    /**
     * The filter to search for the Venue to update in case it exists.
     */
    where: VenueWhereUniqueInput
    /**
     * In case the Venue found by the `where` argument doesn't exist, create a new Venue with this data.
     */
    create: XOR<VenueCreateInput, VenueUncheckedCreateInput>
    /**
     * In case the Venue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VenueUpdateInput, VenueUncheckedUpdateInput>
  }

  /**
   * Venue delete
   */
  export type VenueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null
    /**
     * Filter which Venue to delete.
     */
    where: VenueWhereUniqueInput
  }

  /**
   * Venue deleteMany
   */
  export type VenueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Venues to delete
     */
    where?: VenueWhereInput
    /**
     * Limit how many Venues to delete.
     */
    limit?: number
  }

  /**
   * Venue.courts
   */
  export type Venue$courtsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtInclude<ExtArgs> | null
    where?: VenueCourtWhereInput
    orderBy?: VenueCourtOrderByWithRelationInput | VenueCourtOrderByWithRelationInput[]
    cursor?: VenueCourtWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VenueCourtScalarFieldEnum | VenueCourtScalarFieldEnum[]
  }

  /**
   * Venue.availabilitySlots
   */
  export type Venue$availabilitySlotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotInclude<ExtArgs> | null
    where?: VenueAvailabilitySlotWhereInput
    orderBy?: VenueAvailabilitySlotOrderByWithRelationInput | VenueAvailabilitySlotOrderByWithRelationInput[]
    cursor?: VenueAvailabilitySlotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VenueAvailabilitySlotScalarFieldEnum | VenueAvailabilitySlotScalarFieldEnum[]
  }

  /**
   * Venue.matches
   */
  export type Venue$matchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Venue without action
   */
  export type VenueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null
  }


  /**
   * Model VenueCourt
   */

  export type AggregateVenueCourt = {
    _count: VenueCourtCountAggregateOutputType | null
    _avg: VenueCourtAvgAggregateOutputType | null
    _sum: VenueCourtSumAggregateOutputType | null
    _min: VenueCourtMinAggregateOutputType | null
    _max: VenueCourtMaxAggregateOutputType | null
  }

  export type VenueCourtAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type VenueCourtSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type VenueCourtMinAggregateOutputType = {
    id: string | null
    venueId: string | null
    name: string | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VenueCourtMaxAggregateOutputType = {
    id: string | null
    venueId: string | null
    name: string | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VenueCourtCountAggregateOutputType = {
    id: number
    venueId: number
    name: number
    sortOrder: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VenueCourtAvgAggregateInputType = {
    sortOrder?: true
  }

  export type VenueCourtSumAggregateInputType = {
    sortOrder?: true
  }

  export type VenueCourtMinAggregateInputType = {
    id?: true
    venueId?: true
    name?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VenueCourtMaxAggregateInputType = {
    id?: true
    venueId?: true
    name?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VenueCourtCountAggregateInputType = {
    id?: true
    venueId?: true
    name?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VenueCourtAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VenueCourt to aggregate.
     */
    where?: VenueCourtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VenueCourts to fetch.
     */
    orderBy?: VenueCourtOrderByWithRelationInput | VenueCourtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VenueCourtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VenueCourts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VenueCourts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VenueCourts
    **/
    _count?: true | VenueCourtCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VenueCourtAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VenueCourtSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VenueCourtMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VenueCourtMaxAggregateInputType
  }

  export type GetVenueCourtAggregateType<T extends VenueCourtAggregateArgs> = {
        [P in keyof T & keyof AggregateVenueCourt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVenueCourt[P]>
      : GetScalarType<T[P], AggregateVenueCourt[P]>
  }




  export type VenueCourtGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VenueCourtWhereInput
    orderBy?: VenueCourtOrderByWithAggregationInput | VenueCourtOrderByWithAggregationInput[]
    by: VenueCourtScalarFieldEnum[] | VenueCourtScalarFieldEnum
    having?: VenueCourtScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VenueCourtCountAggregateInputType | true
    _avg?: VenueCourtAvgAggregateInputType
    _sum?: VenueCourtSumAggregateInputType
    _min?: VenueCourtMinAggregateInputType
    _max?: VenueCourtMaxAggregateInputType
  }

  export type VenueCourtGroupByOutputType = {
    id: string
    venueId: string
    name: string
    sortOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: VenueCourtCountAggregateOutputType | null
    _avg: VenueCourtAvgAggregateOutputType | null
    _sum: VenueCourtSumAggregateOutputType | null
    _min: VenueCourtMinAggregateOutputType | null
    _max: VenueCourtMaxAggregateOutputType | null
  }

  type GetVenueCourtGroupByPayload<T extends VenueCourtGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VenueCourtGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VenueCourtGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VenueCourtGroupByOutputType[P]>
            : GetScalarType<T[P], VenueCourtGroupByOutputType[P]>
        }
      >
    >


  export type VenueCourtSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    venueId?: boolean
    name?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    venue?: boolean | VenueDefaultArgs<ExtArgs>
    matches?: boolean | VenueCourt$matchesArgs<ExtArgs>
    _count?: boolean | VenueCourtCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["venueCourt"]>

  export type VenueCourtSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    venueId?: boolean
    name?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    venue?: boolean | VenueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["venueCourt"]>

  export type VenueCourtSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    venueId?: boolean
    name?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    venue?: boolean | VenueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["venueCourt"]>

  export type VenueCourtSelectScalar = {
    id?: boolean
    venueId?: boolean
    name?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VenueCourtOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "venueId" | "name" | "sortOrder" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["venueCourt"]>
  export type VenueCourtInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    venue?: boolean | VenueDefaultArgs<ExtArgs>
    matches?: boolean | VenueCourt$matchesArgs<ExtArgs>
    _count?: boolean | VenueCourtCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VenueCourtIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    venue?: boolean | VenueDefaultArgs<ExtArgs>
  }
  export type VenueCourtIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    venue?: boolean | VenueDefaultArgs<ExtArgs>
  }

  export type $VenueCourtPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VenueCourt"
    objects: {
      venue: Prisma.$VenuePayload<ExtArgs>
      matches: Prisma.$MatchPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      venueId: string
      name: string
      sortOrder: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["venueCourt"]>
    composites: {}
  }

  type VenueCourtGetPayload<S extends boolean | null | undefined | VenueCourtDefaultArgs> = $Result.GetResult<Prisma.$VenueCourtPayload, S>

  type VenueCourtCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VenueCourtFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VenueCourtCountAggregateInputType | true
    }

  export interface VenueCourtDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VenueCourt'], meta: { name: 'VenueCourt' } }
    /**
     * Find zero or one VenueCourt that matches the filter.
     * @param {VenueCourtFindUniqueArgs} args - Arguments to find a VenueCourt
     * @example
     * // Get one VenueCourt
     * const venueCourt = await prisma.venueCourt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VenueCourtFindUniqueArgs>(args: SelectSubset<T, VenueCourtFindUniqueArgs<ExtArgs>>): Prisma__VenueCourtClient<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VenueCourt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VenueCourtFindUniqueOrThrowArgs} args - Arguments to find a VenueCourt
     * @example
     * // Get one VenueCourt
     * const venueCourt = await prisma.venueCourt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VenueCourtFindUniqueOrThrowArgs>(args: SelectSubset<T, VenueCourtFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VenueCourtClient<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VenueCourt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueCourtFindFirstArgs} args - Arguments to find a VenueCourt
     * @example
     * // Get one VenueCourt
     * const venueCourt = await prisma.venueCourt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VenueCourtFindFirstArgs>(args?: SelectSubset<T, VenueCourtFindFirstArgs<ExtArgs>>): Prisma__VenueCourtClient<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VenueCourt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueCourtFindFirstOrThrowArgs} args - Arguments to find a VenueCourt
     * @example
     * // Get one VenueCourt
     * const venueCourt = await prisma.venueCourt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VenueCourtFindFirstOrThrowArgs>(args?: SelectSubset<T, VenueCourtFindFirstOrThrowArgs<ExtArgs>>): Prisma__VenueCourtClient<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VenueCourts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueCourtFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VenueCourts
     * const venueCourts = await prisma.venueCourt.findMany()
     * 
     * // Get first 10 VenueCourts
     * const venueCourts = await prisma.venueCourt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const venueCourtWithIdOnly = await prisma.venueCourt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VenueCourtFindManyArgs>(args?: SelectSubset<T, VenueCourtFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VenueCourt.
     * @param {VenueCourtCreateArgs} args - Arguments to create a VenueCourt.
     * @example
     * // Create one VenueCourt
     * const VenueCourt = await prisma.venueCourt.create({
     *   data: {
     *     // ... data to create a VenueCourt
     *   }
     * })
     * 
     */
    create<T extends VenueCourtCreateArgs>(args: SelectSubset<T, VenueCourtCreateArgs<ExtArgs>>): Prisma__VenueCourtClient<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VenueCourts.
     * @param {VenueCourtCreateManyArgs} args - Arguments to create many VenueCourts.
     * @example
     * // Create many VenueCourts
     * const venueCourt = await prisma.venueCourt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VenueCourtCreateManyArgs>(args?: SelectSubset<T, VenueCourtCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VenueCourts and returns the data saved in the database.
     * @param {VenueCourtCreateManyAndReturnArgs} args - Arguments to create many VenueCourts.
     * @example
     * // Create many VenueCourts
     * const venueCourt = await prisma.venueCourt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VenueCourts and only return the `id`
     * const venueCourtWithIdOnly = await prisma.venueCourt.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VenueCourtCreateManyAndReturnArgs>(args?: SelectSubset<T, VenueCourtCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VenueCourt.
     * @param {VenueCourtDeleteArgs} args - Arguments to delete one VenueCourt.
     * @example
     * // Delete one VenueCourt
     * const VenueCourt = await prisma.venueCourt.delete({
     *   where: {
     *     // ... filter to delete one VenueCourt
     *   }
     * })
     * 
     */
    delete<T extends VenueCourtDeleteArgs>(args: SelectSubset<T, VenueCourtDeleteArgs<ExtArgs>>): Prisma__VenueCourtClient<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VenueCourt.
     * @param {VenueCourtUpdateArgs} args - Arguments to update one VenueCourt.
     * @example
     * // Update one VenueCourt
     * const venueCourt = await prisma.venueCourt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VenueCourtUpdateArgs>(args: SelectSubset<T, VenueCourtUpdateArgs<ExtArgs>>): Prisma__VenueCourtClient<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VenueCourts.
     * @param {VenueCourtDeleteManyArgs} args - Arguments to filter VenueCourts to delete.
     * @example
     * // Delete a few VenueCourts
     * const { count } = await prisma.venueCourt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VenueCourtDeleteManyArgs>(args?: SelectSubset<T, VenueCourtDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VenueCourts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueCourtUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VenueCourts
     * const venueCourt = await prisma.venueCourt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VenueCourtUpdateManyArgs>(args: SelectSubset<T, VenueCourtUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VenueCourts and returns the data updated in the database.
     * @param {VenueCourtUpdateManyAndReturnArgs} args - Arguments to update many VenueCourts.
     * @example
     * // Update many VenueCourts
     * const venueCourt = await prisma.venueCourt.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VenueCourts and only return the `id`
     * const venueCourtWithIdOnly = await prisma.venueCourt.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VenueCourtUpdateManyAndReturnArgs>(args: SelectSubset<T, VenueCourtUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VenueCourt.
     * @param {VenueCourtUpsertArgs} args - Arguments to update or create a VenueCourt.
     * @example
     * // Update or create a VenueCourt
     * const venueCourt = await prisma.venueCourt.upsert({
     *   create: {
     *     // ... data to create a VenueCourt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VenueCourt we want to update
     *   }
     * })
     */
    upsert<T extends VenueCourtUpsertArgs>(args: SelectSubset<T, VenueCourtUpsertArgs<ExtArgs>>): Prisma__VenueCourtClient<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VenueCourts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueCourtCountArgs} args - Arguments to filter VenueCourts to count.
     * @example
     * // Count the number of VenueCourts
     * const count = await prisma.venueCourt.count({
     *   where: {
     *     // ... the filter for the VenueCourts we want to count
     *   }
     * })
    **/
    count<T extends VenueCourtCountArgs>(
      args?: Subset<T, VenueCourtCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VenueCourtCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VenueCourt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueCourtAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VenueCourtAggregateArgs>(args: Subset<T, VenueCourtAggregateArgs>): Prisma.PrismaPromise<GetVenueCourtAggregateType<T>>

    /**
     * Group by VenueCourt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueCourtGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VenueCourtGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VenueCourtGroupByArgs['orderBy'] }
        : { orderBy?: VenueCourtGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VenueCourtGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVenueCourtGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VenueCourt model
   */
  readonly fields: VenueCourtFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VenueCourt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VenueCourtClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    venue<T extends VenueDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VenueDefaultArgs<ExtArgs>>): Prisma__VenueClient<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    matches<T extends VenueCourt$matchesArgs<ExtArgs> = {}>(args?: Subset<T, VenueCourt$matchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VenueCourt model
   */
  interface VenueCourtFieldRefs {
    readonly id: FieldRef<"VenueCourt", 'String'>
    readonly venueId: FieldRef<"VenueCourt", 'String'>
    readonly name: FieldRef<"VenueCourt", 'String'>
    readonly sortOrder: FieldRef<"VenueCourt", 'Int'>
    readonly isActive: FieldRef<"VenueCourt", 'Boolean'>
    readonly createdAt: FieldRef<"VenueCourt", 'DateTime'>
    readonly updatedAt: FieldRef<"VenueCourt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VenueCourt findUnique
   */
  export type VenueCourtFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtInclude<ExtArgs> | null
    /**
     * Filter, which VenueCourt to fetch.
     */
    where: VenueCourtWhereUniqueInput
  }

  /**
   * VenueCourt findUniqueOrThrow
   */
  export type VenueCourtFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtInclude<ExtArgs> | null
    /**
     * Filter, which VenueCourt to fetch.
     */
    where: VenueCourtWhereUniqueInput
  }

  /**
   * VenueCourt findFirst
   */
  export type VenueCourtFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtInclude<ExtArgs> | null
    /**
     * Filter, which VenueCourt to fetch.
     */
    where?: VenueCourtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VenueCourts to fetch.
     */
    orderBy?: VenueCourtOrderByWithRelationInput | VenueCourtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VenueCourts.
     */
    cursor?: VenueCourtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VenueCourts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VenueCourts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VenueCourts.
     */
    distinct?: VenueCourtScalarFieldEnum | VenueCourtScalarFieldEnum[]
  }

  /**
   * VenueCourt findFirstOrThrow
   */
  export type VenueCourtFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtInclude<ExtArgs> | null
    /**
     * Filter, which VenueCourt to fetch.
     */
    where?: VenueCourtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VenueCourts to fetch.
     */
    orderBy?: VenueCourtOrderByWithRelationInput | VenueCourtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VenueCourts.
     */
    cursor?: VenueCourtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VenueCourts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VenueCourts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VenueCourts.
     */
    distinct?: VenueCourtScalarFieldEnum | VenueCourtScalarFieldEnum[]
  }

  /**
   * VenueCourt findMany
   */
  export type VenueCourtFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtInclude<ExtArgs> | null
    /**
     * Filter, which VenueCourts to fetch.
     */
    where?: VenueCourtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VenueCourts to fetch.
     */
    orderBy?: VenueCourtOrderByWithRelationInput | VenueCourtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VenueCourts.
     */
    cursor?: VenueCourtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VenueCourts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VenueCourts.
     */
    skip?: number
    distinct?: VenueCourtScalarFieldEnum | VenueCourtScalarFieldEnum[]
  }

  /**
   * VenueCourt create
   */
  export type VenueCourtCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtInclude<ExtArgs> | null
    /**
     * The data needed to create a VenueCourt.
     */
    data: XOR<VenueCourtCreateInput, VenueCourtUncheckedCreateInput>
  }

  /**
   * VenueCourt createMany
   */
  export type VenueCourtCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VenueCourts.
     */
    data: VenueCourtCreateManyInput | VenueCourtCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VenueCourt createManyAndReturn
   */
  export type VenueCourtCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * The data used to create many VenueCourts.
     */
    data: VenueCourtCreateManyInput | VenueCourtCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VenueCourt update
   */
  export type VenueCourtUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtInclude<ExtArgs> | null
    /**
     * The data needed to update a VenueCourt.
     */
    data: XOR<VenueCourtUpdateInput, VenueCourtUncheckedUpdateInput>
    /**
     * Choose, which VenueCourt to update.
     */
    where: VenueCourtWhereUniqueInput
  }

  /**
   * VenueCourt updateMany
   */
  export type VenueCourtUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VenueCourts.
     */
    data: XOR<VenueCourtUpdateManyMutationInput, VenueCourtUncheckedUpdateManyInput>
    /**
     * Filter which VenueCourts to update
     */
    where?: VenueCourtWhereInput
    /**
     * Limit how many VenueCourts to update.
     */
    limit?: number
  }

  /**
   * VenueCourt updateManyAndReturn
   */
  export type VenueCourtUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * The data used to update VenueCourts.
     */
    data: XOR<VenueCourtUpdateManyMutationInput, VenueCourtUncheckedUpdateManyInput>
    /**
     * Filter which VenueCourts to update
     */
    where?: VenueCourtWhereInput
    /**
     * Limit how many VenueCourts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VenueCourt upsert
   */
  export type VenueCourtUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtInclude<ExtArgs> | null
    /**
     * The filter to search for the VenueCourt to update in case it exists.
     */
    where: VenueCourtWhereUniqueInput
    /**
     * In case the VenueCourt found by the `where` argument doesn't exist, create a new VenueCourt with this data.
     */
    create: XOR<VenueCourtCreateInput, VenueCourtUncheckedCreateInput>
    /**
     * In case the VenueCourt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VenueCourtUpdateInput, VenueCourtUncheckedUpdateInput>
  }

  /**
   * VenueCourt delete
   */
  export type VenueCourtDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtInclude<ExtArgs> | null
    /**
     * Filter which VenueCourt to delete.
     */
    where: VenueCourtWhereUniqueInput
  }

  /**
   * VenueCourt deleteMany
   */
  export type VenueCourtDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VenueCourts to delete
     */
    where?: VenueCourtWhereInput
    /**
     * Limit how many VenueCourts to delete.
     */
    limit?: number
  }

  /**
   * VenueCourt.matches
   */
  export type VenueCourt$matchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * VenueCourt without action
   */
  export type VenueCourtDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtInclude<ExtArgs> | null
  }


  /**
   * Model VenueAvailabilitySlot
   */

  export type AggregateVenueAvailabilitySlot = {
    _count: VenueAvailabilitySlotCountAggregateOutputType | null
    _avg: VenueAvailabilitySlotAvgAggregateOutputType | null
    _sum: VenueAvailabilitySlotSumAggregateOutputType | null
    _min: VenueAvailabilitySlotMinAggregateOutputType | null
    _max: VenueAvailabilitySlotMaxAggregateOutputType | null
  }

  export type VenueAvailabilitySlotAvgAggregateOutputType = {
    startTime: number | null
    endTime: number | null
    sortOrder: number | null
  }

  export type VenueAvailabilitySlotSumAggregateOutputType = {
    startTime: number | null
    endTime: number | null
    sortOrder: number | null
  }

  export type VenueAvailabilitySlotMinAggregateOutputType = {
    id: string | null
    venueId: string | null
    label: string | null
    startTime: number | null
    endTime: number | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VenueAvailabilitySlotMaxAggregateOutputType = {
    id: string | null
    venueId: string | null
    label: string | null
    startTime: number | null
    endTime: number | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VenueAvailabilitySlotCountAggregateOutputType = {
    id: number
    venueId: number
    label: number
    startTime: number
    endTime: number
    sortOrder: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VenueAvailabilitySlotAvgAggregateInputType = {
    startTime?: true
    endTime?: true
    sortOrder?: true
  }

  export type VenueAvailabilitySlotSumAggregateInputType = {
    startTime?: true
    endTime?: true
    sortOrder?: true
  }

  export type VenueAvailabilitySlotMinAggregateInputType = {
    id?: true
    venueId?: true
    label?: true
    startTime?: true
    endTime?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VenueAvailabilitySlotMaxAggregateInputType = {
    id?: true
    venueId?: true
    label?: true
    startTime?: true
    endTime?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VenueAvailabilitySlotCountAggregateInputType = {
    id?: true
    venueId?: true
    label?: true
    startTime?: true
    endTime?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VenueAvailabilitySlotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VenueAvailabilitySlot to aggregate.
     */
    where?: VenueAvailabilitySlotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VenueAvailabilitySlots to fetch.
     */
    orderBy?: VenueAvailabilitySlotOrderByWithRelationInput | VenueAvailabilitySlotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VenueAvailabilitySlotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VenueAvailabilitySlots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VenueAvailabilitySlots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VenueAvailabilitySlots
    **/
    _count?: true | VenueAvailabilitySlotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VenueAvailabilitySlotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VenueAvailabilitySlotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VenueAvailabilitySlotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VenueAvailabilitySlotMaxAggregateInputType
  }

  export type GetVenueAvailabilitySlotAggregateType<T extends VenueAvailabilitySlotAggregateArgs> = {
        [P in keyof T & keyof AggregateVenueAvailabilitySlot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVenueAvailabilitySlot[P]>
      : GetScalarType<T[P], AggregateVenueAvailabilitySlot[P]>
  }




  export type VenueAvailabilitySlotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VenueAvailabilitySlotWhereInput
    orderBy?: VenueAvailabilitySlotOrderByWithAggregationInput | VenueAvailabilitySlotOrderByWithAggregationInput[]
    by: VenueAvailabilitySlotScalarFieldEnum[] | VenueAvailabilitySlotScalarFieldEnum
    having?: VenueAvailabilitySlotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VenueAvailabilitySlotCountAggregateInputType | true
    _avg?: VenueAvailabilitySlotAvgAggregateInputType
    _sum?: VenueAvailabilitySlotSumAggregateInputType
    _min?: VenueAvailabilitySlotMinAggregateInputType
    _max?: VenueAvailabilitySlotMaxAggregateInputType
  }

  export type VenueAvailabilitySlotGroupByOutputType = {
    id: string
    venueId: string
    label: string
    startTime: number
    endTime: number
    sortOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: VenueAvailabilitySlotCountAggregateOutputType | null
    _avg: VenueAvailabilitySlotAvgAggregateOutputType | null
    _sum: VenueAvailabilitySlotSumAggregateOutputType | null
    _min: VenueAvailabilitySlotMinAggregateOutputType | null
    _max: VenueAvailabilitySlotMaxAggregateOutputType | null
  }

  type GetVenueAvailabilitySlotGroupByPayload<T extends VenueAvailabilitySlotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VenueAvailabilitySlotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VenueAvailabilitySlotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VenueAvailabilitySlotGroupByOutputType[P]>
            : GetScalarType<T[P], VenueAvailabilitySlotGroupByOutputType[P]>
        }
      >
    >


  export type VenueAvailabilitySlotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    venueId?: boolean
    label?: boolean
    startTime?: boolean
    endTime?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    venue?: boolean | VenueDefaultArgs<ExtArgs>
    matches?: boolean | VenueAvailabilitySlot$matchesArgs<ExtArgs>
    _count?: boolean | VenueAvailabilitySlotCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["venueAvailabilitySlot"]>

  export type VenueAvailabilitySlotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    venueId?: boolean
    label?: boolean
    startTime?: boolean
    endTime?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    venue?: boolean | VenueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["venueAvailabilitySlot"]>

  export type VenueAvailabilitySlotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    venueId?: boolean
    label?: boolean
    startTime?: boolean
    endTime?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    venue?: boolean | VenueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["venueAvailabilitySlot"]>

  export type VenueAvailabilitySlotSelectScalar = {
    id?: boolean
    venueId?: boolean
    label?: boolean
    startTime?: boolean
    endTime?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VenueAvailabilitySlotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "venueId" | "label" | "startTime" | "endTime" | "sortOrder" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["venueAvailabilitySlot"]>
  export type VenueAvailabilitySlotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    venue?: boolean | VenueDefaultArgs<ExtArgs>
    matches?: boolean | VenueAvailabilitySlot$matchesArgs<ExtArgs>
    _count?: boolean | VenueAvailabilitySlotCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VenueAvailabilitySlotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    venue?: boolean | VenueDefaultArgs<ExtArgs>
  }
  export type VenueAvailabilitySlotIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    venue?: boolean | VenueDefaultArgs<ExtArgs>
  }

  export type $VenueAvailabilitySlotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VenueAvailabilitySlot"
    objects: {
      venue: Prisma.$VenuePayload<ExtArgs>
      matches: Prisma.$MatchPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      venueId: string
      label: string
      startTime: number
      endTime: number
      sortOrder: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["venueAvailabilitySlot"]>
    composites: {}
  }

  type VenueAvailabilitySlotGetPayload<S extends boolean | null | undefined | VenueAvailabilitySlotDefaultArgs> = $Result.GetResult<Prisma.$VenueAvailabilitySlotPayload, S>

  type VenueAvailabilitySlotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VenueAvailabilitySlotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VenueAvailabilitySlotCountAggregateInputType | true
    }

  export interface VenueAvailabilitySlotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VenueAvailabilitySlot'], meta: { name: 'VenueAvailabilitySlot' } }
    /**
     * Find zero or one VenueAvailabilitySlot that matches the filter.
     * @param {VenueAvailabilitySlotFindUniqueArgs} args - Arguments to find a VenueAvailabilitySlot
     * @example
     * // Get one VenueAvailabilitySlot
     * const venueAvailabilitySlot = await prisma.venueAvailabilitySlot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VenueAvailabilitySlotFindUniqueArgs>(args: SelectSubset<T, VenueAvailabilitySlotFindUniqueArgs<ExtArgs>>): Prisma__VenueAvailabilitySlotClient<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VenueAvailabilitySlot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VenueAvailabilitySlotFindUniqueOrThrowArgs} args - Arguments to find a VenueAvailabilitySlot
     * @example
     * // Get one VenueAvailabilitySlot
     * const venueAvailabilitySlot = await prisma.venueAvailabilitySlot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VenueAvailabilitySlotFindUniqueOrThrowArgs>(args: SelectSubset<T, VenueAvailabilitySlotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VenueAvailabilitySlotClient<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VenueAvailabilitySlot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueAvailabilitySlotFindFirstArgs} args - Arguments to find a VenueAvailabilitySlot
     * @example
     * // Get one VenueAvailabilitySlot
     * const venueAvailabilitySlot = await prisma.venueAvailabilitySlot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VenueAvailabilitySlotFindFirstArgs>(args?: SelectSubset<T, VenueAvailabilitySlotFindFirstArgs<ExtArgs>>): Prisma__VenueAvailabilitySlotClient<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VenueAvailabilitySlot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueAvailabilitySlotFindFirstOrThrowArgs} args - Arguments to find a VenueAvailabilitySlot
     * @example
     * // Get one VenueAvailabilitySlot
     * const venueAvailabilitySlot = await prisma.venueAvailabilitySlot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VenueAvailabilitySlotFindFirstOrThrowArgs>(args?: SelectSubset<T, VenueAvailabilitySlotFindFirstOrThrowArgs<ExtArgs>>): Prisma__VenueAvailabilitySlotClient<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VenueAvailabilitySlots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueAvailabilitySlotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VenueAvailabilitySlots
     * const venueAvailabilitySlots = await prisma.venueAvailabilitySlot.findMany()
     * 
     * // Get first 10 VenueAvailabilitySlots
     * const venueAvailabilitySlots = await prisma.venueAvailabilitySlot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const venueAvailabilitySlotWithIdOnly = await prisma.venueAvailabilitySlot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VenueAvailabilitySlotFindManyArgs>(args?: SelectSubset<T, VenueAvailabilitySlotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VenueAvailabilitySlot.
     * @param {VenueAvailabilitySlotCreateArgs} args - Arguments to create a VenueAvailabilitySlot.
     * @example
     * // Create one VenueAvailabilitySlot
     * const VenueAvailabilitySlot = await prisma.venueAvailabilitySlot.create({
     *   data: {
     *     // ... data to create a VenueAvailabilitySlot
     *   }
     * })
     * 
     */
    create<T extends VenueAvailabilitySlotCreateArgs>(args: SelectSubset<T, VenueAvailabilitySlotCreateArgs<ExtArgs>>): Prisma__VenueAvailabilitySlotClient<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VenueAvailabilitySlots.
     * @param {VenueAvailabilitySlotCreateManyArgs} args - Arguments to create many VenueAvailabilitySlots.
     * @example
     * // Create many VenueAvailabilitySlots
     * const venueAvailabilitySlot = await prisma.venueAvailabilitySlot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VenueAvailabilitySlotCreateManyArgs>(args?: SelectSubset<T, VenueAvailabilitySlotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VenueAvailabilitySlots and returns the data saved in the database.
     * @param {VenueAvailabilitySlotCreateManyAndReturnArgs} args - Arguments to create many VenueAvailabilitySlots.
     * @example
     * // Create many VenueAvailabilitySlots
     * const venueAvailabilitySlot = await prisma.venueAvailabilitySlot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VenueAvailabilitySlots and only return the `id`
     * const venueAvailabilitySlotWithIdOnly = await prisma.venueAvailabilitySlot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VenueAvailabilitySlotCreateManyAndReturnArgs>(args?: SelectSubset<T, VenueAvailabilitySlotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VenueAvailabilitySlot.
     * @param {VenueAvailabilitySlotDeleteArgs} args - Arguments to delete one VenueAvailabilitySlot.
     * @example
     * // Delete one VenueAvailabilitySlot
     * const VenueAvailabilitySlot = await prisma.venueAvailabilitySlot.delete({
     *   where: {
     *     // ... filter to delete one VenueAvailabilitySlot
     *   }
     * })
     * 
     */
    delete<T extends VenueAvailabilitySlotDeleteArgs>(args: SelectSubset<T, VenueAvailabilitySlotDeleteArgs<ExtArgs>>): Prisma__VenueAvailabilitySlotClient<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VenueAvailabilitySlot.
     * @param {VenueAvailabilitySlotUpdateArgs} args - Arguments to update one VenueAvailabilitySlot.
     * @example
     * // Update one VenueAvailabilitySlot
     * const venueAvailabilitySlot = await prisma.venueAvailabilitySlot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VenueAvailabilitySlotUpdateArgs>(args: SelectSubset<T, VenueAvailabilitySlotUpdateArgs<ExtArgs>>): Prisma__VenueAvailabilitySlotClient<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VenueAvailabilitySlots.
     * @param {VenueAvailabilitySlotDeleteManyArgs} args - Arguments to filter VenueAvailabilitySlots to delete.
     * @example
     * // Delete a few VenueAvailabilitySlots
     * const { count } = await prisma.venueAvailabilitySlot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VenueAvailabilitySlotDeleteManyArgs>(args?: SelectSubset<T, VenueAvailabilitySlotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VenueAvailabilitySlots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueAvailabilitySlotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VenueAvailabilitySlots
     * const venueAvailabilitySlot = await prisma.venueAvailabilitySlot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VenueAvailabilitySlotUpdateManyArgs>(args: SelectSubset<T, VenueAvailabilitySlotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VenueAvailabilitySlots and returns the data updated in the database.
     * @param {VenueAvailabilitySlotUpdateManyAndReturnArgs} args - Arguments to update many VenueAvailabilitySlots.
     * @example
     * // Update many VenueAvailabilitySlots
     * const venueAvailabilitySlot = await prisma.venueAvailabilitySlot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VenueAvailabilitySlots and only return the `id`
     * const venueAvailabilitySlotWithIdOnly = await prisma.venueAvailabilitySlot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VenueAvailabilitySlotUpdateManyAndReturnArgs>(args: SelectSubset<T, VenueAvailabilitySlotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VenueAvailabilitySlot.
     * @param {VenueAvailabilitySlotUpsertArgs} args - Arguments to update or create a VenueAvailabilitySlot.
     * @example
     * // Update or create a VenueAvailabilitySlot
     * const venueAvailabilitySlot = await prisma.venueAvailabilitySlot.upsert({
     *   create: {
     *     // ... data to create a VenueAvailabilitySlot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VenueAvailabilitySlot we want to update
     *   }
     * })
     */
    upsert<T extends VenueAvailabilitySlotUpsertArgs>(args: SelectSubset<T, VenueAvailabilitySlotUpsertArgs<ExtArgs>>): Prisma__VenueAvailabilitySlotClient<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VenueAvailabilitySlots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueAvailabilitySlotCountArgs} args - Arguments to filter VenueAvailabilitySlots to count.
     * @example
     * // Count the number of VenueAvailabilitySlots
     * const count = await prisma.venueAvailabilitySlot.count({
     *   where: {
     *     // ... the filter for the VenueAvailabilitySlots we want to count
     *   }
     * })
    **/
    count<T extends VenueAvailabilitySlotCountArgs>(
      args?: Subset<T, VenueAvailabilitySlotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VenueAvailabilitySlotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VenueAvailabilitySlot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueAvailabilitySlotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VenueAvailabilitySlotAggregateArgs>(args: Subset<T, VenueAvailabilitySlotAggregateArgs>): Prisma.PrismaPromise<GetVenueAvailabilitySlotAggregateType<T>>

    /**
     * Group by VenueAvailabilitySlot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueAvailabilitySlotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VenueAvailabilitySlotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VenueAvailabilitySlotGroupByArgs['orderBy'] }
        : { orderBy?: VenueAvailabilitySlotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VenueAvailabilitySlotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVenueAvailabilitySlotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VenueAvailabilitySlot model
   */
  readonly fields: VenueAvailabilitySlotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VenueAvailabilitySlot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VenueAvailabilitySlotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    venue<T extends VenueDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VenueDefaultArgs<ExtArgs>>): Prisma__VenueClient<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    matches<T extends VenueAvailabilitySlot$matchesArgs<ExtArgs> = {}>(args?: Subset<T, VenueAvailabilitySlot$matchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VenueAvailabilitySlot model
   */
  interface VenueAvailabilitySlotFieldRefs {
    readonly id: FieldRef<"VenueAvailabilitySlot", 'String'>
    readonly venueId: FieldRef<"VenueAvailabilitySlot", 'String'>
    readonly label: FieldRef<"VenueAvailabilitySlot", 'String'>
    readonly startTime: FieldRef<"VenueAvailabilitySlot", 'Int'>
    readonly endTime: FieldRef<"VenueAvailabilitySlot", 'Int'>
    readonly sortOrder: FieldRef<"VenueAvailabilitySlot", 'Int'>
    readonly isActive: FieldRef<"VenueAvailabilitySlot", 'Boolean'>
    readonly createdAt: FieldRef<"VenueAvailabilitySlot", 'DateTime'>
    readonly updatedAt: FieldRef<"VenueAvailabilitySlot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VenueAvailabilitySlot findUnique
   */
  export type VenueAvailabilitySlotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotInclude<ExtArgs> | null
    /**
     * Filter, which VenueAvailabilitySlot to fetch.
     */
    where: VenueAvailabilitySlotWhereUniqueInput
  }

  /**
   * VenueAvailabilitySlot findUniqueOrThrow
   */
  export type VenueAvailabilitySlotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotInclude<ExtArgs> | null
    /**
     * Filter, which VenueAvailabilitySlot to fetch.
     */
    where: VenueAvailabilitySlotWhereUniqueInput
  }

  /**
   * VenueAvailabilitySlot findFirst
   */
  export type VenueAvailabilitySlotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotInclude<ExtArgs> | null
    /**
     * Filter, which VenueAvailabilitySlot to fetch.
     */
    where?: VenueAvailabilitySlotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VenueAvailabilitySlots to fetch.
     */
    orderBy?: VenueAvailabilitySlotOrderByWithRelationInput | VenueAvailabilitySlotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VenueAvailabilitySlots.
     */
    cursor?: VenueAvailabilitySlotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VenueAvailabilitySlots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VenueAvailabilitySlots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VenueAvailabilitySlots.
     */
    distinct?: VenueAvailabilitySlotScalarFieldEnum | VenueAvailabilitySlotScalarFieldEnum[]
  }

  /**
   * VenueAvailabilitySlot findFirstOrThrow
   */
  export type VenueAvailabilitySlotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotInclude<ExtArgs> | null
    /**
     * Filter, which VenueAvailabilitySlot to fetch.
     */
    where?: VenueAvailabilitySlotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VenueAvailabilitySlots to fetch.
     */
    orderBy?: VenueAvailabilitySlotOrderByWithRelationInput | VenueAvailabilitySlotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VenueAvailabilitySlots.
     */
    cursor?: VenueAvailabilitySlotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VenueAvailabilitySlots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VenueAvailabilitySlots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VenueAvailabilitySlots.
     */
    distinct?: VenueAvailabilitySlotScalarFieldEnum | VenueAvailabilitySlotScalarFieldEnum[]
  }

  /**
   * VenueAvailabilitySlot findMany
   */
  export type VenueAvailabilitySlotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotInclude<ExtArgs> | null
    /**
     * Filter, which VenueAvailabilitySlots to fetch.
     */
    where?: VenueAvailabilitySlotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VenueAvailabilitySlots to fetch.
     */
    orderBy?: VenueAvailabilitySlotOrderByWithRelationInput | VenueAvailabilitySlotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VenueAvailabilitySlots.
     */
    cursor?: VenueAvailabilitySlotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VenueAvailabilitySlots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VenueAvailabilitySlots.
     */
    skip?: number
    distinct?: VenueAvailabilitySlotScalarFieldEnum | VenueAvailabilitySlotScalarFieldEnum[]
  }

  /**
   * VenueAvailabilitySlot create
   */
  export type VenueAvailabilitySlotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotInclude<ExtArgs> | null
    /**
     * The data needed to create a VenueAvailabilitySlot.
     */
    data: XOR<VenueAvailabilitySlotCreateInput, VenueAvailabilitySlotUncheckedCreateInput>
  }

  /**
   * VenueAvailabilitySlot createMany
   */
  export type VenueAvailabilitySlotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VenueAvailabilitySlots.
     */
    data: VenueAvailabilitySlotCreateManyInput | VenueAvailabilitySlotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VenueAvailabilitySlot createManyAndReturn
   */
  export type VenueAvailabilitySlotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * The data used to create many VenueAvailabilitySlots.
     */
    data: VenueAvailabilitySlotCreateManyInput | VenueAvailabilitySlotCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VenueAvailabilitySlot update
   */
  export type VenueAvailabilitySlotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotInclude<ExtArgs> | null
    /**
     * The data needed to update a VenueAvailabilitySlot.
     */
    data: XOR<VenueAvailabilitySlotUpdateInput, VenueAvailabilitySlotUncheckedUpdateInput>
    /**
     * Choose, which VenueAvailabilitySlot to update.
     */
    where: VenueAvailabilitySlotWhereUniqueInput
  }

  /**
   * VenueAvailabilitySlot updateMany
   */
  export type VenueAvailabilitySlotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VenueAvailabilitySlots.
     */
    data: XOR<VenueAvailabilitySlotUpdateManyMutationInput, VenueAvailabilitySlotUncheckedUpdateManyInput>
    /**
     * Filter which VenueAvailabilitySlots to update
     */
    where?: VenueAvailabilitySlotWhereInput
    /**
     * Limit how many VenueAvailabilitySlots to update.
     */
    limit?: number
  }

  /**
   * VenueAvailabilitySlot updateManyAndReturn
   */
  export type VenueAvailabilitySlotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * The data used to update VenueAvailabilitySlots.
     */
    data: XOR<VenueAvailabilitySlotUpdateManyMutationInput, VenueAvailabilitySlotUncheckedUpdateManyInput>
    /**
     * Filter which VenueAvailabilitySlots to update
     */
    where?: VenueAvailabilitySlotWhereInput
    /**
     * Limit how many VenueAvailabilitySlots to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VenueAvailabilitySlot upsert
   */
  export type VenueAvailabilitySlotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotInclude<ExtArgs> | null
    /**
     * The filter to search for the VenueAvailabilitySlot to update in case it exists.
     */
    where: VenueAvailabilitySlotWhereUniqueInput
    /**
     * In case the VenueAvailabilitySlot found by the `where` argument doesn't exist, create a new VenueAvailabilitySlot with this data.
     */
    create: XOR<VenueAvailabilitySlotCreateInput, VenueAvailabilitySlotUncheckedCreateInput>
    /**
     * In case the VenueAvailabilitySlot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VenueAvailabilitySlotUpdateInput, VenueAvailabilitySlotUncheckedUpdateInput>
  }

  /**
   * VenueAvailabilitySlot delete
   */
  export type VenueAvailabilitySlotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotInclude<ExtArgs> | null
    /**
     * Filter which VenueAvailabilitySlot to delete.
     */
    where: VenueAvailabilitySlotWhereUniqueInput
  }

  /**
   * VenueAvailabilitySlot deleteMany
   */
  export type VenueAvailabilitySlotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VenueAvailabilitySlots to delete
     */
    where?: VenueAvailabilitySlotWhereInput
    /**
     * Limit how many VenueAvailabilitySlots to delete.
     */
    limit?: number
  }

  /**
   * VenueAvailabilitySlot.matches
   */
  export type VenueAvailabilitySlot$matchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * VenueAvailabilitySlot without action
   */
  export type VenueAvailabilitySlotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotInclude<ExtArgs> | null
  }


  /**
   * Model OptionPreset
   */

  export type AggregateOptionPreset = {
    _count: OptionPresetCountAggregateOutputType | null
    _avg: OptionPresetAvgAggregateOutputType | null
    _sum: OptionPresetSumAggregateOutputType | null
    _min: OptionPresetMinAggregateOutputType | null
    _max: OptionPresetMaxAggregateOutputType | null
  }

  export type OptionPresetAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type OptionPresetSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type OptionPresetMinAggregateOutputType = {
    id: string | null
    kind: $Enums.OptionPresetKind | null
    value: string | null
    label: string | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OptionPresetMaxAggregateOutputType = {
    id: string | null
    kind: $Enums.OptionPresetKind | null
    value: string | null
    label: string | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OptionPresetCountAggregateOutputType = {
    id: number
    kind: number
    value: number
    label: number
    sortOrder: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OptionPresetAvgAggregateInputType = {
    sortOrder?: true
  }

  export type OptionPresetSumAggregateInputType = {
    sortOrder?: true
  }

  export type OptionPresetMinAggregateInputType = {
    id?: true
    kind?: true
    value?: true
    label?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OptionPresetMaxAggregateInputType = {
    id?: true
    kind?: true
    value?: true
    label?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OptionPresetCountAggregateInputType = {
    id?: true
    kind?: true
    value?: true
    label?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OptionPresetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OptionPreset to aggregate.
     */
    where?: OptionPresetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OptionPresets to fetch.
     */
    orderBy?: OptionPresetOrderByWithRelationInput | OptionPresetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OptionPresetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OptionPresets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OptionPresets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OptionPresets
    **/
    _count?: true | OptionPresetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OptionPresetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OptionPresetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OptionPresetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OptionPresetMaxAggregateInputType
  }

  export type GetOptionPresetAggregateType<T extends OptionPresetAggregateArgs> = {
        [P in keyof T & keyof AggregateOptionPreset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOptionPreset[P]>
      : GetScalarType<T[P], AggregateOptionPreset[P]>
  }




  export type OptionPresetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OptionPresetWhereInput
    orderBy?: OptionPresetOrderByWithAggregationInput | OptionPresetOrderByWithAggregationInput[]
    by: OptionPresetScalarFieldEnum[] | OptionPresetScalarFieldEnum
    having?: OptionPresetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OptionPresetCountAggregateInputType | true
    _avg?: OptionPresetAvgAggregateInputType
    _sum?: OptionPresetSumAggregateInputType
    _min?: OptionPresetMinAggregateInputType
    _max?: OptionPresetMaxAggregateInputType
  }

  export type OptionPresetGroupByOutputType = {
    id: string
    kind: $Enums.OptionPresetKind
    value: string
    label: string
    sortOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: OptionPresetCountAggregateOutputType | null
    _avg: OptionPresetAvgAggregateOutputType | null
    _sum: OptionPresetSumAggregateOutputType | null
    _min: OptionPresetMinAggregateOutputType | null
    _max: OptionPresetMaxAggregateOutputType | null
  }

  type GetOptionPresetGroupByPayload<T extends OptionPresetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OptionPresetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OptionPresetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OptionPresetGroupByOutputType[P]>
            : GetScalarType<T[P], OptionPresetGroupByOutputType[P]>
        }
      >
    >


  export type OptionPresetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    value?: boolean
    label?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["optionPreset"]>

  export type OptionPresetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    value?: boolean
    label?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["optionPreset"]>

  export type OptionPresetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    value?: boolean
    label?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["optionPreset"]>

  export type OptionPresetSelectScalar = {
    id?: boolean
    kind?: boolean
    value?: boolean
    label?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OptionPresetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kind" | "value" | "label" | "sortOrder" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["optionPreset"]>

  export type $OptionPresetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OptionPreset"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kind: $Enums.OptionPresetKind
      value: string
      label: string
      sortOrder: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["optionPreset"]>
    composites: {}
  }

  type OptionPresetGetPayload<S extends boolean | null | undefined | OptionPresetDefaultArgs> = $Result.GetResult<Prisma.$OptionPresetPayload, S>

  type OptionPresetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OptionPresetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OptionPresetCountAggregateInputType | true
    }

  export interface OptionPresetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OptionPreset'], meta: { name: 'OptionPreset' } }
    /**
     * Find zero or one OptionPreset that matches the filter.
     * @param {OptionPresetFindUniqueArgs} args - Arguments to find a OptionPreset
     * @example
     * // Get one OptionPreset
     * const optionPreset = await prisma.optionPreset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OptionPresetFindUniqueArgs>(args: SelectSubset<T, OptionPresetFindUniqueArgs<ExtArgs>>): Prisma__OptionPresetClient<$Result.GetResult<Prisma.$OptionPresetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OptionPreset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OptionPresetFindUniqueOrThrowArgs} args - Arguments to find a OptionPreset
     * @example
     * // Get one OptionPreset
     * const optionPreset = await prisma.optionPreset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OptionPresetFindUniqueOrThrowArgs>(args: SelectSubset<T, OptionPresetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OptionPresetClient<$Result.GetResult<Prisma.$OptionPresetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OptionPreset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionPresetFindFirstArgs} args - Arguments to find a OptionPreset
     * @example
     * // Get one OptionPreset
     * const optionPreset = await prisma.optionPreset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OptionPresetFindFirstArgs>(args?: SelectSubset<T, OptionPresetFindFirstArgs<ExtArgs>>): Prisma__OptionPresetClient<$Result.GetResult<Prisma.$OptionPresetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OptionPreset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionPresetFindFirstOrThrowArgs} args - Arguments to find a OptionPreset
     * @example
     * // Get one OptionPreset
     * const optionPreset = await prisma.optionPreset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OptionPresetFindFirstOrThrowArgs>(args?: SelectSubset<T, OptionPresetFindFirstOrThrowArgs<ExtArgs>>): Prisma__OptionPresetClient<$Result.GetResult<Prisma.$OptionPresetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OptionPresets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionPresetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OptionPresets
     * const optionPresets = await prisma.optionPreset.findMany()
     * 
     * // Get first 10 OptionPresets
     * const optionPresets = await prisma.optionPreset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const optionPresetWithIdOnly = await prisma.optionPreset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OptionPresetFindManyArgs>(args?: SelectSubset<T, OptionPresetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OptionPresetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OptionPreset.
     * @param {OptionPresetCreateArgs} args - Arguments to create a OptionPreset.
     * @example
     * // Create one OptionPreset
     * const OptionPreset = await prisma.optionPreset.create({
     *   data: {
     *     // ... data to create a OptionPreset
     *   }
     * })
     * 
     */
    create<T extends OptionPresetCreateArgs>(args: SelectSubset<T, OptionPresetCreateArgs<ExtArgs>>): Prisma__OptionPresetClient<$Result.GetResult<Prisma.$OptionPresetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OptionPresets.
     * @param {OptionPresetCreateManyArgs} args - Arguments to create many OptionPresets.
     * @example
     * // Create many OptionPresets
     * const optionPreset = await prisma.optionPreset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OptionPresetCreateManyArgs>(args?: SelectSubset<T, OptionPresetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OptionPresets and returns the data saved in the database.
     * @param {OptionPresetCreateManyAndReturnArgs} args - Arguments to create many OptionPresets.
     * @example
     * // Create many OptionPresets
     * const optionPreset = await prisma.optionPreset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OptionPresets and only return the `id`
     * const optionPresetWithIdOnly = await prisma.optionPreset.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OptionPresetCreateManyAndReturnArgs>(args?: SelectSubset<T, OptionPresetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OptionPresetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OptionPreset.
     * @param {OptionPresetDeleteArgs} args - Arguments to delete one OptionPreset.
     * @example
     * // Delete one OptionPreset
     * const OptionPreset = await prisma.optionPreset.delete({
     *   where: {
     *     // ... filter to delete one OptionPreset
     *   }
     * })
     * 
     */
    delete<T extends OptionPresetDeleteArgs>(args: SelectSubset<T, OptionPresetDeleteArgs<ExtArgs>>): Prisma__OptionPresetClient<$Result.GetResult<Prisma.$OptionPresetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OptionPreset.
     * @param {OptionPresetUpdateArgs} args - Arguments to update one OptionPreset.
     * @example
     * // Update one OptionPreset
     * const optionPreset = await prisma.optionPreset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OptionPresetUpdateArgs>(args: SelectSubset<T, OptionPresetUpdateArgs<ExtArgs>>): Prisma__OptionPresetClient<$Result.GetResult<Prisma.$OptionPresetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OptionPresets.
     * @param {OptionPresetDeleteManyArgs} args - Arguments to filter OptionPresets to delete.
     * @example
     * // Delete a few OptionPresets
     * const { count } = await prisma.optionPreset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OptionPresetDeleteManyArgs>(args?: SelectSubset<T, OptionPresetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OptionPresets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionPresetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OptionPresets
     * const optionPreset = await prisma.optionPreset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OptionPresetUpdateManyArgs>(args: SelectSubset<T, OptionPresetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OptionPresets and returns the data updated in the database.
     * @param {OptionPresetUpdateManyAndReturnArgs} args - Arguments to update many OptionPresets.
     * @example
     * // Update many OptionPresets
     * const optionPreset = await prisma.optionPreset.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OptionPresets and only return the `id`
     * const optionPresetWithIdOnly = await prisma.optionPreset.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OptionPresetUpdateManyAndReturnArgs>(args: SelectSubset<T, OptionPresetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OptionPresetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OptionPreset.
     * @param {OptionPresetUpsertArgs} args - Arguments to update or create a OptionPreset.
     * @example
     * // Update or create a OptionPreset
     * const optionPreset = await prisma.optionPreset.upsert({
     *   create: {
     *     // ... data to create a OptionPreset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OptionPreset we want to update
     *   }
     * })
     */
    upsert<T extends OptionPresetUpsertArgs>(args: SelectSubset<T, OptionPresetUpsertArgs<ExtArgs>>): Prisma__OptionPresetClient<$Result.GetResult<Prisma.$OptionPresetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OptionPresets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionPresetCountArgs} args - Arguments to filter OptionPresets to count.
     * @example
     * // Count the number of OptionPresets
     * const count = await prisma.optionPreset.count({
     *   where: {
     *     // ... the filter for the OptionPresets we want to count
     *   }
     * })
    **/
    count<T extends OptionPresetCountArgs>(
      args?: Subset<T, OptionPresetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OptionPresetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OptionPreset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionPresetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OptionPresetAggregateArgs>(args: Subset<T, OptionPresetAggregateArgs>): Prisma.PrismaPromise<GetOptionPresetAggregateType<T>>

    /**
     * Group by OptionPreset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionPresetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OptionPresetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OptionPresetGroupByArgs['orderBy'] }
        : { orderBy?: OptionPresetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OptionPresetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOptionPresetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OptionPreset model
   */
  readonly fields: OptionPresetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OptionPreset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OptionPresetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OptionPreset model
   */
  interface OptionPresetFieldRefs {
    readonly id: FieldRef<"OptionPreset", 'String'>
    readonly kind: FieldRef<"OptionPreset", 'OptionPresetKind'>
    readonly value: FieldRef<"OptionPreset", 'String'>
    readonly label: FieldRef<"OptionPreset", 'String'>
    readonly sortOrder: FieldRef<"OptionPreset", 'Int'>
    readonly isActive: FieldRef<"OptionPreset", 'Boolean'>
    readonly createdAt: FieldRef<"OptionPreset", 'DateTime'>
    readonly updatedAt: FieldRef<"OptionPreset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OptionPreset findUnique
   */
  export type OptionPresetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OptionPreset
     */
    select?: OptionPresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OptionPreset
     */
    omit?: OptionPresetOmit<ExtArgs> | null
    /**
     * Filter, which OptionPreset to fetch.
     */
    where: OptionPresetWhereUniqueInput
  }

  /**
   * OptionPreset findUniqueOrThrow
   */
  export type OptionPresetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OptionPreset
     */
    select?: OptionPresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OptionPreset
     */
    omit?: OptionPresetOmit<ExtArgs> | null
    /**
     * Filter, which OptionPreset to fetch.
     */
    where: OptionPresetWhereUniqueInput
  }

  /**
   * OptionPreset findFirst
   */
  export type OptionPresetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OptionPreset
     */
    select?: OptionPresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OptionPreset
     */
    omit?: OptionPresetOmit<ExtArgs> | null
    /**
     * Filter, which OptionPreset to fetch.
     */
    where?: OptionPresetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OptionPresets to fetch.
     */
    orderBy?: OptionPresetOrderByWithRelationInput | OptionPresetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OptionPresets.
     */
    cursor?: OptionPresetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OptionPresets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OptionPresets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OptionPresets.
     */
    distinct?: OptionPresetScalarFieldEnum | OptionPresetScalarFieldEnum[]
  }

  /**
   * OptionPreset findFirstOrThrow
   */
  export type OptionPresetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OptionPreset
     */
    select?: OptionPresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OptionPreset
     */
    omit?: OptionPresetOmit<ExtArgs> | null
    /**
     * Filter, which OptionPreset to fetch.
     */
    where?: OptionPresetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OptionPresets to fetch.
     */
    orderBy?: OptionPresetOrderByWithRelationInput | OptionPresetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OptionPresets.
     */
    cursor?: OptionPresetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OptionPresets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OptionPresets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OptionPresets.
     */
    distinct?: OptionPresetScalarFieldEnum | OptionPresetScalarFieldEnum[]
  }

  /**
   * OptionPreset findMany
   */
  export type OptionPresetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OptionPreset
     */
    select?: OptionPresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OptionPreset
     */
    omit?: OptionPresetOmit<ExtArgs> | null
    /**
     * Filter, which OptionPresets to fetch.
     */
    where?: OptionPresetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OptionPresets to fetch.
     */
    orderBy?: OptionPresetOrderByWithRelationInput | OptionPresetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OptionPresets.
     */
    cursor?: OptionPresetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OptionPresets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OptionPresets.
     */
    skip?: number
    distinct?: OptionPresetScalarFieldEnum | OptionPresetScalarFieldEnum[]
  }

  /**
   * OptionPreset create
   */
  export type OptionPresetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OptionPreset
     */
    select?: OptionPresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OptionPreset
     */
    omit?: OptionPresetOmit<ExtArgs> | null
    /**
     * The data needed to create a OptionPreset.
     */
    data: XOR<OptionPresetCreateInput, OptionPresetUncheckedCreateInput>
  }

  /**
   * OptionPreset createMany
   */
  export type OptionPresetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OptionPresets.
     */
    data: OptionPresetCreateManyInput | OptionPresetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OptionPreset createManyAndReturn
   */
  export type OptionPresetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OptionPreset
     */
    select?: OptionPresetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OptionPreset
     */
    omit?: OptionPresetOmit<ExtArgs> | null
    /**
     * The data used to create many OptionPresets.
     */
    data: OptionPresetCreateManyInput | OptionPresetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OptionPreset update
   */
  export type OptionPresetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OptionPreset
     */
    select?: OptionPresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OptionPreset
     */
    omit?: OptionPresetOmit<ExtArgs> | null
    /**
     * The data needed to update a OptionPreset.
     */
    data: XOR<OptionPresetUpdateInput, OptionPresetUncheckedUpdateInput>
    /**
     * Choose, which OptionPreset to update.
     */
    where: OptionPresetWhereUniqueInput
  }

  /**
   * OptionPreset updateMany
   */
  export type OptionPresetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OptionPresets.
     */
    data: XOR<OptionPresetUpdateManyMutationInput, OptionPresetUncheckedUpdateManyInput>
    /**
     * Filter which OptionPresets to update
     */
    where?: OptionPresetWhereInput
    /**
     * Limit how many OptionPresets to update.
     */
    limit?: number
  }

  /**
   * OptionPreset updateManyAndReturn
   */
  export type OptionPresetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OptionPreset
     */
    select?: OptionPresetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OptionPreset
     */
    omit?: OptionPresetOmit<ExtArgs> | null
    /**
     * The data used to update OptionPresets.
     */
    data: XOR<OptionPresetUpdateManyMutationInput, OptionPresetUncheckedUpdateManyInput>
    /**
     * Filter which OptionPresets to update
     */
    where?: OptionPresetWhereInput
    /**
     * Limit how many OptionPresets to update.
     */
    limit?: number
  }

  /**
   * OptionPreset upsert
   */
  export type OptionPresetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OptionPreset
     */
    select?: OptionPresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OptionPreset
     */
    omit?: OptionPresetOmit<ExtArgs> | null
    /**
     * The filter to search for the OptionPreset to update in case it exists.
     */
    where: OptionPresetWhereUniqueInput
    /**
     * In case the OptionPreset found by the `where` argument doesn't exist, create a new OptionPreset with this data.
     */
    create: XOR<OptionPresetCreateInput, OptionPresetUncheckedCreateInput>
    /**
     * In case the OptionPreset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OptionPresetUpdateInput, OptionPresetUncheckedUpdateInput>
  }

  /**
   * OptionPreset delete
   */
  export type OptionPresetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OptionPreset
     */
    select?: OptionPresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OptionPreset
     */
    omit?: OptionPresetOmit<ExtArgs> | null
    /**
     * Filter which OptionPreset to delete.
     */
    where: OptionPresetWhereUniqueInput
  }

  /**
   * OptionPreset deleteMany
   */
  export type OptionPresetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OptionPresets to delete
     */
    where?: OptionPresetWhereInput
    /**
     * Limit how many OptionPresets to delete.
     */
    limit?: number
  }

  /**
   * OptionPreset without action
   */
  export type OptionPresetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OptionPreset
     */
    select?: OptionPresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OptionPreset
     */
    omit?: OptionPresetOmit<ExtArgs> | null
  }


  /**
   * Model Match
   */

  export type AggregateMatch = {
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  export type MatchAvgAggregateOutputType = {
    maxPlayers: number | null
    openSlots: number | null
    hostCreditScore: number | null
    distanceKm: number | null
    matchRate: number | null
  }

  export type MatchSumAggregateOutputType = {
    maxPlayers: number | null
    openSlots: number | null
    hostCreditScore: number | null
    distanceKm: number | null
    matchRate: number | null
  }

  export type MatchMinAggregateOutputType = {
    id: string | null
    title: string | null
    venueName: string | null
    venueId: string | null
    courtId: string | null
    slotId: string | null
    startTime: Date | null
    city: string | null
    level: string | null
    maxPlayers: number | null
    openSlots: number | null
    status: string | null
    checkInCode: string | null
    hostUserId: string | null
    hostCreditScore: number | null
    distanceKm: number | null
    matchRate: number | null
    createdAt: Date | null
  }

  export type MatchMaxAggregateOutputType = {
    id: string | null
    title: string | null
    venueName: string | null
    venueId: string | null
    courtId: string | null
    slotId: string | null
    startTime: Date | null
    city: string | null
    level: string | null
    maxPlayers: number | null
    openSlots: number | null
    status: string | null
    checkInCode: string | null
    hostUserId: string | null
    hostCreditScore: number | null
    distanceKm: number | null
    matchRate: number | null
    createdAt: Date | null
  }

  export type MatchCountAggregateOutputType = {
    id: number
    title: number
    venueName: number
    venueId: number
    courtId: number
    slotId: number
    startTime: number
    city: number
    level: number
    maxPlayers: number
    openSlots: number
    status: number
    checkInCode: number
    hostUserId: number
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt: number
    _all: number
  }


  export type MatchAvgAggregateInputType = {
    maxPlayers?: true
    openSlots?: true
    hostCreditScore?: true
    distanceKm?: true
    matchRate?: true
  }

  export type MatchSumAggregateInputType = {
    maxPlayers?: true
    openSlots?: true
    hostCreditScore?: true
    distanceKm?: true
    matchRate?: true
  }

  export type MatchMinAggregateInputType = {
    id?: true
    title?: true
    venueName?: true
    venueId?: true
    courtId?: true
    slotId?: true
    startTime?: true
    city?: true
    level?: true
    maxPlayers?: true
    openSlots?: true
    status?: true
    checkInCode?: true
    hostUserId?: true
    hostCreditScore?: true
    distanceKm?: true
    matchRate?: true
    createdAt?: true
  }

  export type MatchMaxAggregateInputType = {
    id?: true
    title?: true
    venueName?: true
    venueId?: true
    courtId?: true
    slotId?: true
    startTime?: true
    city?: true
    level?: true
    maxPlayers?: true
    openSlots?: true
    status?: true
    checkInCode?: true
    hostUserId?: true
    hostCreditScore?: true
    distanceKm?: true
    matchRate?: true
    createdAt?: true
  }

  export type MatchCountAggregateInputType = {
    id?: true
    title?: true
    venueName?: true
    venueId?: true
    courtId?: true
    slotId?: true
    startTime?: true
    city?: true
    level?: true
    maxPlayers?: true
    openSlots?: true
    status?: true
    checkInCode?: true
    hostUserId?: true
    hostCreditScore?: true
    distanceKm?: true
    matchRate?: true
    createdAt?: true
    _all?: true
  }

  export type MatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Match to aggregate.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Matches
    **/
    _count?: true | MatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchMaxAggregateInputType
  }

  export type GetMatchAggregateType<T extends MatchAggregateArgs> = {
        [P in keyof T & keyof AggregateMatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatch[P]>
      : GetScalarType<T[P], AggregateMatch[P]>
  }




  export type MatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithAggregationInput | MatchOrderByWithAggregationInput[]
    by: MatchScalarFieldEnum[] | MatchScalarFieldEnum
    having?: MatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchCountAggregateInputType | true
    _avg?: MatchAvgAggregateInputType
    _sum?: MatchSumAggregateInputType
    _min?: MatchMinAggregateInputType
    _max?: MatchMaxAggregateInputType
  }

  export type MatchGroupByOutputType = {
    id: string
    title: string
    venueName: string
    venueId: string | null
    courtId: string | null
    slotId: string | null
    startTime: Date
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status: string
    checkInCode: string | null
    hostUserId: string
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt: Date
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  type GetMatchGroupByPayload<T extends MatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchGroupByOutputType[P]>
            : GetScalarType<T[P], MatchGroupByOutputType[P]>
        }
      >
    >


  export type MatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    venueName?: boolean
    venueId?: boolean
    courtId?: boolean
    slotId?: boolean
    startTime?: boolean
    city?: boolean
    level?: boolean
    maxPlayers?: boolean
    openSlots?: boolean
    status?: boolean
    checkInCode?: boolean
    hostUserId?: boolean
    hostCreditScore?: boolean
    distanceKm?: boolean
    matchRate?: boolean
    createdAt?: boolean
    hostUser?: boolean | UserDefaultArgs<ExtArgs>
    venue?: boolean | Match$venueArgs<ExtArgs>
    court?: boolean | Match$courtArgs<ExtArgs>
    slot?: boolean | Match$slotArgs<ExtArgs>
    applications?: boolean | Match$applicationsArgs<ExtArgs>
    thread?: boolean | Match$threadArgs<ExtArgs>
    _count?: boolean | MatchCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    venueName?: boolean
    venueId?: boolean
    courtId?: boolean
    slotId?: boolean
    startTime?: boolean
    city?: boolean
    level?: boolean
    maxPlayers?: boolean
    openSlots?: boolean
    status?: boolean
    checkInCode?: boolean
    hostUserId?: boolean
    hostCreditScore?: boolean
    distanceKm?: boolean
    matchRate?: boolean
    createdAt?: boolean
    hostUser?: boolean | UserDefaultArgs<ExtArgs>
    venue?: boolean | Match$venueArgs<ExtArgs>
    court?: boolean | Match$courtArgs<ExtArgs>
    slot?: boolean | Match$slotArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    venueName?: boolean
    venueId?: boolean
    courtId?: boolean
    slotId?: boolean
    startTime?: boolean
    city?: boolean
    level?: boolean
    maxPlayers?: boolean
    openSlots?: boolean
    status?: boolean
    checkInCode?: boolean
    hostUserId?: boolean
    hostCreditScore?: boolean
    distanceKm?: boolean
    matchRate?: boolean
    createdAt?: boolean
    hostUser?: boolean | UserDefaultArgs<ExtArgs>
    venue?: boolean | Match$venueArgs<ExtArgs>
    court?: boolean | Match$courtArgs<ExtArgs>
    slot?: boolean | Match$slotArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectScalar = {
    id?: boolean
    title?: boolean
    venueName?: boolean
    venueId?: boolean
    courtId?: boolean
    slotId?: boolean
    startTime?: boolean
    city?: boolean
    level?: boolean
    maxPlayers?: boolean
    openSlots?: boolean
    status?: boolean
    checkInCode?: boolean
    hostUserId?: boolean
    hostCreditScore?: boolean
    distanceKm?: boolean
    matchRate?: boolean
    createdAt?: boolean
  }

  export type MatchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "venueName" | "venueId" | "courtId" | "slotId" | "startTime" | "city" | "level" | "maxPlayers" | "openSlots" | "status" | "checkInCode" | "hostUserId" | "hostCreditScore" | "distanceKm" | "matchRate" | "createdAt", ExtArgs["result"]["match"]>
  export type MatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hostUser?: boolean | UserDefaultArgs<ExtArgs>
    venue?: boolean | Match$venueArgs<ExtArgs>
    court?: boolean | Match$courtArgs<ExtArgs>
    slot?: boolean | Match$slotArgs<ExtArgs>
    applications?: boolean | Match$applicationsArgs<ExtArgs>
    thread?: boolean | Match$threadArgs<ExtArgs>
    _count?: boolean | MatchCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hostUser?: boolean | UserDefaultArgs<ExtArgs>
    venue?: boolean | Match$venueArgs<ExtArgs>
    court?: boolean | Match$courtArgs<ExtArgs>
    slot?: boolean | Match$slotArgs<ExtArgs>
  }
  export type MatchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hostUser?: boolean | UserDefaultArgs<ExtArgs>
    venue?: boolean | Match$venueArgs<ExtArgs>
    court?: boolean | Match$courtArgs<ExtArgs>
    slot?: boolean | Match$slotArgs<ExtArgs>
  }

  export type $MatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Match"
    objects: {
      hostUser: Prisma.$UserPayload<ExtArgs>
      venue: Prisma.$VenuePayload<ExtArgs> | null
      court: Prisma.$VenueCourtPayload<ExtArgs> | null
      slot: Prisma.$VenueAvailabilitySlotPayload<ExtArgs> | null
      applications: Prisma.$MatchApplicationPayload<ExtArgs>[]
      thread: Prisma.$ChatThreadPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      venueName: string
      venueId: string | null
      courtId: string | null
      slotId: string | null
      startTime: Date
      city: string
      level: string
      maxPlayers: number
      openSlots: number
      status: string
      checkInCode: string | null
      hostUserId: string
      hostCreditScore: number
      distanceKm: number
      matchRate: number
      createdAt: Date
    }, ExtArgs["result"]["match"]>
    composites: {}
  }

  type MatchGetPayload<S extends boolean | null | undefined | MatchDefaultArgs> = $Result.GetResult<Prisma.$MatchPayload, S>

  type MatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchCountAggregateInputType | true
    }

  export interface MatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Match'], meta: { name: 'Match' } }
    /**
     * Find zero or one Match that matches the filter.
     * @param {MatchFindUniqueArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchFindUniqueArgs>(args: SelectSubset<T, MatchFindUniqueArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Match that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchFindUniqueOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchFindFirstArgs>(args?: SelectSubset<T, MatchFindFirstArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Matches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Matches
     * const matches = await prisma.match.findMany()
     * 
     * // Get first 10 Matches
     * const matches = await prisma.match.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchWithIdOnly = await prisma.match.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchFindManyArgs>(args?: SelectSubset<T, MatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Match.
     * @param {MatchCreateArgs} args - Arguments to create a Match.
     * @example
     * // Create one Match
     * const Match = await prisma.match.create({
     *   data: {
     *     // ... data to create a Match
     *   }
     * })
     * 
     */
    create<T extends MatchCreateArgs>(args: SelectSubset<T, MatchCreateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Matches.
     * @param {MatchCreateManyArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchCreateManyArgs>(args?: SelectSubset<T, MatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Matches and returns the data saved in the database.
     * @param {MatchCreateManyAndReturnArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Match.
     * @param {MatchDeleteArgs} args - Arguments to delete one Match.
     * @example
     * // Delete one Match
     * const Match = await prisma.match.delete({
     *   where: {
     *     // ... filter to delete one Match
     *   }
     * })
     * 
     */
    delete<T extends MatchDeleteArgs>(args: SelectSubset<T, MatchDeleteArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Match.
     * @param {MatchUpdateArgs} args - Arguments to update one Match.
     * @example
     * // Update one Match
     * const match = await prisma.match.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchUpdateArgs>(args: SelectSubset<T, MatchUpdateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Matches.
     * @param {MatchDeleteManyArgs} args - Arguments to filter Matches to delete.
     * @example
     * // Delete a few Matches
     * const { count } = await prisma.match.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchDeleteManyArgs>(args?: SelectSubset<T, MatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchUpdateManyArgs>(args: SelectSubset<T, MatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches and returns the data updated in the database.
     * @param {MatchUpdateManyAndReturnArgs} args - Arguments to update many Matches.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Match.
     * @param {MatchUpsertArgs} args - Arguments to update or create a Match.
     * @example
     * // Update or create a Match
     * const match = await prisma.match.upsert({
     *   create: {
     *     // ... data to create a Match
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Match we want to update
     *   }
     * })
     */
    upsert<T extends MatchUpsertArgs>(args: SelectSubset<T, MatchUpsertArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCountArgs} args - Arguments to filter Matches to count.
     * @example
     * // Count the number of Matches
     * const count = await prisma.match.count({
     *   where: {
     *     // ... the filter for the Matches we want to count
     *   }
     * })
    **/
    count<T extends MatchCountArgs>(
      args?: Subset<T, MatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchAggregateArgs>(args: Subset<T, MatchAggregateArgs>): Prisma.PrismaPromise<GetMatchAggregateType<T>>

    /**
     * Group by Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchGroupByArgs['orderBy'] }
        : { orderBy?: MatchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Match model
   */
  readonly fields: MatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Match.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    hostUser<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    venue<T extends Match$venueArgs<ExtArgs> = {}>(args?: Subset<T, Match$venueArgs<ExtArgs>>): Prisma__VenueClient<$Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    court<T extends Match$courtArgs<ExtArgs> = {}>(args?: Subset<T, Match$courtArgs<ExtArgs>>): Prisma__VenueCourtClient<$Result.GetResult<Prisma.$VenueCourtPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    slot<T extends Match$slotArgs<ExtArgs> = {}>(args?: Subset<T, Match$slotArgs<ExtArgs>>): Prisma__VenueAvailabilitySlotClient<$Result.GetResult<Prisma.$VenueAvailabilitySlotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    applications<T extends Match$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, Match$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    thread<T extends Match$threadArgs<ExtArgs> = {}>(args?: Subset<T, Match$threadArgs<ExtArgs>>): Prisma__ChatThreadClient<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Match model
   */
  interface MatchFieldRefs {
    readonly id: FieldRef<"Match", 'String'>
    readonly title: FieldRef<"Match", 'String'>
    readonly venueName: FieldRef<"Match", 'String'>
    readonly venueId: FieldRef<"Match", 'String'>
    readonly courtId: FieldRef<"Match", 'String'>
    readonly slotId: FieldRef<"Match", 'String'>
    readonly startTime: FieldRef<"Match", 'DateTime'>
    readonly city: FieldRef<"Match", 'String'>
    readonly level: FieldRef<"Match", 'String'>
    readonly maxPlayers: FieldRef<"Match", 'Int'>
    readonly openSlots: FieldRef<"Match", 'Int'>
    readonly status: FieldRef<"Match", 'String'>
    readonly checkInCode: FieldRef<"Match", 'String'>
    readonly hostUserId: FieldRef<"Match", 'String'>
    readonly hostCreditScore: FieldRef<"Match", 'Int'>
    readonly distanceKm: FieldRef<"Match", 'Float'>
    readonly matchRate: FieldRef<"Match", 'Int'>
    readonly createdAt: FieldRef<"Match", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Match findUnique
   */
  export type MatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findUniqueOrThrow
   */
  export type MatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findFirst
   */
  export type MatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findFirstOrThrow
   */
  export type MatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findMany
   */
  export type MatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Matches to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match create
   */
  export type MatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to create a Match.
     */
    data: XOR<MatchCreateInput, MatchUncheckedCreateInput>
  }

  /**
   * Match createMany
   */
  export type MatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Match createManyAndReturn
   */
  export type MatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Match update
   */
  export type MatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to update a Match.
     */
    data: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
    /**
     * Choose, which Match to update.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match updateMany
   */
  export type MatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
  }

  /**
   * Match updateManyAndReturn
   */
  export type MatchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Match upsert
   */
  export type MatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The filter to search for the Match to update in case it exists.
     */
    where: MatchWhereUniqueInput
    /**
     * In case the Match found by the `where` argument doesn't exist, create a new Match with this data.
     */
    create: XOR<MatchCreateInput, MatchUncheckedCreateInput>
    /**
     * In case the Match was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
  }

  /**
   * Match delete
   */
  export type MatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter which Match to delete.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match deleteMany
   */
  export type MatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Matches to delete
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to delete.
     */
    limit?: number
  }

  /**
   * Match.venue
   */
  export type Match$venueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venue
     */
    omit?: VenueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null
    where?: VenueWhereInput
  }

  /**
   * Match.court
   */
  export type Match$courtArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueCourt
     */
    select?: VenueCourtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueCourt
     */
    omit?: VenueCourtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueCourtInclude<ExtArgs> | null
    where?: VenueCourtWhereInput
  }

  /**
   * Match.slot
   */
  export type Match$slotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VenueAvailabilitySlot
     */
    select?: VenueAvailabilitySlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VenueAvailabilitySlot
     */
    omit?: VenueAvailabilitySlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueAvailabilitySlotInclude<ExtArgs> | null
    where?: VenueAvailabilitySlotWhereInput
  }

  /**
   * Match.applications
   */
  export type Match$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationInclude<ExtArgs> | null
    where?: MatchApplicationWhereInput
    orderBy?: MatchApplicationOrderByWithRelationInput | MatchApplicationOrderByWithRelationInput[]
    cursor?: MatchApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchApplicationScalarFieldEnum | MatchApplicationScalarFieldEnum[]
  }

  /**
   * Match.thread
   */
  export type Match$threadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadInclude<ExtArgs> | null
    where?: ChatThreadWhereInput
  }

  /**
   * Match without action
   */
  export type MatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
  }


  /**
   * Model MatchApplication
   */

  export type AggregateMatchApplication = {
    _count: MatchApplicationCountAggregateOutputType | null
    _min: MatchApplicationMinAggregateOutputType | null
    _max: MatchApplicationMaxAggregateOutputType | null
  }

  export type MatchApplicationMinAggregateOutputType = {
    id: string | null
    matchId: string | null
    userId: string | null
    status: string | null
    decisionReason: string | null
    createdAt: Date | null
  }

  export type MatchApplicationMaxAggregateOutputType = {
    id: string | null
    matchId: string | null
    userId: string | null
    status: string | null
    decisionReason: string | null
    createdAt: Date | null
  }

  export type MatchApplicationCountAggregateOutputType = {
    id: number
    matchId: number
    userId: number
    status: number
    decisionReason: number
    createdAt: number
    _all: number
  }


  export type MatchApplicationMinAggregateInputType = {
    id?: true
    matchId?: true
    userId?: true
    status?: true
    decisionReason?: true
    createdAt?: true
  }

  export type MatchApplicationMaxAggregateInputType = {
    id?: true
    matchId?: true
    userId?: true
    status?: true
    decisionReason?: true
    createdAt?: true
  }

  export type MatchApplicationCountAggregateInputType = {
    id?: true
    matchId?: true
    userId?: true
    status?: true
    decisionReason?: true
    createdAt?: true
    _all?: true
  }

  export type MatchApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchApplication to aggregate.
     */
    where?: MatchApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchApplications to fetch.
     */
    orderBy?: MatchApplicationOrderByWithRelationInput | MatchApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MatchApplications
    **/
    _count?: true | MatchApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchApplicationMaxAggregateInputType
  }

  export type GetMatchApplicationAggregateType<T extends MatchApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateMatchApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatchApplication[P]>
      : GetScalarType<T[P], AggregateMatchApplication[P]>
  }




  export type MatchApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchApplicationWhereInput
    orderBy?: MatchApplicationOrderByWithAggregationInput | MatchApplicationOrderByWithAggregationInput[]
    by: MatchApplicationScalarFieldEnum[] | MatchApplicationScalarFieldEnum
    having?: MatchApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchApplicationCountAggregateInputType | true
    _min?: MatchApplicationMinAggregateInputType
    _max?: MatchApplicationMaxAggregateInputType
  }

  export type MatchApplicationGroupByOutputType = {
    id: string
    matchId: string
    userId: string
    status: string
    decisionReason: string | null
    createdAt: Date
    _count: MatchApplicationCountAggregateOutputType | null
    _min: MatchApplicationMinAggregateOutputType | null
    _max: MatchApplicationMaxAggregateOutputType | null
  }

  type GetMatchApplicationGroupByPayload<T extends MatchApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], MatchApplicationGroupByOutputType[P]>
        }
      >
    >


  export type MatchApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    userId?: boolean
    status?: boolean
    decisionReason?: boolean
    createdAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchApplication"]>

  export type MatchApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    userId?: boolean
    status?: boolean
    decisionReason?: boolean
    createdAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchApplication"]>

  export type MatchApplicationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    userId?: boolean
    status?: boolean
    decisionReason?: boolean
    createdAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchApplication"]>

  export type MatchApplicationSelectScalar = {
    id?: boolean
    matchId?: boolean
    userId?: boolean
    status?: boolean
    decisionReason?: boolean
    createdAt?: boolean
  }

  export type MatchApplicationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "matchId" | "userId" | "status" | "decisionReason" | "createdAt", ExtArgs["result"]["matchApplication"]>
  export type MatchApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }
  export type MatchApplicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }
  export type MatchApplicationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }

  export type $MatchApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MatchApplication"
    objects: {
      match: Prisma.$MatchPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      matchId: string
      userId: string
      status: string
      decisionReason: string | null
      createdAt: Date
    }, ExtArgs["result"]["matchApplication"]>
    composites: {}
  }

  type MatchApplicationGetPayload<S extends boolean | null | undefined | MatchApplicationDefaultArgs> = $Result.GetResult<Prisma.$MatchApplicationPayload, S>

  type MatchApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchApplicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchApplicationCountAggregateInputType | true
    }

  export interface MatchApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MatchApplication'], meta: { name: 'MatchApplication' } }
    /**
     * Find zero or one MatchApplication that matches the filter.
     * @param {MatchApplicationFindUniqueArgs} args - Arguments to find a MatchApplication
     * @example
     * // Get one MatchApplication
     * const matchApplication = await prisma.matchApplication.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchApplicationFindUniqueArgs>(args: SelectSubset<T, MatchApplicationFindUniqueArgs<ExtArgs>>): Prisma__MatchApplicationClient<$Result.GetResult<Prisma.$MatchApplicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MatchApplication that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchApplicationFindUniqueOrThrowArgs} args - Arguments to find a MatchApplication
     * @example
     * // Get one MatchApplication
     * const matchApplication = await prisma.matchApplication.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchApplicationClient<$Result.GetResult<Prisma.$MatchApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchApplication that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchApplicationFindFirstArgs} args - Arguments to find a MatchApplication
     * @example
     * // Get one MatchApplication
     * const matchApplication = await prisma.matchApplication.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchApplicationFindFirstArgs>(args?: SelectSubset<T, MatchApplicationFindFirstArgs<ExtArgs>>): Prisma__MatchApplicationClient<$Result.GetResult<Prisma.$MatchApplicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchApplication that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchApplicationFindFirstOrThrowArgs} args - Arguments to find a MatchApplication
     * @example
     * // Get one MatchApplication
     * const matchApplication = await prisma.matchApplication.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchApplicationClient<$Result.GetResult<Prisma.$MatchApplicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MatchApplications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MatchApplications
     * const matchApplications = await prisma.matchApplication.findMany()
     * 
     * // Get first 10 MatchApplications
     * const matchApplications = await prisma.matchApplication.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchApplicationWithIdOnly = await prisma.matchApplication.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchApplicationFindManyArgs>(args?: SelectSubset<T, MatchApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MatchApplication.
     * @param {MatchApplicationCreateArgs} args - Arguments to create a MatchApplication.
     * @example
     * // Create one MatchApplication
     * const MatchApplication = await prisma.matchApplication.create({
     *   data: {
     *     // ... data to create a MatchApplication
     *   }
     * })
     * 
     */
    create<T extends MatchApplicationCreateArgs>(args: SelectSubset<T, MatchApplicationCreateArgs<ExtArgs>>): Prisma__MatchApplicationClient<$Result.GetResult<Prisma.$MatchApplicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MatchApplications.
     * @param {MatchApplicationCreateManyArgs} args - Arguments to create many MatchApplications.
     * @example
     * // Create many MatchApplications
     * const matchApplication = await prisma.matchApplication.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchApplicationCreateManyArgs>(args?: SelectSubset<T, MatchApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MatchApplications and returns the data saved in the database.
     * @param {MatchApplicationCreateManyAndReturnArgs} args - Arguments to create many MatchApplications.
     * @example
     * // Create many MatchApplications
     * const matchApplication = await prisma.matchApplication.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MatchApplications and only return the `id`
     * const matchApplicationWithIdOnly = await prisma.matchApplication.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchApplicationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MatchApplication.
     * @param {MatchApplicationDeleteArgs} args - Arguments to delete one MatchApplication.
     * @example
     * // Delete one MatchApplication
     * const MatchApplication = await prisma.matchApplication.delete({
     *   where: {
     *     // ... filter to delete one MatchApplication
     *   }
     * })
     * 
     */
    delete<T extends MatchApplicationDeleteArgs>(args: SelectSubset<T, MatchApplicationDeleteArgs<ExtArgs>>): Prisma__MatchApplicationClient<$Result.GetResult<Prisma.$MatchApplicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MatchApplication.
     * @param {MatchApplicationUpdateArgs} args - Arguments to update one MatchApplication.
     * @example
     * // Update one MatchApplication
     * const matchApplication = await prisma.matchApplication.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchApplicationUpdateArgs>(args: SelectSubset<T, MatchApplicationUpdateArgs<ExtArgs>>): Prisma__MatchApplicationClient<$Result.GetResult<Prisma.$MatchApplicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MatchApplications.
     * @param {MatchApplicationDeleteManyArgs} args - Arguments to filter MatchApplications to delete.
     * @example
     * // Delete a few MatchApplications
     * const { count } = await prisma.matchApplication.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchApplicationDeleteManyArgs>(args?: SelectSubset<T, MatchApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MatchApplications
     * const matchApplication = await prisma.matchApplication.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchApplicationUpdateManyArgs>(args: SelectSubset<T, MatchApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchApplications and returns the data updated in the database.
     * @param {MatchApplicationUpdateManyAndReturnArgs} args - Arguments to update many MatchApplications.
     * @example
     * // Update many MatchApplications
     * const matchApplication = await prisma.matchApplication.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MatchApplications and only return the `id`
     * const matchApplicationWithIdOnly = await prisma.matchApplication.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchApplicationUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchApplicationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchApplicationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MatchApplication.
     * @param {MatchApplicationUpsertArgs} args - Arguments to update or create a MatchApplication.
     * @example
     * // Update or create a MatchApplication
     * const matchApplication = await prisma.matchApplication.upsert({
     *   create: {
     *     // ... data to create a MatchApplication
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MatchApplication we want to update
     *   }
     * })
     */
    upsert<T extends MatchApplicationUpsertArgs>(args: SelectSubset<T, MatchApplicationUpsertArgs<ExtArgs>>): Prisma__MatchApplicationClient<$Result.GetResult<Prisma.$MatchApplicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MatchApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchApplicationCountArgs} args - Arguments to filter MatchApplications to count.
     * @example
     * // Count the number of MatchApplications
     * const count = await prisma.matchApplication.count({
     *   where: {
     *     // ... the filter for the MatchApplications we want to count
     *   }
     * })
    **/
    count<T extends MatchApplicationCountArgs>(
      args?: Subset<T, MatchApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MatchApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchApplicationAggregateArgs>(args: Subset<T, MatchApplicationAggregateArgs>): Prisma.PrismaPromise<GetMatchApplicationAggregateType<T>>

    /**
     * Group by MatchApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchApplicationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchApplicationGroupByArgs['orderBy'] }
        : { orderBy?: MatchApplicationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MatchApplication model
   */
  readonly fields: MatchApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MatchApplication.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    match<T extends MatchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MatchDefaultArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MatchApplication model
   */
  interface MatchApplicationFieldRefs {
    readonly id: FieldRef<"MatchApplication", 'String'>
    readonly matchId: FieldRef<"MatchApplication", 'String'>
    readonly userId: FieldRef<"MatchApplication", 'String'>
    readonly status: FieldRef<"MatchApplication", 'String'>
    readonly decisionReason: FieldRef<"MatchApplication", 'String'>
    readonly createdAt: FieldRef<"MatchApplication", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MatchApplication findUnique
   */
  export type MatchApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationInclude<ExtArgs> | null
    /**
     * Filter, which MatchApplication to fetch.
     */
    where: MatchApplicationWhereUniqueInput
  }

  /**
   * MatchApplication findUniqueOrThrow
   */
  export type MatchApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationInclude<ExtArgs> | null
    /**
     * Filter, which MatchApplication to fetch.
     */
    where: MatchApplicationWhereUniqueInput
  }

  /**
   * MatchApplication findFirst
   */
  export type MatchApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationInclude<ExtArgs> | null
    /**
     * Filter, which MatchApplication to fetch.
     */
    where?: MatchApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchApplications to fetch.
     */
    orderBy?: MatchApplicationOrderByWithRelationInput | MatchApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchApplications.
     */
    cursor?: MatchApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchApplications.
     */
    distinct?: MatchApplicationScalarFieldEnum | MatchApplicationScalarFieldEnum[]
  }

  /**
   * MatchApplication findFirstOrThrow
   */
  export type MatchApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationInclude<ExtArgs> | null
    /**
     * Filter, which MatchApplication to fetch.
     */
    where?: MatchApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchApplications to fetch.
     */
    orderBy?: MatchApplicationOrderByWithRelationInput | MatchApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchApplications.
     */
    cursor?: MatchApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchApplications.
     */
    distinct?: MatchApplicationScalarFieldEnum | MatchApplicationScalarFieldEnum[]
  }

  /**
   * MatchApplication findMany
   */
  export type MatchApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationInclude<ExtArgs> | null
    /**
     * Filter, which MatchApplications to fetch.
     */
    where?: MatchApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchApplications to fetch.
     */
    orderBy?: MatchApplicationOrderByWithRelationInput | MatchApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MatchApplications.
     */
    cursor?: MatchApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchApplications.
     */
    skip?: number
    distinct?: MatchApplicationScalarFieldEnum | MatchApplicationScalarFieldEnum[]
  }

  /**
   * MatchApplication create
   */
  export type MatchApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a MatchApplication.
     */
    data: XOR<MatchApplicationCreateInput, MatchApplicationUncheckedCreateInput>
  }

  /**
   * MatchApplication createMany
   */
  export type MatchApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MatchApplications.
     */
    data: MatchApplicationCreateManyInput | MatchApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MatchApplication createManyAndReturn
   */
  export type MatchApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * The data used to create many MatchApplications.
     */
    data: MatchApplicationCreateManyInput | MatchApplicationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchApplication update
   */
  export type MatchApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a MatchApplication.
     */
    data: XOR<MatchApplicationUpdateInput, MatchApplicationUncheckedUpdateInput>
    /**
     * Choose, which MatchApplication to update.
     */
    where: MatchApplicationWhereUniqueInput
  }

  /**
   * MatchApplication updateMany
   */
  export type MatchApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MatchApplications.
     */
    data: XOR<MatchApplicationUpdateManyMutationInput, MatchApplicationUncheckedUpdateManyInput>
    /**
     * Filter which MatchApplications to update
     */
    where?: MatchApplicationWhereInput
    /**
     * Limit how many MatchApplications to update.
     */
    limit?: number
  }

  /**
   * MatchApplication updateManyAndReturn
   */
  export type MatchApplicationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * The data used to update MatchApplications.
     */
    data: XOR<MatchApplicationUpdateManyMutationInput, MatchApplicationUncheckedUpdateManyInput>
    /**
     * Filter which MatchApplications to update
     */
    where?: MatchApplicationWhereInput
    /**
     * Limit how many MatchApplications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchApplication upsert
   */
  export type MatchApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the MatchApplication to update in case it exists.
     */
    where: MatchApplicationWhereUniqueInput
    /**
     * In case the MatchApplication found by the `where` argument doesn't exist, create a new MatchApplication with this data.
     */
    create: XOR<MatchApplicationCreateInput, MatchApplicationUncheckedCreateInput>
    /**
     * In case the MatchApplication was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchApplicationUpdateInput, MatchApplicationUncheckedUpdateInput>
  }

  /**
   * MatchApplication delete
   */
  export type MatchApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationInclude<ExtArgs> | null
    /**
     * Filter which MatchApplication to delete.
     */
    where: MatchApplicationWhereUniqueInput
  }

  /**
   * MatchApplication deleteMany
   */
  export type MatchApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchApplications to delete
     */
    where?: MatchApplicationWhereInput
    /**
     * Limit how many MatchApplications to delete.
     */
    limit?: number
  }

  /**
   * MatchApplication without action
   */
  export type MatchApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchApplication
     */
    select?: MatchApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchApplication
     */
    omit?: MatchApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchApplicationInclude<ExtArgs> | null
  }


  /**
   * Model Review
   */

  export type AggregateReview = {
    _count: ReviewCountAggregateOutputType | null
    _avg: ReviewAvgAggregateOutputType | null
    _sum: ReviewSumAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  export type ReviewAvgAggregateOutputType = {
    score: number | null
  }

  export type ReviewSumAggregateOutputType = {
    score: number | null
  }

  export type ReviewMinAggregateOutputType = {
    id: string | null
    matchId: string | null
    reviewerId: string | null
    revieweeId: string | null
    score: number | null
    anonymous: boolean | null
    createdAt: Date | null
  }

  export type ReviewMaxAggregateOutputType = {
    id: string | null
    matchId: string | null
    reviewerId: string | null
    revieweeId: string | null
    score: number | null
    anonymous: boolean | null
    createdAt: Date | null
  }

  export type ReviewCountAggregateOutputType = {
    id: number
    matchId: number
    reviewerId: number
    revieweeId: number
    score: number
    tags: number
    anonymous: number
    createdAt: number
    _all: number
  }


  export type ReviewAvgAggregateInputType = {
    score?: true
  }

  export type ReviewSumAggregateInputType = {
    score?: true
  }

  export type ReviewMinAggregateInputType = {
    id?: true
    matchId?: true
    reviewerId?: true
    revieweeId?: true
    score?: true
    anonymous?: true
    createdAt?: true
  }

  export type ReviewMaxAggregateInputType = {
    id?: true
    matchId?: true
    reviewerId?: true
    revieweeId?: true
    score?: true
    anonymous?: true
    createdAt?: true
  }

  export type ReviewCountAggregateInputType = {
    id?: true
    matchId?: true
    reviewerId?: true
    revieweeId?: true
    score?: true
    tags?: true
    anonymous?: true
    createdAt?: true
    _all?: true
  }

  export type ReviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Review to aggregate.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reviews
    **/
    _count?: true | ReviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReviewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReviewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReviewMaxAggregateInputType
  }

  export type GetReviewAggregateType<T extends ReviewAggregateArgs> = {
        [P in keyof T & keyof AggregateReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReview[P]>
      : GetScalarType<T[P], AggregateReview[P]>
  }




  export type ReviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithAggregationInput | ReviewOrderByWithAggregationInput[]
    by: ReviewScalarFieldEnum[] | ReviewScalarFieldEnum
    having?: ReviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReviewCountAggregateInputType | true
    _avg?: ReviewAvgAggregateInputType
    _sum?: ReviewSumAggregateInputType
    _min?: ReviewMinAggregateInputType
    _max?: ReviewMaxAggregateInputType
  }

  export type ReviewGroupByOutputType = {
    id: string
    matchId: string
    reviewerId: string
    revieweeId: string
    score: number
    tags: string[]
    anonymous: boolean
    createdAt: Date
    _count: ReviewCountAggregateOutputType | null
    _avg: ReviewAvgAggregateOutputType | null
    _sum: ReviewSumAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  type GetReviewGroupByPayload<T extends ReviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReviewGroupByOutputType[P]>
            : GetScalarType<T[P], ReviewGroupByOutputType[P]>
        }
      >
    >


  export type ReviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    reviewerId?: boolean
    revieweeId?: boolean
    score?: boolean
    tags?: boolean
    anonymous?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    reviewerId?: boolean
    revieweeId?: boolean
    score?: boolean
    tags?: boolean
    anonymous?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    reviewerId?: boolean
    revieweeId?: boolean
    score?: boolean
    tags?: boolean
    anonymous?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectScalar = {
    id?: boolean
    matchId?: boolean
    reviewerId?: boolean
    revieweeId?: boolean
    score?: boolean
    tags?: boolean
    anonymous?: boolean
    createdAt?: boolean
  }

  export type ReviewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "matchId" | "reviewerId" | "revieweeId" | "score" | "tags" | "anonymous" | "createdAt", ExtArgs["result"]["review"]>

  export type $ReviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Review"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      matchId: string
      reviewerId: string
      revieweeId: string
      score: number
      tags: string[]
      anonymous: boolean
      createdAt: Date
    }, ExtArgs["result"]["review"]>
    composites: {}
  }

  type ReviewGetPayload<S extends boolean | null | undefined | ReviewDefaultArgs> = $Result.GetResult<Prisma.$ReviewPayload, S>

  type ReviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReviewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReviewCountAggregateInputType | true
    }

  export interface ReviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Review'], meta: { name: 'Review' } }
    /**
     * Find zero or one Review that matches the filter.
     * @param {ReviewFindUniqueArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReviewFindUniqueArgs>(args: SelectSubset<T, ReviewFindUniqueArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Review that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReviewFindUniqueOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReviewFindUniqueOrThrowArgs>(args: SelectSubset<T, ReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Review that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReviewFindFirstArgs>(args?: SelectSubset<T, ReviewFindFirstArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Review that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReviewFindFirstOrThrowArgs>(args?: SelectSubset<T, ReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reviews
     * const reviews = await prisma.review.findMany()
     * 
     * // Get first 10 Reviews
     * const reviews = await prisma.review.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reviewWithIdOnly = await prisma.review.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReviewFindManyArgs>(args?: SelectSubset<T, ReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Review.
     * @param {ReviewCreateArgs} args - Arguments to create a Review.
     * @example
     * // Create one Review
     * const Review = await prisma.review.create({
     *   data: {
     *     // ... data to create a Review
     *   }
     * })
     * 
     */
    create<T extends ReviewCreateArgs>(args: SelectSubset<T, ReviewCreateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reviews.
     * @param {ReviewCreateManyArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReviewCreateManyArgs>(args?: SelectSubset<T, ReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reviews and returns the data saved in the database.
     * @param {ReviewCreateManyAndReturnArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReviewCreateManyAndReturnArgs>(args?: SelectSubset<T, ReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Review.
     * @param {ReviewDeleteArgs} args - Arguments to delete one Review.
     * @example
     * // Delete one Review
     * const Review = await prisma.review.delete({
     *   where: {
     *     // ... filter to delete one Review
     *   }
     * })
     * 
     */
    delete<T extends ReviewDeleteArgs>(args: SelectSubset<T, ReviewDeleteArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Review.
     * @param {ReviewUpdateArgs} args - Arguments to update one Review.
     * @example
     * // Update one Review
     * const review = await prisma.review.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReviewUpdateArgs>(args: SelectSubset<T, ReviewUpdateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reviews.
     * @param {ReviewDeleteManyArgs} args - Arguments to filter Reviews to delete.
     * @example
     * // Delete a few Reviews
     * const { count } = await prisma.review.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReviewDeleteManyArgs>(args?: SelectSubset<T, ReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReviewUpdateManyArgs>(args: SelectSubset<T, ReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews and returns the data updated in the database.
     * @param {ReviewUpdateManyAndReturnArgs} args - Arguments to update many Reviews.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReviewUpdateManyAndReturnArgs>(args: SelectSubset<T, ReviewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Review.
     * @param {ReviewUpsertArgs} args - Arguments to update or create a Review.
     * @example
     * // Update or create a Review
     * const review = await prisma.review.upsert({
     *   create: {
     *     // ... data to create a Review
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Review we want to update
     *   }
     * })
     */
    upsert<T extends ReviewUpsertArgs>(args: SelectSubset<T, ReviewUpsertArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewCountArgs} args - Arguments to filter Reviews to count.
     * @example
     * // Count the number of Reviews
     * const count = await prisma.review.count({
     *   where: {
     *     // ... the filter for the Reviews we want to count
     *   }
     * })
    **/
    count<T extends ReviewCountArgs>(
      args?: Subset<T, ReviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReviewAggregateArgs>(args: Subset<T, ReviewAggregateArgs>): Prisma.PrismaPromise<GetReviewAggregateType<T>>

    /**
     * Group by Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReviewGroupByArgs['orderBy'] }
        : { orderBy?: ReviewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Review model
   */
  readonly fields: ReviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Review.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Review model
   */
  interface ReviewFieldRefs {
    readonly id: FieldRef<"Review", 'String'>
    readonly matchId: FieldRef<"Review", 'String'>
    readonly reviewerId: FieldRef<"Review", 'String'>
    readonly revieweeId: FieldRef<"Review", 'String'>
    readonly score: FieldRef<"Review", 'Int'>
    readonly tags: FieldRef<"Review", 'String[]'>
    readonly anonymous: FieldRef<"Review", 'Boolean'>
    readonly createdAt: FieldRef<"Review", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Review findUnique
   */
  export type ReviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findUniqueOrThrow
   */
  export type ReviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findFirst
   */
  export type ReviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findFirstOrThrow
   */
  export type ReviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findMany
   */
  export type ReviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Filter, which Reviews to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review create
   */
  export type ReviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data needed to create a Review.
     */
    data: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
  }

  /**
   * Review createMany
   */
  export type ReviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Review createManyAndReturn
   */
  export type ReviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Review update
   */
  export type ReviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data needed to update a Review.
     */
    data: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
    /**
     * Choose, which Review to update.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review updateMany
   */
  export type ReviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reviews.
     */
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyInput>
    /**
     * Filter which Reviews to update
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to update.
     */
    limit?: number
  }

  /**
   * Review updateManyAndReturn
   */
  export type ReviewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data used to update Reviews.
     */
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyInput>
    /**
     * Filter which Reviews to update
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to update.
     */
    limit?: number
  }

  /**
   * Review upsert
   */
  export type ReviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The filter to search for the Review to update in case it exists.
     */
    where: ReviewWhereUniqueInput
    /**
     * In case the Review found by the `where` argument doesn't exist, create a new Review with this data.
     */
    create: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
    /**
     * In case the Review was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
  }

  /**
   * Review delete
   */
  export type ReviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Filter which Review to delete.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review deleteMany
   */
  export type ReviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reviews to delete
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to delete.
     */
    limit?: number
  }

  /**
   * Review without action
   */
  export type ReviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
  }


  /**
   * Model ChatThread
   */

  export type AggregateChatThread = {
    _count: ChatThreadCountAggregateOutputType | null
    _min: ChatThreadMinAggregateOutputType | null
    _max: ChatThreadMaxAggregateOutputType | null
  }

  export type ChatThreadMinAggregateOutputType = {
    id: string | null
    matchId: string | null
    title: string | null
    venueName: string | null
    scheduledAt: Date | null
    hostUserId: string | null
    status: string | null
    latestMessagePreview: string | null
    latestMessageAt: Date | null
    lastMessageSenderId: string | null
    lastMessageSenderName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChatThreadMaxAggregateOutputType = {
    id: string | null
    matchId: string | null
    title: string | null
    venueName: string | null
    scheduledAt: Date | null
    hostUserId: string | null
    status: string | null
    latestMessagePreview: string | null
    latestMessageAt: Date | null
    lastMessageSenderId: string | null
    lastMessageSenderName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChatThreadCountAggregateOutputType = {
    id: number
    matchId: number
    title: number
    venueName: number
    scheduledAt: number
    hostUserId: number
    status: number
    latestMessagePreview: number
    latestMessageAt: number
    lastMessageSenderId: number
    lastMessageSenderName: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChatThreadMinAggregateInputType = {
    id?: true
    matchId?: true
    title?: true
    venueName?: true
    scheduledAt?: true
    hostUserId?: true
    status?: true
    latestMessagePreview?: true
    latestMessageAt?: true
    lastMessageSenderId?: true
    lastMessageSenderName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChatThreadMaxAggregateInputType = {
    id?: true
    matchId?: true
    title?: true
    venueName?: true
    scheduledAt?: true
    hostUserId?: true
    status?: true
    latestMessagePreview?: true
    latestMessageAt?: true
    lastMessageSenderId?: true
    lastMessageSenderName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChatThreadCountAggregateInputType = {
    id?: true
    matchId?: true
    title?: true
    venueName?: true
    scheduledAt?: true
    hostUserId?: true
    status?: true
    latestMessagePreview?: true
    latestMessageAt?: true
    lastMessageSenderId?: true
    lastMessageSenderName?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChatThreadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatThread to aggregate.
     */
    where?: ChatThreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatThreads to fetch.
     */
    orderBy?: ChatThreadOrderByWithRelationInput | ChatThreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatThreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatThreads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatThreads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatThreads
    **/
    _count?: true | ChatThreadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatThreadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatThreadMaxAggregateInputType
  }

  export type GetChatThreadAggregateType<T extends ChatThreadAggregateArgs> = {
        [P in keyof T & keyof AggregateChatThread]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatThread[P]>
      : GetScalarType<T[P], AggregateChatThread[P]>
  }




  export type ChatThreadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatThreadWhereInput
    orderBy?: ChatThreadOrderByWithAggregationInput | ChatThreadOrderByWithAggregationInput[]
    by: ChatThreadScalarFieldEnum[] | ChatThreadScalarFieldEnum
    having?: ChatThreadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatThreadCountAggregateInputType | true
    _min?: ChatThreadMinAggregateInputType
    _max?: ChatThreadMaxAggregateInputType
  }

  export type ChatThreadGroupByOutputType = {
    id: string
    matchId: string
    title: string
    venueName: string
    scheduledAt: Date
    hostUserId: string
    status: string
    latestMessagePreview: string
    latestMessageAt: Date
    lastMessageSenderId: string | null
    lastMessageSenderName: string | null
    createdAt: Date
    updatedAt: Date
    _count: ChatThreadCountAggregateOutputType | null
    _min: ChatThreadMinAggregateOutputType | null
    _max: ChatThreadMaxAggregateOutputType | null
  }

  type GetChatThreadGroupByPayload<T extends ChatThreadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatThreadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatThreadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatThreadGroupByOutputType[P]>
            : GetScalarType<T[P], ChatThreadGroupByOutputType[P]>
        }
      >
    >


  export type ChatThreadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    title?: boolean
    venueName?: boolean
    scheduledAt?: boolean
    hostUserId?: boolean
    status?: boolean
    latestMessagePreview?: boolean
    latestMessageAt?: boolean
    lastMessageSenderId?: boolean
    lastMessageSenderName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
    participants?: boolean | ChatThread$participantsArgs<ExtArgs>
    messages?: boolean | ChatThread$messagesArgs<ExtArgs>
    _count?: boolean | ChatThreadCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatThread"]>

  export type ChatThreadSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    title?: boolean
    venueName?: boolean
    scheduledAt?: boolean
    hostUserId?: boolean
    status?: boolean
    latestMessagePreview?: boolean
    latestMessageAt?: boolean
    lastMessageSenderId?: boolean
    lastMessageSenderName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatThread"]>

  export type ChatThreadSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    title?: boolean
    venueName?: boolean
    scheduledAt?: boolean
    hostUserId?: boolean
    status?: boolean
    latestMessagePreview?: boolean
    latestMessageAt?: boolean
    lastMessageSenderId?: boolean
    lastMessageSenderName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatThread"]>

  export type ChatThreadSelectScalar = {
    id?: boolean
    matchId?: boolean
    title?: boolean
    venueName?: boolean
    scheduledAt?: boolean
    hostUserId?: boolean
    status?: boolean
    latestMessagePreview?: boolean
    latestMessageAt?: boolean
    lastMessageSenderId?: boolean
    lastMessageSenderName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChatThreadOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "matchId" | "title" | "venueName" | "scheduledAt" | "hostUserId" | "status" | "latestMessagePreview" | "latestMessageAt" | "lastMessageSenderId" | "lastMessageSenderName" | "createdAt" | "updatedAt", ExtArgs["result"]["chatThread"]>
  export type ChatThreadInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
    participants?: boolean | ChatThread$participantsArgs<ExtArgs>
    messages?: boolean | ChatThread$messagesArgs<ExtArgs>
    _count?: boolean | ChatThreadCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChatThreadIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }
  export type ChatThreadIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }

  export type $ChatThreadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatThread"
    objects: {
      match: Prisma.$MatchPayload<ExtArgs>
      participants: Prisma.$ChatThreadParticipantPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      matchId: string
      title: string
      venueName: string
      scheduledAt: Date
      hostUserId: string
      status: string
      latestMessagePreview: string
      latestMessageAt: Date
      lastMessageSenderId: string | null
      lastMessageSenderName: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["chatThread"]>
    composites: {}
  }

  type ChatThreadGetPayload<S extends boolean | null | undefined | ChatThreadDefaultArgs> = $Result.GetResult<Prisma.$ChatThreadPayload, S>

  type ChatThreadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatThreadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatThreadCountAggregateInputType | true
    }

  export interface ChatThreadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatThread'], meta: { name: 'ChatThread' } }
    /**
     * Find zero or one ChatThread that matches the filter.
     * @param {ChatThreadFindUniqueArgs} args - Arguments to find a ChatThread
     * @example
     * // Get one ChatThread
     * const chatThread = await prisma.chatThread.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatThreadFindUniqueArgs>(args: SelectSubset<T, ChatThreadFindUniqueArgs<ExtArgs>>): Prisma__ChatThreadClient<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatThread that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatThreadFindUniqueOrThrowArgs} args - Arguments to find a ChatThread
     * @example
     * // Get one ChatThread
     * const chatThread = await prisma.chatThread.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatThreadFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatThreadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatThreadClient<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatThread that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadFindFirstArgs} args - Arguments to find a ChatThread
     * @example
     * // Get one ChatThread
     * const chatThread = await prisma.chatThread.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatThreadFindFirstArgs>(args?: SelectSubset<T, ChatThreadFindFirstArgs<ExtArgs>>): Prisma__ChatThreadClient<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatThread that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadFindFirstOrThrowArgs} args - Arguments to find a ChatThread
     * @example
     * // Get one ChatThread
     * const chatThread = await prisma.chatThread.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatThreadFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatThreadFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatThreadClient<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatThreads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatThreads
     * const chatThreads = await prisma.chatThread.findMany()
     * 
     * // Get first 10 ChatThreads
     * const chatThreads = await prisma.chatThread.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatThreadWithIdOnly = await prisma.chatThread.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatThreadFindManyArgs>(args?: SelectSubset<T, ChatThreadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatThread.
     * @param {ChatThreadCreateArgs} args - Arguments to create a ChatThread.
     * @example
     * // Create one ChatThread
     * const ChatThread = await prisma.chatThread.create({
     *   data: {
     *     // ... data to create a ChatThread
     *   }
     * })
     * 
     */
    create<T extends ChatThreadCreateArgs>(args: SelectSubset<T, ChatThreadCreateArgs<ExtArgs>>): Prisma__ChatThreadClient<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatThreads.
     * @param {ChatThreadCreateManyArgs} args - Arguments to create many ChatThreads.
     * @example
     * // Create many ChatThreads
     * const chatThread = await prisma.chatThread.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatThreadCreateManyArgs>(args?: SelectSubset<T, ChatThreadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatThreads and returns the data saved in the database.
     * @param {ChatThreadCreateManyAndReturnArgs} args - Arguments to create many ChatThreads.
     * @example
     * // Create many ChatThreads
     * const chatThread = await prisma.chatThread.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatThreads and only return the `id`
     * const chatThreadWithIdOnly = await prisma.chatThread.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatThreadCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatThreadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatThread.
     * @param {ChatThreadDeleteArgs} args - Arguments to delete one ChatThread.
     * @example
     * // Delete one ChatThread
     * const ChatThread = await prisma.chatThread.delete({
     *   where: {
     *     // ... filter to delete one ChatThread
     *   }
     * })
     * 
     */
    delete<T extends ChatThreadDeleteArgs>(args: SelectSubset<T, ChatThreadDeleteArgs<ExtArgs>>): Prisma__ChatThreadClient<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatThread.
     * @param {ChatThreadUpdateArgs} args - Arguments to update one ChatThread.
     * @example
     * // Update one ChatThread
     * const chatThread = await prisma.chatThread.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatThreadUpdateArgs>(args: SelectSubset<T, ChatThreadUpdateArgs<ExtArgs>>): Prisma__ChatThreadClient<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatThreads.
     * @param {ChatThreadDeleteManyArgs} args - Arguments to filter ChatThreads to delete.
     * @example
     * // Delete a few ChatThreads
     * const { count } = await prisma.chatThread.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatThreadDeleteManyArgs>(args?: SelectSubset<T, ChatThreadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatThreads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatThreads
     * const chatThread = await prisma.chatThread.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatThreadUpdateManyArgs>(args: SelectSubset<T, ChatThreadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatThreads and returns the data updated in the database.
     * @param {ChatThreadUpdateManyAndReturnArgs} args - Arguments to update many ChatThreads.
     * @example
     * // Update many ChatThreads
     * const chatThread = await prisma.chatThread.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatThreads and only return the `id`
     * const chatThreadWithIdOnly = await prisma.chatThread.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatThreadUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatThreadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatThread.
     * @param {ChatThreadUpsertArgs} args - Arguments to update or create a ChatThread.
     * @example
     * // Update or create a ChatThread
     * const chatThread = await prisma.chatThread.upsert({
     *   create: {
     *     // ... data to create a ChatThread
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatThread we want to update
     *   }
     * })
     */
    upsert<T extends ChatThreadUpsertArgs>(args: SelectSubset<T, ChatThreadUpsertArgs<ExtArgs>>): Prisma__ChatThreadClient<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatThreads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadCountArgs} args - Arguments to filter ChatThreads to count.
     * @example
     * // Count the number of ChatThreads
     * const count = await prisma.chatThread.count({
     *   where: {
     *     // ... the filter for the ChatThreads we want to count
     *   }
     * })
    **/
    count<T extends ChatThreadCountArgs>(
      args?: Subset<T, ChatThreadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatThreadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatThread.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatThreadAggregateArgs>(args: Subset<T, ChatThreadAggregateArgs>): Prisma.PrismaPromise<GetChatThreadAggregateType<T>>

    /**
     * Group by ChatThread.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatThreadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatThreadGroupByArgs['orderBy'] }
        : { orderBy?: ChatThreadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatThreadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatThreadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatThread model
   */
  readonly fields: ChatThreadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatThread.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatThreadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    match<T extends MatchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MatchDefaultArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    participants<T extends ChatThread$participantsArgs<ExtArgs> = {}>(args?: Subset<T, ChatThread$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends ChatThread$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ChatThread$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatThread model
   */
  interface ChatThreadFieldRefs {
    readonly id: FieldRef<"ChatThread", 'String'>
    readonly matchId: FieldRef<"ChatThread", 'String'>
    readonly title: FieldRef<"ChatThread", 'String'>
    readonly venueName: FieldRef<"ChatThread", 'String'>
    readonly scheduledAt: FieldRef<"ChatThread", 'DateTime'>
    readonly hostUserId: FieldRef<"ChatThread", 'String'>
    readonly status: FieldRef<"ChatThread", 'String'>
    readonly latestMessagePreview: FieldRef<"ChatThread", 'String'>
    readonly latestMessageAt: FieldRef<"ChatThread", 'DateTime'>
    readonly lastMessageSenderId: FieldRef<"ChatThread", 'String'>
    readonly lastMessageSenderName: FieldRef<"ChatThread", 'String'>
    readonly createdAt: FieldRef<"ChatThread", 'DateTime'>
    readonly updatedAt: FieldRef<"ChatThread", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatThread findUnique
   */
  export type ChatThreadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadInclude<ExtArgs> | null
    /**
     * Filter, which ChatThread to fetch.
     */
    where: ChatThreadWhereUniqueInput
  }

  /**
   * ChatThread findUniqueOrThrow
   */
  export type ChatThreadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadInclude<ExtArgs> | null
    /**
     * Filter, which ChatThread to fetch.
     */
    where: ChatThreadWhereUniqueInput
  }

  /**
   * ChatThread findFirst
   */
  export type ChatThreadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadInclude<ExtArgs> | null
    /**
     * Filter, which ChatThread to fetch.
     */
    where?: ChatThreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatThreads to fetch.
     */
    orderBy?: ChatThreadOrderByWithRelationInput | ChatThreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatThreads.
     */
    cursor?: ChatThreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatThreads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatThreads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatThreads.
     */
    distinct?: ChatThreadScalarFieldEnum | ChatThreadScalarFieldEnum[]
  }

  /**
   * ChatThread findFirstOrThrow
   */
  export type ChatThreadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadInclude<ExtArgs> | null
    /**
     * Filter, which ChatThread to fetch.
     */
    where?: ChatThreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatThreads to fetch.
     */
    orderBy?: ChatThreadOrderByWithRelationInput | ChatThreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatThreads.
     */
    cursor?: ChatThreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatThreads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatThreads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatThreads.
     */
    distinct?: ChatThreadScalarFieldEnum | ChatThreadScalarFieldEnum[]
  }

  /**
   * ChatThread findMany
   */
  export type ChatThreadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadInclude<ExtArgs> | null
    /**
     * Filter, which ChatThreads to fetch.
     */
    where?: ChatThreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatThreads to fetch.
     */
    orderBy?: ChatThreadOrderByWithRelationInput | ChatThreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatThreads.
     */
    cursor?: ChatThreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatThreads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatThreads.
     */
    skip?: number
    distinct?: ChatThreadScalarFieldEnum | ChatThreadScalarFieldEnum[]
  }

  /**
   * ChatThread create
   */
  export type ChatThreadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatThread.
     */
    data: XOR<ChatThreadCreateInput, ChatThreadUncheckedCreateInput>
  }

  /**
   * ChatThread createMany
   */
  export type ChatThreadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatThreads.
     */
    data: ChatThreadCreateManyInput | ChatThreadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatThread createManyAndReturn
   */
  export type ChatThreadCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * The data used to create many ChatThreads.
     */
    data: ChatThreadCreateManyInput | ChatThreadCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatThread update
   */
  export type ChatThreadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatThread.
     */
    data: XOR<ChatThreadUpdateInput, ChatThreadUncheckedUpdateInput>
    /**
     * Choose, which ChatThread to update.
     */
    where: ChatThreadWhereUniqueInput
  }

  /**
   * ChatThread updateMany
   */
  export type ChatThreadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatThreads.
     */
    data: XOR<ChatThreadUpdateManyMutationInput, ChatThreadUncheckedUpdateManyInput>
    /**
     * Filter which ChatThreads to update
     */
    where?: ChatThreadWhereInput
    /**
     * Limit how many ChatThreads to update.
     */
    limit?: number
  }

  /**
   * ChatThread updateManyAndReturn
   */
  export type ChatThreadUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * The data used to update ChatThreads.
     */
    data: XOR<ChatThreadUpdateManyMutationInput, ChatThreadUncheckedUpdateManyInput>
    /**
     * Filter which ChatThreads to update
     */
    where?: ChatThreadWhereInput
    /**
     * Limit how many ChatThreads to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatThread upsert
   */
  export type ChatThreadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatThread to update in case it exists.
     */
    where: ChatThreadWhereUniqueInput
    /**
     * In case the ChatThread found by the `where` argument doesn't exist, create a new ChatThread with this data.
     */
    create: XOR<ChatThreadCreateInput, ChatThreadUncheckedCreateInput>
    /**
     * In case the ChatThread was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatThreadUpdateInput, ChatThreadUncheckedUpdateInput>
  }

  /**
   * ChatThread delete
   */
  export type ChatThreadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadInclude<ExtArgs> | null
    /**
     * Filter which ChatThread to delete.
     */
    where: ChatThreadWhereUniqueInput
  }

  /**
   * ChatThread deleteMany
   */
  export type ChatThreadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatThreads to delete
     */
    where?: ChatThreadWhereInput
    /**
     * Limit how many ChatThreads to delete.
     */
    limit?: number
  }

  /**
   * ChatThread.participants
   */
  export type ChatThread$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantInclude<ExtArgs> | null
    where?: ChatThreadParticipantWhereInput
    orderBy?: ChatThreadParticipantOrderByWithRelationInput | ChatThreadParticipantOrderByWithRelationInput[]
    cursor?: ChatThreadParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatThreadParticipantScalarFieldEnum | ChatThreadParticipantScalarFieldEnum[]
  }

  /**
   * ChatThread.messages
   */
  export type ChatThread$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * ChatThread without action
   */
  export type ChatThreadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadInclude<ExtArgs> | null
  }


  /**
   * Model ChatThreadParticipant
   */

  export type AggregateChatThreadParticipant = {
    _count: ChatThreadParticipantCountAggregateOutputType | null
    _min: ChatThreadParticipantMinAggregateOutputType | null
    _max: ChatThreadParticipantMaxAggregateOutputType | null
  }

  export type ChatThreadParticipantMinAggregateOutputType = {
    id: string | null
    threadId: string | null
    userId: string | null
    role: string | null
    joinedAt: Date | null
    lastReadAt: Date | null
    checkedInAt: Date | null
  }

  export type ChatThreadParticipantMaxAggregateOutputType = {
    id: string | null
    threadId: string | null
    userId: string | null
    role: string | null
    joinedAt: Date | null
    lastReadAt: Date | null
    checkedInAt: Date | null
  }

  export type ChatThreadParticipantCountAggregateOutputType = {
    id: number
    threadId: number
    userId: number
    role: number
    joinedAt: number
    lastReadAt: number
    checkedInAt: number
    _all: number
  }


  export type ChatThreadParticipantMinAggregateInputType = {
    id?: true
    threadId?: true
    userId?: true
    role?: true
    joinedAt?: true
    lastReadAt?: true
    checkedInAt?: true
  }

  export type ChatThreadParticipantMaxAggregateInputType = {
    id?: true
    threadId?: true
    userId?: true
    role?: true
    joinedAt?: true
    lastReadAt?: true
    checkedInAt?: true
  }

  export type ChatThreadParticipantCountAggregateInputType = {
    id?: true
    threadId?: true
    userId?: true
    role?: true
    joinedAt?: true
    lastReadAt?: true
    checkedInAt?: true
    _all?: true
  }

  export type ChatThreadParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatThreadParticipant to aggregate.
     */
    where?: ChatThreadParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatThreadParticipants to fetch.
     */
    orderBy?: ChatThreadParticipantOrderByWithRelationInput | ChatThreadParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatThreadParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatThreadParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatThreadParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatThreadParticipants
    **/
    _count?: true | ChatThreadParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatThreadParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatThreadParticipantMaxAggregateInputType
  }

  export type GetChatThreadParticipantAggregateType<T extends ChatThreadParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateChatThreadParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatThreadParticipant[P]>
      : GetScalarType<T[P], AggregateChatThreadParticipant[P]>
  }




  export type ChatThreadParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatThreadParticipantWhereInput
    orderBy?: ChatThreadParticipantOrderByWithAggregationInput | ChatThreadParticipantOrderByWithAggregationInput[]
    by: ChatThreadParticipantScalarFieldEnum[] | ChatThreadParticipantScalarFieldEnum
    having?: ChatThreadParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatThreadParticipantCountAggregateInputType | true
    _min?: ChatThreadParticipantMinAggregateInputType
    _max?: ChatThreadParticipantMaxAggregateInputType
  }

  export type ChatThreadParticipantGroupByOutputType = {
    id: string
    threadId: string
    userId: string
    role: string
    joinedAt: Date
    lastReadAt: Date | null
    checkedInAt: Date | null
    _count: ChatThreadParticipantCountAggregateOutputType | null
    _min: ChatThreadParticipantMinAggregateOutputType | null
    _max: ChatThreadParticipantMaxAggregateOutputType | null
  }

  type GetChatThreadParticipantGroupByPayload<T extends ChatThreadParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatThreadParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatThreadParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatThreadParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], ChatThreadParticipantGroupByOutputType[P]>
        }
      >
    >


  export type ChatThreadParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    threadId?: boolean
    userId?: boolean
    role?: boolean
    joinedAt?: boolean
    lastReadAt?: boolean
    checkedInAt?: boolean
    thread?: boolean | ChatThreadDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatThreadParticipant"]>

  export type ChatThreadParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    threadId?: boolean
    userId?: boolean
    role?: boolean
    joinedAt?: boolean
    lastReadAt?: boolean
    checkedInAt?: boolean
    thread?: boolean | ChatThreadDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatThreadParticipant"]>

  export type ChatThreadParticipantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    threadId?: boolean
    userId?: boolean
    role?: boolean
    joinedAt?: boolean
    lastReadAt?: boolean
    checkedInAt?: boolean
    thread?: boolean | ChatThreadDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatThreadParticipant"]>

  export type ChatThreadParticipantSelectScalar = {
    id?: boolean
    threadId?: boolean
    userId?: boolean
    role?: boolean
    joinedAt?: boolean
    lastReadAt?: boolean
    checkedInAt?: boolean
  }

  export type ChatThreadParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "threadId" | "userId" | "role" | "joinedAt" | "lastReadAt" | "checkedInAt", ExtArgs["result"]["chatThreadParticipant"]>
  export type ChatThreadParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    thread?: boolean | ChatThreadDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ChatThreadParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    thread?: boolean | ChatThreadDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ChatThreadParticipantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    thread?: boolean | ChatThreadDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ChatThreadParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatThreadParticipant"
    objects: {
      thread: Prisma.$ChatThreadPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      threadId: string
      userId: string
      role: string
      joinedAt: Date
      lastReadAt: Date | null
      checkedInAt: Date | null
    }, ExtArgs["result"]["chatThreadParticipant"]>
    composites: {}
  }

  type ChatThreadParticipantGetPayload<S extends boolean | null | undefined | ChatThreadParticipantDefaultArgs> = $Result.GetResult<Prisma.$ChatThreadParticipantPayload, S>

  type ChatThreadParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatThreadParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatThreadParticipantCountAggregateInputType | true
    }

  export interface ChatThreadParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatThreadParticipant'], meta: { name: 'ChatThreadParticipant' } }
    /**
     * Find zero or one ChatThreadParticipant that matches the filter.
     * @param {ChatThreadParticipantFindUniqueArgs} args - Arguments to find a ChatThreadParticipant
     * @example
     * // Get one ChatThreadParticipant
     * const chatThreadParticipant = await prisma.chatThreadParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatThreadParticipantFindUniqueArgs>(args: SelectSubset<T, ChatThreadParticipantFindUniqueArgs<ExtArgs>>): Prisma__ChatThreadParticipantClient<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatThreadParticipant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatThreadParticipantFindUniqueOrThrowArgs} args - Arguments to find a ChatThreadParticipant
     * @example
     * // Get one ChatThreadParticipant
     * const chatThreadParticipant = await prisma.chatThreadParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatThreadParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatThreadParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatThreadParticipantClient<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatThreadParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadParticipantFindFirstArgs} args - Arguments to find a ChatThreadParticipant
     * @example
     * // Get one ChatThreadParticipant
     * const chatThreadParticipant = await prisma.chatThreadParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatThreadParticipantFindFirstArgs>(args?: SelectSubset<T, ChatThreadParticipantFindFirstArgs<ExtArgs>>): Prisma__ChatThreadParticipantClient<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatThreadParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadParticipantFindFirstOrThrowArgs} args - Arguments to find a ChatThreadParticipant
     * @example
     * // Get one ChatThreadParticipant
     * const chatThreadParticipant = await prisma.chatThreadParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatThreadParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatThreadParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatThreadParticipantClient<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatThreadParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatThreadParticipants
     * const chatThreadParticipants = await prisma.chatThreadParticipant.findMany()
     * 
     * // Get first 10 ChatThreadParticipants
     * const chatThreadParticipants = await prisma.chatThreadParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatThreadParticipantWithIdOnly = await prisma.chatThreadParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatThreadParticipantFindManyArgs>(args?: SelectSubset<T, ChatThreadParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatThreadParticipant.
     * @param {ChatThreadParticipantCreateArgs} args - Arguments to create a ChatThreadParticipant.
     * @example
     * // Create one ChatThreadParticipant
     * const ChatThreadParticipant = await prisma.chatThreadParticipant.create({
     *   data: {
     *     // ... data to create a ChatThreadParticipant
     *   }
     * })
     * 
     */
    create<T extends ChatThreadParticipantCreateArgs>(args: SelectSubset<T, ChatThreadParticipantCreateArgs<ExtArgs>>): Prisma__ChatThreadParticipantClient<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatThreadParticipants.
     * @param {ChatThreadParticipantCreateManyArgs} args - Arguments to create many ChatThreadParticipants.
     * @example
     * // Create many ChatThreadParticipants
     * const chatThreadParticipant = await prisma.chatThreadParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatThreadParticipantCreateManyArgs>(args?: SelectSubset<T, ChatThreadParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatThreadParticipants and returns the data saved in the database.
     * @param {ChatThreadParticipantCreateManyAndReturnArgs} args - Arguments to create many ChatThreadParticipants.
     * @example
     * // Create many ChatThreadParticipants
     * const chatThreadParticipant = await prisma.chatThreadParticipant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatThreadParticipants and only return the `id`
     * const chatThreadParticipantWithIdOnly = await prisma.chatThreadParticipant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatThreadParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatThreadParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatThreadParticipant.
     * @param {ChatThreadParticipantDeleteArgs} args - Arguments to delete one ChatThreadParticipant.
     * @example
     * // Delete one ChatThreadParticipant
     * const ChatThreadParticipant = await prisma.chatThreadParticipant.delete({
     *   where: {
     *     // ... filter to delete one ChatThreadParticipant
     *   }
     * })
     * 
     */
    delete<T extends ChatThreadParticipantDeleteArgs>(args: SelectSubset<T, ChatThreadParticipantDeleteArgs<ExtArgs>>): Prisma__ChatThreadParticipantClient<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatThreadParticipant.
     * @param {ChatThreadParticipantUpdateArgs} args - Arguments to update one ChatThreadParticipant.
     * @example
     * // Update one ChatThreadParticipant
     * const chatThreadParticipant = await prisma.chatThreadParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatThreadParticipantUpdateArgs>(args: SelectSubset<T, ChatThreadParticipantUpdateArgs<ExtArgs>>): Prisma__ChatThreadParticipantClient<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatThreadParticipants.
     * @param {ChatThreadParticipantDeleteManyArgs} args - Arguments to filter ChatThreadParticipants to delete.
     * @example
     * // Delete a few ChatThreadParticipants
     * const { count } = await prisma.chatThreadParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatThreadParticipantDeleteManyArgs>(args?: SelectSubset<T, ChatThreadParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatThreadParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatThreadParticipants
     * const chatThreadParticipant = await prisma.chatThreadParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatThreadParticipantUpdateManyArgs>(args: SelectSubset<T, ChatThreadParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatThreadParticipants and returns the data updated in the database.
     * @param {ChatThreadParticipantUpdateManyAndReturnArgs} args - Arguments to update many ChatThreadParticipants.
     * @example
     * // Update many ChatThreadParticipants
     * const chatThreadParticipant = await prisma.chatThreadParticipant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatThreadParticipants and only return the `id`
     * const chatThreadParticipantWithIdOnly = await prisma.chatThreadParticipant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatThreadParticipantUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatThreadParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatThreadParticipant.
     * @param {ChatThreadParticipantUpsertArgs} args - Arguments to update or create a ChatThreadParticipant.
     * @example
     * // Update or create a ChatThreadParticipant
     * const chatThreadParticipant = await prisma.chatThreadParticipant.upsert({
     *   create: {
     *     // ... data to create a ChatThreadParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatThreadParticipant we want to update
     *   }
     * })
     */
    upsert<T extends ChatThreadParticipantUpsertArgs>(args: SelectSubset<T, ChatThreadParticipantUpsertArgs<ExtArgs>>): Prisma__ChatThreadParticipantClient<$Result.GetResult<Prisma.$ChatThreadParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatThreadParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadParticipantCountArgs} args - Arguments to filter ChatThreadParticipants to count.
     * @example
     * // Count the number of ChatThreadParticipants
     * const count = await prisma.chatThreadParticipant.count({
     *   where: {
     *     // ... the filter for the ChatThreadParticipants we want to count
     *   }
     * })
    **/
    count<T extends ChatThreadParticipantCountArgs>(
      args?: Subset<T, ChatThreadParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatThreadParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatThreadParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatThreadParticipantAggregateArgs>(args: Subset<T, ChatThreadParticipantAggregateArgs>): Prisma.PrismaPromise<GetChatThreadParticipantAggregateType<T>>

    /**
     * Group by ChatThreadParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatThreadParticipantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatThreadParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatThreadParticipantGroupByArgs['orderBy'] }
        : { orderBy?: ChatThreadParticipantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatThreadParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatThreadParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatThreadParticipant model
   */
  readonly fields: ChatThreadParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatThreadParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatThreadParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    thread<T extends ChatThreadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatThreadDefaultArgs<ExtArgs>>): Prisma__ChatThreadClient<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatThreadParticipant model
   */
  interface ChatThreadParticipantFieldRefs {
    readonly id: FieldRef<"ChatThreadParticipant", 'String'>
    readonly threadId: FieldRef<"ChatThreadParticipant", 'String'>
    readonly userId: FieldRef<"ChatThreadParticipant", 'String'>
    readonly role: FieldRef<"ChatThreadParticipant", 'String'>
    readonly joinedAt: FieldRef<"ChatThreadParticipant", 'DateTime'>
    readonly lastReadAt: FieldRef<"ChatThreadParticipant", 'DateTime'>
    readonly checkedInAt: FieldRef<"ChatThreadParticipant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatThreadParticipant findUnique
   */
  export type ChatThreadParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ChatThreadParticipant to fetch.
     */
    where: ChatThreadParticipantWhereUniqueInput
  }

  /**
   * ChatThreadParticipant findUniqueOrThrow
   */
  export type ChatThreadParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ChatThreadParticipant to fetch.
     */
    where: ChatThreadParticipantWhereUniqueInput
  }

  /**
   * ChatThreadParticipant findFirst
   */
  export type ChatThreadParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ChatThreadParticipant to fetch.
     */
    where?: ChatThreadParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatThreadParticipants to fetch.
     */
    orderBy?: ChatThreadParticipantOrderByWithRelationInput | ChatThreadParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatThreadParticipants.
     */
    cursor?: ChatThreadParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatThreadParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatThreadParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatThreadParticipants.
     */
    distinct?: ChatThreadParticipantScalarFieldEnum | ChatThreadParticipantScalarFieldEnum[]
  }

  /**
   * ChatThreadParticipant findFirstOrThrow
   */
  export type ChatThreadParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ChatThreadParticipant to fetch.
     */
    where?: ChatThreadParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatThreadParticipants to fetch.
     */
    orderBy?: ChatThreadParticipantOrderByWithRelationInput | ChatThreadParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatThreadParticipants.
     */
    cursor?: ChatThreadParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatThreadParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatThreadParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatThreadParticipants.
     */
    distinct?: ChatThreadParticipantScalarFieldEnum | ChatThreadParticipantScalarFieldEnum[]
  }

  /**
   * ChatThreadParticipant findMany
   */
  export type ChatThreadParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ChatThreadParticipants to fetch.
     */
    where?: ChatThreadParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatThreadParticipants to fetch.
     */
    orderBy?: ChatThreadParticipantOrderByWithRelationInput | ChatThreadParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatThreadParticipants.
     */
    cursor?: ChatThreadParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatThreadParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatThreadParticipants.
     */
    skip?: number
    distinct?: ChatThreadParticipantScalarFieldEnum | ChatThreadParticipantScalarFieldEnum[]
  }

  /**
   * ChatThreadParticipant create
   */
  export type ChatThreadParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatThreadParticipant.
     */
    data: XOR<ChatThreadParticipantCreateInput, ChatThreadParticipantUncheckedCreateInput>
  }

  /**
   * ChatThreadParticipant createMany
   */
  export type ChatThreadParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatThreadParticipants.
     */
    data: ChatThreadParticipantCreateManyInput | ChatThreadParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatThreadParticipant createManyAndReturn
   */
  export type ChatThreadParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * The data used to create many ChatThreadParticipants.
     */
    data: ChatThreadParticipantCreateManyInput | ChatThreadParticipantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatThreadParticipant update
   */
  export type ChatThreadParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatThreadParticipant.
     */
    data: XOR<ChatThreadParticipantUpdateInput, ChatThreadParticipantUncheckedUpdateInput>
    /**
     * Choose, which ChatThreadParticipant to update.
     */
    where: ChatThreadParticipantWhereUniqueInput
  }

  /**
   * ChatThreadParticipant updateMany
   */
  export type ChatThreadParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatThreadParticipants.
     */
    data: XOR<ChatThreadParticipantUpdateManyMutationInput, ChatThreadParticipantUncheckedUpdateManyInput>
    /**
     * Filter which ChatThreadParticipants to update
     */
    where?: ChatThreadParticipantWhereInput
    /**
     * Limit how many ChatThreadParticipants to update.
     */
    limit?: number
  }

  /**
   * ChatThreadParticipant updateManyAndReturn
   */
  export type ChatThreadParticipantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * The data used to update ChatThreadParticipants.
     */
    data: XOR<ChatThreadParticipantUpdateManyMutationInput, ChatThreadParticipantUncheckedUpdateManyInput>
    /**
     * Filter which ChatThreadParticipants to update
     */
    where?: ChatThreadParticipantWhereInput
    /**
     * Limit how many ChatThreadParticipants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatThreadParticipant upsert
   */
  export type ChatThreadParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatThreadParticipant to update in case it exists.
     */
    where: ChatThreadParticipantWhereUniqueInput
    /**
     * In case the ChatThreadParticipant found by the `where` argument doesn't exist, create a new ChatThreadParticipant with this data.
     */
    create: XOR<ChatThreadParticipantCreateInput, ChatThreadParticipantUncheckedCreateInput>
    /**
     * In case the ChatThreadParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatThreadParticipantUpdateInput, ChatThreadParticipantUncheckedUpdateInput>
  }

  /**
   * ChatThreadParticipant delete
   */
  export type ChatThreadParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantInclude<ExtArgs> | null
    /**
     * Filter which ChatThreadParticipant to delete.
     */
    where: ChatThreadParticipantWhereUniqueInput
  }

  /**
   * ChatThreadParticipant deleteMany
   */
  export type ChatThreadParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatThreadParticipants to delete
     */
    where?: ChatThreadParticipantWhereInput
    /**
     * Limit how many ChatThreadParticipants to delete.
     */
    limit?: number
  }

  /**
   * ChatThreadParticipant without action
   */
  export type ChatThreadParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThreadParticipant
     */
    select?: ChatThreadParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThreadParticipant
     */
    omit?: ChatThreadParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadParticipantInclude<ExtArgs> | null
  }


  /**
   * Model Report
   */

  export type AggregateReport = {
    _count: ReportCountAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  export type ReportMinAggregateOutputType = {
    id: string | null
    reporterId: string | null
    targetUserId: string | null
    matchId: string | null
    reason: string | null
    status: string | null
    createdAt: Date | null
  }

  export type ReportMaxAggregateOutputType = {
    id: string | null
    reporterId: string | null
    targetUserId: string | null
    matchId: string | null
    reason: string | null
    status: string | null
    createdAt: Date | null
  }

  export type ReportCountAggregateOutputType = {
    id: number
    reporterId: number
    targetUserId: number
    matchId: number
    reason: number
    status: number
    createdAt: number
    _all: number
  }


  export type ReportMinAggregateInputType = {
    id?: true
    reporterId?: true
    targetUserId?: true
    matchId?: true
    reason?: true
    status?: true
    createdAt?: true
  }

  export type ReportMaxAggregateInputType = {
    id?: true
    reporterId?: true
    targetUserId?: true
    matchId?: true
    reason?: true
    status?: true
    createdAt?: true
  }

  export type ReportCountAggregateInputType = {
    id?: true
    reporterId?: true
    targetUserId?: true
    matchId?: true
    reason?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type ReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Report to aggregate.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reports
    **/
    _count?: true | ReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReportMaxAggregateInputType
  }

  export type GetReportAggregateType<T extends ReportAggregateArgs> = {
        [P in keyof T & keyof AggregateReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReport[P]>
      : GetScalarType<T[P], AggregateReport[P]>
  }




  export type ReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithAggregationInput | ReportOrderByWithAggregationInput[]
    by: ReportScalarFieldEnum[] | ReportScalarFieldEnum
    having?: ReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReportCountAggregateInputType | true
    _min?: ReportMinAggregateInputType
    _max?: ReportMaxAggregateInputType
  }

  export type ReportGroupByOutputType = {
    id: string
    reporterId: string
    targetUserId: string
    matchId: string | null
    reason: string
    status: string
    createdAt: Date
    _count: ReportCountAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  type GetReportGroupByPayload<T extends ReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReportGroupByOutputType[P]>
            : GetScalarType<T[P], ReportGroupByOutputType[P]>
        }
      >
    >


  export type ReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reporterId?: boolean
    targetUserId?: boolean
    matchId?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["report"]>

  export type ReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reporterId?: boolean
    targetUserId?: boolean
    matchId?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["report"]>

  export type ReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reporterId?: boolean
    targetUserId?: boolean
    matchId?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["report"]>

  export type ReportSelectScalar = {
    id?: boolean
    reporterId?: boolean
    targetUserId?: boolean
    matchId?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type ReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "reporterId" | "targetUserId" | "matchId" | "reason" | "status" | "createdAt", ExtArgs["result"]["report"]>

  export type $ReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Report"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      reporterId: string
      targetUserId: string
      matchId: string | null
      reason: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["report"]>
    composites: {}
  }

  type ReportGetPayload<S extends boolean | null | undefined | ReportDefaultArgs> = $Result.GetResult<Prisma.$ReportPayload, S>

  type ReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReportCountAggregateInputType | true
    }

  export interface ReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Report'], meta: { name: 'Report' } }
    /**
     * Find zero or one Report that matches the filter.
     * @param {ReportFindUniqueArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReportFindUniqueArgs>(args: SelectSubset<T, ReportFindUniqueArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Report that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReportFindUniqueOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReportFindUniqueOrThrowArgs>(args: SelectSubset<T, ReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Report that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReportFindFirstArgs>(args?: SelectSubset<T, ReportFindFirstArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Report that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReportFindFirstOrThrowArgs>(args?: SelectSubset<T, ReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reports
     * const reports = await prisma.report.findMany()
     * 
     * // Get first 10 Reports
     * const reports = await prisma.report.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reportWithIdOnly = await prisma.report.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReportFindManyArgs>(args?: SelectSubset<T, ReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Report.
     * @param {ReportCreateArgs} args - Arguments to create a Report.
     * @example
     * // Create one Report
     * const Report = await prisma.report.create({
     *   data: {
     *     // ... data to create a Report
     *   }
     * })
     * 
     */
    create<T extends ReportCreateArgs>(args: SelectSubset<T, ReportCreateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reports.
     * @param {ReportCreateManyArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const report = await prisma.report.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReportCreateManyArgs>(args?: SelectSubset<T, ReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reports and returns the data saved in the database.
     * @param {ReportCreateManyAndReturnArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const report = await prisma.report.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reports and only return the `id`
     * const reportWithIdOnly = await prisma.report.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReportCreateManyAndReturnArgs>(args?: SelectSubset<T, ReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Report.
     * @param {ReportDeleteArgs} args - Arguments to delete one Report.
     * @example
     * // Delete one Report
     * const Report = await prisma.report.delete({
     *   where: {
     *     // ... filter to delete one Report
     *   }
     * })
     * 
     */
    delete<T extends ReportDeleteArgs>(args: SelectSubset<T, ReportDeleteArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Report.
     * @param {ReportUpdateArgs} args - Arguments to update one Report.
     * @example
     * // Update one Report
     * const report = await prisma.report.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReportUpdateArgs>(args: SelectSubset<T, ReportUpdateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reports.
     * @param {ReportDeleteManyArgs} args - Arguments to filter Reports to delete.
     * @example
     * // Delete a few Reports
     * const { count } = await prisma.report.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReportDeleteManyArgs>(args?: SelectSubset<T, ReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reports
     * const report = await prisma.report.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReportUpdateManyArgs>(args: SelectSubset<T, ReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports and returns the data updated in the database.
     * @param {ReportUpdateManyAndReturnArgs} args - Arguments to update many Reports.
     * @example
     * // Update many Reports
     * const report = await prisma.report.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reports and only return the `id`
     * const reportWithIdOnly = await prisma.report.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReportUpdateManyAndReturnArgs>(args: SelectSubset<T, ReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Report.
     * @param {ReportUpsertArgs} args - Arguments to update or create a Report.
     * @example
     * // Update or create a Report
     * const report = await prisma.report.upsert({
     *   create: {
     *     // ... data to create a Report
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Report we want to update
     *   }
     * })
     */
    upsert<T extends ReportUpsertArgs>(args: SelectSubset<T, ReportUpsertArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportCountArgs} args - Arguments to filter Reports to count.
     * @example
     * // Count the number of Reports
     * const count = await prisma.report.count({
     *   where: {
     *     // ... the filter for the Reports we want to count
     *   }
     * })
    **/
    count<T extends ReportCountArgs>(
      args?: Subset<T, ReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReportAggregateArgs>(args: Subset<T, ReportAggregateArgs>): Prisma.PrismaPromise<GetReportAggregateType<T>>

    /**
     * Group by Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReportGroupByArgs['orderBy'] }
        : { orderBy?: ReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Report model
   */
  readonly fields: ReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Report.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Report model
   */
  interface ReportFieldRefs {
    readonly id: FieldRef<"Report", 'String'>
    readonly reporterId: FieldRef<"Report", 'String'>
    readonly targetUserId: FieldRef<"Report", 'String'>
    readonly matchId: FieldRef<"Report", 'String'>
    readonly reason: FieldRef<"Report", 'String'>
    readonly status: FieldRef<"Report", 'String'>
    readonly createdAt: FieldRef<"Report", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Report findUnique
   */
  export type ReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findUniqueOrThrow
   */
  export type ReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findFirst
   */
  export type ReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findFirstOrThrow
   */
  export type ReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findMany
   */
  export type ReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Filter, which Reports to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report create
   */
  export type ReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * The data needed to create a Report.
     */
    data: XOR<ReportCreateInput, ReportUncheckedCreateInput>
  }

  /**
   * Report createMany
   */
  export type ReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reports.
     */
    data: ReportCreateManyInput | ReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Report createManyAndReturn
   */
  export type ReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * The data used to create many Reports.
     */
    data: ReportCreateManyInput | ReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Report update
   */
  export type ReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * The data needed to update a Report.
     */
    data: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
    /**
     * Choose, which Report to update.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report updateMany
   */
  export type ReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reports.
     */
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyInput>
    /**
     * Filter which Reports to update
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to update.
     */
    limit?: number
  }

  /**
   * Report updateManyAndReturn
   */
  export type ReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * The data used to update Reports.
     */
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyInput>
    /**
     * Filter which Reports to update
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to update.
     */
    limit?: number
  }

  /**
   * Report upsert
   */
  export type ReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * The filter to search for the Report to update in case it exists.
     */
    where: ReportWhereUniqueInput
    /**
     * In case the Report found by the `where` argument doesn't exist, create a new Report with this data.
     */
    create: XOR<ReportCreateInput, ReportUncheckedCreateInput>
    /**
     * In case the Report was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
  }

  /**
   * Report delete
   */
  export type ReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Filter which Report to delete.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report deleteMany
   */
  export type ReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reports to delete
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to delete.
     */
    limit?: number
  }

  /**
   * Report without action
   */
  export type ReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    userId: string | null
    kind: string | null
    title: string | null
    content: string | null
    senderId: string | null
    senderName: string | null
    isRead: boolean | null
    status: string | null
    matchId: string | null
    threadId: string | null
    createdAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    kind: string | null
    title: string | null
    content: string | null
    senderId: string | null
    senderName: string | null
    isRead: boolean | null
    status: string | null
    matchId: string | null
    threadId: string | null
    createdAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    userId: number
    kind: number
    title: number
    content: number
    senderId: number
    senderName: number
    isRead: number
    status: number
    matchId: number
    threadId: number
    createdAt: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    userId?: true
    kind?: true
    title?: true
    content?: true
    senderId?: true
    senderName?: true
    isRead?: true
    status?: true
    matchId?: true
    threadId?: true
    createdAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    userId?: true
    kind?: true
    title?: true
    content?: true
    senderId?: true
    senderName?: true
    isRead?: true
    status?: true
    matchId?: true
    threadId?: true
    createdAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    userId?: true
    kind?: true
    title?: true
    content?: true
    senderId?: true
    senderName?: true
    isRead?: true
    status?: true
    matchId?: true
    threadId?: true
    createdAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    userId: string
    kind: string
    title: string
    content: string
    senderId: string | null
    senderName: string | null
    isRead: boolean
    status: string | null
    matchId: string | null
    threadId: string | null
    createdAt: Date
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    kind?: boolean
    title?: boolean
    content?: boolean
    senderId?: boolean
    senderName?: boolean
    isRead?: boolean
    status?: boolean
    matchId?: boolean
    threadId?: boolean
    createdAt?: boolean
    thread?: boolean | Message$threadArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    kind?: boolean
    title?: boolean
    content?: boolean
    senderId?: boolean
    senderName?: boolean
    isRead?: boolean
    status?: boolean
    matchId?: boolean
    threadId?: boolean
    createdAt?: boolean
    thread?: boolean | Message$threadArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    kind?: boolean
    title?: boolean
    content?: boolean
    senderId?: boolean
    senderName?: boolean
    isRead?: boolean
    status?: boolean
    matchId?: boolean
    threadId?: boolean
    createdAt?: boolean
    thread?: boolean | Message$threadArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    userId?: boolean
    kind?: boolean
    title?: boolean
    content?: boolean
    senderId?: boolean
    senderName?: boolean
    isRead?: boolean
    status?: boolean
    matchId?: boolean
    threadId?: boolean
    createdAt?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "kind" | "title" | "content" | "senderId" | "senderName" | "isRead" | "status" | "matchId" | "threadId" | "createdAt", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    thread?: boolean | Message$threadArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    thread?: boolean | Message$threadArgs<ExtArgs>
  }
  export type MessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    thread?: boolean | Message$threadArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      thread: Prisma.$ChatThreadPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      kind: string
      title: string
      content: string
      senderId: string | null
      senderName: string | null
      isRead: boolean
      status: string | null
      matchId: string | null
      threadId: string | null
      createdAt: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    thread<T extends Message$threadArgs<ExtArgs> = {}>(args?: Subset<T, Message$threadArgs<ExtArgs>>): Prisma__ChatThreadClient<$Result.GetResult<Prisma.$ChatThreadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly userId: FieldRef<"Message", 'String'>
    readonly kind: FieldRef<"Message", 'String'>
    readonly title: FieldRef<"Message", 'String'>
    readonly content: FieldRef<"Message", 'String'>
    readonly senderId: FieldRef<"Message", 'String'>
    readonly senderName: FieldRef<"Message", 'String'>
    readonly isRead: FieldRef<"Message", 'Boolean'>
    readonly status: FieldRef<"Message", 'String'>
    readonly matchId: FieldRef<"Message", 'String'>
    readonly threadId: FieldRef<"Message", 'String'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message.thread
   */
  export type Message$threadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatThread
     */
    select?: ChatThreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatThread
     */
    omit?: ChatThreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatThreadInclude<ExtArgs> | null
    where?: ChatThreadWhereInput
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
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

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const VenueScalarFieldEnum: {
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

  export type VenueScalarFieldEnum = (typeof VenueScalarFieldEnum)[keyof typeof VenueScalarFieldEnum]


  export const VenueCourtScalarFieldEnum: {
    id: 'id',
    venueId: 'venueId',
    name: 'name',
    sortOrder: 'sortOrder',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VenueCourtScalarFieldEnum = (typeof VenueCourtScalarFieldEnum)[keyof typeof VenueCourtScalarFieldEnum]


  export const VenueAvailabilitySlotScalarFieldEnum: {
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

  export type VenueAvailabilitySlotScalarFieldEnum = (typeof VenueAvailabilitySlotScalarFieldEnum)[keyof typeof VenueAvailabilitySlotScalarFieldEnum]


  export const OptionPresetScalarFieldEnum: {
    id: 'id',
    kind: 'kind',
    value: 'value',
    label: 'label',
    sortOrder: 'sortOrder',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OptionPresetScalarFieldEnum = (typeof OptionPresetScalarFieldEnum)[keyof typeof OptionPresetScalarFieldEnum]


  export const MatchScalarFieldEnum: {
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

  export type MatchScalarFieldEnum = (typeof MatchScalarFieldEnum)[keyof typeof MatchScalarFieldEnum]


  export const MatchApplicationScalarFieldEnum: {
    id: 'id',
    matchId: 'matchId',
    userId: 'userId',
    status: 'status',
    decisionReason: 'decisionReason',
    createdAt: 'createdAt'
  };

  export type MatchApplicationScalarFieldEnum = (typeof MatchApplicationScalarFieldEnum)[keyof typeof MatchApplicationScalarFieldEnum]


  export const ReviewScalarFieldEnum: {
    id: 'id',
    matchId: 'matchId',
    reviewerId: 'reviewerId',
    revieweeId: 'revieweeId',
    score: 'score',
    tags: 'tags',
    anonymous: 'anonymous',
    createdAt: 'createdAt'
  };

  export type ReviewScalarFieldEnum = (typeof ReviewScalarFieldEnum)[keyof typeof ReviewScalarFieldEnum]


  export const ChatThreadScalarFieldEnum: {
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

  export type ChatThreadScalarFieldEnum = (typeof ChatThreadScalarFieldEnum)[keyof typeof ChatThreadScalarFieldEnum]


  export const ChatThreadParticipantScalarFieldEnum: {
    id: 'id',
    threadId: 'threadId',
    userId: 'userId',
    role: 'role',
    joinedAt: 'joinedAt',
    lastReadAt: 'lastReadAt',
    checkedInAt: 'checkedInAt'
  };

  export type ChatThreadParticipantScalarFieldEnum = (typeof ChatThreadParticipantScalarFieldEnum)[keyof typeof ChatThreadParticipantScalarFieldEnum]


  export const ReportScalarFieldEnum: {
    id: 'id',
    reporterId: 'reporterId',
    targetUserId: 'targetUserId',
    matchId: 'matchId',
    reason: 'reason',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type ReportScalarFieldEnum = (typeof ReportScalarFieldEnum)[keyof typeof ReportScalarFieldEnum]


  export const MessageScalarFieldEnum: {
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

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'OptionPresetKind'
   */
  export type EnumOptionPresetKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OptionPresetKind'>
    


  /**
   * Reference to a field of type 'OptionPresetKind[]'
   */
  export type ListEnumOptionPresetKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OptionPresetKind[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    wechatOpenId?: StringNullableFilter<"User"> | string | null
    wechatUnionId?: StringNullableFilter<"User"> | string | null
    nickname?: StringFilter<"User"> | string
    city?: StringFilter<"User"> | string
    level?: StringFilter<"User"> | string
    creditScore?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    hostedMatches?: MatchListRelationFilter
    threadMembership?: ChatThreadParticipantListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    phone?: SortOrderInput | SortOrder
    wechatOpenId?: SortOrderInput | SortOrder
    wechatUnionId?: SortOrderInput | SortOrder
    nickname?: SortOrder
    city?: SortOrder
    level?: SortOrder
    creditScore?: SortOrder
    createdAt?: SortOrder
    hostedMatches?: MatchOrderByRelationAggregateInput
    threadMembership?: ChatThreadParticipantOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phone?: string
    wechatOpenId?: string
    wechatUnionId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    nickname?: StringFilter<"User"> | string
    city?: StringFilter<"User"> | string
    level?: StringFilter<"User"> | string
    creditScore?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    hostedMatches?: MatchListRelationFilter
    threadMembership?: ChatThreadParticipantListRelationFilter
  }, "id" | "phone" | "wechatOpenId" | "wechatUnionId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    phone?: SortOrderInput | SortOrder
    wechatOpenId?: SortOrderInput | SortOrder
    wechatUnionId?: SortOrderInput | SortOrder
    nickname?: SortOrder
    city?: SortOrder
    level?: SortOrder
    creditScore?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    wechatOpenId?: StringNullableWithAggregatesFilter<"User"> | string | null
    wechatUnionId?: StringNullableWithAggregatesFilter<"User"> | string | null
    nickname?: StringWithAggregatesFilter<"User"> | string
    city?: StringWithAggregatesFilter<"User"> | string
    level?: StringWithAggregatesFilter<"User"> | string
    creditScore?: IntWithAggregatesFilter<"User"> | number
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type VenueWhereInput = {
    AND?: VenueWhereInput | VenueWhereInput[]
    OR?: VenueWhereInput[]
    NOT?: VenueWhereInput | VenueWhereInput[]
    id?: StringFilter<"Venue"> | string
    name?: StringFilter<"Venue"> | string
    city?: StringFilter<"Venue"> | string
    district?: StringNullableFilter<"Venue"> | string | null
    distanceKm?: FloatFilter<"Venue"> | number
    sortOrder?: IntFilter<"Venue"> | number
    isActive?: BoolFilter<"Venue"> | boolean
    createdAt?: DateTimeFilter<"Venue"> | Date | string
    updatedAt?: DateTimeFilter<"Venue"> | Date | string
    courts?: VenueCourtListRelationFilter
    availabilitySlots?: VenueAvailabilitySlotListRelationFilter
    matches?: MatchListRelationFilter
  }

  export type VenueOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    district?: SortOrderInput | SortOrder
    distanceKm?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    courts?: VenueCourtOrderByRelationAggregateInput
    availabilitySlots?: VenueAvailabilitySlotOrderByRelationAggregateInput
    matches?: MatchOrderByRelationAggregateInput
  }

  export type VenueWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VenueWhereInput | VenueWhereInput[]
    OR?: VenueWhereInput[]
    NOT?: VenueWhereInput | VenueWhereInput[]
    name?: StringFilter<"Venue"> | string
    city?: StringFilter<"Venue"> | string
    district?: StringNullableFilter<"Venue"> | string | null
    distanceKm?: FloatFilter<"Venue"> | number
    sortOrder?: IntFilter<"Venue"> | number
    isActive?: BoolFilter<"Venue"> | boolean
    createdAt?: DateTimeFilter<"Venue"> | Date | string
    updatedAt?: DateTimeFilter<"Venue"> | Date | string
    courts?: VenueCourtListRelationFilter
    availabilitySlots?: VenueAvailabilitySlotListRelationFilter
    matches?: MatchListRelationFilter
  }, "id">

  export type VenueOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    district?: SortOrderInput | SortOrder
    distanceKm?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VenueCountOrderByAggregateInput
    _avg?: VenueAvgOrderByAggregateInput
    _max?: VenueMaxOrderByAggregateInput
    _min?: VenueMinOrderByAggregateInput
    _sum?: VenueSumOrderByAggregateInput
  }

  export type VenueScalarWhereWithAggregatesInput = {
    AND?: VenueScalarWhereWithAggregatesInput | VenueScalarWhereWithAggregatesInput[]
    OR?: VenueScalarWhereWithAggregatesInput[]
    NOT?: VenueScalarWhereWithAggregatesInput | VenueScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Venue"> | string
    name?: StringWithAggregatesFilter<"Venue"> | string
    city?: StringWithAggregatesFilter<"Venue"> | string
    district?: StringNullableWithAggregatesFilter<"Venue"> | string | null
    distanceKm?: FloatWithAggregatesFilter<"Venue"> | number
    sortOrder?: IntWithAggregatesFilter<"Venue"> | number
    isActive?: BoolWithAggregatesFilter<"Venue"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Venue"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Venue"> | Date | string
  }

  export type VenueCourtWhereInput = {
    AND?: VenueCourtWhereInput | VenueCourtWhereInput[]
    OR?: VenueCourtWhereInput[]
    NOT?: VenueCourtWhereInput | VenueCourtWhereInput[]
    id?: StringFilter<"VenueCourt"> | string
    venueId?: StringFilter<"VenueCourt"> | string
    name?: StringFilter<"VenueCourt"> | string
    sortOrder?: IntFilter<"VenueCourt"> | number
    isActive?: BoolFilter<"VenueCourt"> | boolean
    createdAt?: DateTimeFilter<"VenueCourt"> | Date | string
    updatedAt?: DateTimeFilter<"VenueCourt"> | Date | string
    venue?: XOR<VenueScalarRelationFilter, VenueWhereInput>
    matches?: MatchListRelationFilter
  }

  export type VenueCourtOrderByWithRelationInput = {
    id?: SortOrder
    venueId?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    venue?: VenueOrderByWithRelationInput
    matches?: MatchOrderByRelationAggregateInput
  }

  export type VenueCourtWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VenueCourtWhereInput | VenueCourtWhereInput[]
    OR?: VenueCourtWhereInput[]
    NOT?: VenueCourtWhereInput | VenueCourtWhereInput[]
    venueId?: StringFilter<"VenueCourt"> | string
    name?: StringFilter<"VenueCourt"> | string
    sortOrder?: IntFilter<"VenueCourt"> | number
    isActive?: BoolFilter<"VenueCourt"> | boolean
    createdAt?: DateTimeFilter<"VenueCourt"> | Date | string
    updatedAt?: DateTimeFilter<"VenueCourt"> | Date | string
    venue?: XOR<VenueScalarRelationFilter, VenueWhereInput>
    matches?: MatchListRelationFilter
  }, "id">

  export type VenueCourtOrderByWithAggregationInput = {
    id?: SortOrder
    venueId?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VenueCourtCountOrderByAggregateInput
    _avg?: VenueCourtAvgOrderByAggregateInput
    _max?: VenueCourtMaxOrderByAggregateInput
    _min?: VenueCourtMinOrderByAggregateInput
    _sum?: VenueCourtSumOrderByAggregateInput
  }

  export type VenueCourtScalarWhereWithAggregatesInput = {
    AND?: VenueCourtScalarWhereWithAggregatesInput | VenueCourtScalarWhereWithAggregatesInput[]
    OR?: VenueCourtScalarWhereWithAggregatesInput[]
    NOT?: VenueCourtScalarWhereWithAggregatesInput | VenueCourtScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VenueCourt"> | string
    venueId?: StringWithAggregatesFilter<"VenueCourt"> | string
    name?: StringWithAggregatesFilter<"VenueCourt"> | string
    sortOrder?: IntWithAggregatesFilter<"VenueCourt"> | number
    isActive?: BoolWithAggregatesFilter<"VenueCourt"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"VenueCourt"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VenueCourt"> | Date | string
  }

  export type VenueAvailabilitySlotWhereInput = {
    AND?: VenueAvailabilitySlotWhereInput | VenueAvailabilitySlotWhereInput[]
    OR?: VenueAvailabilitySlotWhereInput[]
    NOT?: VenueAvailabilitySlotWhereInput | VenueAvailabilitySlotWhereInput[]
    id?: StringFilter<"VenueAvailabilitySlot"> | string
    venueId?: StringFilter<"VenueAvailabilitySlot"> | string
    label?: StringFilter<"VenueAvailabilitySlot"> | string
    startTime?: IntFilter<"VenueAvailabilitySlot"> | number
    endTime?: IntFilter<"VenueAvailabilitySlot"> | number
    sortOrder?: IntFilter<"VenueAvailabilitySlot"> | number
    isActive?: BoolFilter<"VenueAvailabilitySlot"> | boolean
    createdAt?: DateTimeFilter<"VenueAvailabilitySlot"> | Date | string
    updatedAt?: DateTimeFilter<"VenueAvailabilitySlot"> | Date | string
    venue?: XOR<VenueScalarRelationFilter, VenueWhereInput>
    matches?: MatchListRelationFilter
  }

  export type VenueAvailabilitySlotOrderByWithRelationInput = {
    id?: SortOrder
    venueId?: SortOrder
    label?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    venue?: VenueOrderByWithRelationInput
    matches?: MatchOrderByRelationAggregateInput
  }

  export type VenueAvailabilitySlotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VenueAvailabilitySlotWhereInput | VenueAvailabilitySlotWhereInput[]
    OR?: VenueAvailabilitySlotWhereInput[]
    NOT?: VenueAvailabilitySlotWhereInput | VenueAvailabilitySlotWhereInput[]
    venueId?: StringFilter<"VenueAvailabilitySlot"> | string
    label?: StringFilter<"VenueAvailabilitySlot"> | string
    startTime?: IntFilter<"VenueAvailabilitySlot"> | number
    endTime?: IntFilter<"VenueAvailabilitySlot"> | number
    sortOrder?: IntFilter<"VenueAvailabilitySlot"> | number
    isActive?: BoolFilter<"VenueAvailabilitySlot"> | boolean
    createdAt?: DateTimeFilter<"VenueAvailabilitySlot"> | Date | string
    updatedAt?: DateTimeFilter<"VenueAvailabilitySlot"> | Date | string
    venue?: XOR<VenueScalarRelationFilter, VenueWhereInput>
    matches?: MatchListRelationFilter
  }, "id">

  export type VenueAvailabilitySlotOrderByWithAggregationInput = {
    id?: SortOrder
    venueId?: SortOrder
    label?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VenueAvailabilitySlotCountOrderByAggregateInput
    _avg?: VenueAvailabilitySlotAvgOrderByAggregateInput
    _max?: VenueAvailabilitySlotMaxOrderByAggregateInput
    _min?: VenueAvailabilitySlotMinOrderByAggregateInput
    _sum?: VenueAvailabilitySlotSumOrderByAggregateInput
  }

  export type VenueAvailabilitySlotScalarWhereWithAggregatesInput = {
    AND?: VenueAvailabilitySlotScalarWhereWithAggregatesInput | VenueAvailabilitySlotScalarWhereWithAggregatesInput[]
    OR?: VenueAvailabilitySlotScalarWhereWithAggregatesInput[]
    NOT?: VenueAvailabilitySlotScalarWhereWithAggregatesInput | VenueAvailabilitySlotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VenueAvailabilitySlot"> | string
    venueId?: StringWithAggregatesFilter<"VenueAvailabilitySlot"> | string
    label?: StringWithAggregatesFilter<"VenueAvailabilitySlot"> | string
    startTime?: IntWithAggregatesFilter<"VenueAvailabilitySlot"> | number
    endTime?: IntWithAggregatesFilter<"VenueAvailabilitySlot"> | number
    sortOrder?: IntWithAggregatesFilter<"VenueAvailabilitySlot"> | number
    isActive?: BoolWithAggregatesFilter<"VenueAvailabilitySlot"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"VenueAvailabilitySlot"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VenueAvailabilitySlot"> | Date | string
  }

  export type OptionPresetWhereInput = {
    AND?: OptionPresetWhereInput | OptionPresetWhereInput[]
    OR?: OptionPresetWhereInput[]
    NOT?: OptionPresetWhereInput | OptionPresetWhereInput[]
    id?: StringFilter<"OptionPreset"> | string
    kind?: EnumOptionPresetKindFilter<"OptionPreset"> | $Enums.OptionPresetKind
    value?: StringFilter<"OptionPreset"> | string
    label?: StringFilter<"OptionPreset"> | string
    sortOrder?: IntFilter<"OptionPreset"> | number
    isActive?: BoolFilter<"OptionPreset"> | boolean
    createdAt?: DateTimeFilter<"OptionPreset"> | Date | string
    updatedAt?: DateTimeFilter<"OptionPreset"> | Date | string
  }

  export type OptionPresetOrderByWithRelationInput = {
    id?: SortOrder
    kind?: SortOrder
    value?: SortOrder
    label?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OptionPresetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OptionPresetWhereInput | OptionPresetWhereInput[]
    OR?: OptionPresetWhereInput[]
    NOT?: OptionPresetWhereInput | OptionPresetWhereInput[]
    kind?: EnumOptionPresetKindFilter<"OptionPreset"> | $Enums.OptionPresetKind
    value?: StringFilter<"OptionPreset"> | string
    label?: StringFilter<"OptionPreset"> | string
    sortOrder?: IntFilter<"OptionPreset"> | number
    isActive?: BoolFilter<"OptionPreset"> | boolean
    createdAt?: DateTimeFilter<"OptionPreset"> | Date | string
    updatedAt?: DateTimeFilter<"OptionPreset"> | Date | string
  }, "id">

  export type OptionPresetOrderByWithAggregationInput = {
    id?: SortOrder
    kind?: SortOrder
    value?: SortOrder
    label?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OptionPresetCountOrderByAggregateInput
    _avg?: OptionPresetAvgOrderByAggregateInput
    _max?: OptionPresetMaxOrderByAggregateInput
    _min?: OptionPresetMinOrderByAggregateInput
    _sum?: OptionPresetSumOrderByAggregateInput
  }

  export type OptionPresetScalarWhereWithAggregatesInput = {
    AND?: OptionPresetScalarWhereWithAggregatesInput | OptionPresetScalarWhereWithAggregatesInput[]
    OR?: OptionPresetScalarWhereWithAggregatesInput[]
    NOT?: OptionPresetScalarWhereWithAggregatesInput | OptionPresetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OptionPreset"> | string
    kind?: EnumOptionPresetKindWithAggregatesFilter<"OptionPreset"> | $Enums.OptionPresetKind
    value?: StringWithAggregatesFilter<"OptionPreset"> | string
    label?: StringWithAggregatesFilter<"OptionPreset"> | string
    sortOrder?: IntWithAggregatesFilter<"OptionPreset"> | number
    isActive?: BoolWithAggregatesFilter<"OptionPreset"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"OptionPreset"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OptionPreset"> | Date | string
  }

  export type MatchWhereInput = {
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    id?: StringFilter<"Match"> | string
    title?: StringFilter<"Match"> | string
    venueName?: StringFilter<"Match"> | string
    venueId?: StringNullableFilter<"Match"> | string | null
    courtId?: StringNullableFilter<"Match"> | string | null
    slotId?: StringNullableFilter<"Match"> | string | null
    startTime?: DateTimeFilter<"Match"> | Date | string
    city?: StringFilter<"Match"> | string
    level?: StringFilter<"Match"> | string
    maxPlayers?: IntFilter<"Match"> | number
    openSlots?: IntFilter<"Match"> | number
    status?: StringFilter<"Match"> | string
    checkInCode?: StringNullableFilter<"Match"> | string | null
    hostUserId?: StringFilter<"Match"> | string
    hostCreditScore?: IntFilter<"Match"> | number
    distanceKm?: FloatFilter<"Match"> | number
    matchRate?: IntFilter<"Match"> | number
    createdAt?: DateTimeFilter<"Match"> | Date | string
    hostUser?: XOR<UserScalarRelationFilter, UserWhereInput>
    venue?: XOR<VenueNullableScalarRelationFilter, VenueWhereInput> | null
    court?: XOR<VenueCourtNullableScalarRelationFilter, VenueCourtWhereInput> | null
    slot?: XOR<VenueAvailabilitySlotNullableScalarRelationFilter, VenueAvailabilitySlotWhereInput> | null
    applications?: MatchApplicationListRelationFilter
    thread?: XOR<ChatThreadNullableScalarRelationFilter, ChatThreadWhereInput> | null
  }

  export type MatchOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    venueName?: SortOrder
    venueId?: SortOrderInput | SortOrder
    courtId?: SortOrderInput | SortOrder
    slotId?: SortOrderInput | SortOrder
    startTime?: SortOrder
    city?: SortOrder
    level?: SortOrder
    maxPlayers?: SortOrder
    openSlots?: SortOrder
    status?: SortOrder
    checkInCode?: SortOrderInput | SortOrder
    hostUserId?: SortOrder
    hostCreditScore?: SortOrder
    distanceKm?: SortOrder
    matchRate?: SortOrder
    createdAt?: SortOrder
    hostUser?: UserOrderByWithRelationInput
    venue?: VenueOrderByWithRelationInput
    court?: VenueCourtOrderByWithRelationInput
    slot?: VenueAvailabilitySlotOrderByWithRelationInput
    applications?: MatchApplicationOrderByRelationAggregateInput
    thread?: ChatThreadOrderByWithRelationInput
  }

  export type MatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    title?: StringFilter<"Match"> | string
    venueName?: StringFilter<"Match"> | string
    venueId?: StringNullableFilter<"Match"> | string | null
    courtId?: StringNullableFilter<"Match"> | string | null
    slotId?: StringNullableFilter<"Match"> | string | null
    startTime?: DateTimeFilter<"Match"> | Date | string
    city?: StringFilter<"Match"> | string
    level?: StringFilter<"Match"> | string
    maxPlayers?: IntFilter<"Match"> | number
    openSlots?: IntFilter<"Match"> | number
    status?: StringFilter<"Match"> | string
    checkInCode?: StringNullableFilter<"Match"> | string | null
    hostUserId?: StringFilter<"Match"> | string
    hostCreditScore?: IntFilter<"Match"> | number
    distanceKm?: FloatFilter<"Match"> | number
    matchRate?: IntFilter<"Match"> | number
    createdAt?: DateTimeFilter<"Match"> | Date | string
    hostUser?: XOR<UserScalarRelationFilter, UserWhereInput>
    venue?: XOR<VenueNullableScalarRelationFilter, VenueWhereInput> | null
    court?: XOR<VenueCourtNullableScalarRelationFilter, VenueCourtWhereInput> | null
    slot?: XOR<VenueAvailabilitySlotNullableScalarRelationFilter, VenueAvailabilitySlotWhereInput> | null
    applications?: MatchApplicationListRelationFilter
    thread?: XOR<ChatThreadNullableScalarRelationFilter, ChatThreadWhereInput> | null
  }, "id">

  export type MatchOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    venueName?: SortOrder
    venueId?: SortOrderInput | SortOrder
    courtId?: SortOrderInput | SortOrder
    slotId?: SortOrderInput | SortOrder
    startTime?: SortOrder
    city?: SortOrder
    level?: SortOrder
    maxPlayers?: SortOrder
    openSlots?: SortOrder
    status?: SortOrder
    checkInCode?: SortOrderInput | SortOrder
    hostUserId?: SortOrder
    hostCreditScore?: SortOrder
    distanceKm?: SortOrder
    matchRate?: SortOrder
    createdAt?: SortOrder
    _count?: MatchCountOrderByAggregateInput
    _avg?: MatchAvgOrderByAggregateInput
    _max?: MatchMaxOrderByAggregateInput
    _min?: MatchMinOrderByAggregateInput
    _sum?: MatchSumOrderByAggregateInput
  }

  export type MatchScalarWhereWithAggregatesInput = {
    AND?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    OR?: MatchScalarWhereWithAggregatesInput[]
    NOT?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Match"> | string
    title?: StringWithAggregatesFilter<"Match"> | string
    venueName?: StringWithAggregatesFilter<"Match"> | string
    venueId?: StringNullableWithAggregatesFilter<"Match"> | string | null
    courtId?: StringNullableWithAggregatesFilter<"Match"> | string | null
    slotId?: StringNullableWithAggregatesFilter<"Match"> | string | null
    startTime?: DateTimeWithAggregatesFilter<"Match"> | Date | string
    city?: StringWithAggregatesFilter<"Match"> | string
    level?: StringWithAggregatesFilter<"Match"> | string
    maxPlayers?: IntWithAggregatesFilter<"Match"> | number
    openSlots?: IntWithAggregatesFilter<"Match"> | number
    status?: StringWithAggregatesFilter<"Match"> | string
    checkInCode?: StringNullableWithAggregatesFilter<"Match"> | string | null
    hostUserId?: StringWithAggregatesFilter<"Match"> | string
    hostCreditScore?: IntWithAggregatesFilter<"Match"> | number
    distanceKm?: FloatWithAggregatesFilter<"Match"> | number
    matchRate?: IntWithAggregatesFilter<"Match"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Match"> | Date | string
  }

  export type MatchApplicationWhereInput = {
    AND?: MatchApplicationWhereInput | MatchApplicationWhereInput[]
    OR?: MatchApplicationWhereInput[]
    NOT?: MatchApplicationWhereInput | MatchApplicationWhereInput[]
    id?: StringFilter<"MatchApplication"> | string
    matchId?: StringFilter<"MatchApplication"> | string
    userId?: StringFilter<"MatchApplication"> | string
    status?: StringFilter<"MatchApplication"> | string
    decisionReason?: StringNullableFilter<"MatchApplication"> | string | null
    createdAt?: DateTimeFilter<"MatchApplication"> | Date | string
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
  }

  export type MatchApplicationOrderByWithRelationInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    decisionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    match?: MatchOrderByWithRelationInput
  }

  export type MatchApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    matchId_userId?: MatchApplicationMatchIdUserIdCompoundUniqueInput
    AND?: MatchApplicationWhereInput | MatchApplicationWhereInput[]
    OR?: MatchApplicationWhereInput[]
    NOT?: MatchApplicationWhereInput | MatchApplicationWhereInput[]
    matchId?: StringFilter<"MatchApplication"> | string
    userId?: StringFilter<"MatchApplication"> | string
    status?: StringFilter<"MatchApplication"> | string
    decisionReason?: StringNullableFilter<"MatchApplication"> | string | null
    createdAt?: DateTimeFilter<"MatchApplication"> | Date | string
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
  }, "id" | "matchId_userId">

  export type MatchApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    decisionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MatchApplicationCountOrderByAggregateInput
    _max?: MatchApplicationMaxOrderByAggregateInput
    _min?: MatchApplicationMinOrderByAggregateInput
  }

  export type MatchApplicationScalarWhereWithAggregatesInput = {
    AND?: MatchApplicationScalarWhereWithAggregatesInput | MatchApplicationScalarWhereWithAggregatesInput[]
    OR?: MatchApplicationScalarWhereWithAggregatesInput[]
    NOT?: MatchApplicationScalarWhereWithAggregatesInput | MatchApplicationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MatchApplication"> | string
    matchId?: StringWithAggregatesFilter<"MatchApplication"> | string
    userId?: StringWithAggregatesFilter<"MatchApplication"> | string
    status?: StringWithAggregatesFilter<"MatchApplication"> | string
    decisionReason?: StringNullableWithAggregatesFilter<"MatchApplication"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MatchApplication"> | Date | string
  }

  export type ReviewWhereInput = {
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    id?: StringFilter<"Review"> | string
    matchId?: StringFilter<"Review"> | string
    reviewerId?: StringFilter<"Review"> | string
    revieweeId?: StringFilter<"Review"> | string
    score?: IntFilter<"Review"> | number
    tags?: StringNullableListFilter<"Review">
    anonymous?: BoolFilter<"Review"> | boolean
    createdAt?: DateTimeFilter<"Review"> | Date | string
  }

  export type ReviewOrderByWithRelationInput = {
    id?: SortOrder
    matchId?: SortOrder
    reviewerId?: SortOrder
    revieweeId?: SortOrder
    score?: SortOrder
    tags?: SortOrder
    anonymous?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    matchId_reviewerId_revieweeId?: ReviewMatchIdReviewerIdRevieweeIdCompoundUniqueInput
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    matchId?: StringFilter<"Review"> | string
    reviewerId?: StringFilter<"Review"> | string
    revieweeId?: StringFilter<"Review"> | string
    score?: IntFilter<"Review"> | number
    tags?: StringNullableListFilter<"Review">
    anonymous?: BoolFilter<"Review"> | boolean
    createdAt?: DateTimeFilter<"Review"> | Date | string
  }, "id" | "matchId_reviewerId_revieweeId">

  export type ReviewOrderByWithAggregationInput = {
    id?: SortOrder
    matchId?: SortOrder
    reviewerId?: SortOrder
    revieweeId?: SortOrder
    score?: SortOrder
    tags?: SortOrder
    anonymous?: SortOrder
    createdAt?: SortOrder
    _count?: ReviewCountOrderByAggregateInput
    _avg?: ReviewAvgOrderByAggregateInput
    _max?: ReviewMaxOrderByAggregateInput
    _min?: ReviewMinOrderByAggregateInput
    _sum?: ReviewSumOrderByAggregateInput
  }

  export type ReviewScalarWhereWithAggregatesInput = {
    AND?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    OR?: ReviewScalarWhereWithAggregatesInput[]
    NOT?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Review"> | string
    matchId?: StringWithAggregatesFilter<"Review"> | string
    reviewerId?: StringWithAggregatesFilter<"Review"> | string
    revieweeId?: StringWithAggregatesFilter<"Review"> | string
    score?: IntWithAggregatesFilter<"Review"> | number
    tags?: StringNullableListFilter<"Review">
    anonymous?: BoolWithAggregatesFilter<"Review"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Review"> | Date | string
  }

  export type ChatThreadWhereInput = {
    AND?: ChatThreadWhereInput | ChatThreadWhereInput[]
    OR?: ChatThreadWhereInput[]
    NOT?: ChatThreadWhereInput | ChatThreadWhereInput[]
    id?: StringFilter<"ChatThread"> | string
    matchId?: StringFilter<"ChatThread"> | string
    title?: StringFilter<"ChatThread"> | string
    venueName?: StringFilter<"ChatThread"> | string
    scheduledAt?: DateTimeFilter<"ChatThread"> | Date | string
    hostUserId?: StringFilter<"ChatThread"> | string
    status?: StringFilter<"ChatThread"> | string
    latestMessagePreview?: StringFilter<"ChatThread"> | string
    latestMessageAt?: DateTimeFilter<"ChatThread"> | Date | string
    lastMessageSenderId?: StringNullableFilter<"ChatThread"> | string | null
    lastMessageSenderName?: StringNullableFilter<"ChatThread"> | string | null
    createdAt?: DateTimeFilter<"ChatThread"> | Date | string
    updatedAt?: DateTimeFilter<"ChatThread"> | Date | string
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
    participants?: ChatThreadParticipantListRelationFilter
    messages?: MessageListRelationFilter
  }

  export type ChatThreadOrderByWithRelationInput = {
    id?: SortOrder
    matchId?: SortOrder
    title?: SortOrder
    venueName?: SortOrder
    scheduledAt?: SortOrder
    hostUserId?: SortOrder
    status?: SortOrder
    latestMessagePreview?: SortOrder
    latestMessageAt?: SortOrder
    lastMessageSenderId?: SortOrderInput | SortOrder
    lastMessageSenderName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    match?: MatchOrderByWithRelationInput
    participants?: ChatThreadParticipantOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type ChatThreadWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    matchId?: string
    AND?: ChatThreadWhereInput | ChatThreadWhereInput[]
    OR?: ChatThreadWhereInput[]
    NOT?: ChatThreadWhereInput | ChatThreadWhereInput[]
    title?: StringFilter<"ChatThread"> | string
    venueName?: StringFilter<"ChatThread"> | string
    scheduledAt?: DateTimeFilter<"ChatThread"> | Date | string
    hostUserId?: StringFilter<"ChatThread"> | string
    status?: StringFilter<"ChatThread"> | string
    latestMessagePreview?: StringFilter<"ChatThread"> | string
    latestMessageAt?: DateTimeFilter<"ChatThread"> | Date | string
    lastMessageSenderId?: StringNullableFilter<"ChatThread"> | string | null
    lastMessageSenderName?: StringNullableFilter<"ChatThread"> | string | null
    createdAt?: DateTimeFilter<"ChatThread"> | Date | string
    updatedAt?: DateTimeFilter<"ChatThread"> | Date | string
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
    participants?: ChatThreadParticipantListRelationFilter
    messages?: MessageListRelationFilter
  }, "id" | "matchId">

  export type ChatThreadOrderByWithAggregationInput = {
    id?: SortOrder
    matchId?: SortOrder
    title?: SortOrder
    venueName?: SortOrder
    scheduledAt?: SortOrder
    hostUserId?: SortOrder
    status?: SortOrder
    latestMessagePreview?: SortOrder
    latestMessageAt?: SortOrder
    lastMessageSenderId?: SortOrderInput | SortOrder
    lastMessageSenderName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChatThreadCountOrderByAggregateInput
    _max?: ChatThreadMaxOrderByAggregateInput
    _min?: ChatThreadMinOrderByAggregateInput
  }

  export type ChatThreadScalarWhereWithAggregatesInput = {
    AND?: ChatThreadScalarWhereWithAggregatesInput | ChatThreadScalarWhereWithAggregatesInput[]
    OR?: ChatThreadScalarWhereWithAggregatesInput[]
    NOT?: ChatThreadScalarWhereWithAggregatesInput | ChatThreadScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatThread"> | string
    matchId?: StringWithAggregatesFilter<"ChatThread"> | string
    title?: StringWithAggregatesFilter<"ChatThread"> | string
    venueName?: StringWithAggregatesFilter<"ChatThread"> | string
    scheduledAt?: DateTimeWithAggregatesFilter<"ChatThread"> | Date | string
    hostUserId?: StringWithAggregatesFilter<"ChatThread"> | string
    status?: StringWithAggregatesFilter<"ChatThread"> | string
    latestMessagePreview?: StringWithAggregatesFilter<"ChatThread"> | string
    latestMessageAt?: DateTimeWithAggregatesFilter<"ChatThread"> | Date | string
    lastMessageSenderId?: StringNullableWithAggregatesFilter<"ChatThread"> | string | null
    lastMessageSenderName?: StringNullableWithAggregatesFilter<"ChatThread"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ChatThread"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChatThread"> | Date | string
  }

  export type ChatThreadParticipantWhereInput = {
    AND?: ChatThreadParticipantWhereInput | ChatThreadParticipantWhereInput[]
    OR?: ChatThreadParticipantWhereInput[]
    NOT?: ChatThreadParticipantWhereInput | ChatThreadParticipantWhereInput[]
    id?: StringFilter<"ChatThreadParticipant"> | string
    threadId?: StringFilter<"ChatThreadParticipant"> | string
    userId?: StringFilter<"ChatThreadParticipant"> | string
    role?: StringFilter<"ChatThreadParticipant"> | string
    joinedAt?: DateTimeFilter<"ChatThreadParticipant"> | Date | string
    lastReadAt?: DateTimeNullableFilter<"ChatThreadParticipant"> | Date | string | null
    checkedInAt?: DateTimeNullableFilter<"ChatThreadParticipant"> | Date | string | null
    thread?: XOR<ChatThreadScalarRelationFilter, ChatThreadWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ChatThreadParticipantOrderByWithRelationInput = {
    id?: SortOrder
    threadId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    lastReadAt?: SortOrderInput | SortOrder
    checkedInAt?: SortOrderInput | SortOrder
    thread?: ChatThreadOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ChatThreadParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    threadId_userId?: ChatThreadParticipantThreadIdUserIdCompoundUniqueInput
    AND?: ChatThreadParticipantWhereInput | ChatThreadParticipantWhereInput[]
    OR?: ChatThreadParticipantWhereInput[]
    NOT?: ChatThreadParticipantWhereInput | ChatThreadParticipantWhereInput[]
    threadId?: StringFilter<"ChatThreadParticipant"> | string
    userId?: StringFilter<"ChatThreadParticipant"> | string
    role?: StringFilter<"ChatThreadParticipant"> | string
    joinedAt?: DateTimeFilter<"ChatThreadParticipant"> | Date | string
    lastReadAt?: DateTimeNullableFilter<"ChatThreadParticipant"> | Date | string | null
    checkedInAt?: DateTimeNullableFilter<"ChatThreadParticipant"> | Date | string | null
    thread?: XOR<ChatThreadScalarRelationFilter, ChatThreadWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "threadId_userId">

  export type ChatThreadParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    threadId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    lastReadAt?: SortOrderInput | SortOrder
    checkedInAt?: SortOrderInput | SortOrder
    _count?: ChatThreadParticipantCountOrderByAggregateInput
    _max?: ChatThreadParticipantMaxOrderByAggregateInput
    _min?: ChatThreadParticipantMinOrderByAggregateInput
  }

  export type ChatThreadParticipantScalarWhereWithAggregatesInput = {
    AND?: ChatThreadParticipantScalarWhereWithAggregatesInput | ChatThreadParticipantScalarWhereWithAggregatesInput[]
    OR?: ChatThreadParticipantScalarWhereWithAggregatesInput[]
    NOT?: ChatThreadParticipantScalarWhereWithAggregatesInput | ChatThreadParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatThreadParticipant"> | string
    threadId?: StringWithAggregatesFilter<"ChatThreadParticipant"> | string
    userId?: StringWithAggregatesFilter<"ChatThreadParticipant"> | string
    role?: StringWithAggregatesFilter<"ChatThreadParticipant"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"ChatThreadParticipant"> | Date | string
    lastReadAt?: DateTimeNullableWithAggregatesFilter<"ChatThreadParticipant"> | Date | string | null
    checkedInAt?: DateTimeNullableWithAggregatesFilter<"ChatThreadParticipant"> | Date | string | null
  }

  export type ReportWhereInput = {
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    id?: StringFilter<"Report"> | string
    reporterId?: StringFilter<"Report"> | string
    targetUserId?: StringFilter<"Report"> | string
    matchId?: StringNullableFilter<"Report"> | string | null
    reason?: StringFilter<"Report"> | string
    status?: StringFilter<"Report"> | string
    createdAt?: DateTimeFilter<"Report"> | Date | string
  }

  export type ReportOrderByWithRelationInput = {
    id?: SortOrder
    reporterId?: SortOrder
    targetUserId?: SortOrder
    matchId?: SortOrderInput | SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    reporterId?: StringFilter<"Report"> | string
    targetUserId?: StringFilter<"Report"> | string
    matchId?: StringNullableFilter<"Report"> | string | null
    reason?: StringFilter<"Report"> | string
    status?: StringFilter<"Report"> | string
    createdAt?: DateTimeFilter<"Report"> | Date | string
  }, "id">

  export type ReportOrderByWithAggregationInput = {
    id?: SortOrder
    reporterId?: SortOrder
    targetUserId?: SortOrder
    matchId?: SortOrderInput | SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: ReportCountOrderByAggregateInput
    _max?: ReportMaxOrderByAggregateInput
    _min?: ReportMinOrderByAggregateInput
  }

  export type ReportScalarWhereWithAggregatesInput = {
    AND?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    OR?: ReportScalarWhereWithAggregatesInput[]
    NOT?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Report"> | string
    reporterId?: StringWithAggregatesFilter<"Report"> | string
    targetUserId?: StringWithAggregatesFilter<"Report"> | string
    matchId?: StringNullableWithAggregatesFilter<"Report"> | string | null
    reason?: StringWithAggregatesFilter<"Report"> | string
    status?: StringWithAggregatesFilter<"Report"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Report"> | Date | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    userId?: StringFilter<"Message"> | string
    kind?: StringFilter<"Message"> | string
    title?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    senderId?: StringNullableFilter<"Message"> | string | null
    senderName?: StringNullableFilter<"Message"> | string | null
    isRead?: BoolFilter<"Message"> | boolean
    status?: StringNullableFilter<"Message"> | string | null
    matchId?: StringNullableFilter<"Message"> | string | null
    threadId?: StringNullableFilter<"Message"> | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    thread?: XOR<ChatThreadNullableScalarRelationFilter, ChatThreadWhereInput> | null
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    kind?: SortOrder
    title?: SortOrder
    content?: SortOrder
    senderId?: SortOrderInput | SortOrder
    senderName?: SortOrderInput | SortOrder
    isRead?: SortOrder
    status?: SortOrderInput | SortOrder
    matchId?: SortOrderInput | SortOrder
    threadId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    thread?: ChatThreadOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    userId?: StringFilter<"Message"> | string
    kind?: StringFilter<"Message"> | string
    title?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    senderId?: StringNullableFilter<"Message"> | string | null
    senderName?: StringNullableFilter<"Message"> | string | null
    isRead?: BoolFilter<"Message"> | boolean
    status?: StringNullableFilter<"Message"> | string | null
    matchId?: StringNullableFilter<"Message"> | string | null
    threadId?: StringNullableFilter<"Message"> | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    thread?: XOR<ChatThreadNullableScalarRelationFilter, ChatThreadWhereInput> | null
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    kind?: SortOrder
    title?: SortOrder
    content?: SortOrder
    senderId?: SortOrderInput | SortOrder
    senderName?: SortOrderInput | SortOrder
    isRead?: SortOrder
    status?: SortOrderInput | SortOrder
    matchId?: SortOrderInput | SortOrder
    threadId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    userId?: StringWithAggregatesFilter<"Message"> | string
    kind?: StringWithAggregatesFilter<"Message"> | string
    title?: StringWithAggregatesFilter<"Message"> | string
    content?: StringWithAggregatesFilter<"Message"> | string
    senderId?: StringNullableWithAggregatesFilter<"Message"> | string | null
    senderName?: StringNullableWithAggregatesFilter<"Message"> | string | null
    isRead?: BoolWithAggregatesFilter<"Message"> | boolean
    status?: StringNullableWithAggregatesFilter<"Message"> | string | null
    matchId?: StringNullableWithAggregatesFilter<"Message"> | string | null
    threadId?: StringNullableWithAggregatesFilter<"Message"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    phone?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    nickname: string
    city: string
    level: string
    creditScore?: number
    createdAt?: Date | string
    hostedMatches?: MatchCreateNestedManyWithoutHostUserInput
    threadMembership?: ChatThreadParticipantCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    phone?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    nickname: string
    city: string
    level: string
    creditScore?: number
    createdAt?: Date | string
    hostedMatches?: MatchUncheckedCreateNestedManyWithoutHostUserInput
    threadMembership?: ChatThreadParticipantUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    creditScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostedMatches?: MatchUpdateManyWithoutHostUserNestedInput
    threadMembership?: ChatThreadParticipantUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    creditScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostedMatches?: MatchUncheckedUpdateManyWithoutHostUserNestedInput
    threadMembership?: ChatThreadParticipantUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    phone?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    nickname: string
    city: string
    level: string
    creditScore?: number
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    creditScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    creditScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VenueCreateInput = {
    id?: string
    name: string
    city: string
    district?: string | null
    distanceKm: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    courts?: VenueCourtCreateNestedManyWithoutVenueInput
    availabilitySlots?: VenueAvailabilitySlotCreateNestedManyWithoutVenueInput
    matches?: MatchCreateNestedManyWithoutVenueInput
  }

  export type VenueUncheckedCreateInput = {
    id?: string
    name: string
    city: string
    district?: string | null
    distanceKm: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    courts?: VenueCourtUncheckedCreateNestedManyWithoutVenueInput
    availabilitySlots?: VenueAvailabilitySlotUncheckedCreateNestedManyWithoutVenueInput
    matches?: MatchUncheckedCreateNestedManyWithoutVenueInput
  }

  export type VenueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    distanceKm?: FloatFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courts?: VenueCourtUpdateManyWithoutVenueNestedInput
    availabilitySlots?: VenueAvailabilitySlotUpdateManyWithoutVenueNestedInput
    matches?: MatchUpdateManyWithoutVenueNestedInput
  }

  export type VenueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    distanceKm?: FloatFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courts?: VenueCourtUncheckedUpdateManyWithoutVenueNestedInput
    availabilitySlots?: VenueAvailabilitySlotUncheckedUpdateManyWithoutVenueNestedInput
    matches?: MatchUncheckedUpdateManyWithoutVenueNestedInput
  }

  export type VenueCreateManyInput = {
    id?: string
    name: string
    city: string
    district?: string | null
    distanceKm: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VenueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    distanceKm?: FloatFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VenueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    distanceKm?: FloatFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VenueCourtCreateInput = {
    id?: string
    name: string
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    venue: VenueCreateNestedOneWithoutCourtsInput
    matches?: MatchCreateNestedManyWithoutCourtInput
  }

  export type VenueCourtUncheckedCreateInput = {
    id?: string
    venueId: string
    name: string
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    matches?: MatchUncheckedCreateNestedManyWithoutCourtInput
  }

  export type VenueCourtUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: VenueUpdateOneRequiredWithoutCourtsNestedInput
    matches?: MatchUpdateManyWithoutCourtNestedInput
  }

  export type VenueCourtUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    venueId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matches?: MatchUncheckedUpdateManyWithoutCourtNestedInput
  }

  export type VenueCourtCreateManyInput = {
    id?: string
    venueId: string
    name: string
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VenueCourtUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VenueCourtUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    venueId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VenueAvailabilitySlotCreateInput = {
    id?: string
    label: string
    startTime: number
    endTime: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    venue: VenueCreateNestedOneWithoutAvailabilitySlotsInput
    matches?: MatchCreateNestedManyWithoutSlotInput
  }

  export type VenueAvailabilitySlotUncheckedCreateInput = {
    id?: string
    venueId: string
    label: string
    startTime: number
    endTime: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    matches?: MatchUncheckedCreateNestedManyWithoutSlotInput
  }

  export type VenueAvailabilitySlotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    startTime?: IntFieldUpdateOperationsInput | number
    endTime?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: VenueUpdateOneRequiredWithoutAvailabilitySlotsNestedInput
    matches?: MatchUpdateManyWithoutSlotNestedInput
  }

  export type VenueAvailabilitySlotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    venueId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    startTime?: IntFieldUpdateOperationsInput | number
    endTime?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matches?: MatchUncheckedUpdateManyWithoutSlotNestedInput
  }

  export type VenueAvailabilitySlotCreateManyInput = {
    id?: string
    venueId: string
    label: string
    startTime: number
    endTime: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VenueAvailabilitySlotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    startTime?: IntFieldUpdateOperationsInput | number
    endTime?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VenueAvailabilitySlotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    venueId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    startTime?: IntFieldUpdateOperationsInput | number
    endTime?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OptionPresetCreateInput = {
    id?: string
    kind: $Enums.OptionPresetKind
    value: string
    label: string
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OptionPresetUncheckedCreateInput = {
    id?: string
    kind: $Enums.OptionPresetKind
    value: string
    label: string
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OptionPresetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumOptionPresetKindFieldUpdateOperationsInput | $Enums.OptionPresetKind
    value?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OptionPresetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumOptionPresetKindFieldUpdateOperationsInput | $Enums.OptionPresetKind
    value?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OptionPresetCreateManyInput = {
    id?: string
    kind: $Enums.OptionPresetKind
    value: string
    label: string
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OptionPresetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumOptionPresetKindFieldUpdateOperationsInput | $Enums.OptionPresetKind
    value?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OptionPresetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumOptionPresetKindFieldUpdateOperationsInput | $Enums.OptionPresetKind
    value?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCreateInput = {
    id?: string
    title: string
    venueName: string
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    hostUser: UserCreateNestedOneWithoutHostedMatchesInput
    venue?: VenueCreateNestedOneWithoutMatchesInput
    court?: VenueCourtCreateNestedOneWithoutMatchesInput
    slot?: VenueAvailabilitySlotCreateNestedOneWithoutMatchesInput
    applications?: MatchApplicationCreateNestedManyWithoutMatchInput
    thread?: ChatThreadCreateNestedOneWithoutMatchInput
  }

  export type MatchUncheckedCreateInput = {
    id?: string
    title: string
    venueName: string
    venueId?: string | null
    courtId?: string | null
    slotId?: string | null
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostUserId: string
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    applications?: MatchApplicationUncheckedCreateNestedManyWithoutMatchInput
    thread?: ChatThreadUncheckedCreateNestedOneWithoutMatchInput
  }

  export type MatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUser?: UserUpdateOneRequiredWithoutHostedMatchesNestedInput
    venue?: VenueUpdateOneWithoutMatchesNestedInput
    court?: VenueCourtUpdateOneWithoutMatchesNestedInput
    slot?: VenueAvailabilitySlotUpdateOneWithoutMatchesNestedInput
    applications?: MatchApplicationUpdateManyWithoutMatchNestedInput
    thread?: ChatThreadUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    venueId?: NullableStringFieldUpdateOperationsInput | string | null
    courtId?: NullableStringFieldUpdateOperationsInput | string | null
    slotId?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostUserId?: StringFieldUpdateOperationsInput | string
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: MatchApplicationUncheckedUpdateManyWithoutMatchNestedInput
    thread?: ChatThreadUncheckedUpdateOneWithoutMatchNestedInput
  }

  export type MatchCreateManyInput = {
    id?: string
    title: string
    venueName: string
    venueId?: string | null
    courtId?: string | null
    slotId?: string | null
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostUserId: string
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
  }

  export type MatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    venueId?: NullableStringFieldUpdateOperationsInput | string | null
    courtId?: NullableStringFieldUpdateOperationsInput | string | null
    slotId?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostUserId?: StringFieldUpdateOperationsInput | string
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchApplicationCreateInput = {
    id?: string
    userId: string
    status: string
    decisionReason?: string | null
    createdAt?: Date | string
    match: MatchCreateNestedOneWithoutApplicationsInput
  }

  export type MatchApplicationUncheckedCreateInput = {
    id?: string
    matchId: string
    userId: string
    status: string
    decisionReason?: string | null
    createdAt?: Date | string
  }

  export type MatchApplicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    decisionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type MatchApplicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    decisionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchApplicationCreateManyInput = {
    id?: string
    matchId: string
    userId: string
    status: string
    decisionReason?: string | null
    createdAt?: Date | string
  }

  export type MatchApplicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    decisionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchApplicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    decisionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateInput = {
    id?: string
    matchId: string
    reviewerId: string
    revieweeId: string
    score: number
    tags?: ReviewCreatetagsInput | string[]
    anonymous?: boolean
    createdAt?: Date | string
  }

  export type ReviewUncheckedCreateInput = {
    id?: string
    matchId: string
    reviewerId: string
    revieweeId: string
    score: number
    tags?: ReviewCreatetagsInput | string[]
    anonymous?: boolean
    createdAt?: Date | string
  }

  export type ReviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    revieweeId?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    tags?: ReviewUpdatetagsInput | string[]
    anonymous?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    revieweeId?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    tags?: ReviewUpdatetagsInput | string[]
    anonymous?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateManyInput = {
    id?: string
    matchId: string
    reviewerId: string
    revieweeId: string
    score: number
    tags?: ReviewCreatetagsInput | string[]
    anonymous?: boolean
    createdAt?: Date | string
  }

  export type ReviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    revieweeId?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    tags?: ReviewUpdatetagsInput | string[]
    anonymous?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    revieweeId?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    tags?: ReviewUpdatetagsInput | string[]
    anonymous?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatThreadCreateInput = {
    id?: string
    title: string
    venueName: string
    scheduledAt: Date | string
    hostUserId: string
    status?: string
    latestMessagePreview: string
    latestMessageAt: Date | string
    lastMessageSenderId?: string | null
    lastMessageSenderName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    match: MatchCreateNestedOneWithoutThreadInput
    participants?: ChatThreadParticipantCreateNestedManyWithoutThreadInput
    messages?: MessageCreateNestedManyWithoutThreadInput
  }

  export type ChatThreadUncheckedCreateInput = {
    id?: string
    matchId: string
    title: string
    venueName: string
    scheduledAt: Date | string
    hostUserId: string
    status?: string
    latestMessagePreview: string
    latestMessageAt: Date | string
    lastMessageSenderId?: string | null
    lastMessageSenderName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ChatThreadParticipantUncheckedCreateNestedManyWithoutThreadInput
    messages?: MessageUncheckedCreateNestedManyWithoutThreadInput
  }

  export type ChatThreadUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestMessagePreview?: StringFieldUpdateOperationsInput | string
    latestMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageSenderId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageSenderName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutThreadNestedInput
    participants?: ChatThreadParticipantUpdateManyWithoutThreadNestedInput
    messages?: MessageUpdateManyWithoutThreadNestedInput
  }

  export type ChatThreadUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestMessagePreview?: StringFieldUpdateOperationsInput | string
    latestMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageSenderId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageSenderName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ChatThreadParticipantUncheckedUpdateManyWithoutThreadNestedInput
    messages?: MessageUncheckedUpdateManyWithoutThreadNestedInput
  }

  export type ChatThreadCreateManyInput = {
    id?: string
    matchId: string
    title: string
    venueName: string
    scheduledAt: Date | string
    hostUserId: string
    status?: string
    latestMessagePreview: string
    latestMessageAt: Date | string
    lastMessageSenderId?: string | null
    lastMessageSenderName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatThreadUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestMessagePreview?: StringFieldUpdateOperationsInput | string
    latestMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageSenderId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageSenderName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatThreadUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestMessagePreview?: StringFieldUpdateOperationsInput | string
    latestMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageSenderId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageSenderName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatThreadParticipantCreateInput = {
    id?: string
    role: string
    joinedAt?: Date | string
    lastReadAt?: Date | string | null
    checkedInAt?: Date | string | null
    thread: ChatThreadCreateNestedOneWithoutParticipantsInput
    user: UserCreateNestedOneWithoutThreadMembershipInput
  }

  export type ChatThreadParticipantUncheckedCreateInput = {
    id?: string
    threadId: string
    userId: string
    role: string
    joinedAt?: Date | string
    lastReadAt?: Date | string | null
    checkedInAt?: Date | string | null
  }

  export type ChatThreadParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thread?: ChatThreadUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneRequiredWithoutThreadMembershipNestedInput
  }

  export type ChatThreadParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatThreadParticipantCreateManyInput = {
    id?: string
    threadId: string
    userId: string
    role: string
    joinedAt?: Date | string
    lastReadAt?: Date | string | null
    checkedInAt?: Date | string | null
  }

  export type ChatThreadParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatThreadParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ReportCreateInput = {
    id?: string
    reporterId: string
    targetUserId: string
    matchId?: string | null
    reason: string
    status?: string
    createdAt?: Date | string
  }

  export type ReportUncheckedCreateInput = {
    id?: string
    reporterId: string
    targetUserId: string
    matchId?: string | null
    reason: string
    status?: string
    createdAt?: Date | string
  }

  export type ReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reporterId?: StringFieldUpdateOperationsInput | string
    targetUserId?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reporterId?: StringFieldUpdateOperationsInput | string
    targetUserId?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportCreateManyInput = {
    id?: string
    reporterId: string
    targetUserId: string
    matchId?: string | null
    reason: string
    status?: string
    createdAt?: Date | string
  }

  export type ReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reporterId?: StringFieldUpdateOperationsInput | string
    targetUserId?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reporterId?: StringFieldUpdateOperationsInput | string
    targetUserId?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateInput = {
    id?: string
    userId: string
    kind: string
    title: string
    content: string
    senderId?: string | null
    senderName?: string | null
    isRead?: boolean
    status?: string | null
    matchId?: string | null
    createdAt?: Date | string
    thread?: ChatThreadCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    userId: string
    kind: string
    title: string
    content: string
    senderId?: string | null
    senderName?: string | null
    isRead?: boolean
    status?: string | null
    matchId?: string | null
    threadId?: string | null
    createdAt?: Date | string
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: NullableStringFieldUpdateOperationsInput | string | null
    senderName?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    status?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    thread?: ChatThreadUpdateOneWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: NullableStringFieldUpdateOperationsInput | string | null
    senderName?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    status?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyInput = {
    id?: string
    userId: string
    kind: string
    title: string
    content: string
    senderId?: string | null
    senderName?: string | null
    isRead?: boolean
    status?: string | null
    matchId?: string | null
    threadId?: string | null
    createdAt?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: NullableStringFieldUpdateOperationsInput | string | null
    senderName?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    status?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: NullableStringFieldUpdateOperationsInput | string | null
    senderName?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    status?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type MatchListRelationFilter = {
    every?: MatchWhereInput
    some?: MatchWhereInput
    none?: MatchWhereInput
  }

  export type ChatThreadParticipantListRelationFilter = {
    every?: ChatThreadParticipantWhereInput
    some?: ChatThreadParticipantWhereInput
    none?: ChatThreadParticipantWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MatchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatThreadParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    wechatOpenId?: SortOrder
    wechatUnionId?: SortOrder
    nickname?: SortOrder
    city?: SortOrder
    level?: SortOrder
    creditScore?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    creditScore?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    wechatOpenId?: SortOrder
    wechatUnionId?: SortOrder
    nickname?: SortOrder
    city?: SortOrder
    level?: SortOrder
    creditScore?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    wechatOpenId?: SortOrder
    wechatUnionId?: SortOrder
    nickname?: SortOrder
    city?: SortOrder
    level?: SortOrder
    creditScore?: SortOrder
    createdAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    creditScore?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type VenueCourtListRelationFilter = {
    every?: VenueCourtWhereInput
    some?: VenueCourtWhereInput
    none?: VenueCourtWhereInput
  }

  export type VenueAvailabilitySlotListRelationFilter = {
    every?: VenueAvailabilitySlotWhereInput
    some?: VenueAvailabilitySlotWhereInput
    none?: VenueAvailabilitySlotWhereInput
  }

  export type VenueCourtOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VenueAvailabilitySlotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VenueCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    district?: SortOrder
    distanceKm?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VenueAvgOrderByAggregateInput = {
    distanceKm?: SortOrder
    sortOrder?: SortOrder
  }

  export type VenueMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    district?: SortOrder
    distanceKm?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VenueMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    district?: SortOrder
    distanceKm?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VenueSumOrderByAggregateInput = {
    distanceKm?: SortOrder
    sortOrder?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type VenueScalarRelationFilter = {
    is?: VenueWhereInput
    isNot?: VenueWhereInput
  }

  export type VenueCourtCountOrderByAggregateInput = {
    id?: SortOrder
    venueId?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VenueCourtAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type VenueCourtMaxOrderByAggregateInput = {
    id?: SortOrder
    venueId?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VenueCourtMinOrderByAggregateInput = {
    id?: SortOrder
    venueId?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VenueCourtSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type VenueAvailabilitySlotCountOrderByAggregateInput = {
    id?: SortOrder
    venueId?: SortOrder
    label?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VenueAvailabilitySlotAvgOrderByAggregateInput = {
    startTime?: SortOrder
    endTime?: SortOrder
    sortOrder?: SortOrder
  }

  export type VenueAvailabilitySlotMaxOrderByAggregateInput = {
    id?: SortOrder
    venueId?: SortOrder
    label?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VenueAvailabilitySlotMinOrderByAggregateInput = {
    id?: SortOrder
    venueId?: SortOrder
    label?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VenueAvailabilitySlotSumOrderByAggregateInput = {
    startTime?: SortOrder
    endTime?: SortOrder
    sortOrder?: SortOrder
  }

  export type EnumOptionPresetKindFilter<$PrismaModel = never> = {
    equals?: $Enums.OptionPresetKind | EnumOptionPresetKindFieldRefInput<$PrismaModel>
    in?: $Enums.OptionPresetKind[] | ListEnumOptionPresetKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.OptionPresetKind[] | ListEnumOptionPresetKindFieldRefInput<$PrismaModel>
    not?: NestedEnumOptionPresetKindFilter<$PrismaModel> | $Enums.OptionPresetKind
  }

  export type OptionPresetCountOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    value?: SortOrder
    label?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OptionPresetAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type OptionPresetMaxOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    value?: SortOrder
    label?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OptionPresetMinOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    value?: SortOrder
    label?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OptionPresetSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type EnumOptionPresetKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OptionPresetKind | EnumOptionPresetKindFieldRefInput<$PrismaModel>
    in?: $Enums.OptionPresetKind[] | ListEnumOptionPresetKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.OptionPresetKind[] | ListEnumOptionPresetKindFieldRefInput<$PrismaModel>
    not?: NestedEnumOptionPresetKindWithAggregatesFilter<$PrismaModel> | $Enums.OptionPresetKind
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOptionPresetKindFilter<$PrismaModel>
    _max?: NestedEnumOptionPresetKindFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type VenueNullableScalarRelationFilter = {
    is?: VenueWhereInput | null
    isNot?: VenueWhereInput | null
  }

  export type VenueCourtNullableScalarRelationFilter = {
    is?: VenueCourtWhereInput | null
    isNot?: VenueCourtWhereInput | null
  }

  export type VenueAvailabilitySlotNullableScalarRelationFilter = {
    is?: VenueAvailabilitySlotWhereInput | null
    isNot?: VenueAvailabilitySlotWhereInput | null
  }

  export type MatchApplicationListRelationFilter = {
    every?: MatchApplicationWhereInput
    some?: MatchApplicationWhereInput
    none?: MatchApplicationWhereInput
  }

  export type ChatThreadNullableScalarRelationFilter = {
    is?: ChatThreadWhereInput | null
    isNot?: ChatThreadWhereInput | null
  }

  export type MatchApplicationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MatchCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    venueName?: SortOrder
    venueId?: SortOrder
    courtId?: SortOrder
    slotId?: SortOrder
    startTime?: SortOrder
    city?: SortOrder
    level?: SortOrder
    maxPlayers?: SortOrder
    openSlots?: SortOrder
    status?: SortOrder
    checkInCode?: SortOrder
    hostUserId?: SortOrder
    hostCreditScore?: SortOrder
    distanceKm?: SortOrder
    matchRate?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchAvgOrderByAggregateInput = {
    maxPlayers?: SortOrder
    openSlots?: SortOrder
    hostCreditScore?: SortOrder
    distanceKm?: SortOrder
    matchRate?: SortOrder
  }

  export type MatchMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    venueName?: SortOrder
    venueId?: SortOrder
    courtId?: SortOrder
    slotId?: SortOrder
    startTime?: SortOrder
    city?: SortOrder
    level?: SortOrder
    maxPlayers?: SortOrder
    openSlots?: SortOrder
    status?: SortOrder
    checkInCode?: SortOrder
    hostUserId?: SortOrder
    hostCreditScore?: SortOrder
    distanceKm?: SortOrder
    matchRate?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    venueName?: SortOrder
    venueId?: SortOrder
    courtId?: SortOrder
    slotId?: SortOrder
    startTime?: SortOrder
    city?: SortOrder
    level?: SortOrder
    maxPlayers?: SortOrder
    openSlots?: SortOrder
    status?: SortOrder
    checkInCode?: SortOrder
    hostUserId?: SortOrder
    hostCreditScore?: SortOrder
    distanceKm?: SortOrder
    matchRate?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchSumOrderByAggregateInput = {
    maxPlayers?: SortOrder
    openSlots?: SortOrder
    hostCreditScore?: SortOrder
    distanceKm?: SortOrder
    matchRate?: SortOrder
  }

  export type MatchScalarRelationFilter = {
    is?: MatchWhereInput
    isNot?: MatchWhereInput
  }

  export type MatchApplicationMatchIdUserIdCompoundUniqueInput = {
    matchId: string
    userId: string
  }

  export type MatchApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    decisionReason?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    decisionReason?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    decisionReason?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type ReviewMatchIdReviewerIdRevieweeIdCompoundUniqueInput = {
    matchId: string
    reviewerId: string
    revieweeId: string
  }

  export type ReviewCountOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    reviewerId?: SortOrder
    revieweeId?: SortOrder
    score?: SortOrder
    tags?: SortOrder
    anonymous?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type ReviewMaxOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    reviewerId?: SortOrder
    revieweeId?: SortOrder
    score?: SortOrder
    anonymous?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewMinOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    reviewerId?: SortOrder
    revieweeId?: SortOrder
    score?: SortOrder
    anonymous?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatThreadCountOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    title?: SortOrder
    venueName?: SortOrder
    scheduledAt?: SortOrder
    hostUserId?: SortOrder
    status?: SortOrder
    latestMessagePreview?: SortOrder
    latestMessageAt?: SortOrder
    lastMessageSenderId?: SortOrder
    lastMessageSenderName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatThreadMaxOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    title?: SortOrder
    venueName?: SortOrder
    scheduledAt?: SortOrder
    hostUserId?: SortOrder
    status?: SortOrder
    latestMessagePreview?: SortOrder
    latestMessageAt?: SortOrder
    lastMessageSenderId?: SortOrder
    lastMessageSenderName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatThreadMinOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    title?: SortOrder
    venueName?: SortOrder
    scheduledAt?: SortOrder
    hostUserId?: SortOrder
    status?: SortOrder
    latestMessagePreview?: SortOrder
    latestMessageAt?: SortOrder
    lastMessageSenderId?: SortOrder
    lastMessageSenderName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ChatThreadScalarRelationFilter = {
    is?: ChatThreadWhereInput
    isNot?: ChatThreadWhereInput
  }

  export type ChatThreadParticipantThreadIdUserIdCompoundUniqueInput = {
    threadId: string
    userId: string
  }

  export type ChatThreadParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    threadId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    lastReadAt?: SortOrder
    checkedInAt?: SortOrder
  }

  export type ChatThreadParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    threadId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    lastReadAt?: SortOrder
    checkedInAt?: SortOrder
  }

  export type ChatThreadParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    threadId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    lastReadAt?: SortOrder
    checkedInAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ReportCountOrderByAggregateInput = {
    id?: SortOrder
    reporterId?: SortOrder
    targetUserId?: SortOrder
    matchId?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ReportMaxOrderByAggregateInput = {
    id?: SortOrder
    reporterId?: SortOrder
    targetUserId?: SortOrder
    matchId?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ReportMinOrderByAggregateInput = {
    id?: SortOrder
    reporterId?: SortOrder
    targetUserId?: SortOrder
    matchId?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    kind?: SortOrder
    title?: SortOrder
    content?: SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    isRead?: SortOrder
    status?: SortOrder
    matchId?: SortOrder
    threadId?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    kind?: SortOrder
    title?: SortOrder
    content?: SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    isRead?: SortOrder
    status?: SortOrder
    matchId?: SortOrder
    threadId?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    kind?: SortOrder
    title?: SortOrder
    content?: SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    isRead?: SortOrder
    status?: SortOrder
    matchId?: SortOrder
    threadId?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchCreateNestedManyWithoutHostUserInput = {
    create?: XOR<MatchCreateWithoutHostUserInput, MatchUncheckedCreateWithoutHostUserInput> | MatchCreateWithoutHostUserInput[] | MatchUncheckedCreateWithoutHostUserInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutHostUserInput | MatchCreateOrConnectWithoutHostUserInput[]
    createMany?: MatchCreateManyHostUserInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type ChatThreadParticipantCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatThreadParticipantCreateWithoutUserInput, ChatThreadParticipantUncheckedCreateWithoutUserInput> | ChatThreadParticipantCreateWithoutUserInput[] | ChatThreadParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatThreadParticipantCreateOrConnectWithoutUserInput | ChatThreadParticipantCreateOrConnectWithoutUserInput[]
    createMany?: ChatThreadParticipantCreateManyUserInputEnvelope
    connect?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutHostUserInput = {
    create?: XOR<MatchCreateWithoutHostUserInput, MatchUncheckedCreateWithoutHostUserInput> | MatchCreateWithoutHostUserInput[] | MatchUncheckedCreateWithoutHostUserInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutHostUserInput | MatchCreateOrConnectWithoutHostUserInput[]
    createMany?: MatchCreateManyHostUserInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type ChatThreadParticipantUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatThreadParticipantCreateWithoutUserInput, ChatThreadParticipantUncheckedCreateWithoutUserInput> | ChatThreadParticipantCreateWithoutUserInput[] | ChatThreadParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatThreadParticipantCreateOrConnectWithoutUserInput | ChatThreadParticipantCreateOrConnectWithoutUserInput[]
    createMany?: ChatThreadParticipantCreateManyUserInputEnvelope
    connect?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MatchUpdateManyWithoutHostUserNestedInput = {
    create?: XOR<MatchCreateWithoutHostUserInput, MatchUncheckedCreateWithoutHostUserInput> | MatchCreateWithoutHostUserInput[] | MatchUncheckedCreateWithoutHostUserInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutHostUserInput | MatchCreateOrConnectWithoutHostUserInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutHostUserInput | MatchUpsertWithWhereUniqueWithoutHostUserInput[]
    createMany?: MatchCreateManyHostUserInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutHostUserInput | MatchUpdateWithWhereUniqueWithoutHostUserInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutHostUserInput | MatchUpdateManyWithWhereWithoutHostUserInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type ChatThreadParticipantUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatThreadParticipantCreateWithoutUserInput, ChatThreadParticipantUncheckedCreateWithoutUserInput> | ChatThreadParticipantCreateWithoutUserInput[] | ChatThreadParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatThreadParticipantCreateOrConnectWithoutUserInput | ChatThreadParticipantCreateOrConnectWithoutUserInput[]
    upsert?: ChatThreadParticipantUpsertWithWhereUniqueWithoutUserInput | ChatThreadParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatThreadParticipantCreateManyUserInputEnvelope
    set?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    disconnect?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    delete?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    connect?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    update?: ChatThreadParticipantUpdateWithWhereUniqueWithoutUserInput | ChatThreadParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatThreadParticipantUpdateManyWithWhereWithoutUserInput | ChatThreadParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatThreadParticipantScalarWhereInput | ChatThreadParticipantScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutHostUserNestedInput = {
    create?: XOR<MatchCreateWithoutHostUserInput, MatchUncheckedCreateWithoutHostUserInput> | MatchCreateWithoutHostUserInput[] | MatchUncheckedCreateWithoutHostUserInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutHostUserInput | MatchCreateOrConnectWithoutHostUserInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutHostUserInput | MatchUpsertWithWhereUniqueWithoutHostUserInput[]
    createMany?: MatchCreateManyHostUserInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutHostUserInput | MatchUpdateWithWhereUniqueWithoutHostUserInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutHostUserInput | MatchUpdateManyWithWhereWithoutHostUserInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type ChatThreadParticipantUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatThreadParticipantCreateWithoutUserInput, ChatThreadParticipantUncheckedCreateWithoutUserInput> | ChatThreadParticipantCreateWithoutUserInput[] | ChatThreadParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatThreadParticipantCreateOrConnectWithoutUserInput | ChatThreadParticipantCreateOrConnectWithoutUserInput[]
    upsert?: ChatThreadParticipantUpsertWithWhereUniqueWithoutUserInput | ChatThreadParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatThreadParticipantCreateManyUserInputEnvelope
    set?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    disconnect?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    delete?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    connect?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    update?: ChatThreadParticipantUpdateWithWhereUniqueWithoutUserInput | ChatThreadParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatThreadParticipantUpdateManyWithWhereWithoutUserInput | ChatThreadParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatThreadParticipantScalarWhereInput | ChatThreadParticipantScalarWhereInput[]
  }

  export type VenueCourtCreateNestedManyWithoutVenueInput = {
    create?: XOR<VenueCourtCreateWithoutVenueInput, VenueCourtUncheckedCreateWithoutVenueInput> | VenueCourtCreateWithoutVenueInput[] | VenueCourtUncheckedCreateWithoutVenueInput[]
    connectOrCreate?: VenueCourtCreateOrConnectWithoutVenueInput | VenueCourtCreateOrConnectWithoutVenueInput[]
    createMany?: VenueCourtCreateManyVenueInputEnvelope
    connect?: VenueCourtWhereUniqueInput | VenueCourtWhereUniqueInput[]
  }

  export type VenueAvailabilitySlotCreateNestedManyWithoutVenueInput = {
    create?: XOR<VenueAvailabilitySlotCreateWithoutVenueInput, VenueAvailabilitySlotUncheckedCreateWithoutVenueInput> | VenueAvailabilitySlotCreateWithoutVenueInput[] | VenueAvailabilitySlotUncheckedCreateWithoutVenueInput[]
    connectOrCreate?: VenueAvailabilitySlotCreateOrConnectWithoutVenueInput | VenueAvailabilitySlotCreateOrConnectWithoutVenueInput[]
    createMany?: VenueAvailabilitySlotCreateManyVenueInputEnvelope
    connect?: VenueAvailabilitySlotWhereUniqueInput | VenueAvailabilitySlotWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutVenueInput = {
    create?: XOR<MatchCreateWithoutVenueInput, MatchUncheckedCreateWithoutVenueInput> | MatchCreateWithoutVenueInput[] | MatchUncheckedCreateWithoutVenueInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutVenueInput | MatchCreateOrConnectWithoutVenueInput[]
    createMany?: MatchCreateManyVenueInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type VenueCourtUncheckedCreateNestedManyWithoutVenueInput = {
    create?: XOR<VenueCourtCreateWithoutVenueInput, VenueCourtUncheckedCreateWithoutVenueInput> | VenueCourtCreateWithoutVenueInput[] | VenueCourtUncheckedCreateWithoutVenueInput[]
    connectOrCreate?: VenueCourtCreateOrConnectWithoutVenueInput | VenueCourtCreateOrConnectWithoutVenueInput[]
    createMany?: VenueCourtCreateManyVenueInputEnvelope
    connect?: VenueCourtWhereUniqueInput | VenueCourtWhereUniqueInput[]
  }

  export type VenueAvailabilitySlotUncheckedCreateNestedManyWithoutVenueInput = {
    create?: XOR<VenueAvailabilitySlotCreateWithoutVenueInput, VenueAvailabilitySlotUncheckedCreateWithoutVenueInput> | VenueAvailabilitySlotCreateWithoutVenueInput[] | VenueAvailabilitySlotUncheckedCreateWithoutVenueInput[]
    connectOrCreate?: VenueAvailabilitySlotCreateOrConnectWithoutVenueInput | VenueAvailabilitySlotCreateOrConnectWithoutVenueInput[]
    createMany?: VenueAvailabilitySlotCreateManyVenueInputEnvelope
    connect?: VenueAvailabilitySlotWhereUniqueInput | VenueAvailabilitySlotWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutVenueInput = {
    create?: XOR<MatchCreateWithoutVenueInput, MatchUncheckedCreateWithoutVenueInput> | MatchCreateWithoutVenueInput[] | MatchUncheckedCreateWithoutVenueInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutVenueInput | MatchCreateOrConnectWithoutVenueInput[]
    createMany?: MatchCreateManyVenueInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type VenueCourtUpdateManyWithoutVenueNestedInput = {
    create?: XOR<VenueCourtCreateWithoutVenueInput, VenueCourtUncheckedCreateWithoutVenueInput> | VenueCourtCreateWithoutVenueInput[] | VenueCourtUncheckedCreateWithoutVenueInput[]
    connectOrCreate?: VenueCourtCreateOrConnectWithoutVenueInput | VenueCourtCreateOrConnectWithoutVenueInput[]
    upsert?: VenueCourtUpsertWithWhereUniqueWithoutVenueInput | VenueCourtUpsertWithWhereUniqueWithoutVenueInput[]
    createMany?: VenueCourtCreateManyVenueInputEnvelope
    set?: VenueCourtWhereUniqueInput | VenueCourtWhereUniqueInput[]
    disconnect?: VenueCourtWhereUniqueInput | VenueCourtWhereUniqueInput[]
    delete?: VenueCourtWhereUniqueInput | VenueCourtWhereUniqueInput[]
    connect?: VenueCourtWhereUniqueInput | VenueCourtWhereUniqueInput[]
    update?: VenueCourtUpdateWithWhereUniqueWithoutVenueInput | VenueCourtUpdateWithWhereUniqueWithoutVenueInput[]
    updateMany?: VenueCourtUpdateManyWithWhereWithoutVenueInput | VenueCourtUpdateManyWithWhereWithoutVenueInput[]
    deleteMany?: VenueCourtScalarWhereInput | VenueCourtScalarWhereInput[]
  }

  export type VenueAvailabilitySlotUpdateManyWithoutVenueNestedInput = {
    create?: XOR<VenueAvailabilitySlotCreateWithoutVenueInput, VenueAvailabilitySlotUncheckedCreateWithoutVenueInput> | VenueAvailabilitySlotCreateWithoutVenueInput[] | VenueAvailabilitySlotUncheckedCreateWithoutVenueInput[]
    connectOrCreate?: VenueAvailabilitySlotCreateOrConnectWithoutVenueInput | VenueAvailabilitySlotCreateOrConnectWithoutVenueInput[]
    upsert?: VenueAvailabilitySlotUpsertWithWhereUniqueWithoutVenueInput | VenueAvailabilitySlotUpsertWithWhereUniqueWithoutVenueInput[]
    createMany?: VenueAvailabilitySlotCreateManyVenueInputEnvelope
    set?: VenueAvailabilitySlotWhereUniqueInput | VenueAvailabilitySlotWhereUniqueInput[]
    disconnect?: VenueAvailabilitySlotWhereUniqueInput | VenueAvailabilitySlotWhereUniqueInput[]
    delete?: VenueAvailabilitySlotWhereUniqueInput | VenueAvailabilitySlotWhereUniqueInput[]
    connect?: VenueAvailabilitySlotWhereUniqueInput | VenueAvailabilitySlotWhereUniqueInput[]
    update?: VenueAvailabilitySlotUpdateWithWhereUniqueWithoutVenueInput | VenueAvailabilitySlotUpdateWithWhereUniqueWithoutVenueInput[]
    updateMany?: VenueAvailabilitySlotUpdateManyWithWhereWithoutVenueInput | VenueAvailabilitySlotUpdateManyWithWhereWithoutVenueInput[]
    deleteMany?: VenueAvailabilitySlotScalarWhereInput | VenueAvailabilitySlotScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutVenueNestedInput = {
    create?: XOR<MatchCreateWithoutVenueInput, MatchUncheckedCreateWithoutVenueInput> | MatchCreateWithoutVenueInput[] | MatchUncheckedCreateWithoutVenueInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutVenueInput | MatchCreateOrConnectWithoutVenueInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutVenueInput | MatchUpsertWithWhereUniqueWithoutVenueInput[]
    createMany?: MatchCreateManyVenueInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutVenueInput | MatchUpdateWithWhereUniqueWithoutVenueInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutVenueInput | MatchUpdateManyWithWhereWithoutVenueInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type VenueCourtUncheckedUpdateManyWithoutVenueNestedInput = {
    create?: XOR<VenueCourtCreateWithoutVenueInput, VenueCourtUncheckedCreateWithoutVenueInput> | VenueCourtCreateWithoutVenueInput[] | VenueCourtUncheckedCreateWithoutVenueInput[]
    connectOrCreate?: VenueCourtCreateOrConnectWithoutVenueInput | VenueCourtCreateOrConnectWithoutVenueInput[]
    upsert?: VenueCourtUpsertWithWhereUniqueWithoutVenueInput | VenueCourtUpsertWithWhereUniqueWithoutVenueInput[]
    createMany?: VenueCourtCreateManyVenueInputEnvelope
    set?: VenueCourtWhereUniqueInput | VenueCourtWhereUniqueInput[]
    disconnect?: VenueCourtWhereUniqueInput | VenueCourtWhereUniqueInput[]
    delete?: VenueCourtWhereUniqueInput | VenueCourtWhereUniqueInput[]
    connect?: VenueCourtWhereUniqueInput | VenueCourtWhereUniqueInput[]
    update?: VenueCourtUpdateWithWhereUniqueWithoutVenueInput | VenueCourtUpdateWithWhereUniqueWithoutVenueInput[]
    updateMany?: VenueCourtUpdateManyWithWhereWithoutVenueInput | VenueCourtUpdateManyWithWhereWithoutVenueInput[]
    deleteMany?: VenueCourtScalarWhereInput | VenueCourtScalarWhereInput[]
  }

  export type VenueAvailabilitySlotUncheckedUpdateManyWithoutVenueNestedInput = {
    create?: XOR<VenueAvailabilitySlotCreateWithoutVenueInput, VenueAvailabilitySlotUncheckedCreateWithoutVenueInput> | VenueAvailabilitySlotCreateWithoutVenueInput[] | VenueAvailabilitySlotUncheckedCreateWithoutVenueInput[]
    connectOrCreate?: VenueAvailabilitySlotCreateOrConnectWithoutVenueInput | VenueAvailabilitySlotCreateOrConnectWithoutVenueInput[]
    upsert?: VenueAvailabilitySlotUpsertWithWhereUniqueWithoutVenueInput | VenueAvailabilitySlotUpsertWithWhereUniqueWithoutVenueInput[]
    createMany?: VenueAvailabilitySlotCreateManyVenueInputEnvelope
    set?: VenueAvailabilitySlotWhereUniqueInput | VenueAvailabilitySlotWhereUniqueInput[]
    disconnect?: VenueAvailabilitySlotWhereUniqueInput | VenueAvailabilitySlotWhereUniqueInput[]
    delete?: VenueAvailabilitySlotWhereUniqueInput | VenueAvailabilitySlotWhereUniqueInput[]
    connect?: VenueAvailabilitySlotWhereUniqueInput | VenueAvailabilitySlotWhereUniqueInput[]
    update?: VenueAvailabilitySlotUpdateWithWhereUniqueWithoutVenueInput | VenueAvailabilitySlotUpdateWithWhereUniqueWithoutVenueInput[]
    updateMany?: VenueAvailabilitySlotUpdateManyWithWhereWithoutVenueInput | VenueAvailabilitySlotUpdateManyWithWhereWithoutVenueInput[]
    deleteMany?: VenueAvailabilitySlotScalarWhereInput | VenueAvailabilitySlotScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutVenueNestedInput = {
    create?: XOR<MatchCreateWithoutVenueInput, MatchUncheckedCreateWithoutVenueInput> | MatchCreateWithoutVenueInput[] | MatchUncheckedCreateWithoutVenueInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutVenueInput | MatchCreateOrConnectWithoutVenueInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutVenueInput | MatchUpsertWithWhereUniqueWithoutVenueInput[]
    createMany?: MatchCreateManyVenueInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutVenueInput | MatchUpdateWithWhereUniqueWithoutVenueInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutVenueInput | MatchUpdateManyWithWhereWithoutVenueInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type VenueCreateNestedOneWithoutCourtsInput = {
    create?: XOR<VenueCreateWithoutCourtsInput, VenueUncheckedCreateWithoutCourtsInput>
    connectOrCreate?: VenueCreateOrConnectWithoutCourtsInput
    connect?: VenueWhereUniqueInput
  }

  export type MatchCreateNestedManyWithoutCourtInput = {
    create?: XOR<MatchCreateWithoutCourtInput, MatchUncheckedCreateWithoutCourtInput> | MatchCreateWithoutCourtInput[] | MatchUncheckedCreateWithoutCourtInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutCourtInput | MatchCreateOrConnectWithoutCourtInput[]
    createMany?: MatchCreateManyCourtInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutCourtInput = {
    create?: XOR<MatchCreateWithoutCourtInput, MatchUncheckedCreateWithoutCourtInput> | MatchCreateWithoutCourtInput[] | MatchUncheckedCreateWithoutCourtInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutCourtInput | MatchCreateOrConnectWithoutCourtInput[]
    createMany?: MatchCreateManyCourtInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type VenueUpdateOneRequiredWithoutCourtsNestedInput = {
    create?: XOR<VenueCreateWithoutCourtsInput, VenueUncheckedCreateWithoutCourtsInput>
    connectOrCreate?: VenueCreateOrConnectWithoutCourtsInput
    upsert?: VenueUpsertWithoutCourtsInput
    connect?: VenueWhereUniqueInput
    update?: XOR<XOR<VenueUpdateToOneWithWhereWithoutCourtsInput, VenueUpdateWithoutCourtsInput>, VenueUncheckedUpdateWithoutCourtsInput>
  }

  export type MatchUpdateManyWithoutCourtNestedInput = {
    create?: XOR<MatchCreateWithoutCourtInput, MatchUncheckedCreateWithoutCourtInput> | MatchCreateWithoutCourtInput[] | MatchUncheckedCreateWithoutCourtInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutCourtInput | MatchCreateOrConnectWithoutCourtInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutCourtInput | MatchUpsertWithWhereUniqueWithoutCourtInput[]
    createMany?: MatchCreateManyCourtInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutCourtInput | MatchUpdateWithWhereUniqueWithoutCourtInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutCourtInput | MatchUpdateManyWithWhereWithoutCourtInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutCourtNestedInput = {
    create?: XOR<MatchCreateWithoutCourtInput, MatchUncheckedCreateWithoutCourtInput> | MatchCreateWithoutCourtInput[] | MatchUncheckedCreateWithoutCourtInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutCourtInput | MatchCreateOrConnectWithoutCourtInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutCourtInput | MatchUpsertWithWhereUniqueWithoutCourtInput[]
    createMany?: MatchCreateManyCourtInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutCourtInput | MatchUpdateWithWhereUniqueWithoutCourtInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutCourtInput | MatchUpdateManyWithWhereWithoutCourtInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type VenueCreateNestedOneWithoutAvailabilitySlotsInput = {
    create?: XOR<VenueCreateWithoutAvailabilitySlotsInput, VenueUncheckedCreateWithoutAvailabilitySlotsInput>
    connectOrCreate?: VenueCreateOrConnectWithoutAvailabilitySlotsInput
    connect?: VenueWhereUniqueInput
  }

  export type MatchCreateNestedManyWithoutSlotInput = {
    create?: XOR<MatchCreateWithoutSlotInput, MatchUncheckedCreateWithoutSlotInput> | MatchCreateWithoutSlotInput[] | MatchUncheckedCreateWithoutSlotInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutSlotInput | MatchCreateOrConnectWithoutSlotInput[]
    createMany?: MatchCreateManySlotInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutSlotInput = {
    create?: XOR<MatchCreateWithoutSlotInput, MatchUncheckedCreateWithoutSlotInput> | MatchCreateWithoutSlotInput[] | MatchUncheckedCreateWithoutSlotInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutSlotInput | MatchCreateOrConnectWithoutSlotInput[]
    createMany?: MatchCreateManySlotInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type VenueUpdateOneRequiredWithoutAvailabilitySlotsNestedInput = {
    create?: XOR<VenueCreateWithoutAvailabilitySlotsInput, VenueUncheckedCreateWithoutAvailabilitySlotsInput>
    connectOrCreate?: VenueCreateOrConnectWithoutAvailabilitySlotsInput
    upsert?: VenueUpsertWithoutAvailabilitySlotsInput
    connect?: VenueWhereUniqueInput
    update?: XOR<XOR<VenueUpdateToOneWithWhereWithoutAvailabilitySlotsInput, VenueUpdateWithoutAvailabilitySlotsInput>, VenueUncheckedUpdateWithoutAvailabilitySlotsInput>
  }

  export type MatchUpdateManyWithoutSlotNestedInput = {
    create?: XOR<MatchCreateWithoutSlotInput, MatchUncheckedCreateWithoutSlotInput> | MatchCreateWithoutSlotInput[] | MatchUncheckedCreateWithoutSlotInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutSlotInput | MatchCreateOrConnectWithoutSlotInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutSlotInput | MatchUpsertWithWhereUniqueWithoutSlotInput[]
    createMany?: MatchCreateManySlotInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutSlotInput | MatchUpdateWithWhereUniqueWithoutSlotInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutSlotInput | MatchUpdateManyWithWhereWithoutSlotInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutSlotNestedInput = {
    create?: XOR<MatchCreateWithoutSlotInput, MatchUncheckedCreateWithoutSlotInput> | MatchCreateWithoutSlotInput[] | MatchUncheckedCreateWithoutSlotInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutSlotInput | MatchCreateOrConnectWithoutSlotInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutSlotInput | MatchUpsertWithWhereUniqueWithoutSlotInput[]
    createMany?: MatchCreateManySlotInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutSlotInput | MatchUpdateWithWhereUniqueWithoutSlotInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutSlotInput | MatchUpdateManyWithWhereWithoutSlotInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type EnumOptionPresetKindFieldUpdateOperationsInput = {
    set?: $Enums.OptionPresetKind
  }

  export type UserCreateNestedOneWithoutHostedMatchesInput = {
    create?: XOR<UserCreateWithoutHostedMatchesInput, UserUncheckedCreateWithoutHostedMatchesInput>
    connectOrCreate?: UserCreateOrConnectWithoutHostedMatchesInput
    connect?: UserWhereUniqueInput
  }

  export type VenueCreateNestedOneWithoutMatchesInput = {
    create?: XOR<VenueCreateWithoutMatchesInput, VenueUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: VenueCreateOrConnectWithoutMatchesInput
    connect?: VenueWhereUniqueInput
  }

  export type VenueCourtCreateNestedOneWithoutMatchesInput = {
    create?: XOR<VenueCourtCreateWithoutMatchesInput, VenueCourtUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: VenueCourtCreateOrConnectWithoutMatchesInput
    connect?: VenueCourtWhereUniqueInput
  }

  export type VenueAvailabilitySlotCreateNestedOneWithoutMatchesInput = {
    create?: XOR<VenueAvailabilitySlotCreateWithoutMatchesInput, VenueAvailabilitySlotUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: VenueAvailabilitySlotCreateOrConnectWithoutMatchesInput
    connect?: VenueAvailabilitySlotWhereUniqueInput
  }

  export type MatchApplicationCreateNestedManyWithoutMatchInput = {
    create?: XOR<MatchApplicationCreateWithoutMatchInput, MatchApplicationUncheckedCreateWithoutMatchInput> | MatchApplicationCreateWithoutMatchInput[] | MatchApplicationUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchApplicationCreateOrConnectWithoutMatchInput | MatchApplicationCreateOrConnectWithoutMatchInput[]
    createMany?: MatchApplicationCreateManyMatchInputEnvelope
    connect?: MatchApplicationWhereUniqueInput | MatchApplicationWhereUniqueInput[]
  }

  export type ChatThreadCreateNestedOneWithoutMatchInput = {
    create?: XOR<ChatThreadCreateWithoutMatchInput, ChatThreadUncheckedCreateWithoutMatchInput>
    connectOrCreate?: ChatThreadCreateOrConnectWithoutMatchInput
    connect?: ChatThreadWhereUniqueInput
  }

  export type MatchApplicationUncheckedCreateNestedManyWithoutMatchInput = {
    create?: XOR<MatchApplicationCreateWithoutMatchInput, MatchApplicationUncheckedCreateWithoutMatchInput> | MatchApplicationCreateWithoutMatchInput[] | MatchApplicationUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchApplicationCreateOrConnectWithoutMatchInput | MatchApplicationCreateOrConnectWithoutMatchInput[]
    createMany?: MatchApplicationCreateManyMatchInputEnvelope
    connect?: MatchApplicationWhereUniqueInput | MatchApplicationWhereUniqueInput[]
  }

  export type ChatThreadUncheckedCreateNestedOneWithoutMatchInput = {
    create?: XOR<ChatThreadCreateWithoutMatchInput, ChatThreadUncheckedCreateWithoutMatchInput>
    connectOrCreate?: ChatThreadCreateOrConnectWithoutMatchInput
    connect?: ChatThreadWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutHostedMatchesNestedInput = {
    create?: XOR<UserCreateWithoutHostedMatchesInput, UserUncheckedCreateWithoutHostedMatchesInput>
    connectOrCreate?: UserCreateOrConnectWithoutHostedMatchesInput
    upsert?: UserUpsertWithoutHostedMatchesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutHostedMatchesInput, UserUpdateWithoutHostedMatchesInput>, UserUncheckedUpdateWithoutHostedMatchesInput>
  }

  export type VenueUpdateOneWithoutMatchesNestedInput = {
    create?: XOR<VenueCreateWithoutMatchesInput, VenueUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: VenueCreateOrConnectWithoutMatchesInput
    upsert?: VenueUpsertWithoutMatchesInput
    disconnect?: VenueWhereInput | boolean
    delete?: VenueWhereInput | boolean
    connect?: VenueWhereUniqueInput
    update?: XOR<XOR<VenueUpdateToOneWithWhereWithoutMatchesInput, VenueUpdateWithoutMatchesInput>, VenueUncheckedUpdateWithoutMatchesInput>
  }

  export type VenueCourtUpdateOneWithoutMatchesNestedInput = {
    create?: XOR<VenueCourtCreateWithoutMatchesInput, VenueCourtUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: VenueCourtCreateOrConnectWithoutMatchesInput
    upsert?: VenueCourtUpsertWithoutMatchesInput
    disconnect?: VenueCourtWhereInput | boolean
    delete?: VenueCourtWhereInput | boolean
    connect?: VenueCourtWhereUniqueInput
    update?: XOR<XOR<VenueCourtUpdateToOneWithWhereWithoutMatchesInput, VenueCourtUpdateWithoutMatchesInput>, VenueCourtUncheckedUpdateWithoutMatchesInput>
  }

  export type VenueAvailabilitySlotUpdateOneWithoutMatchesNestedInput = {
    create?: XOR<VenueAvailabilitySlotCreateWithoutMatchesInput, VenueAvailabilitySlotUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: VenueAvailabilitySlotCreateOrConnectWithoutMatchesInput
    upsert?: VenueAvailabilitySlotUpsertWithoutMatchesInput
    disconnect?: VenueAvailabilitySlotWhereInput | boolean
    delete?: VenueAvailabilitySlotWhereInput | boolean
    connect?: VenueAvailabilitySlotWhereUniqueInput
    update?: XOR<XOR<VenueAvailabilitySlotUpdateToOneWithWhereWithoutMatchesInput, VenueAvailabilitySlotUpdateWithoutMatchesInput>, VenueAvailabilitySlotUncheckedUpdateWithoutMatchesInput>
  }

  export type MatchApplicationUpdateManyWithoutMatchNestedInput = {
    create?: XOR<MatchApplicationCreateWithoutMatchInput, MatchApplicationUncheckedCreateWithoutMatchInput> | MatchApplicationCreateWithoutMatchInput[] | MatchApplicationUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchApplicationCreateOrConnectWithoutMatchInput | MatchApplicationCreateOrConnectWithoutMatchInput[]
    upsert?: MatchApplicationUpsertWithWhereUniqueWithoutMatchInput | MatchApplicationUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: MatchApplicationCreateManyMatchInputEnvelope
    set?: MatchApplicationWhereUniqueInput | MatchApplicationWhereUniqueInput[]
    disconnect?: MatchApplicationWhereUniqueInput | MatchApplicationWhereUniqueInput[]
    delete?: MatchApplicationWhereUniqueInput | MatchApplicationWhereUniqueInput[]
    connect?: MatchApplicationWhereUniqueInput | MatchApplicationWhereUniqueInput[]
    update?: MatchApplicationUpdateWithWhereUniqueWithoutMatchInput | MatchApplicationUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: MatchApplicationUpdateManyWithWhereWithoutMatchInput | MatchApplicationUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: MatchApplicationScalarWhereInput | MatchApplicationScalarWhereInput[]
  }

  export type ChatThreadUpdateOneWithoutMatchNestedInput = {
    create?: XOR<ChatThreadCreateWithoutMatchInput, ChatThreadUncheckedCreateWithoutMatchInput>
    connectOrCreate?: ChatThreadCreateOrConnectWithoutMatchInput
    upsert?: ChatThreadUpsertWithoutMatchInput
    disconnect?: ChatThreadWhereInput | boolean
    delete?: ChatThreadWhereInput | boolean
    connect?: ChatThreadWhereUniqueInput
    update?: XOR<XOR<ChatThreadUpdateToOneWithWhereWithoutMatchInput, ChatThreadUpdateWithoutMatchInput>, ChatThreadUncheckedUpdateWithoutMatchInput>
  }

  export type MatchApplicationUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: XOR<MatchApplicationCreateWithoutMatchInput, MatchApplicationUncheckedCreateWithoutMatchInput> | MatchApplicationCreateWithoutMatchInput[] | MatchApplicationUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchApplicationCreateOrConnectWithoutMatchInput | MatchApplicationCreateOrConnectWithoutMatchInput[]
    upsert?: MatchApplicationUpsertWithWhereUniqueWithoutMatchInput | MatchApplicationUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: MatchApplicationCreateManyMatchInputEnvelope
    set?: MatchApplicationWhereUniqueInput | MatchApplicationWhereUniqueInput[]
    disconnect?: MatchApplicationWhereUniqueInput | MatchApplicationWhereUniqueInput[]
    delete?: MatchApplicationWhereUniqueInput | MatchApplicationWhereUniqueInput[]
    connect?: MatchApplicationWhereUniqueInput | MatchApplicationWhereUniqueInput[]
    update?: MatchApplicationUpdateWithWhereUniqueWithoutMatchInput | MatchApplicationUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: MatchApplicationUpdateManyWithWhereWithoutMatchInput | MatchApplicationUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: MatchApplicationScalarWhereInput | MatchApplicationScalarWhereInput[]
  }

  export type ChatThreadUncheckedUpdateOneWithoutMatchNestedInput = {
    create?: XOR<ChatThreadCreateWithoutMatchInput, ChatThreadUncheckedCreateWithoutMatchInput>
    connectOrCreate?: ChatThreadCreateOrConnectWithoutMatchInput
    upsert?: ChatThreadUpsertWithoutMatchInput
    disconnect?: ChatThreadWhereInput | boolean
    delete?: ChatThreadWhereInput | boolean
    connect?: ChatThreadWhereUniqueInput
    update?: XOR<XOR<ChatThreadUpdateToOneWithWhereWithoutMatchInput, ChatThreadUpdateWithoutMatchInput>, ChatThreadUncheckedUpdateWithoutMatchInput>
  }

  export type MatchCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<MatchCreateWithoutApplicationsInput, MatchUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: MatchCreateOrConnectWithoutApplicationsInput
    connect?: MatchWhereUniqueInput
  }

  export type MatchUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<MatchCreateWithoutApplicationsInput, MatchUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: MatchCreateOrConnectWithoutApplicationsInput
    upsert?: MatchUpsertWithoutApplicationsInput
    connect?: MatchWhereUniqueInput
    update?: XOR<XOR<MatchUpdateToOneWithWhereWithoutApplicationsInput, MatchUpdateWithoutApplicationsInput>, MatchUncheckedUpdateWithoutApplicationsInput>
  }

  export type ReviewCreatetagsInput = {
    set: string[]
  }

  export type ReviewUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type MatchCreateNestedOneWithoutThreadInput = {
    create?: XOR<MatchCreateWithoutThreadInput, MatchUncheckedCreateWithoutThreadInput>
    connectOrCreate?: MatchCreateOrConnectWithoutThreadInput
    connect?: MatchWhereUniqueInput
  }

  export type ChatThreadParticipantCreateNestedManyWithoutThreadInput = {
    create?: XOR<ChatThreadParticipantCreateWithoutThreadInput, ChatThreadParticipantUncheckedCreateWithoutThreadInput> | ChatThreadParticipantCreateWithoutThreadInput[] | ChatThreadParticipantUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: ChatThreadParticipantCreateOrConnectWithoutThreadInput | ChatThreadParticipantCreateOrConnectWithoutThreadInput[]
    createMany?: ChatThreadParticipantCreateManyThreadInputEnvelope
    connect?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutThreadInput = {
    create?: XOR<MessageCreateWithoutThreadInput, MessageUncheckedCreateWithoutThreadInput> | MessageCreateWithoutThreadInput[] | MessageUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutThreadInput | MessageCreateOrConnectWithoutThreadInput[]
    createMany?: MessageCreateManyThreadInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type ChatThreadParticipantUncheckedCreateNestedManyWithoutThreadInput = {
    create?: XOR<ChatThreadParticipantCreateWithoutThreadInput, ChatThreadParticipantUncheckedCreateWithoutThreadInput> | ChatThreadParticipantCreateWithoutThreadInput[] | ChatThreadParticipantUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: ChatThreadParticipantCreateOrConnectWithoutThreadInput | ChatThreadParticipantCreateOrConnectWithoutThreadInput[]
    createMany?: ChatThreadParticipantCreateManyThreadInputEnvelope
    connect?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutThreadInput = {
    create?: XOR<MessageCreateWithoutThreadInput, MessageUncheckedCreateWithoutThreadInput> | MessageCreateWithoutThreadInput[] | MessageUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutThreadInput | MessageCreateOrConnectWithoutThreadInput[]
    createMany?: MessageCreateManyThreadInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MatchUpdateOneRequiredWithoutThreadNestedInput = {
    create?: XOR<MatchCreateWithoutThreadInput, MatchUncheckedCreateWithoutThreadInput>
    connectOrCreate?: MatchCreateOrConnectWithoutThreadInput
    upsert?: MatchUpsertWithoutThreadInput
    connect?: MatchWhereUniqueInput
    update?: XOR<XOR<MatchUpdateToOneWithWhereWithoutThreadInput, MatchUpdateWithoutThreadInput>, MatchUncheckedUpdateWithoutThreadInput>
  }

  export type ChatThreadParticipantUpdateManyWithoutThreadNestedInput = {
    create?: XOR<ChatThreadParticipantCreateWithoutThreadInput, ChatThreadParticipantUncheckedCreateWithoutThreadInput> | ChatThreadParticipantCreateWithoutThreadInput[] | ChatThreadParticipantUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: ChatThreadParticipantCreateOrConnectWithoutThreadInput | ChatThreadParticipantCreateOrConnectWithoutThreadInput[]
    upsert?: ChatThreadParticipantUpsertWithWhereUniqueWithoutThreadInput | ChatThreadParticipantUpsertWithWhereUniqueWithoutThreadInput[]
    createMany?: ChatThreadParticipantCreateManyThreadInputEnvelope
    set?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    disconnect?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    delete?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    connect?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    update?: ChatThreadParticipantUpdateWithWhereUniqueWithoutThreadInput | ChatThreadParticipantUpdateWithWhereUniqueWithoutThreadInput[]
    updateMany?: ChatThreadParticipantUpdateManyWithWhereWithoutThreadInput | ChatThreadParticipantUpdateManyWithWhereWithoutThreadInput[]
    deleteMany?: ChatThreadParticipantScalarWhereInput | ChatThreadParticipantScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutThreadNestedInput = {
    create?: XOR<MessageCreateWithoutThreadInput, MessageUncheckedCreateWithoutThreadInput> | MessageCreateWithoutThreadInput[] | MessageUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutThreadInput | MessageCreateOrConnectWithoutThreadInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutThreadInput | MessageUpsertWithWhereUniqueWithoutThreadInput[]
    createMany?: MessageCreateManyThreadInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutThreadInput | MessageUpdateWithWhereUniqueWithoutThreadInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutThreadInput | MessageUpdateManyWithWhereWithoutThreadInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ChatThreadParticipantUncheckedUpdateManyWithoutThreadNestedInput = {
    create?: XOR<ChatThreadParticipantCreateWithoutThreadInput, ChatThreadParticipantUncheckedCreateWithoutThreadInput> | ChatThreadParticipantCreateWithoutThreadInput[] | ChatThreadParticipantUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: ChatThreadParticipantCreateOrConnectWithoutThreadInput | ChatThreadParticipantCreateOrConnectWithoutThreadInput[]
    upsert?: ChatThreadParticipantUpsertWithWhereUniqueWithoutThreadInput | ChatThreadParticipantUpsertWithWhereUniqueWithoutThreadInput[]
    createMany?: ChatThreadParticipantCreateManyThreadInputEnvelope
    set?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    disconnect?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    delete?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    connect?: ChatThreadParticipantWhereUniqueInput | ChatThreadParticipantWhereUniqueInput[]
    update?: ChatThreadParticipantUpdateWithWhereUniqueWithoutThreadInput | ChatThreadParticipantUpdateWithWhereUniqueWithoutThreadInput[]
    updateMany?: ChatThreadParticipantUpdateManyWithWhereWithoutThreadInput | ChatThreadParticipantUpdateManyWithWhereWithoutThreadInput[]
    deleteMany?: ChatThreadParticipantScalarWhereInput | ChatThreadParticipantScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutThreadNestedInput = {
    create?: XOR<MessageCreateWithoutThreadInput, MessageUncheckedCreateWithoutThreadInput> | MessageCreateWithoutThreadInput[] | MessageUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutThreadInput | MessageCreateOrConnectWithoutThreadInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutThreadInput | MessageUpsertWithWhereUniqueWithoutThreadInput[]
    createMany?: MessageCreateManyThreadInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutThreadInput | MessageUpdateWithWhereUniqueWithoutThreadInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutThreadInput | MessageUpdateManyWithWhereWithoutThreadInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ChatThreadCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<ChatThreadCreateWithoutParticipantsInput, ChatThreadUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: ChatThreadCreateOrConnectWithoutParticipantsInput
    connect?: ChatThreadWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutThreadMembershipInput = {
    create?: XOR<UserCreateWithoutThreadMembershipInput, UserUncheckedCreateWithoutThreadMembershipInput>
    connectOrCreate?: UserCreateOrConnectWithoutThreadMembershipInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ChatThreadUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<ChatThreadCreateWithoutParticipantsInput, ChatThreadUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: ChatThreadCreateOrConnectWithoutParticipantsInput
    upsert?: ChatThreadUpsertWithoutParticipantsInput
    connect?: ChatThreadWhereUniqueInput
    update?: XOR<XOR<ChatThreadUpdateToOneWithWhereWithoutParticipantsInput, ChatThreadUpdateWithoutParticipantsInput>, ChatThreadUncheckedUpdateWithoutParticipantsInput>
  }

  export type UserUpdateOneRequiredWithoutThreadMembershipNestedInput = {
    create?: XOR<UserCreateWithoutThreadMembershipInput, UserUncheckedCreateWithoutThreadMembershipInput>
    connectOrCreate?: UserCreateOrConnectWithoutThreadMembershipInput
    upsert?: UserUpsertWithoutThreadMembershipInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutThreadMembershipInput, UserUpdateWithoutThreadMembershipInput>, UserUncheckedUpdateWithoutThreadMembershipInput>
  }

  export type ChatThreadCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ChatThreadCreateWithoutMessagesInput, ChatThreadUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatThreadCreateOrConnectWithoutMessagesInput
    connect?: ChatThreadWhereUniqueInput
  }

  export type ChatThreadUpdateOneWithoutMessagesNestedInput = {
    create?: XOR<ChatThreadCreateWithoutMessagesInput, ChatThreadUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatThreadCreateOrConnectWithoutMessagesInput
    upsert?: ChatThreadUpsertWithoutMessagesInput
    disconnect?: ChatThreadWhereInput | boolean
    delete?: ChatThreadWhereInput | boolean
    connect?: ChatThreadWhereUniqueInput
    update?: XOR<XOR<ChatThreadUpdateToOneWithWhereWithoutMessagesInput, ChatThreadUpdateWithoutMessagesInput>, ChatThreadUncheckedUpdateWithoutMessagesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumOptionPresetKindFilter<$PrismaModel = never> = {
    equals?: $Enums.OptionPresetKind | EnumOptionPresetKindFieldRefInput<$PrismaModel>
    in?: $Enums.OptionPresetKind[] | ListEnumOptionPresetKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.OptionPresetKind[] | ListEnumOptionPresetKindFieldRefInput<$PrismaModel>
    not?: NestedEnumOptionPresetKindFilter<$PrismaModel> | $Enums.OptionPresetKind
  }

  export type NestedEnumOptionPresetKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OptionPresetKind | EnumOptionPresetKindFieldRefInput<$PrismaModel>
    in?: $Enums.OptionPresetKind[] | ListEnumOptionPresetKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.OptionPresetKind[] | ListEnumOptionPresetKindFieldRefInput<$PrismaModel>
    not?: NestedEnumOptionPresetKindWithAggregatesFilter<$PrismaModel> | $Enums.OptionPresetKind
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOptionPresetKindFilter<$PrismaModel>
    _max?: NestedEnumOptionPresetKindFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type MatchCreateWithoutHostUserInput = {
    id?: string
    title: string
    venueName: string
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    venue?: VenueCreateNestedOneWithoutMatchesInput
    court?: VenueCourtCreateNestedOneWithoutMatchesInput
    slot?: VenueAvailabilitySlotCreateNestedOneWithoutMatchesInput
    applications?: MatchApplicationCreateNestedManyWithoutMatchInput
    thread?: ChatThreadCreateNestedOneWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutHostUserInput = {
    id?: string
    title: string
    venueName: string
    venueId?: string | null
    courtId?: string | null
    slotId?: string | null
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    applications?: MatchApplicationUncheckedCreateNestedManyWithoutMatchInput
    thread?: ChatThreadUncheckedCreateNestedOneWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutHostUserInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutHostUserInput, MatchUncheckedCreateWithoutHostUserInput>
  }

  export type MatchCreateManyHostUserInputEnvelope = {
    data: MatchCreateManyHostUserInput | MatchCreateManyHostUserInput[]
    skipDuplicates?: boolean
  }

  export type ChatThreadParticipantCreateWithoutUserInput = {
    id?: string
    role: string
    joinedAt?: Date | string
    lastReadAt?: Date | string | null
    checkedInAt?: Date | string | null
    thread: ChatThreadCreateNestedOneWithoutParticipantsInput
  }

  export type ChatThreadParticipantUncheckedCreateWithoutUserInput = {
    id?: string
    threadId: string
    role: string
    joinedAt?: Date | string
    lastReadAt?: Date | string | null
    checkedInAt?: Date | string | null
  }

  export type ChatThreadParticipantCreateOrConnectWithoutUserInput = {
    where: ChatThreadParticipantWhereUniqueInput
    create: XOR<ChatThreadParticipantCreateWithoutUserInput, ChatThreadParticipantUncheckedCreateWithoutUserInput>
  }

  export type ChatThreadParticipantCreateManyUserInputEnvelope = {
    data: ChatThreadParticipantCreateManyUserInput | ChatThreadParticipantCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MatchUpsertWithWhereUniqueWithoutHostUserInput = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutHostUserInput, MatchUncheckedUpdateWithoutHostUserInput>
    create: XOR<MatchCreateWithoutHostUserInput, MatchUncheckedCreateWithoutHostUserInput>
  }

  export type MatchUpdateWithWhereUniqueWithoutHostUserInput = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutHostUserInput, MatchUncheckedUpdateWithoutHostUserInput>
  }

  export type MatchUpdateManyWithWhereWithoutHostUserInput = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutHostUserInput>
  }

  export type MatchScalarWhereInput = {
    AND?: MatchScalarWhereInput | MatchScalarWhereInput[]
    OR?: MatchScalarWhereInput[]
    NOT?: MatchScalarWhereInput | MatchScalarWhereInput[]
    id?: StringFilter<"Match"> | string
    title?: StringFilter<"Match"> | string
    venueName?: StringFilter<"Match"> | string
    venueId?: StringNullableFilter<"Match"> | string | null
    courtId?: StringNullableFilter<"Match"> | string | null
    slotId?: StringNullableFilter<"Match"> | string | null
    startTime?: DateTimeFilter<"Match"> | Date | string
    city?: StringFilter<"Match"> | string
    level?: StringFilter<"Match"> | string
    maxPlayers?: IntFilter<"Match"> | number
    openSlots?: IntFilter<"Match"> | number
    status?: StringFilter<"Match"> | string
    checkInCode?: StringNullableFilter<"Match"> | string | null
    hostUserId?: StringFilter<"Match"> | string
    hostCreditScore?: IntFilter<"Match"> | number
    distanceKm?: FloatFilter<"Match"> | number
    matchRate?: IntFilter<"Match"> | number
    createdAt?: DateTimeFilter<"Match"> | Date | string
  }

  export type ChatThreadParticipantUpsertWithWhereUniqueWithoutUserInput = {
    where: ChatThreadParticipantWhereUniqueInput
    update: XOR<ChatThreadParticipantUpdateWithoutUserInput, ChatThreadParticipantUncheckedUpdateWithoutUserInput>
    create: XOR<ChatThreadParticipantCreateWithoutUserInput, ChatThreadParticipantUncheckedCreateWithoutUserInput>
  }

  export type ChatThreadParticipantUpdateWithWhereUniqueWithoutUserInput = {
    where: ChatThreadParticipantWhereUniqueInput
    data: XOR<ChatThreadParticipantUpdateWithoutUserInput, ChatThreadParticipantUncheckedUpdateWithoutUserInput>
  }

  export type ChatThreadParticipantUpdateManyWithWhereWithoutUserInput = {
    where: ChatThreadParticipantScalarWhereInput
    data: XOR<ChatThreadParticipantUpdateManyMutationInput, ChatThreadParticipantUncheckedUpdateManyWithoutUserInput>
  }

  export type ChatThreadParticipantScalarWhereInput = {
    AND?: ChatThreadParticipantScalarWhereInput | ChatThreadParticipantScalarWhereInput[]
    OR?: ChatThreadParticipantScalarWhereInput[]
    NOT?: ChatThreadParticipantScalarWhereInput | ChatThreadParticipantScalarWhereInput[]
    id?: StringFilter<"ChatThreadParticipant"> | string
    threadId?: StringFilter<"ChatThreadParticipant"> | string
    userId?: StringFilter<"ChatThreadParticipant"> | string
    role?: StringFilter<"ChatThreadParticipant"> | string
    joinedAt?: DateTimeFilter<"ChatThreadParticipant"> | Date | string
    lastReadAt?: DateTimeNullableFilter<"ChatThreadParticipant"> | Date | string | null
    checkedInAt?: DateTimeNullableFilter<"ChatThreadParticipant"> | Date | string | null
  }

  export type VenueCourtCreateWithoutVenueInput = {
    id?: string
    name: string
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    matches?: MatchCreateNestedManyWithoutCourtInput
  }

  export type VenueCourtUncheckedCreateWithoutVenueInput = {
    id?: string
    name: string
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    matches?: MatchUncheckedCreateNestedManyWithoutCourtInput
  }

  export type VenueCourtCreateOrConnectWithoutVenueInput = {
    where: VenueCourtWhereUniqueInput
    create: XOR<VenueCourtCreateWithoutVenueInput, VenueCourtUncheckedCreateWithoutVenueInput>
  }

  export type VenueCourtCreateManyVenueInputEnvelope = {
    data: VenueCourtCreateManyVenueInput | VenueCourtCreateManyVenueInput[]
    skipDuplicates?: boolean
  }

  export type VenueAvailabilitySlotCreateWithoutVenueInput = {
    id?: string
    label: string
    startTime: number
    endTime: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    matches?: MatchCreateNestedManyWithoutSlotInput
  }

  export type VenueAvailabilitySlotUncheckedCreateWithoutVenueInput = {
    id?: string
    label: string
    startTime: number
    endTime: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    matches?: MatchUncheckedCreateNestedManyWithoutSlotInput
  }

  export type VenueAvailabilitySlotCreateOrConnectWithoutVenueInput = {
    where: VenueAvailabilitySlotWhereUniqueInput
    create: XOR<VenueAvailabilitySlotCreateWithoutVenueInput, VenueAvailabilitySlotUncheckedCreateWithoutVenueInput>
  }

  export type VenueAvailabilitySlotCreateManyVenueInputEnvelope = {
    data: VenueAvailabilitySlotCreateManyVenueInput | VenueAvailabilitySlotCreateManyVenueInput[]
    skipDuplicates?: boolean
  }

  export type MatchCreateWithoutVenueInput = {
    id?: string
    title: string
    venueName: string
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    hostUser: UserCreateNestedOneWithoutHostedMatchesInput
    court?: VenueCourtCreateNestedOneWithoutMatchesInput
    slot?: VenueAvailabilitySlotCreateNestedOneWithoutMatchesInput
    applications?: MatchApplicationCreateNestedManyWithoutMatchInput
    thread?: ChatThreadCreateNestedOneWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutVenueInput = {
    id?: string
    title: string
    venueName: string
    courtId?: string | null
    slotId?: string | null
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostUserId: string
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    applications?: MatchApplicationUncheckedCreateNestedManyWithoutMatchInput
    thread?: ChatThreadUncheckedCreateNestedOneWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutVenueInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutVenueInput, MatchUncheckedCreateWithoutVenueInput>
  }

  export type MatchCreateManyVenueInputEnvelope = {
    data: MatchCreateManyVenueInput | MatchCreateManyVenueInput[]
    skipDuplicates?: boolean
  }

  export type VenueCourtUpsertWithWhereUniqueWithoutVenueInput = {
    where: VenueCourtWhereUniqueInput
    update: XOR<VenueCourtUpdateWithoutVenueInput, VenueCourtUncheckedUpdateWithoutVenueInput>
    create: XOR<VenueCourtCreateWithoutVenueInput, VenueCourtUncheckedCreateWithoutVenueInput>
  }

  export type VenueCourtUpdateWithWhereUniqueWithoutVenueInput = {
    where: VenueCourtWhereUniqueInput
    data: XOR<VenueCourtUpdateWithoutVenueInput, VenueCourtUncheckedUpdateWithoutVenueInput>
  }

  export type VenueCourtUpdateManyWithWhereWithoutVenueInput = {
    where: VenueCourtScalarWhereInput
    data: XOR<VenueCourtUpdateManyMutationInput, VenueCourtUncheckedUpdateManyWithoutVenueInput>
  }

  export type VenueCourtScalarWhereInput = {
    AND?: VenueCourtScalarWhereInput | VenueCourtScalarWhereInput[]
    OR?: VenueCourtScalarWhereInput[]
    NOT?: VenueCourtScalarWhereInput | VenueCourtScalarWhereInput[]
    id?: StringFilter<"VenueCourt"> | string
    venueId?: StringFilter<"VenueCourt"> | string
    name?: StringFilter<"VenueCourt"> | string
    sortOrder?: IntFilter<"VenueCourt"> | number
    isActive?: BoolFilter<"VenueCourt"> | boolean
    createdAt?: DateTimeFilter<"VenueCourt"> | Date | string
    updatedAt?: DateTimeFilter<"VenueCourt"> | Date | string
  }

  export type VenueAvailabilitySlotUpsertWithWhereUniqueWithoutVenueInput = {
    where: VenueAvailabilitySlotWhereUniqueInput
    update: XOR<VenueAvailabilitySlotUpdateWithoutVenueInput, VenueAvailabilitySlotUncheckedUpdateWithoutVenueInput>
    create: XOR<VenueAvailabilitySlotCreateWithoutVenueInput, VenueAvailabilitySlotUncheckedCreateWithoutVenueInput>
  }

  export type VenueAvailabilitySlotUpdateWithWhereUniqueWithoutVenueInput = {
    where: VenueAvailabilitySlotWhereUniqueInput
    data: XOR<VenueAvailabilitySlotUpdateWithoutVenueInput, VenueAvailabilitySlotUncheckedUpdateWithoutVenueInput>
  }

  export type VenueAvailabilitySlotUpdateManyWithWhereWithoutVenueInput = {
    where: VenueAvailabilitySlotScalarWhereInput
    data: XOR<VenueAvailabilitySlotUpdateManyMutationInput, VenueAvailabilitySlotUncheckedUpdateManyWithoutVenueInput>
  }

  export type VenueAvailabilitySlotScalarWhereInput = {
    AND?: VenueAvailabilitySlotScalarWhereInput | VenueAvailabilitySlotScalarWhereInput[]
    OR?: VenueAvailabilitySlotScalarWhereInput[]
    NOT?: VenueAvailabilitySlotScalarWhereInput | VenueAvailabilitySlotScalarWhereInput[]
    id?: StringFilter<"VenueAvailabilitySlot"> | string
    venueId?: StringFilter<"VenueAvailabilitySlot"> | string
    label?: StringFilter<"VenueAvailabilitySlot"> | string
    startTime?: IntFilter<"VenueAvailabilitySlot"> | number
    endTime?: IntFilter<"VenueAvailabilitySlot"> | number
    sortOrder?: IntFilter<"VenueAvailabilitySlot"> | number
    isActive?: BoolFilter<"VenueAvailabilitySlot"> | boolean
    createdAt?: DateTimeFilter<"VenueAvailabilitySlot"> | Date | string
    updatedAt?: DateTimeFilter<"VenueAvailabilitySlot"> | Date | string
  }

  export type MatchUpsertWithWhereUniqueWithoutVenueInput = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutVenueInput, MatchUncheckedUpdateWithoutVenueInput>
    create: XOR<MatchCreateWithoutVenueInput, MatchUncheckedCreateWithoutVenueInput>
  }

  export type MatchUpdateWithWhereUniqueWithoutVenueInput = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutVenueInput, MatchUncheckedUpdateWithoutVenueInput>
  }

  export type MatchUpdateManyWithWhereWithoutVenueInput = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutVenueInput>
  }

  export type VenueCreateWithoutCourtsInput = {
    id?: string
    name: string
    city: string
    district?: string | null
    distanceKm: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    availabilitySlots?: VenueAvailabilitySlotCreateNestedManyWithoutVenueInput
    matches?: MatchCreateNestedManyWithoutVenueInput
  }

  export type VenueUncheckedCreateWithoutCourtsInput = {
    id?: string
    name: string
    city: string
    district?: string | null
    distanceKm: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    availabilitySlots?: VenueAvailabilitySlotUncheckedCreateNestedManyWithoutVenueInput
    matches?: MatchUncheckedCreateNestedManyWithoutVenueInput
  }

  export type VenueCreateOrConnectWithoutCourtsInput = {
    where: VenueWhereUniqueInput
    create: XOR<VenueCreateWithoutCourtsInput, VenueUncheckedCreateWithoutCourtsInput>
  }

  export type MatchCreateWithoutCourtInput = {
    id?: string
    title: string
    venueName: string
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    hostUser: UserCreateNestedOneWithoutHostedMatchesInput
    venue?: VenueCreateNestedOneWithoutMatchesInput
    slot?: VenueAvailabilitySlotCreateNestedOneWithoutMatchesInput
    applications?: MatchApplicationCreateNestedManyWithoutMatchInput
    thread?: ChatThreadCreateNestedOneWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutCourtInput = {
    id?: string
    title: string
    venueName: string
    venueId?: string | null
    slotId?: string | null
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostUserId: string
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    applications?: MatchApplicationUncheckedCreateNestedManyWithoutMatchInput
    thread?: ChatThreadUncheckedCreateNestedOneWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutCourtInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutCourtInput, MatchUncheckedCreateWithoutCourtInput>
  }

  export type MatchCreateManyCourtInputEnvelope = {
    data: MatchCreateManyCourtInput | MatchCreateManyCourtInput[]
    skipDuplicates?: boolean
  }

  export type VenueUpsertWithoutCourtsInput = {
    update: XOR<VenueUpdateWithoutCourtsInput, VenueUncheckedUpdateWithoutCourtsInput>
    create: XOR<VenueCreateWithoutCourtsInput, VenueUncheckedCreateWithoutCourtsInput>
    where?: VenueWhereInput
  }

  export type VenueUpdateToOneWithWhereWithoutCourtsInput = {
    where?: VenueWhereInput
    data: XOR<VenueUpdateWithoutCourtsInput, VenueUncheckedUpdateWithoutCourtsInput>
  }

  export type VenueUpdateWithoutCourtsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    distanceKm?: FloatFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    availabilitySlots?: VenueAvailabilitySlotUpdateManyWithoutVenueNestedInput
    matches?: MatchUpdateManyWithoutVenueNestedInput
  }

  export type VenueUncheckedUpdateWithoutCourtsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    distanceKm?: FloatFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    availabilitySlots?: VenueAvailabilitySlotUncheckedUpdateManyWithoutVenueNestedInput
    matches?: MatchUncheckedUpdateManyWithoutVenueNestedInput
  }

  export type MatchUpsertWithWhereUniqueWithoutCourtInput = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutCourtInput, MatchUncheckedUpdateWithoutCourtInput>
    create: XOR<MatchCreateWithoutCourtInput, MatchUncheckedCreateWithoutCourtInput>
  }

  export type MatchUpdateWithWhereUniqueWithoutCourtInput = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutCourtInput, MatchUncheckedUpdateWithoutCourtInput>
  }

  export type MatchUpdateManyWithWhereWithoutCourtInput = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutCourtInput>
  }

  export type VenueCreateWithoutAvailabilitySlotsInput = {
    id?: string
    name: string
    city: string
    district?: string | null
    distanceKm: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    courts?: VenueCourtCreateNestedManyWithoutVenueInput
    matches?: MatchCreateNestedManyWithoutVenueInput
  }

  export type VenueUncheckedCreateWithoutAvailabilitySlotsInput = {
    id?: string
    name: string
    city: string
    district?: string | null
    distanceKm: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    courts?: VenueCourtUncheckedCreateNestedManyWithoutVenueInput
    matches?: MatchUncheckedCreateNestedManyWithoutVenueInput
  }

  export type VenueCreateOrConnectWithoutAvailabilitySlotsInput = {
    where: VenueWhereUniqueInput
    create: XOR<VenueCreateWithoutAvailabilitySlotsInput, VenueUncheckedCreateWithoutAvailabilitySlotsInput>
  }

  export type MatchCreateWithoutSlotInput = {
    id?: string
    title: string
    venueName: string
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    hostUser: UserCreateNestedOneWithoutHostedMatchesInput
    venue?: VenueCreateNestedOneWithoutMatchesInput
    court?: VenueCourtCreateNestedOneWithoutMatchesInput
    applications?: MatchApplicationCreateNestedManyWithoutMatchInput
    thread?: ChatThreadCreateNestedOneWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutSlotInput = {
    id?: string
    title: string
    venueName: string
    venueId?: string | null
    courtId?: string | null
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostUserId: string
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    applications?: MatchApplicationUncheckedCreateNestedManyWithoutMatchInput
    thread?: ChatThreadUncheckedCreateNestedOneWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutSlotInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutSlotInput, MatchUncheckedCreateWithoutSlotInput>
  }

  export type MatchCreateManySlotInputEnvelope = {
    data: MatchCreateManySlotInput | MatchCreateManySlotInput[]
    skipDuplicates?: boolean
  }

  export type VenueUpsertWithoutAvailabilitySlotsInput = {
    update: XOR<VenueUpdateWithoutAvailabilitySlotsInput, VenueUncheckedUpdateWithoutAvailabilitySlotsInput>
    create: XOR<VenueCreateWithoutAvailabilitySlotsInput, VenueUncheckedCreateWithoutAvailabilitySlotsInput>
    where?: VenueWhereInput
  }

  export type VenueUpdateToOneWithWhereWithoutAvailabilitySlotsInput = {
    where?: VenueWhereInput
    data: XOR<VenueUpdateWithoutAvailabilitySlotsInput, VenueUncheckedUpdateWithoutAvailabilitySlotsInput>
  }

  export type VenueUpdateWithoutAvailabilitySlotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    distanceKm?: FloatFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courts?: VenueCourtUpdateManyWithoutVenueNestedInput
    matches?: MatchUpdateManyWithoutVenueNestedInput
  }

  export type VenueUncheckedUpdateWithoutAvailabilitySlotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    distanceKm?: FloatFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courts?: VenueCourtUncheckedUpdateManyWithoutVenueNestedInput
    matches?: MatchUncheckedUpdateManyWithoutVenueNestedInput
  }

  export type MatchUpsertWithWhereUniqueWithoutSlotInput = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutSlotInput, MatchUncheckedUpdateWithoutSlotInput>
    create: XOR<MatchCreateWithoutSlotInput, MatchUncheckedCreateWithoutSlotInput>
  }

  export type MatchUpdateWithWhereUniqueWithoutSlotInput = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutSlotInput, MatchUncheckedUpdateWithoutSlotInput>
  }

  export type MatchUpdateManyWithWhereWithoutSlotInput = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutSlotInput>
  }

  export type UserCreateWithoutHostedMatchesInput = {
    id?: string
    phone?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    nickname: string
    city: string
    level: string
    creditScore?: number
    createdAt?: Date | string
    threadMembership?: ChatThreadParticipantCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutHostedMatchesInput = {
    id?: string
    phone?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    nickname: string
    city: string
    level: string
    creditScore?: number
    createdAt?: Date | string
    threadMembership?: ChatThreadParticipantUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutHostedMatchesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutHostedMatchesInput, UserUncheckedCreateWithoutHostedMatchesInput>
  }

  export type VenueCreateWithoutMatchesInput = {
    id?: string
    name: string
    city: string
    district?: string | null
    distanceKm: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    courts?: VenueCourtCreateNestedManyWithoutVenueInput
    availabilitySlots?: VenueAvailabilitySlotCreateNestedManyWithoutVenueInput
  }

  export type VenueUncheckedCreateWithoutMatchesInput = {
    id?: string
    name: string
    city: string
    district?: string | null
    distanceKm: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    courts?: VenueCourtUncheckedCreateNestedManyWithoutVenueInput
    availabilitySlots?: VenueAvailabilitySlotUncheckedCreateNestedManyWithoutVenueInput
  }

  export type VenueCreateOrConnectWithoutMatchesInput = {
    where: VenueWhereUniqueInput
    create: XOR<VenueCreateWithoutMatchesInput, VenueUncheckedCreateWithoutMatchesInput>
  }

  export type VenueCourtCreateWithoutMatchesInput = {
    id?: string
    name: string
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    venue: VenueCreateNestedOneWithoutCourtsInput
  }

  export type VenueCourtUncheckedCreateWithoutMatchesInput = {
    id?: string
    venueId: string
    name: string
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VenueCourtCreateOrConnectWithoutMatchesInput = {
    where: VenueCourtWhereUniqueInput
    create: XOR<VenueCourtCreateWithoutMatchesInput, VenueCourtUncheckedCreateWithoutMatchesInput>
  }

  export type VenueAvailabilitySlotCreateWithoutMatchesInput = {
    id?: string
    label: string
    startTime: number
    endTime: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    venue: VenueCreateNestedOneWithoutAvailabilitySlotsInput
  }

  export type VenueAvailabilitySlotUncheckedCreateWithoutMatchesInput = {
    id?: string
    venueId: string
    label: string
    startTime: number
    endTime: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VenueAvailabilitySlotCreateOrConnectWithoutMatchesInput = {
    where: VenueAvailabilitySlotWhereUniqueInput
    create: XOR<VenueAvailabilitySlotCreateWithoutMatchesInput, VenueAvailabilitySlotUncheckedCreateWithoutMatchesInput>
  }

  export type MatchApplicationCreateWithoutMatchInput = {
    id?: string
    userId: string
    status: string
    decisionReason?: string | null
    createdAt?: Date | string
  }

  export type MatchApplicationUncheckedCreateWithoutMatchInput = {
    id?: string
    userId: string
    status: string
    decisionReason?: string | null
    createdAt?: Date | string
  }

  export type MatchApplicationCreateOrConnectWithoutMatchInput = {
    where: MatchApplicationWhereUniqueInput
    create: XOR<MatchApplicationCreateWithoutMatchInput, MatchApplicationUncheckedCreateWithoutMatchInput>
  }

  export type MatchApplicationCreateManyMatchInputEnvelope = {
    data: MatchApplicationCreateManyMatchInput | MatchApplicationCreateManyMatchInput[]
    skipDuplicates?: boolean
  }

  export type ChatThreadCreateWithoutMatchInput = {
    id?: string
    title: string
    venueName: string
    scheduledAt: Date | string
    hostUserId: string
    status?: string
    latestMessagePreview: string
    latestMessageAt: Date | string
    lastMessageSenderId?: string | null
    lastMessageSenderName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ChatThreadParticipantCreateNestedManyWithoutThreadInput
    messages?: MessageCreateNestedManyWithoutThreadInput
  }

  export type ChatThreadUncheckedCreateWithoutMatchInput = {
    id?: string
    title: string
    venueName: string
    scheduledAt: Date | string
    hostUserId: string
    status?: string
    latestMessagePreview: string
    latestMessageAt: Date | string
    lastMessageSenderId?: string | null
    lastMessageSenderName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ChatThreadParticipantUncheckedCreateNestedManyWithoutThreadInput
    messages?: MessageUncheckedCreateNestedManyWithoutThreadInput
  }

  export type ChatThreadCreateOrConnectWithoutMatchInput = {
    where: ChatThreadWhereUniqueInput
    create: XOR<ChatThreadCreateWithoutMatchInput, ChatThreadUncheckedCreateWithoutMatchInput>
  }

  export type UserUpsertWithoutHostedMatchesInput = {
    update: XOR<UserUpdateWithoutHostedMatchesInput, UserUncheckedUpdateWithoutHostedMatchesInput>
    create: XOR<UserCreateWithoutHostedMatchesInput, UserUncheckedCreateWithoutHostedMatchesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutHostedMatchesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutHostedMatchesInput, UserUncheckedUpdateWithoutHostedMatchesInput>
  }

  export type UserUpdateWithoutHostedMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    creditScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    threadMembership?: ChatThreadParticipantUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutHostedMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    creditScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    threadMembership?: ChatThreadParticipantUncheckedUpdateManyWithoutUserNestedInput
  }

  export type VenueUpsertWithoutMatchesInput = {
    update: XOR<VenueUpdateWithoutMatchesInput, VenueUncheckedUpdateWithoutMatchesInput>
    create: XOR<VenueCreateWithoutMatchesInput, VenueUncheckedCreateWithoutMatchesInput>
    where?: VenueWhereInput
  }

  export type VenueUpdateToOneWithWhereWithoutMatchesInput = {
    where?: VenueWhereInput
    data: XOR<VenueUpdateWithoutMatchesInput, VenueUncheckedUpdateWithoutMatchesInput>
  }

  export type VenueUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    distanceKm?: FloatFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courts?: VenueCourtUpdateManyWithoutVenueNestedInput
    availabilitySlots?: VenueAvailabilitySlotUpdateManyWithoutVenueNestedInput
  }

  export type VenueUncheckedUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    distanceKm?: FloatFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courts?: VenueCourtUncheckedUpdateManyWithoutVenueNestedInput
    availabilitySlots?: VenueAvailabilitySlotUncheckedUpdateManyWithoutVenueNestedInput
  }

  export type VenueCourtUpsertWithoutMatchesInput = {
    update: XOR<VenueCourtUpdateWithoutMatchesInput, VenueCourtUncheckedUpdateWithoutMatchesInput>
    create: XOR<VenueCourtCreateWithoutMatchesInput, VenueCourtUncheckedCreateWithoutMatchesInput>
    where?: VenueCourtWhereInput
  }

  export type VenueCourtUpdateToOneWithWhereWithoutMatchesInput = {
    where?: VenueCourtWhereInput
    data: XOR<VenueCourtUpdateWithoutMatchesInput, VenueCourtUncheckedUpdateWithoutMatchesInput>
  }

  export type VenueCourtUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: VenueUpdateOneRequiredWithoutCourtsNestedInput
  }

  export type VenueCourtUncheckedUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    venueId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VenueAvailabilitySlotUpsertWithoutMatchesInput = {
    update: XOR<VenueAvailabilitySlotUpdateWithoutMatchesInput, VenueAvailabilitySlotUncheckedUpdateWithoutMatchesInput>
    create: XOR<VenueAvailabilitySlotCreateWithoutMatchesInput, VenueAvailabilitySlotUncheckedCreateWithoutMatchesInput>
    where?: VenueAvailabilitySlotWhereInput
  }

  export type VenueAvailabilitySlotUpdateToOneWithWhereWithoutMatchesInput = {
    where?: VenueAvailabilitySlotWhereInput
    data: XOR<VenueAvailabilitySlotUpdateWithoutMatchesInput, VenueAvailabilitySlotUncheckedUpdateWithoutMatchesInput>
  }

  export type VenueAvailabilitySlotUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    startTime?: IntFieldUpdateOperationsInput | number
    endTime?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: VenueUpdateOneRequiredWithoutAvailabilitySlotsNestedInput
  }

  export type VenueAvailabilitySlotUncheckedUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    venueId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    startTime?: IntFieldUpdateOperationsInput | number
    endTime?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchApplicationUpsertWithWhereUniqueWithoutMatchInput = {
    where: MatchApplicationWhereUniqueInput
    update: XOR<MatchApplicationUpdateWithoutMatchInput, MatchApplicationUncheckedUpdateWithoutMatchInput>
    create: XOR<MatchApplicationCreateWithoutMatchInput, MatchApplicationUncheckedCreateWithoutMatchInput>
  }

  export type MatchApplicationUpdateWithWhereUniqueWithoutMatchInput = {
    where: MatchApplicationWhereUniqueInput
    data: XOR<MatchApplicationUpdateWithoutMatchInput, MatchApplicationUncheckedUpdateWithoutMatchInput>
  }

  export type MatchApplicationUpdateManyWithWhereWithoutMatchInput = {
    where: MatchApplicationScalarWhereInput
    data: XOR<MatchApplicationUpdateManyMutationInput, MatchApplicationUncheckedUpdateManyWithoutMatchInput>
  }

  export type MatchApplicationScalarWhereInput = {
    AND?: MatchApplicationScalarWhereInput | MatchApplicationScalarWhereInput[]
    OR?: MatchApplicationScalarWhereInput[]
    NOT?: MatchApplicationScalarWhereInput | MatchApplicationScalarWhereInput[]
    id?: StringFilter<"MatchApplication"> | string
    matchId?: StringFilter<"MatchApplication"> | string
    userId?: StringFilter<"MatchApplication"> | string
    status?: StringFilter<"MatchApplication"> | string
    decisionReason?: StringNullableFilter<"MatchApplication"> | string | null
    createdAt?: DateTimeFilter<"MatchApplication"> | Date | string
  }

  export type ChatThreadUpsertWithoutMatchInput = {
    update: XOR<ChatThreadUpdateWithoutMatchInput, ChatThreadUncheckedUpdateWithoutMatchInput>
    create: XOR<ChatThreadCreateWithoutMatchInput, ChatThreadUncheckedCreateWithoutMatchInput>
    where?: ChatThreadWhereInput
  }

  export type ChatThreadUpdateToOneWithWhereWithoutMatchInput = {
    where?: ChatThreadWhereInput
    data: XOR<ChatThreadUpdateWithoutMatchInput, ChatThreadUncheckedUpdateWithoutMatchInput>
  }

  export type ChatThreadUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestMessagePreview?: StringFieldUpdateOperationsInput | string
    latestMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageSenderId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageSenderName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ChatThreadParticipantUpdateManyWithoutThreadNestedInput
    messages?: MessageUpdateManyWithoutThreadNestedInput
  }

  export type ChatThreadUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestMessagePreview?: StringFieldUpdateOperationsInput | string
    latestMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageSenderId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageSenderName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ChatThreadParticipantUncheckedUpdateManyWithoutThreadNestedInput
    messages?: MessageUncheckedUpdateManyWithoutThreadNestedInput
  }

  export type MatchCreateWithoutApplicationsInput = {
    id?: string
    title: string
    venueName: string
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    hostUser: UserCreateNestedOneWithoutHostedMatchesInput
    venue?: VenueCreateNestedOneWithoutMatchesInput
    court?: VenueCourtCreateNestedOneWithoutMatchesInput
    slot?: VenueAvailabilitySlotCreateNestedOneWithoutMatchesInput
    thread?: ChatThreadCreateNestedOneWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutApplicationsInput = {
    id?: string
    title: string
    venueName: string
    venueId?: string | null
    courtId?: string | null
    slotId?: string | null
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostUserId: string
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    thread?: ChatThreadUncheckedCreateNestedOneWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutApplicationsInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutApplicationsInput, MatchUncheckedCreateWithoutApplicationsInput>
  }

  export type MatchUpsertWithoutApplicationsInput = {
    update: XOR<MatchUpdateWithoutApplicationsInput, MatchUncheckedUpdateWithoutApplicationsInput>
    create: XOR<MatchCreateWithoutApplicationsInput, MatchUncheckedCreateWithoutApplicationsInput>
    where?: MatchWhereInput
  }

  export type MatchUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: MatchWhereInput
    data: XOR<MatchUpdateWithoutApplicationsInput, MatchUncheckedUpdateWithoutApplicationsInput>
  }

  export type MatchUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUser?: UserUpdateOneRequiredWithoutHostedMatchesNestedInput
    venue?: VenueUpdateOneWithoutMatchesNestedInput
    court?: VenueCourtUpdateOneWithoutMatchesNestedInput
    slot?: VenueAvailabilitySlotUpdateOneWithoutMatchesNestedInput
    thread?: ChatThreadUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    venueId?: NullableStringFieldUpdateOperationsInput | string | null
    courtId?: NullableStringFieldUpdateOperationsInput | string | null
    slotId?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostUserId?: StringFieldUpdateOperationsInput | string
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    thread?: ChatThreadUncheckedUpdateOneWithoutMatchNestedInput
  }

  export type MatchCreateWithoutThreadInput = {
    id?: string
    title: string
    venueName: string
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    hostUser: UserCreateNestedOneWithoutHostedMatchesInput
    venue?: VenueCreateNestedOneWithoutMatchesInput
    court?: VenueCourtCreateNestedOneWithoutMatchesInput
    slot?: VenueAvailabilitySlotCreateNestedOneWithoutMatchesInput
    applications?: MatchApplicationCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutThreadInput = {
    id?: string
    title: string
    venueName: string
    venueId?: string | null
    courtId?: string | null
    slotId?: string | null
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostUserId: string
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
    applications?: MatchApplicationUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutThreadInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutThreadInput, MatchUncheckedCreateWithoutThreadInput>
  }

  export type ChatThreadParticipantCreateWithoutThreadInput = {
    id?: string
    role: string
    joinedAt?: Date | string
    lastReadAt?: Date | string | null
    checkedInAt?: Date | string | null
    user: UserCreateNestedOneWithoutThreadMembershipInput
  }

  export type ChatThreadParticipantUncheckedCreateWithoutThreadInput = {
    id?: string
    userId: string
    role: string
    joinedAt?: Date | string
    lastReadAt?: Date | string | null
    checkedInAt?: Date | string | null
  }

  export type ChatThreadParticipantCreateOrConnectWithoutThreadInput = {
    where: ChatThreadParticipantWhereUniqueInput
    create: XOR<ChatThreadParticipantCreateWithoutThreadInput, ChatThreadParticipantUncheckedCreateWithoutThreadInput>
  }

  export type ChatThreadParticipantCreateManyThreadInputEnvelope = {
    data: ChatThreadParticipantCreateManyThreadInput | ChatThreadParticipantCreateManyThreadInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutThreadInput = {
    id?: string
    userId: string
    kind: string
    title: string
    content: string
    senderId?: string | null
    senderName?: string | null
    isRead?: boolean
    status?: string | null
    matchId?: string | null
    createdAt?: Date | string
  }

  export type MessageUncheckedCreateWithoutThreadInput = {
    id?: string
    userId: string
    kind: string
    title: string
    content: string
    senderId?: string | null
    senderName?: string | null
    isRead?: boolean
    status?: string | null
    matchId?: string | null
    createdAt?: Date | string
  }

  export type MessageCreateOrConnectWithoutThreadInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutThreadInput, MessageUncheckedCreateWithoutThreadInput>
  }

  export type MessageCreateManyThreadInputEnvelope = {
    data: MessageCreateManyThreadInput | MessageCreateManyThreadInput[]
    skipDuplicates?: boolean
  }

  export type MatchUpsertWithoutThreadInput = {
    update: XOR<MatchUpdateWithoutThreadInput, MatchUncheckedUpdateWithoutThreadInput>
    create: XOR<MatchCreateWithoutThreadInput, MatchUncheckedCreateWithoutThreadInput>
    where?: MatchWhereInput
  }

  export type MatchUpdateToOneWithWhereWithoutThreadInput = {
    where?: MatchWhereInput
    data: XOR<MatchUpdateWithoutThreadInput, MatchUncheckedUpdateWithoutThreadInput>
  }

  export type MatchUpdateWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUser?: UserUpdateOneRequiredWithoutHostedMatchesNestedInput
    venue?: VenueUpdateOneWithoutMatchesNestedInput
    court?: VenueCourtUpdateOneWithoutMatchesNestedInput
    slot?: VenueAvailabilitySlotUpdateOneWithoutMatchesNestedInput
    applications?: MatchApplicationUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    venueId?: NullableStringFieldUpdateOperationsInput | string | null
    courtId?: NullableStringFieldUpdateOperationsInput | string | null
    slotId?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostUserId?: StringFieldUpdateOperationsInput | string
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: MatchApplicationUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type ChatThreadParticipantUpsertWithWhereUniqueWithoutThreadInput = {
    where: ChatThreadParticipantWhereUniqueInput
    update: XOR<ChatThreadParticipantUpdateWithoutThreadInput, ChatThreadParticipantUncheckedUpdateWithoutThreadInput>
    create: XOR<ChatThreadParticipantCreateWithoutThreadInput, ChatThreadParticipantUncheckedCreateWithoutThreadInput>
  }

  export type ChatThreadParticipantUpdateWithWhereUniqueWithoutThreadInput = {
    where: ChatThreadParticipantWhereUniqueInput
    data: XOR<ChatThreadParticipantUpdateWithoutThreadInput, ChatThreadParticipantUncheckedUpdateWithoutThreadInput>
  }

  export type ChatThreadParticipantUpdateManyWithWhereWithoutThreadInput = {
    where: ChatThreadParticipantScalarWhereInput
    data: XOR<ChatThreadParticipantUpdateManyMutationInput, ChatThreadParticipantUncheckedUpdateManyWithoutThreadInput>
  }

  export type MessageUpsertWithWhereUniqueWithoutThreadInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutThreadInput, MessageUncheckedUpdateWithoutThreadInput>
    create: XOR<MessageCreateWithoutThreadInput, MessageUncheckedCreateWithoutThreadInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutThreadInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutThreadInput, MessageUncheckedUpdateWithoutThreadInput>
  }

  export type MessageUpdateManyWithWhereWithoutThreadInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutThreadInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    userId?: StringFilter<"Message"> | string
    kind?: StringFilter<"Message"> | string
    title?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    senderId?: StringNullableFilter<"Message"> | string | null
    senderName?: StringNullableFilter<"Message"> | string | null
    isRead?: BoolFilter<"Message"> | boolean
    status?: StringNullableFilter<"Message"> | string | null
    matchId?: StringNullableFilter<"Message"> | string | null
    threadId?: StringNullableFilter<"Message"> | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
  }

  export type ChatThreadCreateWithoutParticipantsInput = {
    id?: string
    title: string
    venueName: string
    scheduledAt: Date | string
    hostUserId: string
    status?: string
    latestMessagePreview: string
    latestMessageAt: Date | string
    lastMessageSenderId?: string | null
    lastMessageSenderName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    match: MatchCreateNestedOneWithoutThreadInput
    messages?: MessageCreateNestedManyWithoutThreadInput
  }

  export type ChatThreadUncheckedCreateWithoutParticipantsInput = {
    id?: string
    matchId: string
    title: string
    venueName: string
    scheduledAt: Date | string
    hostUserId: string
    status?: string
    latestMessagePreview: string
    latestMessageAt: Date | string
    lastMessageSenderId?: string | null
    lastMessageSenderName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutThreadInput
  }

  export type ChatThreadCreateOrConnectWithoutParticipantsInput = {
    where: ChatThreadWhereUniqueInput
    create: XOR<ChatThreadCreateWithoutParticipantsInput, ChatThreadUncheckedCreateWithoutParticipantsInput>
  }

  export type UserCreateWithoutThreadMembershipInput = {
    id?: string
    phone?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    nickname: string
    city: string
    level: string
    creditScore?: number
    createdAt?: Date | string
    hostedMatches?: MatchCreateNestedManyWithoutHostUserInput
  }

  export type UserUncheckedCreateWithoutThreadMembershipInput = {
    id?: string
    phone?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    nickname: string
    city: string
    level: string
    creditScore?: number
    createdAt?: Date | string
    hostedMatches?: MatchUncheckedCreateNestedManyWithoutHostUserInput
  }

  export type UserCreateOrConnectWithoutThreadMembershipInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutThreadMembershipInput, UserUncheckedCreateWithoutThreadMembershipInput>
  }

  export type ChatThreadUpsertWithoutParticipantsInput = {
    update: XOR<ChatThreadUpdateWithoutParticipantsInput, ChatThreadUncheckedUpdateWithoutParticipantsInput>
    create: XOR<ChatThreadCreateWithoutParticipantsInput, ChatThreadUncheckedCreateWithoutParticipantsInput>
    where?: ChatThreadWhereInput
  }

  export type ChatThreadUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: ChatThreadWhereInput
    data: XOR<ChatThreadUpdateWithoutParticipantsInput, ChatThreadUncheckedUpdateWithoutParticipantsInput>
  }

  export type ChatThreadUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestMessagePreview?: StringFieldUpdateOperationsInput | string
    latestMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageSenderId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageSenderName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutThreadNestedInput
    messages?: MessageUpdateManyWithoutThreadNestedInput
  }

  export type ChatThreadUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestMessagePreview?: StringFieldUpdateOperationsInput | string
    latestMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageSenderId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageSenderName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutThreadNestedInput
  }

  export type UserUpsertWithoutThreadMembershipInput = {
    update: XOR<UserUpdateWithoutThreadMembershipInput, UserUncheckedUpdateWithoutThreadMembershipInput>
    create: XOR<UserCreateWithoutThreadMembershipInput, UserUncheckedCreateWithoutThreadMembershipInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutThreadMembershipInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutThreadMembershipInput, UserUncheckedUpdateWithoutThreadMembershipInput>
  }

  export type UserUpdateWithoutThreadMembershipInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    creditScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostedMatches?: MatchUpdateManyWithoutHostUserNestedInput
  }

  export type UserUncheckedUpdateWithoutThreadMembershipInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    creditScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostedMatches?: MatchUncheckedUpdateManyWithoutHostUserNestedInput
  }

  export type ChatThreadCreateWithoutMessagesInput = {
    id?: string
    title: string
    venueName: string
    scheduledAt: Date | string
    hostUserId: string
    status?: string
    latestMessagePreview: string
    latestMessageAt: Date | string
    lastMessageSenderId?: string | null
    lastMessageSenderName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    match: MatchCreateNestedOneWithoutThreadInput
    participants?: ChatThreadParticipantCreateNestedManyWithoutThreadInput
  }

  export type ChatThreadUncheckedCreateWithoutMessagesInput = {
    id?: string
    matchId: string
    title: string
    venueName: string
    scheduledAt: Date | string
    hostUserId: string
    status?: string
    latestMessagePreview: string
    latestMessageAt: Date | string
    lastMessageSenderId?: string | null
    lastMessageSenderName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ChatThreadParticipantUncheckedCreateNestedManyWithoutThreadInput
  }

  export type ChatThreadCreateOrConnectWithoutMessagesInput = {
    where: ChatThreadWhereUniqueInput
    create: XOR<ChatThreadCreateWithoutMessagesInput, ChatThreadUncheckedCreateWithoutMessagesInput>
  }

  export type ChatThreadUpsertWithoutMessagesInput = {
    update: XOR<ChatThreadUpdateWithoutMessagesInput, ChatThreadUncheckedUpdateWithoutMessagesInput>
    create: XOR<ChatThreadCreateWithoutMessagesInput, ChatThreadUncheckedCreateWithoutMessagesInput>
    where?: ChatThreadWhereInput
  }

  export type ChatThreadUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ChatThreadWhereInput
    data: XOR<ChatThreadUpdateWithoutMessagesInput, ChatThreadUncheckedUpdateWithoutMessagesInput>
  }

  export type ChatThreadUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestMessagePreview?: StringFieldUpdateOperationsInput | string
    latestMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageSenderId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageSenderName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutThreadNestedInput
    participants?: ChatThreadParticipantUpdateManyWithoutThreadNestedInput
  }

  export type ChatThreadUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestMessagePreview?: StringFieldUpdateOperationsInput | string
    latestMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageSenderId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageSenderName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ChatThreadParticipantUncheckedUpdateManyWithoutThreadNestedInput
  }

  export type MatchCreateManyHostUserInput = {
    id?: string
    title: string
    venueName: string
    venueId?: string | null
    courtId?: string | null
    slotId?: string | null
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
  }

  export type ChatThreadParticipantCreateManyUserInput = {
    id?: string
    threadId: string
    role: string
    joinedAt?: Date | string
    lastReadAt?: Date | string | null
    checkedInAt?: Date | string | null
  }

  export type MatchUpdateWithoutHostUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: VenueUpdateOneWithoutMatchesNestedInput
    court?: VenueCourtUpdateOneWithoutMatchesNestedInput
    slot?: VenueAvailabilitySlotUpdateOneWithoutMatchesNestedInput
    applications?: MatchApplicationUpdateManyWithoutMatchNestedInput
    thread?: ChatThreadUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutHostUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    venueId?: NullableStringFieldUpdateOperationsInput | string | null
    courtId?: NullableStringFieldUpdateOperationsInput | string | null
    slotId?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: MatchApplicationUncheckedUpdateManyWithoutMatchNestedInput
    thread?: ChatThreadUncheckedUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutHostUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    venueId?: NullableStringFieldUpdateOperationsInput | string | null
    courtId?: NullableStringFieldUpdateOperationsInput | string | null
    slotId?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatThreadParticipantUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    thread?: ChatThreadUpdateOneRequiredWithoutParticipantsNestedInput
  }

  export type ChatThreadParticipantUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatThreadParticipantUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VenueCourtCreateManyVenueInput = {
    id?: string
    name: string
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VenueAvailabilitySlotCreateManyVenueInput = {
    id?: string
    label: string
    startTime: number
    endTime: number
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchCreateManyVenueInput = {
    id?: string
    title: string
    venueName: string
    courtId?: string | null
    slotId?: string | null
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostUserId: string
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
  }

  export type VenueCourtUpdateWithoutVenueInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matches?: MatchUpdateManyWithoutCourtNestedInput
  }

  export type VenueCourtUncheckedUpdateWithoutVenueInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matches?: MatchUncheckedUpdateManyWithoutCourtNestedInput
  }

  export type VenueCourtUncheckedUpdateManyWithoutVenueInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VenueAvailabilitySlotUpdateWithoutVenueInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    startTime?: IntFieldUpdateOperationsInput | number
    endTime?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matches?: MatchUpdateManyWithoutSlotNestedInput
  }

  export type VenueAvailabilitySlotUncheckedUpdateWithoutVenueInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    startTime?: IntFieldUpdateOperationsInput | number
    endTime?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matches?: MatchUncheckedUpdateManyWithoutSlotNestedInput
  }

  export type VenueAvailabilitySlotUncheckedUpdateManyWithoutVenueInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    startTime?: IntFieldUpdateOperationsInput | number
    endTime?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchUpdateWithoutVenueInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUser?: UserUpdateOneRequiredWithoutHostedMatchesNestedInput
    court?: VenueCourtUpdateOneWithoutMatchesNestedInput
    slot?: VenueAvailabilitySlotUpdateOneWithoutMatchesNestedInput
    applications?: MatchApplicationUpdateManyWithoutMatchNestedInput
    thread?: ChatThreadUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutVenueInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    courtId?: NullableStringFieldUpdateOperationsInput | string | null
    slotId?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostUserId?: StringFieldUpdateOperationsInput | string
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: MatchApplicationUncheckedUpdateManyWithoutMatchNestedInput
    thread?: ChatThreadUncheckedUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutVenueInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    courtId?: NullableStringFieldUpdateOperationsInput | string | null
    slotId?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostUserId?: StringFieldUpdateOperationsInput | string
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCreateManyCourtInput = {
    id?: string
    title: string
    venueName: string
    venueId?: string | null
    slotId?: string | null
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostUserId: string
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
  }

  export type MatchUpdateWithoutCourtInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUser?: UserUpdateOneRequiredWithoutHostedMatchesNestedInput
    venue?: VenueUpdateOneWithoutMatchesNestedInput
    slot?: VenueAvailabilitySlotUpdateOneWithoutMatchesNestedInput
    applications?: MatchApplicationUpdateManyWithoutMatchNestedInput
    thread?: ChatThreadUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutCourtInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    venueId?: NullableStringFieldUpdateOperationsInput | string | null
    slotId?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostUserId?: StringFieldUpdateOperationsInput | string
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: MatchApplicationUncheckedUpdateManyWithoutMatchNestedInput
    thread?: ChatThreadUncheckedUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutCourtInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    venueId?: NullableStringFieldUpdateOperationsInput | string | null
    slotId?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostUserId?: StringFieldUpdateOperationsInput | string
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCreateManySlotInput = {
    id?: string
    title: string
    venueName: string
    venueId?: string | null
    courtId?: string | null
    startTime: Date | string
    city: string
    level: string
    maxPlayers: number
    openSlots: number
    status?: string
    checkInCode?: string | null
    hostUserId: string
    hostCreditScore: number
    distanceKm: number
    matchRate: number
    createdAt?: Date | string
  }

  export type MatchUpdateWithoutSlotInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hostUser?: UserUpdateOneRequiredWithoutHostedMatchesNestedInput
    venue?: VenueUpdateOneWithoutMatchesNestedInput
    court?: VenueCourtUpdateOneWithoutMatchesNestedInput
    applications?: MatchApplicationUpdateManyWithoutMatchNestedInput
    thread?: ChatThreadUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutSlotInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    venueId?: NullableStringFieldUpdateOperationsInput | string | null
    courtId?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostUserId?: StringFieldUpdateOperationsInput | string
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: MatchApplicationUncheckedUpdateManyWithoutMatchNestedInput
    thread?: ChatThreadUncheckedUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutSlotInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    venueName?: StringFieldUpdateOperationsInput | string
    venueId?: NullableStringFieldUpdateOperationsInput | string | null
    courtId?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    openSlots?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    checkInCode?: NullableStringFieldUpdateOperationsInput | string | null
    hostUserId?: StringFieldUpdateOperationsInput | string
    hostCreditScore?: IntFieldUpdateOperationsInput | number
    distanceKm?: FloatFieldUpdateOperationsInput | number
    matchRate?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchApplicationCreateManyMatchInput = {
    id?: string
    userId: string
    status: string
    decisionReason?: string | null
    createdAt?: Date | string
  }

  export type MatchApplicationUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    decisionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchApplicationUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    decisionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchApplicationUncheckedUpdateManyWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    decisionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatThreadParticipantCreateManyThreadInput = {
    id?: string
    userId: string
    role: string
    joinedAt?: Date | string
    lastReadAt?: Date | string | null
    checkedInAt?: Date | string | null
  }

  export type MessageCreateManyThreadInput = {
    id?: string
    userId: string
    kind: string
    title: string
    content: string
    senderId?: string | null
    senderName?: string | null
    isRead?: boolean
    status?: string | null
    matchId?: string | null
    createdAt?: Date | string
  }

  export type ChatThreadParticipantUpdateWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutThreadMembershipNestedInput
  }

  export type ChatThreadParticipantUncheckedUpdateWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatThreadParticipantUncheckedUpdateManyWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkedInAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageUpdateWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: NullableStringFieldUpdateOperationsInput | string | null
    senderName?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    status?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: NullableStringFieldUpdateOperationsInput | string | null
    senderName?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    status?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: NullableStringFieldUpdateOperationsInput | string | null
    senderName?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    status?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}