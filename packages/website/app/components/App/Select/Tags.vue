<script setup lang="ts">
import Multiselect from "@vueform/multiselect";
import { vueformMultiselectTailwindClasses } from "./utils";

const props = defineProps({
	id: {
		type: String,
		required: false,
		default: "select",
	},
	value: {
		type: Array as PropType<string[]>,
		required: false,
	},
	options: {
		type: Array as PropType<string[]>,
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
	max: {
		type: Number,
		default: -1,
	},
});
const valueModel = defineModel<string[]>();
const emit = defineEmits<{
	(event: "focus"): void;
	(event: "change", value: string[]): void;
}>();

const value = computed({
	get: () => valueModel.value ?? props.value ?? null,
	set: (newValue) => {
		if (!newValue) return;
		valueModel.value = newValue;
		emit("change", newValue);
	},
});
</script>
<template>
	<Multiselect
		v-model="value"
		:options
		:required
		:disabled
		:max
		:placeholder
		mode="tags"
		:close-on-select="false"
		:searchable="true"
		:create-option="true"
		:classes="vueformMultiselectTailwindClasses"
		@focus="emit('focus')"
		@open="emit('focus')"
	>
		<template #clear="{ clear }">
			<AppSelectVueFormClear @clear="clear" />
		</template>
		<template #caret="{ handleCaretClick, isOpen }">
			<AppSelectVueFormCaret :is-open @click="handleCaretClick" />
		</template>
	</Multiselect>
</template>
<style src="@vueform/multiselect/themes/tailwind.css"></style>
