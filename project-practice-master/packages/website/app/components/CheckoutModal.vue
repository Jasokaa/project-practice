<script setup lang="ts">
import { DELIVERY_METHOD_LABELS, type DeliveryMethod } from "~~/shared/orders";

const { $trpc, $toast } = useNuxtApp();
const cartStore = useCartStore();

const isOpen = defineModel<boolean>({ default: false });

const firstName = ref("");
const phone = ref("");
const deliveryMethod = ref<DeliveryMethod>("NOVA_POSHTA");
const deliveryAddress = ref("");
const isSubmitting = ref(false);
const orderResult = ref<{ orderCode: string; total: number } | null>(null);

const deliveryMethods: { value: DeliveryMethod; label: string }[] = [
	{ value: "NOVA_POSHTA", label: DELIVERY_METHOD_LABELS.NOVA_POSHTA },
	{ value: "UKRPOSHTA", label: DELIVERY_METHOD_LABELS.UKRPOSHTA },
	{ value: "PICKUP", label: DELIVERY_METHOD_LABELS.PICKUP },
];

const isFormValid = computed(
	() =>
		firstName.value.trim().length > 0 &&
		phone.value.trim().length >= 4 &&
		deliveryAddress.value.trim().length > 0 &&
		cartStore.items.length > 0
);

const addressLabel = computed(() =>
	deliveryMethod.value === "PICKUP" ? "Pickup note (optional)" : "Delivery address"
);

const submitOrder = async () => {
	if (!isFormValid.value) return;

	isSubmitting.value = true;
	try {
		const result = await $trpc.orders.create.mutate({
			firstName: firstName.value.trim(),
			phone: phone.value.trim(),
			deliveryMethod: deliveryMethod.value,
			deliveryAddress: deliveryAddress.value.trim() || deliveryMethod.value,
			items: cartStore.items.map((item) => ({
				productId: item.id,
				name: item.name,
				quantity: item.quantity,
				unit: item.unit,
				price: item.price,
			})),
		});

		orderResult.value = result;
		cartStore.clearCart();
		$toast.success("Order placed successfully!");
	} catch {
		$toast.error("Failed to place order. Please try again.");
	} finally {
		isSubmitting.value = false;
	}
};

const close = () => {
	isOpen.value = false;
	if (orderResult.value) {
		navigateTo("/order-status");
	}
};

const resetForm = () => {
	firstName.value = "";
	phone.value = "";
	deliveryMethod.value = "NOVA_POSHTA";
	deliveryAddress.value = "";
	orderResult.value = null;
};

watch(isOpen, (val) => {
	if (val) resetForm();
});
</script>

<template>
	<AppModalBase v-model="isOpen" label="Place your order" @close="close">
		<!-- Success state -->
		<div v-if="orderResult" class="w-full md:w-[28rem] pb-2">
			<div class="text-center py-6">
				<div class="text-5xl mb-4">🎉</div>
				<h3 class="text-2xl font-bold text-candyPink-700 mb-2">
					Order placed!
				</h3>
				<p class="text-gray-600 mb-6">
					Your order has been received. Save your order code to track delivery.
				</p>

				<div class="bg-candyYellow-50 border-2 border-candyYellow-300 rounded-xl p-6 mb-6">
					<p class="text-sm text-gray-500 mb-1">Your order code</p>
					<p class="text-3xl font-bold text-candyPink-700 font-mono tracking-wider">
						{{ orderResult.orderCode }}
					</p>
					<p class="text-sm text-gray-600 mt-2">
						Total: {{ orderResult.total }} ₴
					</p>
				</div>

				<div class="space-y-3">
					<NuxtLink
						to="/order-status"
						class="block w-full bg-candyPink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-candyPink-700 transition-colors text-center"
						@click="isOpen = false"
					>
						Track your order
					</NuxtLink>
					<button
						class="w-full bg-candyYellow-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-candyYellow-200 transition-colors"
						@click="close"
					>
						Continue shopping
					</button>
				</div>
			</div>
		</div>

		<!-- Order form -->
		<form v-else class="w-full md:w-[28rem] pb-2" @submit.prevent="submitOrder">
			<div class="space-y-4">
				<!-- Name -->
				<div>
					<label for="checkout-name" class="block text-sm font-medium text-gray-700 mb-1">
						First name
					</label>
					<input
						id="checkout-name"
						v-model="firstName"
						type="text"
						placeholder="Olena"
						class="w-full px-4 py-3 border border-candyYellow-300 rounded-lg focus:ring-2 focus:ring-candyPink-400 focus:border-transparent"
						required
					/>
				</div>

				<!-- Phone -->
				<div>
					<label for="checkout-phone" class="block text-sm font-medium text-gray-700 mb-1">
						Phone number
					</label>
					<input
						id="checkout-phone"
						v-model="phone"
						type="tel"
						placeholder="+380 XX XXX XX XX"
						class="w-full px-4 py-3 border border-candyYellow-300 rounded-lg focus:ring-2 focus:ring-candyPink-400 focus:border-transparent"
						required
					/>
				</div>

				<!-- Delivery method -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Delivery method
					</label>
					<div class="grid grid-cols-3 gap-2">
						<button
							v-for="method in deliveryMethods"
							:key="method.value"
							type="button"
							:class="[
								'px-3 py-2 rounded-lg text-sm font-medium transition-colors border-2',
								deliveryMethod === method.value
									? 'bg-candyPink-600 text-white border-candyPink-600'
									: 'bg-white text-gray-700 border-candyYellow-300 hover:border-candyPink-300',
							]"
							@click="deliveryMethod = method.value"
						>
							{{ method.label }}
						</button>
					</div>
				</div>

				<!-- Address -->
				<div>
					<label for="checkout-address" class="block text-sm font-medium text-gray-700 mb-1">
						{{ addressLabel }}
					</label>
					<input
						id="checkout-address"
						v-model="deliveryAddress"
						type="text"
						:placeholder="
							deliveryMethod === 'PICKUP'
								? 'Any notes for pickup'
								: 'City, branch number or address'
						"
						class="w-full px-4 py-3 border border-candyYellow-300 rounded-lg focus:ring-2 focus:ring-candyPink-400 focus:border-transparent"
						:required="deliveryMethod !== 'PICKUP'"
					/>
				</div>

				<!-- Order summary -->
				<div class="bg-candyYellow-50 rounded-xl p-4">
					<div class="flex justify-between text-sm text-gray-600 mb-1">
						<span>Items</span>
						<span>{{ cartStore.itemCount }}</span>
					</div>
					<div class="flex justify-between font-bold text-candyPink-700 text-lg">
						<span>Total</span>
						<span>{{ cartStore.totalPrice }} ₴</span>
					</div>
				</div>
			</div>

			<button
				type="submit"
				class="w-full mt-6 bg-candyPink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-candyPink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				:disabled="!isFormValid || isSubmitting"
			>
				{{ isSubmitting ? "Placing order..." : "Confirm order" }}
			</button>

			<p class="text-xs text-gray-500 mt-3 text-center">
				We will contact you to confirm the order details and payment.
			</p>
		</form>
	</AppModalBase>
</template>
