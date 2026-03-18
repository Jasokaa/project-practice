import { initTRPC, TRPCError } from "@trpc/server";
import type { H3Event } from "h3";

const t = initTRPC.context().create();

export const publicProcedure = t.procedure;

export const router = t.router;
export const middleware = t.middleware;
