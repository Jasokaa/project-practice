<script setup lang="ts">
const { t } = useI18n();

const props = defineProps({
	id: {
		type: String,
		required: false,
		default: "select",
	},
	value: {
		type: [String, Number, null] as PropType<string | number | null>,
		required: false,
	},
	options: {
		type: Array as PropType<
			{
				label: string | number | null;
				value: string | number | null;
				disabled?: boolean | null;
			}[]
		>,
		required: true,
	},
	required: Boolean,
	width: {
		type: String,
		default: "w-full",
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
	<div :class="width">
		<select
			v-model="value"
			:id
			:name="id"
			class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
			:required
			:disabled
			@focus="emit('focus')"
		>
			<option
				v-if="showEmpty || placeholder"
				:value="null"
				:disabled="required"
			>
				{{ placeholder || t("Not selected") }}
			</option>
			<option
				v-for="option in options"
				:key="option.value?.toString() ?? 'null'"
				:value="option.value"
				:disabled="!!option.disabled"
			>
				{{ option.label }}
			</option>
		</select>
	</div>
</template>
<style lang="css" scoped>
select {
	background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' aria-hidden='true' viewBox='0 0 10 6'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 1 4 4 4-4'/%3E%3C/svg%3E");
	background-position: right 0.75rem center;
	background-repeat: no-repeat;
	background-size: 0.75em 0.75em;
	padding-right: 2.5rem;
	-webkit-print-color-adjust: exact;
	print-color-adjust: exact;
	appearance: none;
}
</style>
