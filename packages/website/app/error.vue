<script setup lang="ts">
import type { NuxtError } from "#app";

const config = useRuntimeConfig();

const props = defineProps({
	error: Object as () => NuxtError,
});

useHeadSafe({
	title: `Page not found - ${config.public.STORE_NAME}`,
	meta: [
		{
			name: "description",
			content:
				"Page not found. Return to the homepage or browse our candy catalog.",
		},
	],
});
</script>

<template>
	<div class="min-h-screen bg-candyYellow-50 flex items-center justify-center px-4">
		<div class="text-center max-w-md mx-auto">
			<div class="text-8xl mb-8">🍬</div>
			<h1 class="text-4xl font-bold text-candyPink-700 mb-4">
				{{ error?.statusCode || "404" }}
			</h1>
			<p class="text-gray-600 mb-8 leading-relaxed">
				{{
					error?.message ||
					"Sorry, the page you are looking for does not exist. It may have been moved, deleted, or the link may be incorrect."
				}}
			</p>

			<div class="space-y-4">
				<NuxtLink
					to="/"
					class="block bg-candyPink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-candyPink-700 transition-colors"
				>
					🏠 Back to home
				</NuxtLink>
				<NuxtLink
					to="/catalog"
					class="block border-2 border-candyPink-600 text-candyPink-700 px-8 py-3 rounded-lg font-semibold hover:bg-candyPink-600 hover:text-white transition-colors"
				>
					🛍️ Browse catalog
				</NuxtLink>
				<a
					:href="`tel:${config.public.CONTACT.phone}`"
					class="block text-candyPink-700 hover:text-candyPink-800 font-medium"
				>
					📞 Contact us
				</a>
			</div>
		</div>
	</div>
</template>