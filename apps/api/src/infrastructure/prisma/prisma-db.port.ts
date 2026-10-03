import { PrismaClient } from './generated';

export type PrismaDb = PrismaClient;

export const IPrismaDb = Symbol('IPrismaDb');
