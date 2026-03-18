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
		class="flex justify-end items-center shrink-0 absolute top-0 right-0 pe-4 pt-2 z-[1650]"
	>
		<AppButtonBase
			variant="secondary"
			variant-type="light"
			:icon="X"
			@click="emit('close')"
		/>
	</div>
</template>
