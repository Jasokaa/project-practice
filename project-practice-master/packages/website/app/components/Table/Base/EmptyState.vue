<script setup lang="ts">
defineProps({
	label: {
		type: String,
		default: "No data",
	},
	description: {
		type: String,
		default: null,
	},
});
</script>
<template>
	<div
		class="w-full flex flex-col justify-center items-center gap-4 text-center text-gray-500 dark:text-gray-400"
	>
		<slot name="icon"></slot>
		<div>
			<p class="text-lg font-semibold">
				{{ label }}
			</p>
			<p v-if="description" class="text-sm">
				{{ description }}
			</p>
		</div>
		<slot name="actions"></slot>
	</div>
</template>
