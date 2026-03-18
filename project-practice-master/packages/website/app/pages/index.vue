<script setup lang="ts">
const config = useRuntimeConfig();
const productsStore = useProductsStore();

const featuredProducts = productsStore.getFeaturedProducts();

useHead({
	title: `${config.public.STORE_NAME} - Colorful gummy candies and sweet treats`,
	meta: [
		{
			name: "description",
			content:
				"Colorful gummy candies, chewy sweets and jelly treats with delivery across Ukraine. Order your favorite candy online at Jellylicious.",
		},
	],
});
</script>

<template>
	<div class="min-h-screen bg-candyYellow-50">
		<!-- Hero Section -->
<section class="relative py-20 px-4 bg-candyYellow-50">
	<div class="max-w-screen-xl mx-auto">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<div>
				<h1
					class="text-4xl md:text-6xl font-bold text-candyPink-700 mb-6 leading-tight"
				>
					{{ config.public.STORE_NAME }}
				</h1>
				<p class="text-xl text-gray-700 mb-8 leading-relaxed">
					Colorful gummy candies, chewy sweets and fruity jelly treats.
					We deliver across
					{{ config.public.STORE_LOCATION.region_given }}
					and all over Ukraine.
				</p>
				<div class="flex flex-col sm:flex-row gap-4">
					<NuxtLink
						to="/catalog"
						class="bg-candyPink-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-candyPink-700 transition-colors text-center"
					>
						View catalog
					</NuxtLink>
					<a
						:href="`tel:${config.public.CONTACT.phone}`"
						class="border-2 border-candyPink-600 text-candyPink-700 px-8 py-4 rounded-lg font-semibold hover:bg-candyPink-600 hover:border-candyPink-600 hover:text-white transition-colors text-center"
					>
						Call us
					</a>
				</div>
			</div>
			<div
				class="w-full h-full md:h-auto flex items-center justify-center relative"
			>
				<NuxtPicture
					src="/images/JF_close_up_grande.jpg"
					alt="Colorful gummy candies and sweet jelly treats"
					class="w-full aspect-[5/3] object-cover rounded-2xl shadow-2xl overflow-hidden"
				/>
			</div>
		</div>
	</div>
</section>

<!-- Featured Products Section -->
<section class="py-16 px-4 bg-candyYellow-50">
	<div class="max-w-screen-xl mx-auto">
		<h2
			class="text-3xl md:text-4xl font-bold text-candyPink-700 text-center mb-12"
		>
			Our bestsellers
		</h2>
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
			<AppCardProduct
				v-for="product in featuredProducts"
				:key="product.id"
				:product
			/>
		</div>
		<div class="text-center mt-12">
			<NuxtLink
				to="/catalog"
				class="bg-candyPink-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-candyPink-700 transition-colors inline-block"
			>
				View all products
			</NuxtLink>
		</div>
	</div>
