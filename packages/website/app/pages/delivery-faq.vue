<script setup lang="ts">
const config = useRuntimeConfig();

useHeadSafe({
	title: `Delivery & FAQ - ${config.public.STORE_NAME}`,
	meta: [
		{
			name: "description",
			content:
				"Delivery, payment, and order tracking FAQ for Jellylicious. Learn shipping timelines, payment options, and support contacts.",
		},
	],
});
</script>

<template>
	<div class="min-h-screen bg-candyYellow-50">
		<section class="py-12 md:py-16">
			<div class="max-w-screen-xl mx-auto px-4">
				<h1 class="text-4xl md:text-5xl font-bold text-candyPink-700 mb-4">
					Delivery & FAQ
				</h1>
				<p class="text-gray-700 max-w-3xl mb-10">
					Everything you need to know about shipping, payment, order updates, and
					how to get support.
				</p>

				<div class="grid md:grid-cols-2 gap-6 mb-10">
					<div class="bg-white rounded-2xl shadow-lg p-6">
						<h2 class="text-2xl font-semibold text-candyPink-700 mb-4">
							Delivery
						</h2>
						<ul class="space-y-3 text-gray-700">
							<li>Delivery is available across Ukraine.</li>
							<li>We ship with Nova Poshta and Ukrposhta.</li>
							<li>Delivery cost depends on carrier rates.</li>
							<li>Free delivery is available for orders over 1000 UAH.</li>
						</ul>
					</div>
					<div class="bg-white rounded-2xl shadow-lg p-6">
						<h2 class="text-2xl font-semibold text-candyPink-700 mb-4">
							Payment
						</h2>
						<ul class="space-y-3 text-gray-700">
							<li>Payment by bank transfer is available.</li>
							<li>Cash on delivery is available after confirmation.</li>
							<li>We confirm your order details before dispatch.</li>
						</ul>
					</div>
				</div>

				<div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10">
					<h2 class="text-2xl font-semibold text-candyPink-700 mb-6">
						Frequently asked questions
					</h2>
					<div class="space-y-6">
						<div>
							<h3 class="font-semibold text-gray-900">
								How do I track my order?
							</h3>
							<p class="text-gray-700 mt-1">
								Open the order status page and enter your order code and phone
								number.
							</p>
						</div>
						<div>
							<h3 class="font-semibold text-gray-900">
								How long does delivery usually take?
							</h3>
							<p class="text-gray-700 mt-1">
								Most orders are delivered in 1-3 business days, depending on your
								city and carrier workload.
							</p>
						</div>
						<div>
							<h3 class="font-semibold text-gray-900">
								Can I change or cancel an order?
							</h3>
							<p class="text-gray-700 mt-1">
								Yes, contact us as soon as possible. Changes are possible before
								the order is shipped.
							</p>
						</div>
					</div>
				</div>

				<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<NuxtLink
						to="/cart"
						class="bg-candyPink-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-candyPink-700 transition-colors"
					>
						Go to cart
					</NuxtLink>
					<NuxtLink
						to="/order-status"
						class="bg-candyBlue-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-candyBlue-800 transition-colors"
					>
						Track order
					</NuxtLink>
					<a
						:href="`tel:${config.public.CONTACT.phone}`"
						class="bg-candyOrange-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-candyOrange-700 transition-colors"
					>
						Call support
					</a>
					<a
						:href="`https://t.me/${config.public.CONTACT.telegram.replace('@', '')}`"
						target="_blank"
						class="bg-candyGreen-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-candyGreen-700 transition-colors"
					>
						Telegram
					</a>
				</div>
			</div>
		</section>
	</div>
</template>
