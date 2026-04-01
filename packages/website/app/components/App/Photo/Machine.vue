<script setup lang="ts">
import { Tractor } from "lucide-vue-next";

const props = defineProps({
	machine: {
		type: Object as PropType<{
			id: number;
			Photo?: Object | null;
		} | null>,
		required: false,
	},
	photo: {
		type: String as PropType<string | null>,
		default: null,
	},
});
</script>
<template>
	<div>
		<img
			v-if="machine?.Photo || photo"
			:src="photo || `/api/files/machine/${machine?.id}/photo.jpeg`"
			alt="Machine photo"
			class="w-full aspect-square rounded-md"
		/>
		<div
			v-else
			class="w-full aspect-square flex items-center justify-center text-gray-700 dark:text-white bg-gray-300 dark:bg-gray-700 rounded-md"
		>
			<Tractor />
		</div>
	</div>
</template>
