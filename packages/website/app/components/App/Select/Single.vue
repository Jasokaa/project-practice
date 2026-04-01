<script setup lang="ts">
import Multiselect from "@vueform/multiselect";
import { vueformMultiselectTailwindClasses } from "./utils";
import { SuperscriptMapping } from "~/utils";

type Value = number | string | null;

const props = defineProps({
	id: {
		type: String,
		required: false,
		default: "select",
	},
	value: {
		type: [String, Number, null] as PropType<Value>,
		required: false,
	},
	options: {
		type: Array as PropType<
			{
				label: string;
				value: string | number | null;
				disabled?: boolean;
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
	searchable: {
		type: Boolean,
		default: false,
	},
	filterFunction: {
		type: Function as PropType<
			(
				search: string,
				option: {
					label: string;
					value: string | number | null;
				}
			) => boolean
		>,
		default: (
			search: string,
			option: { label: string; value: string | number | null }
		) => option.label.toLowerCase().includes(search),
	},
});
const valueModel = defineModel<Value>();
const emit = defineEmits<{
	(event: "focus"): void;
	(event: "change", value: Value): void;
}>();
const value = computed({
	get: () => valueModel.value ?? props.value ?? null,
	set: (newValue) => {
		valueModel.value = newValue;
		emit("change", newValue);
	},
});

const search = ref("");

const options = computed(() => {
	if (!search.value) return props.options;

	return props.options.filter((option) =>
		props.filterFunction(search.value, option)
	);
});

const handleSearchChange = (newSearch: string | null) => {
	search.value = newSearch || "";
	emit("focus");
};
</script>
<template>
	<Multiselect
		v-model="value"
		:options
		:disabled
		close-on-select
		:filter-results="false"
		:searchable
		label="label"
		track-by="value"
		:placeholder
		:classes="vueformMultiselectTailwindClasses"
		@focus="emit('focus')"
		@open="emit('focus')"
		@search-change="handleSearchChange"
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
