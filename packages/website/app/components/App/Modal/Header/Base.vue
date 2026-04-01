<script setup lang="ts">
import { X } from "lucide-vue-next";

defineProps({
	label: {
		type: String,
		required: true,
	},
});
const emit = defineEmits<{
	(event: "close"): void;
}>();
</script>
<template>
	<div
		class="flex justify-between items-center shrink-0 sticky top-0 py-2 mb-4 z-[1650] border-b sm:mb-5 dark:border-gray-600"
	>
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
			{{ label }}
		</h3>
		<AppButtonBase
			variant="secondary"
			variant-type="transparent"
			:icon="X"
			@click="emit('close')"
		/>
	</div>
</template>
