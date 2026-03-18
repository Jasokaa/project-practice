<script setup lang="ts">
import { TRPCClientError } from "@trpc/client";
import {
	DELIVERY_METHOD_LABELS,
	FINAL_ORDER_STATES,
	ORDER_STATE_LABELS,
	type OrderState,
	type OrderStatusResponse,
} from "~~/shared/orders";

const config = useRuntimeConfig();
const { $trpc } = useNuxtApp();

const orderCode = ref("");
const phone = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const order = ref<OrderStatusResponse | null>(null);

const statusClasses: Record<OrderState, string> = {
	RECEIVED: "bg-candyYellow-100 text-candyPink-700",
	CONFIRMED: "bg-candyBlue-100 text-candyBlue-800",
	PACKING: "bg-candyOrange-100 text-candyOrange-800",
	SHIPPED: "bg-candyBlue-200 text-candyBlue-900",
	DELIVERED: "bg-candyGreen-100 text-candyGreen-800",
	CANCELED: "bg-red-100 text-red-700",
};

const hasSubmitted = computed(() => isLoading.value || !!order.value || !!errorMessage.value);
const isFinalState = computed(() =>
	order.value ? FINAL_ORDER_STATES.includes(order.value.currentState) : false
);
const supportMessage = computed(() =>
	order.value
		? `Hello! Please help me with order ${order.value.orderCode}.`
		: "Hello! Please help me check my order status."
);

const formatDateTime = (date: string) =>
	new Date(date).toLocaleString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

const submitLookup = async () => {
	errorMessage.value = "";
	order.value = null;

	if (!orderCode.value.trim() || !phone.value.trim()) {
		errorMessage.value = "Enter your order code and phone number.";
		return;
	}

	isLoading.value = true;
	try {
		order.value = await $trpc.orders.getStatus.query({
			orderCode: orderCode.value,
			phone: phone.value,
		});
	} catch (error) {
		if (error instanceof TRPCClientError && error.data?.code === "NOT_FOUND") {
			errorMessage.value =
				"Order not found. Check your order code and phone number and try again.";
		} else {
			errorMessage.value =
				"We could not check your order status right now. Please try again later.";
		}
	} finally {
		isLoading.value = false;
	}
};

useHeadSafe({
	title: `Order Status - ${config.public.STORE_NAME}`,
	meta: [
		{
			name: "description",
			content:
				"Track your Jellylicious order status by order code and phone number. See current state, timeline updates, and delivery details.",
		},
	],
});
</script>