</section>

		<!-- Who We Are & Our Advantages Section -->
		<section class="py-16 px-4 bg-white">
			<div class="max-w-screen-xl mx-auto text-center">
				<h2 class="text-3xl md:text-4xl font-bold text-primary-800 mb-12">
					Why choose Jellylicious
				</h2>
				<div
					class="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-8"
				>
					<div class="p-6">
						<div class="text-4xl mb-4">🍬</div>
						<h3 class="text-xl font-semibold text-primary-700 mb-3">
							Bright candy selection
						</h3>
						<p class="text-gray-600">
							We offer colorful gummy candies, chewy sweets and fun
							jelly treats for every taste and mood.
						</p>
					</div>
					<div class="p-6">
						<div class="text-4xl mb-4">✨</div>
						<h3 class="text-xl font-semibold text-primary-700 mb-3">
							Great taste
						</h3>
						<p class="text-gray-600">
							From fruity gummies to sour favorites, every candy is
							chosen to bring bright flavor and sweet moments.
						</p>
					</div>
					<div class="p-6">
						<div class="text-4xl mb-4">🎁</div>
						<h3 class="text-xl font-semibold text-primary-700 mb-3">
							Perfect for gifting
						</h3>
						<p class="text-gray-600">
							Our jelly treats are great for gifts, parties, candy
							boxes or simply a sweet everyday treat.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Delivery Methods Section -->
		<section class="py-16 px-4 bg-candyYellow-50">
			<div class="max-w-screen-xl mx-auto">
				<h2
					class="text-3xl md:text-4xl font-bold text-primary-800 text-center mb-12"
				>
					Delivery options
				</h2>
				<div class="grid md:grid-cols-3 gap-8">
					<div class="bg-white p-8 rounded-2xl shadow-lg">
						<div class="text-4xl mb-4">📦</div>
						<h3 class="text-2xl font-semibold text-primary-700 mb-4">
							Nova Poshta
						</h3>
						<p class="text-gray-600 mb-4">
							Fast delivery across Ukraine through Nova Poshta.
							Convenient for receiving your favorite sweets in any
							city.
						</p>
						<ul class="text-sm text-gray-600 space-y-2">
							<li>• Carrier rates apply</li>
							<li>• Delivery across Ukraine</li>
							<li>• Free delivery for orders over 1000 UAH</li>
						</ul>
					</div>
					<div class="bg-white p-8 rounded-2xl shadow-lg">
						<div class="text-4xl mb-4">📮</div>
						<h3 class="text-2xl font-semibold text-primary-700 mb-4">
							Ukrposhta
						</h3>
						<p class="text-gray-600 mb-4">
							Delivery across Ukraine through Ukrposhta for a simple
							and reliable way to receive your order.
						</p>
						<ul class="text-sm text-gray-600 space-y-2">
							<li>• Carrier rates apply</li>
							<li>• Delivery across Ukraine</li>
							<li>• Free delivery for orders over 1000 UAH</li>
						</ul>
					</div>
					<div class="bg-white p-8 rounded-2xl shadow-lg">
						<div class="text-4xl mb-4">🎁</div>
						<h3 class="text-2xl font-semibold text-primary-700 mb-4">
							Order benefits
						</h3>
						<p class="text-gray-600 mb-4">
							Order your favorite jelly treats online and enjoy easy
							delivery anywhere in Ukraine.
						</p>
						<ul class="text-sm text-gray-600 space-y-2">
							<li>• Free delivery from 1000 UAH</li>
							<li>• Sweet treats for every mood</li>
							<li>• Perfect for gifts and personal orders</li>
						</ul>
					</div>
				</div>
			</div>
		</section>

		<!-- Contact Section -->
<section class="py-16 px-4 bg-candyPink-400 text-white">
	<div class="max-w-screen-xl mx-auto text-center justify-items-center">
		<h2 class="text-3xl md:text-4xl font-bold mb-8">
			Ready to order your favorite sweets?
		</h2>
		<p class="text-xl mb-12 text-candyYellow-50">
			Choose the easiest way to contact us and we will help you place your order quickly.
		</p>
		<div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
			<a
				:href="`tel:${config.public.CONTACT.phone}`"
				class="bg-candyPink-700 hover:bg-candyPink-800 p-4 rounded-xl transition-colors flex items-center gap-3"
			>
				<div class="text-2xl">📞</div>
				<div class="flex-1">
					<div class="font-semibold text-sm">Call us</div>
					<div class="text-candyYellow-50 text-xs">
						{{ config.public.CONTACT.phone }}
					</div>
				</div>
			</a>

			<a
				:href="`https://t.me/${config.public.CONTACT.telegram.replace(
					'@',
					''
				)}`"
				target="_blank"
				class="bg-candyBlue-600 hover:bg-candyBlue-800 p-4 rounded-xl transition-colors flex items-center gap-3"
			>
				<AppIconTelegram class="w-6 h-6 flex-shrink-0" />
				<div class="flex-1">
					<div class="font-semibold text-sm">Message on Telegram</div>
					<div class="text-candyYellow-50 text-xs">
						{{ config.public.CONTACT.telegram }}
					</div>
				</div>
			</a>
		</div>
	</div>
</section>
	</div>
</template>