<script setup lang="ts">
const config = useRuntimeConfig();
const cartStore = useCartStore();

// Load cart on page mount
onMounted(() => {
	cartStore.loadCart();
});

useHeadSafe({
	title: `Cart - ${config.public.STORE_NAME}`,
	meta: [
		{
			name: "description",
			content: `Your shopping cart at ${config.public.STORE_NAME}. Review your gummy candies, chewy sweets and jelly treats before placing your order.`,
		},
	],
});

const orderMessage = computed(() => cartStore.getOrderSummary());

const showCheckout = ref(false);
</script>

<template>
	<div class="min-h-screen bg-candyYellow-50">
		<!-- Breadcrumbs -->
		<nav class="bg-white border-b border-candyYellow-200 py-4">
			<div class="max-w-screen-xl mx-auto px-4">
				<div class="flex items-center space-x-2 text-sm text-gray-600">
					<NuxtLink to="/" class="hover:text-candyPink-600">
						Home
					</NuxtLink>
					<span>/</span>
					<span class="text-candyPink-600 font-medium">Cart</span>
				</div>
			</div>
		</nav>

		<!-- Cart Content -->
		<section class="py-12">
			<div class="max-w-screen-xl mx-auto px-4">
				<h1 class="text-4xl font-bold text-candyPink-700 mb-8">
					Your cart
				</h1>

				<!-- Empty Cart -->
				<div v-if="cartStore.isEmpty" class="text-center py-16">
					<div class="text-6xl mb-6">🛒</div>
					<h2 class="text-2xl font-semibold text-gray-700 mb-4">
						Your cart is empty
					</h2>
					<p class="text-gray-500 mb-8">
						Add some sweet treats from our catalog
					</p>
					<NuxtLink
						to="/catalog"
						class="bg-candyPink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-candyPink-700 transition-colors inline-block"
					>
						Go to catalog
					</NuxtLink>
				</div>

				<!-- Cart Items -->
				<div v-else class="flex flex-col lg:grid lg:grid-cols-3 gap-8">
					<!-- Items List -->
					<div class="lg:col-span-2 space-y-4 order-2 lg:order-1">
						<div
							v-for="item in cartStore.items"
							:key="item.id"
							class="bg-white p-4 md:p-6 rounded-xl shadow-lg"
						>
							<div
								class="flex flex-col sm:flex-row items-start sm:items-center gap-4"
							>
								<!-- Product Image -->
								<div class="flex-shrink-0">
									<NuxtPicture
										:src="item.image"
										:alt="item.name"
										width="80"
										height="80"
										class="flex w-20 h-20 flex-shrink-0 object-cover rounded-lg overflow-hidden relative"
										:placeholder="`[80x80] ${item.name}`"
									/>
								</div>

								<!-- Product Info -->
								<div class="flex-1 min-w-0">
									<NuxtLink :to="`/product/${item.id}`">
										<h3
											class="font-semibold text-lg text-candyPink-700"
										>
											{{ item.name }}
										</h3>
									</NuxtLink>
									<p
										class="text-gray-600 text-sm sm:text-base"
									>
										{{ item.variety }}
									</p>
									<p class="text-candyPink-600 font-semibold">
										{{ item.price }} ₴/{{ item.unit }}
									</p>
								</div>

								<!-- Mobile: Quantity + Total -->
								<div
									class="flex flex-col sm:hidden gap-3 w-full"
								>
									<div
										class="flex items-center justify-between"
									>
										<span class="text-gray-600 text-sm">
											Quantity:
										</span>
										<div class="flex items-center gap-2">
											<div
												class="flex items-center border-2 border-candyYellow-300 rounded-lg"
											>
												<button
													@click="
														cartStore.updateQuantity(
															item.id,
															item.quantity - 1
														)
													"
													class="px-2 py-1 hover:bg-candyYellow-100 transition-colors"
													:disabled="
														item.quantity <= 1
													"
												>
													−
												</button>
												<input
													:value="item.quantity"
													@input="
														cartStore.updateQuantity(
															item.id,
															parseInt(
																(
																	$event.target as HTMLInputElement
																).value
															) || 1
														)
													"
													type="number"
													min="1"
													class="w-12 px-1 py-1 text-center border-none focus:ring-0 text-sm"
												/>
												<button
													@click="
														cartStore.updateQuantity(
															item.id,
															item.quantity + 1
														)
													"
													class="px-2 py-1 hover:bg-candyYellow-100 transition-colors"
												>
													+
												</button>
											</div>
											<span
												class="text-gray-600 text-sm"
											>
												{{ item.unit }}
											</span>
										</div>
									</div>

									<div
										class="flex items-center justify-between"
									>
										<div
											class="text-lg font-bold text-candyPink-600"
										>
											{{ item.price * item.quantity }} ₴
										</div>
										<button
											@click="
												cartStore.removeItem(item.id)
											"
											class="text-red-500 hover:text-red-700 text-sm"
										>
											Remove
										</button>
									</div>
								</div>

								<!-- Desktop: Quantity Controls -->
								<div class="hidden sm:flex items-center gap-3">
									<div
										class="flex items-center border-2 border-candyYellow-300 rounded-lg"
									>
										<button
											@click="
												cartStore.updateQuantity(
													item.id,
													item.quantity - 1
												)
											"
											class="px-3 py-2 hover:bg-candyYellow-100 transition-colors"
											:disabled="item.quantity <= 1"
										>
											−
										</button>
										<input
											:value="item.quantity"
											@input="
												cartStore.updateQuantity(
													item.id,
													parseInt(
														(
															$event.target as HTMLInputElement
														).value
													) || 1
												)
											"
											type="number"
											min="1"
											class="w-16 px-2 py-2 text-center border-none focus:ring-0"
										/>
										<button
											@click="
												cartStore.updateQuantity(
													item.id,
													item.quantity + 1
												)
											"
											class="px-3 py-2 hover:bg-candyYellow-100 transition-colors"
										>
											+
										</button>
									</div>
									<span class="text-gray-600 text-sm">
										{{ item.unit }}
									</span>
								</div>

								<!-- Desktop: Item Total -->
								<div class="hidden sm:block text-right">
									<div
										class="text-xl font-bold text-candyPink-600"
									>
										{{ item.price * item.quantity }} ₴
									</div>
									<button
										@click="cartStore.removeItem(item.id)"
										class="text-red-500 hover:text-red-700 text-sm mt-1"
									>
										Remove
									</button>
								</div>
							</div>
						</div>

						<!-- Clear Cart Button -->
						<div class="pt-4">
							<button
								@click="cartStore.clearCart()"
								class="text-red-500 hover:text-red-700 font-medium"
							>
								🗑️ Clear cart
							</button>
						</div>
					</div>

					<!-- Order Summary -->
					<div class="lg:col-span-1 order-1 lg:order-2">
						<div
							class="bg-white p-4 md:p-6 rounded-xl shadow-lg lg:sticky lg:top-6"
						>
							<h3
								class="text-xl font-semibold text-candyPink-700 mb-4"
							>
								Order summary
							</h3>

							<div class="flex justify-between mb-2">
								<span class="text-gray-600">Items:</span>
								<span class="font-medium">
									{{ cartStore.itemCount }}
								</span>
							</div>

							<div
								class="flex justify-between text-xl font-bold text-candyPink-600 pt-4 border-t border-candyYellow-200"
							>
								<span>Total:</span>
								<span>{{ cartStore.totalPrice }} ₴</span>
							</div>

							<div class="mt-6 space-y-3">
								<button
									@click="showCheckout = true"
									class="w-full bg-candyPink-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-candyPink-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
								>
									🛒 Place order
								</button>

								<div class="relative flex items-center">
									<div class="flex-grow border-t border-candyYellow-300"></div>
									<span class="mx-3 text-xs text-gray-400">or contact us</span>
									<div class="flex-grow border-t border-candyYellow-300"></div>
								</div>

								<a
									:href="`tel:${config.public.CONTACT.phone}`"
									class="w-full bg-candyPink-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-candyPink-800 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
								>
									<span class="text-lg">📞</span>
									Call us
								</a>
								<a
									:href="`https://t.me/${config.public.CONTACT.telegram.replace(
										'@',
										''
									)}?text=${encodeURIComponent(orderMessage)}`"
									target="_blank"
									class="w-full bg-candyBlue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-candyBlue-800 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
								>
									<AppIconTelegram class="w-5 h-5" />
									Telegram
								</a>
								<a
									:href="`https://wa.me/${config.public.CONTACT.whatsapp.replace(
										/\D/g,
										''
									)}?text=${encodeURIComponent(orderMessage)}`"
									target="_blank"
									class="w-full bg-white text-candyGreen-700 border border-candyYellow-300 px-4 py-3 rounded-lg font-semibold hover:bg-candyYellow-50 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
								>
									<AppIconWhatsApp class="w-5 h-5" />
									WhatsApp
								</a>
								<a
									:href="config.public.CONTACT.facebook"
									target="_blank"
									class="w-full bg-candyOrange-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-candyOrange-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
								>
									<span class="text-lg">📘</span>
									Facebook
								</a>
							</div>

							<div class="mt-6 pt-4 border-t border-candyYellow-200">
								<NuxtLink
									to="/catalog"
									class="w-full bg-candyYellow-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-candyYellow-200 transition-colors block text-center text-sm md:text-base"
								>
									Continue shopping
								</NuxtLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<DeliveryInfo />

		<CheckoutModal v-model="showCheckout" />
	</div>
</template>