<script setup lang="ts">
const props = defineProps({
	id: {
		type: String,
		required: false,
		default: "radio",
	},
	value: {
		type: [String, Number, null] as PropType<string | number | null>,
		required: false,
	},
	options: {
		type: Array as PropType<
			{
				label: string | number;
				value: string | number | null;
				disabled?: boolean;
			}[]
		>,
		required: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	showEmpty: {
		type: Boolean,
		default: true,
	},
	placeholder: {
		type: String,
		default: null,
	},
});
const valueModel = defineModel<number | string | null>();
const emit = defineEmits<{
	(event: "focus"): void;
	(event: "change", value: string | number | null): void;
}>();

const value = computed({
	get: () => valueModel.value ?? props.value ?? null,
	set: (newValue: string | number | null) => {
		valueModel.value = newValue;
		emit("change", newValue);
	},
});
</script>
<template>
	<div class="flex flex-col gap-2">
		<div
			v-for="(option, index) of options"
			:key="`${option.value || 'null'}`"
			:class="[
				'flex items-center',
				{ 'cursor-not-allowed': option.disabled || disabled },
			]"
		>
			<input
				v-model="value"
				:id="`${id}-${index}`"
				type="radio"
				:disabled="option.disabled || disabled"
				:value="option.value"
				class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
			/>
			<label
				:for="`${id}-${index}`"
				:class="[
					'w-full ms-2 text-sm font-medium',
					{
						'text-gray-900 dark:text-gray-300': !option.disabled && !disabled,
						'text-gray-400 dark:text-gray-500': option.disabled || disabled,
					},
				]"
			>
				{{ option.label }}
			</label>
		</div>
	</div>
</template>
