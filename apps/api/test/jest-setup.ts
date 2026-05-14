// e2e suites bootstrap the full Nest module graph (Throttler + Redis client +
// Prisma) which can take longer than Jest's 5s default hook timeout when many
// suites run back-to-back. Bump the global timeout once here.
jest.setTimeout(30_000);
