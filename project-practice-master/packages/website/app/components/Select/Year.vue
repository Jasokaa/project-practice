<template>
	<AppSelectNative
		v-model="year"
		:options="yearOptions"
		:required
		:showEmpty="false"
	/>
</template>
<script setup lang="ts">
const now = new Date();
const currentYear = now.getFullYear();

const year = defineModel<number>();
defineProps({
	required: {
		type: Boolean,
		default: false,
	},
});

const yearOptions = [
	...Array.from({ length: 2 }, (_, i) => currentYear + 1 + i).reverse(),
	currentYear,
	...Array.from({ length: 10 }, (_, i) => currentYear - 1 - i),
].map((year) => ({ label: year, value: year }));
</script>
