import { router } from "~~/server/trpc/trpc";
import { ordersRouter } from "./orders";
import { productsRouter } from "./products";

export const appRouter = router({
	orders: ordersRouter,
	products: productsRouter,
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;
