<script setup lang="ts">
const props = defineProps({
	label: {
		type: String,
		required: false,
	},
	required: {
		type: Boolean,
		required: false,
		default: false,
	},
	fullrow: {
		type: Boolean,
		required: false,
		default: false,
	},
	labelFor: {
		type: String,
		required: false,
		default: "",
	},
});

const asterysk = computed(() => (props.required ? "*" : ""));
const containerClasses = computed(() => ({
	"flex flex-col": true,
	"md:flex-row": props.fullrow,
}));
const labelClasses = computed(() => ({
	"w-full block text-sm font-medium text-gray-900 dark:text-white": true,
	"md:w-1/2": props.fullrow,
}));
const inputClasses = computed(() => ({
	"w-full h-full flex flex-col gap-2": true,
	"mt-2": props.label,
	"md:w-1/2 md:justify-start md:items-start md:mt-0": props.fullrow,
}));
</script>
<template>
	<div :class="containerClasses">
		<label :for="labelFor" :class="labelClasses">
			{{ label }}{{ asterysk }}
		</label>
		<div :class="inputClasses">
			<slot></slot>
		</div>
	</div>
</template>
