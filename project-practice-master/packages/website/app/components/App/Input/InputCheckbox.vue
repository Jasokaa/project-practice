<script setup lang="ts">
const slots = useSlots();

const props = defineProps({
	id: {
		type: String,
		required: false,
		default: null,
	},
	value: {
		type: Boolean as PropType<boolean | null>,
		required: false,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	size: {
		type: String,
		default: "4",
	},
});
const valueModel = defineModel<boolean | null>();
const emit = defineEmits<{
	(e: "change", value: boolean): void;
}>();

const classes = computed(() => {
	return {
		[`w-${props.size} h-${props.size}`]: true,
	};
});

const value = computed({
	get: () => valueModel.value || props.value || false,
	set: (newValue) => {
		valueModel.value = newValue;
		emit("change", newValue);
	},
});
</script>
<template>
	<div class="flex items-center">
		<input
			v-model="value"
			:id
			:disabled
			type="checkbox"
			:class="[
				classes,
				'text-primary-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600',
			]"
		/>
		<label
			v-if="slots.default"
			:for="id"
			class="ms-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300"
		>
			<slot></slot>
		</label>
	</div>
</template>
