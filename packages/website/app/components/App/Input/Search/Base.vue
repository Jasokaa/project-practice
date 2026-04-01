<script setup lang="ts">
import { Search } from "lucide-vue-next";

const props = defineProps({
	value: {
		type: String as PropType<string | null>,
		required: false,
		default: null,
	},
});
const emit = defineEmits<{
	(e: "update", value: string | null): void;
	(e: "focus"): void;
}>();
const model = defineModel<string | null>();

const value = computed({
	get: () => model.value || props.value,
	set: (value) => {
		model.value = value;
		emit("update", value);
	},
});
</script>
<template>
	<div class="flex flex-row relative text-black dark:text-white">
		<div
			class="h-full flex items-center justify-center px-3 absolute top-0 left-0"
		>
			<Search class="w-4 h-4 text-gray-500 dark:text-gray-400" />
		</div>
		<input
			v-model="value"
			type="text"
			class="w-full block p-2.5 ps-9 text-sm placeholder-gray-500 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary-500"
			placeholder="Search..."
		/>
	</div>
</template>
