<script setup lang="ts">
const valueModel = defineModel<string | number | null>();

const value = computed({
	get: () => valueModel.value,
	set: (newValue: string | number | null) => {
		if (newValue === "") {
			valueModel.value = null;
		} else {
			valueModel.value = newValue;
		}
	},
});
</script>
<template>
	<textarea
		v-model="value"
		type="text"
		class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
	></textarea>
</template>
