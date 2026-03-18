<script setup lang="ts">
import { UserRound } from "lucide-vue-next";

const slots = useSlots();

const props = defineProps({
	person: {
		type: Object as PropType<{
			id: number;
			Photo?: Object | null;
			name?: string | null;
			first_name?: string | null;
			last_name?: string | null;
		} | null>,
		required: false,
	},
	photo: {
		type: String as PropType<string | null>,
		default: null,
	},
});

const initials = computed(() => {
	if (!props.person?.first_name && !props.person?.last_name) return null;
	const firstInitial = props.person?.first_name?.charAt(0).toUpperCase() || "";
	const lastInitial = props.person?.last_name?.charAt(0).toUpperCase() || "";
	return `${firstInitial}${lastInitial}`;
});
</script>
<template>
	<div>
		<img
			v-if="person?.Photo || photo"
			:src="photo || `/api/files/avatar/${person?.id}/photo.jpeg`"
			:alt="person?.name || 'Avatar'"
			class="w-full aspect-square rounded-full"
		/>
		<div
			v-else
			class="w-full aspect-square flex items-center justify-center text-gray-700 dark:text-white bg-gray-300 dark:bg-gray-700 rounded-full"
		>
			<slot name="avatar-placeholder"></slot>
			<span
				v-if="!slots['avatar-placeholder'] && initials"
				class="text-[100%] font-semibold tracking-wider"
			>
				{{ initials }}
			</span>
			<UserRound v-if="!slots['avatar-placeholder'] && !initials" />
		</div>
	</div>
</template>
