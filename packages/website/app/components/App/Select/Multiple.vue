<script setup lang="ts">
import Multiselect from "@vueform/multiselect";
import { vueformMultiselectTailwindClasses } from "./utils";

type Value = Array<number | string | null>;

const props = defineProps({
	id: {
		type: String,
		required: false,
		default: "select",
	},
	value: {
		type: Array as PropType<Value>,
		required: false,
	},
	options: {
		type: Array as PropType<
			{
				label: string | number | null;
				value: string | number | null;
				icon?: any;
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
	placeholder: {
		type: String,
		default: null,
	},
});
const valueModel = defineModel<Value>();
const emit = defineEmits<{
	(event: "focus"): void;
	(event: "change", value: Value): void;
}>();
const value = computed({
	get: () => valueModel.value ?? props.value ?? [],
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
		:close-on-select="false"
		label="label"
		track-by="value"
		mode="multiple"
		:hide-selected="false"
		:multipleLabel="(selected) => `${selected.length} selected`"
		:classes="vueformMultiselectTailwindClasses"
		@focus="emit('focus')"
		@open="emit('focus')"
	>
		<template v-if="options.some((o) => o.icon)" #option="{ option }">
			<component :is="option.icon" class="w-4 h-4 mr-2" />
			{{ option.label }}
		</template>
		<template v-if="options.some((o) => o.icon)" #singlelabel="{ value }">
			<div class="multiselect-single-label">
				<component :is="value.icon" class="w-4 h-4 mr-2" />
				{{ value.label }}
			</div>
		</template>
		<template #selection="{ values, search, isOpen }">
			<span class="multiselect__single" v-if="values.length" v-show="!isOpen">
				{{ values.length }} options selected
			</span>
		</template>
		<template #clear="{ clear }">
			<AppSelectVueFormClear @clear="clear" />
		</template>
		<template #caret="{ handleCaretClick, isOpen }">
			<AppSelectVueFormCaret :is-open @click="handleCaretClick" />
		</template>
	</Multiselect>
</template>
<style src="@vueform/multiselect/themes/tailwind.css"></style>
