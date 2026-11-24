import 'server-only';
import { createCallerFactory } from './trpc';
import { appRouter } from './routers/_app';

export const api = createCallerFactory(appRouter)({});