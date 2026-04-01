<script setup lang="ts" generic="T extends string | number|null">
import { Check } from "lucide-vue-next";

interface CategoryOption<T> {
	value: T;
	label: string;
	icon?: Component;
}

const props = defineProps({
	options: {
		type: Array as PropType<CategoryOption<T>[]>,
		required: true,
	},
	value: {
		type: [String, Number, null] as PropType<T>,
		default: null,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	required: {
		type: Boolean,
		default: false,
	},
});

const categoryModel = defineModel<T>();
const emit = defineEmits<{
	(event: "change", categoryId: T): void;
}>();

const selected = computed({
	get: () => categoryModel.value ?? props.value ?? null,
	set: (newValue: T) => {
		categoryModel.value = newValue;
		emit("change", newValue);
	},
});

const selectCategory = (categoryId: T) => {
	if (props.disabled) return;
	if (props.required && selected.value === categoryId) {
		return;
	}
	selected.value = categoryId === selected.value ? null : categoryId;
};
</script>

<template>
	<div class="flex flex-wrap gap-2">
		<button
			v-for="option in options"
			:key="option.value"
			type="button"
			class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			:class="{
				'border-primary-500 bg-primary-50 dark:bg-primary-900 dark:border-primary-600':
					selected === option.value,
				'cursor-not-allowed opacity-50': disabled,
			}"
			@click.prevent="selectCategory(option.value)"
		>
			<component
				v-if="option.icon"
				:is="selected === option.value ? Check : option.icon"
				class="me-2 h-4 w-4 shrink-0 text-gray-900 dark:text-white"
			>
			</component>
			<span class="text-sm font-medium text-gray-900 dark:text-white">
				{{ option.label }}
			</span>
		</button>
	</div>
</template>
