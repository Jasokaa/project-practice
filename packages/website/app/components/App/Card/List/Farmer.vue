<script setup lang="ts">
import { Tractor } from "lucide-vue-next";

const slots = useSlots();

defineProps({
	farmer: {
		type: Object as PropType<{
			name: string;
			email: string;
			photo?: string | null;
		} | null>,
		required: false,
		default: null,
	},
});
</script>
<template>
	<div
		v-if="farmer"
		:class="`w-full flex justify-center gap-1 ${
			slots.default ? 'flex-col sm:flex-row' : 'flex-row'
		} text-black dark:text-white`"
	>
		<div class="flex flex-row items-center gap-4 flex-grow">
			<div>
				<img
					v-if="farmer.photo"
					:src="farmer.photo"
					:alt="farmer.name"
					class="w-10 h-10 rounded-full"
				/>
				<div
					v-else
					class="w-10 h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-full"
				>
					<slot name="avatar"></slot>
					<Tractor v-if="!slots.avatar" />
				</div>
			</div>
			<div class="flex flex-grow flex-col justify-center py-1">
				<div class="h-6">
					<span>{{ farmer.name }}</span>
				</div>
				<span class="text-xs">{{ farmer.email }}</span>
			</div>
		</div>
		<div class="flex-shrink-0 ml-auto sm:ml-0">
			<slot></slot>
		</div>
	</div>
	<div v-else class="flex w-full items-center gap-4 text-black dark:text-white">
		<div>
			<div
				class="w-10 h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-full"
			>
				<slot name="avatar"></slot>
			</div>
		</div>
		<div class="flex flex-grow flex-col justify-center py-1">
			<div>
				<div class="h-4 mb-2 bg-gray-300 rounded w-1/3"></div>
			</div>
			<div class="h-2 bg-gray-300 rounded w-1/2"></div>
		</div>
	</div>
</template>
