import { createTRPCNuxtHandler } from "trpc-nuxt/server";
import { appRouter } from "~~/server/trpc/routers";
import type { H3Event } from "h3";

export default createTRPCNuxtHandler({
	router: appRouter,
	createContext: async (event: H3Event) => {
		return { event };
	},
});
