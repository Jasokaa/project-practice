<script setup lang="ts">
import { X } from "lucide-vue-next";
const emit = defineEmits<{ (e: "clear"): void }>();
</script>
<template>
	<button
		type="button"
		class="h-6 w-6 flex items-center justify-center relative mr-1"
		@click="emit('clear')"
	>
		<X class="w-4 h-4 text-gray-700 dark:text-gray-200" />
	</button>
</template>
