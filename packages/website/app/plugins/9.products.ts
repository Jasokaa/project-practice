import { createTRPCNuxtClient } from "trpc-nuxt/client";
import type { AppRouter } from "~~/server/trpc/routers";

export default defineNuxtPlugin((nuxtApp) => {
	const { $trpc } = nuxtApp as typeof nuxtApp & {
		$trpc: ReturnType<typeof createTRPCNuxtClient<AppRouter>>;
	};

	const productsQ = $trpc.products.getAll.useQuery();

	const products = computed(() => productsQ.data.value || []);

	return {
		provide: {
			products,
		},
	};
});
