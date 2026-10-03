import { PrismaClient } from './prisma-client';

export type PrismaDb = PrismaClient;

export const IPrismaDb = Symbol('IPrismaDb');
