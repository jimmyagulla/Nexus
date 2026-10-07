import { PrismaClient } from './prisma-client';

export const IPrismaDb = Symbol('IPrismaDb');

export type PrismaDb = PrismaClient;
