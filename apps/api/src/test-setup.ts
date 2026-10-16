import 'reflect-metadata';

// The generated Prisma client loads the workspace `.env` when it is imported.
// Pin the persistence mode first so that a developer's `.env` never decides
// which modules the specs compile (dotenv does not override a set variable).
process.env.PERSISTENCE = 'memory';
