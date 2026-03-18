import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { createOrder, findOrderStatus } from "~~/server/repositories/orders";

export const ordersRouter = router({
	getStatus: publicProcedure
		.input(
			z.object({
				orderCode: z.string().min(1).max(64),
				phone: z.string().min(4).max(32),
			})
		)
		.query(({ input }) => {
			const orderStatus = findOrderStatus({
				orderCode: input.orderCode,
				phone: input.phone,
			});

			if (!orderStatus) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Order not found",
				});
			}

			return orderStatus;
		}),

	create: publicProcedure
		.input(
			z.object({
				firstName: z.string().min(1).max(100),
				phone: z.string().min(4).max(32),
				deliveryMethod: z.enum(["NOVA_POSHTA", "UKRPOSHTA", "PICKUP"]),
				deliveryAddress: z.string().min(1).max(500),
				items: z
					.array(
						z.object({
							productId: z.string(),
							name: z.string(),
							quantity: z.number().int().min(1),
							unit: z.string(),
							price: z.number().min(0),
						})
					)
					.min(1),
			})
		)
		.mutation(({ input }) => {
			return createOrder(input);
		}),
});
