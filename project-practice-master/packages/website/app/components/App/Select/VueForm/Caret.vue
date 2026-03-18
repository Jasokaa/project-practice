<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
defineProps({
	isOpen: {
		type: Boolean,
		default: false,
	},
});
</script>
<template>
	<button
		type="button"
		class="h-6 w-6 flex items-center justify-center relative mr-1"
		:class="{
			'pointer-events-none': isOpen ? undefined : 'false',
		}"
	>
		<ChevronDown
			class="w-4 h-4 text-gray-700 dark:text-gray-200 transition-transform duration-200"
			:class="{ 'rotate-180': isOpen }"
		/>
	</button>
</template>
