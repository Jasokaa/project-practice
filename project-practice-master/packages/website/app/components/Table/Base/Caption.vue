<script setup lang="ts">
const slots = useSlots();

defineProps({
	label: {
		type: String,
		required: true,
	},
});
const searchQueryModel = defineModel<string | null>("search");
</script>
<template>
	<div class="flex flex-col gap-2 md:gap-3">
		<div class="flex flex-row justify-between items-center gap-2">
			<div class="h-full flex flex-row items-center gap-2">
				<span class="ml-2">{{ label }}</span>
				<slot name="label-actions"></slot>
			</div>
			<div v-if="slots['actions']" class="flex flex-row">
				<slot name="actions" />
			</div>
		</div>
		<div class="flex flex-col md:flex-row justify-between gap-2">
			<div class="flex flex-row">
				<AppInputSearchBase v-model="searchQueryModel" />
			</div>
			<div
				v-if="slots['additional-actions']"
				class="flex flex-row flex-wrap gap-1"
			>
				<slot name="additional-actions" />
			</div>
		</div>
	</div>
</template>
