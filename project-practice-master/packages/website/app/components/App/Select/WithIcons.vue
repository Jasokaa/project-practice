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
		type: [String, Number, null] as PropType<string | number | null>,
		required: false,
	},
	options: {
		type: Array as PropType<
			{
				label: string | number | null;
				value: string | number | null;
				image?: string | null;
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
	<Multiselect
		v-model="value"
		:options
		:required
		:disabled
		:placeholder
		:can-clear="!required"
		track-by="value"
		label="label"
		value="value"
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
		<template #clear="{ clear }">
			<AppSelectVueFormClear @clear="clear" />
		</template>
		<template #caret="{ handleCaretClick, isOpen }">
			<AppSelectVueFormCaret :is-open @click="handleCaretClick" />
		</template>
	</Multiselect>
</template>
<style src="@vueform/multiselect/themes/tailwind.css"></style>
