<script setup lang="ts">
const valueModel = defineModel<boolean | null>();
const props = defineProps({
	value: {
		type: Boolean as PropType<boolean | null>,
		default: null,
	},
});
const emit = defineEmits<{
	(event: "change", value: boolean): void;
}>();

const value = computed({
	get: () => valueModel.value ?? props.value,
	set: (newValue: boolean | null) => {
		valueModel.value = !!newValue;
		emit("change", !!newValue);
	},
});
</script>
<template>
	<label class="inline-flex items-center cursor-pointer p-2">
		<input v-model="value" type="checkbox" class="sr-only peer" />
		<div
			class="w-11 h-6 relative bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-gray-600 peer-checked:bg-primary-600"
		></div>
		<span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
			<slot></slot>
		</span>
	</label>
</template>
