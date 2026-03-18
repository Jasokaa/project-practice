<script setup lang="ts">
import { Eye, EyeOff } from "lucide-vue-next";

const valueModel = defineModel<string | number | null>();

const value = computed({
	get: () => valueModel.value,
	set: (newValue: string | number | null) => {
		if (newValue === "") {
			valueModel.value = null;
		} else {
			valueModel.value = newValue;
		}
	},
});

const isRevealed = ref(false);

const type = computed(() => (isRevealed.value ? "text" : "password"));

const toggleReveal = () => {
	isRevealed.value = !isRevealed.value;
};
</script>
<template>
	<div class="w-full flex flex-row justify-center items-center relative">
		<input
			v-model="value"
			:type
			class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
		/>
		<button
			class="h-full right-0 absolute text-gray-700 dark:text-gray-300"
			type="button"
			@click="toggleReveal"
		>
			<div class="p-2">
				<Eye v-if="!isRevealed" />
				<EyeOff v-else />
			</div>
		</button>
	</div>
</template>
