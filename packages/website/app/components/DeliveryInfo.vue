<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<template>
	<section class="py-16 bg-primary-50">
		<div class="max-w-screen-xl mx-auto px-4">
			<h2 class="text-3xl font-bold text-primary-700 text-center mb-12">
				Delivery & Payment
			</h2>

			<div class="grid md:grid-cols-3 gap-6">
				<div
					class="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
				>
					<div class="text-4xl mb-4">🛒</div>
					<h3 class="text-lg font-semibold text-primary-700 mb-2">
						Order
					</h3>
					<p class="text-gray-600 text-sm">
						Add products to your cart and send your order. We will contact you to confirm the details.
					</p>
				</div>

				<div
					class="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
				>
					<div class="text-4xl mb-4">📦</div>
					<h3 class="text-lg font-semibold text-primary-700 mb-2">
						Delivery
					</h3>
					<p class="text-gray-600 text-sm">
						We ship orders across Ukraine via Nova Poshta or Ukrposhta.
					</p>
				</div>

				<div
					class="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
				>
					<div class="text-4xl mb-4">💳</div>
					<h3 class="text-lg font-semibold text-primary-700 mb-2">
						Payment
					</h3>
					<p class="text-gray-600 text-sm">
						Payment is available by bank transfer or cash on delivery after order confirmation.
					</p>
				</div>
			</div>
		</div>
	</section>
</template>