<template>
	<div class="min-h-screen bg-candyYellow-50">
		<section class="py-12 md:py-16">
			<div class="max-w-screen-xl mx-auto px-4">
				<h1 class="text-4xl md:text-5xl font-bold text-candyPink-700 mb-4">
					Order status
				</h1>
				<p class="text-gray-700 max-w-3xl mb-8">
					Enter your order code and phone number to check your latest order progress.
				</p>

				<div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
					<form
						class="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end"
						@submit.prevent="submitLookup"
					>
						<div>
							<label
								for="order-code"
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Order code
							</label>
							<input
								id="order-code"
								v-model="orderCode"
								type="text"
								placeholder="JL-2026-0001"
								class="w-full px-4 py-3 border border-candyYellow-300 rounded-lg focus:ring-2 focus:ring-candyPink-400 focus:border-transparent"
							/>
						</div>

						<div>
							<label
								for="phone"
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Phone number
							</label>
							<input
								id="phone"
								v-model="phone"
								type="tel"
								placeholder="+380 XX XXX XX XX"
								class="w-full px-4 py-3 border border-candyYellow-300 rounded-lg focus:ring-2 focus:ring-candyPink-400 focus:border-transparent"
							/>
						</div>

						<button
							type="submit"
							class="bg-candyPink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-candyPink-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
							:disabled="isLoading"
						>
							{{ isLoading ? "Checking..." : "Check status" }}
						</button>
					</form>

					<p class="text-xs text-gray-500 mt-3">
						Use the same phone number you used when placing the order.
					</p>
				</div>

				<div
					v-if="errorMessage"
					class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-8"
				>
					{{ errorMessage }}
				</div>

				<div
					v-else-if="order"
					class="grid lg:grid-cols-[1.25fr_1fr] gap-8"
				>
					<div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
						<div class="flex items-center justify-between gap-4 flex-wrap mb-6">
							<div>
								<p class="text-sm text-gray-500">Order</p>
								<p class="text-2xl font-bold text-candyPink-700">
									{{ order.orderCode }}
								</p>
							</div>
							<span
								:class="[
									'inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold',
									statusClasses[order.currentState],
								]"
							>
								{{ ORDER_STATE_LABELS[order.currentState] }}
							</span>
						</div>

						<div class="grid sm:grid-cols-2 gap-4 mb-8">
							<div class="bg-candyYellow-50 rounded-xl p-4">
								<p class="text-sm text-gray-500 mb-1">Recipient</p>
								<p class="font-semibold text-gray-800">
									{{ order.recipientFirstName }}
								</p>
								<p class="text-sm text-gray-600">{{ order.maskedPhone }}</p>
							</div>
							<div class="bg-candyYellow-50 rounded-xl p-4">
								<p class="text-sm text-gray-500 mb-1">Delivery method</p>
								<p class="font-semibold text-gray-800">
									{{ DELIVERY_METHOD_LABELS[order.deliveryMethod] }}
								</p>
								<p class="text-sm text-gray-600">
									Total: {{ order.total }} {{ order.currency }}
								</p>
							</div>
						</div>

						<h2 class="text-xl font-semibold text-candyPink-700 mb-4">
							Status timeline
						</h2>
						<ol class="space-y-4">
							<li
								v-for="(event, index) in order.events"
								:key="`${event.state}-${event.at}`"
								class="flex gap-4"
							>
								<div class="flex flex-col items-center">
									<span
										class="w-3 h-3 rounded-full bg-candyPink-500 mt-1"
									/>
									<span
										v-if="index < order.events.length - 1"
										class="w-px h-full bg-candyYellow-300"
									/>
								</div>
								<div class="pb-3">
									<p class="font-semibold text-gray-800">
										{{ ORDER_STATE_LABELS[event.state] }}
									</p>
									<p class="text-sm text-gray-600">
										{{ formatDateTime(event.at) }}
									</p>
									<p v-if="event.note" class="text-sm text-gray-500 mt-1">
										{{ event.note }}
									</p>
								</div>
							</li>
						</ol>
					</div>

					<div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 h-fit">
						<h2 class="text-xl font-semibold text-candyPink-700 mb-4">
							Order items
						</h2>
						<div class="space-y-3">
							<div
								v-for="(item, index) in order.items"
								:key="`${item.name}-${item.unit}-${index}`"
								class="bg-candyYellow-50 rounded-xl p-4"
							>
								<p class="font-semibold text-gray-800">{{ item.name }}</p>
								<p class="text-sm text-gray-600">
									{{ item.quantity }} {{ item.unit }}
								</p>
								<p class="text-sm font-semibold text-candyPink-700">
									{{ item.lineTotal }} {{ order.currency }}
								</p>
							</div>
						</div>

						<div
							v-if="!isFinalState"
							class="mt-6 pt-6 border-t border-candyYellow-200 space-y-3"
						>
							<p class="text-sm text-gray-600">
								Need help with this order? Contact support and include your order
								code.
							</p>
							<a
								:href="`tel:${config.public.CONTACT.phone}`"
								class="w-full bg-candyPink-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-candyPink-800 transition-colors flex items-center justify-center"
							>
								Call support
							</a>
							<a
								:href="`https://t.me/${config.public.CONTACT.telegram.replace('@', '')}?text=${encodeURIComponent(supportMessage)}`"
								target="_blank"
								class="w-full bg-candyBlue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-candyBlue-800 transition-colors flex items-center justify-center"
							>
								Message on Telegram
							</a>
						</div>
					</div>
				</div>

				<div
					v-else-if="!hasSubmitted"
					class="bg-white rounded-2xl shadow-sm border border-candyYellow-200 p-6 text-gray-600"
				>
					Enter your lookup details above to view your current order status and
					delivery progress.
				</div>
			</div>
		</section>
	</div>
</template>
