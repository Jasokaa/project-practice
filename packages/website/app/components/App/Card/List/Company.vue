<script setup lang="ts">
const slots = useSlots();

defineProps({
	company: {
		type: Object as PropType<{
			name: string;
			email: string;
			photo?: string | null;
		}>,
		required: false,
		default: null,
	},
});
</script>
<template>
	<div
		v-if="company"
		:class="`w-full h-full flex justify-center gap-1 ${
			slots.default ? 'flex-col sm:flex-row' : 'flex-row'
		} text-black dark:text-white`"
	>
		<div class="flex flex-row items-center gap-4 flex-grow">
			<div>
				<AppPhotoUser
					:person="company"
					class="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"
				>
					<template #avatar-placeholder>
						<slot name="avatar"></slot>
					</template>
				</AppPhotoUser>
			</div>
			<div class="flex flex-grow flex-col justify-center py-1">
				<div class="h-6">
					<span>{{ company.name }}</span>
				</div>
				<span class="text-xs">{{ company.email }}</span>
			</div>
		</div>
		<div class="flex-shrink-0 ml-auto sm:ml-0">
			<slot></slot>
		</div>
	</div>
	<div
		v-else
		class="flex w-full h-full items-center gap-4 text-black dark:text-white"
	>
		<div>
			<div
				class="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-white bg-gray-300 dark:bg-gray-700 rounded-full"
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
