<script setup lang="ts">
const valueModel = defineModel<Date | string | number | null>();

const props = defineProps({
	value: {
		type: [Date, String, Number],
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
const emit = defineEmits<{
	(e: "change", value: Date | string | number | null): void;
	(e: "focus"): void;
}>();

const value = computed({
	get: () => {
		const val = valueModel.value || props.value || null;
		if (val) {
			return new Date(val).valueOf();
		}
	},
	set: (newValue) => {
		const val = newValue ? new Date(newValue).toISOString() : null;
		valueModel.value = val;
		emit("change", val);
	},
});
</script>
<template>
	<div>
		<AppInputNumber
			v-model="value"
			:disabled
			:required
			@focus="emit('focus')"
		/>
	</div>
</template>
