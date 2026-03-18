<template>
	<div class="min-h-[100dvh]">
		<LayoutHeaderDefault />
		<slot />
		<LayoutFooterDefault />
	</div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

useHeadSafe({
	title: config.public.STORE_NAME || "Jellylicious",
	meta: [
		{
			name: "description",
			content:
				"Welcome to Jellylicious - an online candy shop with colorful gummy candies, chewy sweets and fruity jelly treats. Order online with delivery across Ukraine.",
		},
	],
});
</script>