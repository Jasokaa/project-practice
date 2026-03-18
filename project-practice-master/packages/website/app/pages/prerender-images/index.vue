<script setup lang="ts">
const { $products } = useNuxtApp();
const config = useRuntimeConfig();

useRobotsRule({ noindex: true, nofollow: true });

definePageMeta({
	layout: "empty",
});
</script>

<template>
	<div>
		<!-- Products preview -->
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
			<div v-for="product in $products" :key="product.id">
				<AppCardProduct :product />

				<NuxtPicture
					v-for="image in product.images"
					:key="image"
					:src="image"
					height="512"
					width="512"
					densities="x1 x2"
					fit="cover"
				/>

				<img
					:src="
						product?.images?.[0]
							? `${config.public.APP_URL}/_ipx/f_png&q_80&fit_cover&s_512x512${product.images[0]}`
							: undefined
					"
					alt="Candy product"
				/>
			</div>
		</div>

		<!-- Hero section -->
		<section class="relative py-20 px-4">
			<div class="max-w-screen-xl mx-auto">
				<div class="grid lg:grid-cols-2 gap-12 items-center">
					<div>
						<h1
							class="text-4xl md:text-6xl font-bold text-candyPink-600 mb-6 leading-tight"
						>
							{{ config.public.STORE_NAME }}
						</h1>

						<p class="text-xl text-gray-700 mb-8 leading-relaxed">
							Colorful gummy candies, chewy sweets and fruity jelly treats.
							Order your favorite sweets online and enjoy delivery across
							Ukraine.
						</p>

						<div class="flex flex-col sm:flex-row gap-4">
							<NuxtLink
								to="/catalog"
								class="bg-candyPink-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-candyPink-600 transition-colors text-center"
							>
								Open catalog
							</NuxtLink>

							<a
								:href="`tel:${config.public.CONTACT.phone}`"
								class="border-2 border-candyPink-500 text-candyPink-600 px-8 py-4 rounded-lg font-semibold hover:bg-candyPink-500 hover:text-white transition-colors text-center"
							>
								Call us
							</a>
						</div>
					</div>

					<div
						class="w-full h-full md:h-auto flex items-center justify-center relative"
					>
						<NuxtPicture
							src="/images/candy-hero.png"
							alt="Colorful gummy candies"
							class="h-full rounded-2xl shadow-2xl overflow-hidden"
						/>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>