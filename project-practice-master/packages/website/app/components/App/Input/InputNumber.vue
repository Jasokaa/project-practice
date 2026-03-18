<script setup lang="ts">
import Decimal from "decimal.js";

const props = defineProps({
	id: {
		type: String,
		default: null,
	},
	value: {
		type: Number as PropType<number | null>,
		default: null,
	},
	controls: {
		type: Boolean,
		default: true,
	},
	step: {
		type: Number,
		default: 1,
	},
	precision: {
		type: Number,
		default: 0,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	size: {
		type: String as PropType<"medium" | "small" | "large">,
		default: "medium",
	},
	placeholder: {
		type: String,
		default: "",
	},
});
const emit = defineEmits<{
	(e: "change", value: number | null): void;
	(e: "input", value: number | null): void;
	(e: "focus"): void;
}>();
const valueModel = defineModel<number | null>();

const value = computed({
	get: () => valueModel.value ?? props.value,
	set: (newValue: "" | number | null) => {
		if (newValue === "") {
			newValue = null;
		}
		valueModel.value = newValue;
		emit("change", newValue);
		emit("input", newValue);
	},
});

const increment = () => {
	if (!value.value) {
		value.value = props.step;
	} else {
		value.value = new Decimal(value.value).plus(props.step).toNumber();
	}
};
const decrement = () => {
	if (!value.value) {
		value.value = -props.step;
	} else {
		value.value = new Decimal(value.value).minus(props.step).toNumber();
	}
};
</script>
<template>
	<div
		class="w-full flex overflow-hidden text-gray-900 text-sm rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
	>
		<input
			v-model="value"
			:id
			type="number"
			step="any"
			:disabled
			:placeholder
			class="w-full bg-transparent border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
			:class="{
				'p-0.5 ps-1': size === 'small',
				'p-2.5': size === 'medium',
			}"
			@focus="emit('focus')"
		/>
		<div
			v-if="controls"
			class="flex w-8 flex-shrink-0"
			:class="{
				'flex-row': size === 'large',
				'flex-col': size === 'medium',
			}"
		>
			<AppLongPress
				is="button"
				class="w-full h-full select-none"
				type="button"
				:disabled
				@trigger="increment"
				@focus="emit('focus')"
			>
				+
			</AppLongPress>
			<AppLongPress
				is="button"
				class="w-full h-full select-none"
				type="button"
				:disabled
				@trigger="decrement"
				@focus="emit('focus')"
			>
				-
			</AppLongPress>
		</div>
	</div>
</template>
