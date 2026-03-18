<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

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
	timepickerEnabled: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits<{
	(e: "change", value: Date | string | number | null): void;
	(e: "focus"): void;
}>();

const value = computed({
	get: () => valueModel.value || props.value || null,
	set: (newValue) => {
		valueModel.value = newValue ? new Date(newValue).toISOString() : null;
		emit("change", newValue ? new Date(newValue).toISOString() : null);
	},
});
const format = computed(() => {
	if (props.timepickerEnabled) {
		return "dd.MM.yyyy HH:mm";
	}
	return "dd.MM.yyyy";
});
</script>
<template>
	<div>
		<VueDatePicker
			v-model="value"
			:format
			:enable-time-picker="timepickerEnabled"
			:clearable="!required"
			:disabled
			@focus="emit('focus')"
		/>
	</div>
</template>
